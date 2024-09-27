export type ReferralSource = {
  id: string;
  sourceName: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  birthday: string;
  referralSourceId: string;
  referralSource: ReferralSource;
};

export type UserEvent = {
  id: string;
  userId: string;
  eventId: string;
  createdAt: string;
  user: User;
};

export type UserEventRegistrate= {
  name: string;
  email: string;
  birthday: string;
  referralSourceId: string;
};

export type Organizer = {
  id: string;
  isInternal: boolean;
  name: string;
};

export type EventDetailItem = {
  id: string;
  eventDate: string;
  description: string;
  organizerId: string;
  title: string;
  organizer: Organizer;
  userEvents: UserEvent[];
};

export type UserStatistic = {
  _id: string;
  count: number;
  date: string;
};

export type EventListItem = Omit<EventDetailItem, 'organizer' | 'userEvents'>;
