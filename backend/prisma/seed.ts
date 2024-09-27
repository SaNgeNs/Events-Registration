import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const generateEvents = ({ count, users }: {
  count: number;
  users: string[];
}) => {
  const events = [];

  const dates = [
    faker.date.past(),
    faker.date.past(),
    faker.date.past(),
  ];

  for (let i = 0; i < count; i++) {
    events.push({
      title: faker.company.catchPhrase(),
      description: faker.lorem.sentences(2),
      eventDate: faker.date.future(),
      userEvents: {
        create: users.map((id, idx) => ({ userId: id, createdAt: dates[idx % dates.length] })),
      }
    });
  }

  return events;
};

async function main() {
  const referralSocialMedia = await prisma.referralSource.create({
    data: { sourceName: 'Social media' }
  });

  const referralFriends = await prisma.referralSource.create({
    data: { sourceName: 'Friends' }
  });

  const referralSelf = await prisma.referralSource.create({
    data: { sourceName: 'Found myself' }
  });

  const sourceIds = [referralSocialMedia.id, referralFriends.id, referralSelf.id];

  const users = await Promise.allSettled(
    Array(20).fill(0).map((_data, idx) => (
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.internet.userName(),
          birthday: faker.date.birthdate(),
          referralSourceId: sourceIds[idx % sourceIds.length]
        }
      })
    ))
  );

  const usersIds = users.reduce((accumulator, currentValue: any) => ([
    ...accumulator,
    currentValue.value.id
  ]), [] as any[]);

  await prisma.organizer.create({
    data: {
      name: 'Internal Organizer',
      isInternal: true
    }
  });

  await prisma.organizer.create({
    data: {
      name: faker.internet.userName(),
      isInternal: false,
      events: {
        create: [
          ...generateEvents({ count: 100, users: usersIds.slice(0, 10) }),
          ...generateEvents({ count: 100, users: usersIds.slice(10) }),
        ],
      }
    }
  });

  await prisma.organizer.create({
    data: {
      name: faker.internet.userName(),
      isInternal: false,
      events: {
        create: [
          ...generateEvents({ count: 100, users: usersIds.slice(0, 10) }),
          ...generateEvents({ count: 100, users: usersIds.slice(10) }),
        ],
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
