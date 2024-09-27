import { asyncHandler, prisma } from "../../utils";

export default asyncHandler(async (req, res) => {
  const sources = await prisma.referralSource.findMany();

  res.json(sources);
});