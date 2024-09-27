import { PrismaClient } from "@prisma/client";
import cron from "node-cron";
import { TicketmasterEvent } from "./ticketmaster_types";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

let isFetching = false;

async function fetchEvents() {
  if (!process.env.TICKETMASTER_API_KEY) {
    console.log('TICKETMASTER_API_KEY not found');
    return;
  }

  if (isFetching) {
    console.log("Previous fetchEvents is still running, skipping this run.");
    return;
  }

  console.log('Start fetchEvents: ', new Date().toString());
  isFetching = true;

  const organizer = await prisma.organizer.findFirst({
    where: { isInternal: true },
  });

  if (organizer) {
    const size = 199;
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const tmResponse = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${process.env.TICKETMASTER_API_KEY}&includeTest=only&source=ticketmaster&countryCode=us&size=${size}&page=${page}`);
      const tmData: any = await tmResponse.json();
      const tmEvents: TicketmasterEvent[] = tmData?._embedded?.events || [];

      if (tmData.errors) {
        console.log('Error: ', tmData.errors[0].detail);
        break;
      }

      for (const tmEvent of tmEvents) {
        const tmEventId = tmEvent.id;

        const existingEvent = await prisma.event.findFirst({
          where: { ticketmasterId: tmEventId },
        });

        const eventData = {
          description: `${tmEvent.info ? `${tmEvent.info} \n\n` : ''}${tmEvent.url}`,
          title: tmEvent.name,
          eventDate: tmEvent.dates.start.dateTime || new Date(),
        };

        if (existingEvent) {
          await prisma.event.update({
            where: { id: existingEvent.id },
            data: eventData,
          });
        } else {
          await prisma.event.create({
            data: {
              ...eventData,
              ticketmasterId: tmEventId,
              organizerId: organizer.id,
            },
          });
        }
      }

      // totalPages = tmData.page.totalPages;

      // * It's hardcore because there are api restrictions
      // ! API Limits Exceeded: Max paging depth exceeded. (page * size) must be less than 1,000
      totalPages = Math.round(1000 / size);
      page++;
    }
  }

  console.log('End fetchEvents: ', new Date().toString());
  isFetching = false;
}

fetchEvents().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());

cron.schedule('0 3 * * *', () => {
  console.log('Running fetchEvents at 3:00 AM');
  fetchEvents().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());
});
