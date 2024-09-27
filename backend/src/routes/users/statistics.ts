import { asyncHandler, prisma } from "../../utils";

export default asyncHandler(async (req, res) => {
  const eventId = req.params.id;

  const registrations = await prisma.userEvent.aggregateRaw({
    pipeline: [
      {
        $match: {
          eventId: eventId,
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $addFields: {
          date: "$_id",
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ],
  });

  res.json(registrations);
});