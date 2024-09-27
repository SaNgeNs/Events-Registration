import { asyncHandler, getPagination, prisma, setPaginationHeaders } from "../../utils";

export default asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);

  const { sortBy, sortOrder } = req.query;

  const orderField: any = sortBy || 'eventDate';
  const orderDirection = sortOrder || 'asc';

  const totalEvents = await prisma.event.count();
  const events = await prisma.event.findMany({
    skip: skip,
    take: limit,
    orderBy: {
      [orderField]: orderDirection,
    },
  });

  setPaginationHeaders(res, totalEvents, page, limit);
  res.json(events);
});