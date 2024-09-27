import { asyncHandler, getPagination, prisma, setPaginationHeaders } from "../../utils";

export default asyncHandler(async (req, res) => {
  const eventId = req.params.id;
  const search = req.query.search ? String(req.query.search).trim() : '';
  const { page, limit, skip } = getPagination(req);

  const userEvents = await prisma.userEvent.findMany({
    where: { eventId: eventId },
    select: { userId: true },
  });

  const userIds = userEvents.map((user) => user.userId);

  const whereConditions: any = {
    id: { in: userIds },
    OR: [
      {
        name: {
          contains: search ? String(search) : '',
          mode: 'insensitive',
        },
      },
      {
        email: {
          contains: search ? String(search) : '',
          mode: 'insensitive',
        },
      },
    ],
  };

  const totalUsers = await prisma.user.count({
    where: whereConditions,
  });

  const users = await prisma.user.findMany({
    skip: skip,
    take: limit,
    where: whereConditions,
  });

  setPaginationHeaders(res, totalUsers, page, limit);
  res.json(users);
});