import { z } from "zod";
import { asyncHandler, prisma } from "../../utils";

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

const userEventSchema = z.object({
  name: z.string().min(3, {
    message: "name must be at least 3 characters.",
  }),
  email: z.string().email("email is required."),
  birthday: z.string()
    .regex(dateFormatRegex, { message: "Date must be in the format 'yyyy-MM-dd'T'HH:mm:ss'Z'" }),
  referralSourceId: z.string().min(1, {
    message: 'Referral source is required.'
  }),
});

export default asyncHandler(async (req, res) => {
  const parseResult = userEventSchema.safeParse(req.body);

  if (!parseResult.success) {
    return res.status(400).json({
      errors: parseResult.error.errors,
    });
  }

  const eventId = req.params.id;
  const { name, email, birthday, referralSourceId } = parseResult.data;

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name,
        email,
        birthday,
        referralSourceId,
      },
    });
  }

  const existingUserEvent = await prisma.userEvent.findFirst({
    where: {
      userId: user.id,
      eventId,
    },
  });

  if (existingUserEvent) {
    return res.status(400).json({ error: 'The user is already registered for this event' });
  }

  const userEvent = await prisma.userEvent.create({
    data: {
      userId: user.id,
      eventId,
    },
    include: {
      user: true,
    },
  });

  res.status(201).json(userEvent);
});