import { asyncHandler, prisma } from "../../utils";

export default asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: true
    }
  });

  res.json(event);
});