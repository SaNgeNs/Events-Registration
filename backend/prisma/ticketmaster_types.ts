export interface TicketmasterEvent {
  name: string;
  type: string;
  id: string;
  test: boolean;
  url: string;
  locale: string;
  images: Image[];
  sales: Sales;
  dates: Dates;
  classifications: Classification[];
  promoter?: Promoter;
  promoters: Promoter[];
  info: string;
  pleaseNote: string;
  priceRanges: PriceRange[];
  products: Product[];
  seatmap: Seatmap;
  accessibility: Accessibility;
  ticketLimit: TicketLimit;
  ageRestrictions: AgeRestrictions;
  ticketing: Ticketing;
  _links: Links;
  _embedded: Embedded;
}

interface Embedded {
  venues: Venue[];
  attractions: Attraction[];
}

interface Attraction {
  name: string;
  type: string;
  id: string;
  test: boolean;
  url: string;
  locale: string;
  externalLinks?: ExternalLinks;
  aliases?: string[];
  images: Image[];
  classifications: Classification[];
  upcomingEvents: UpcomingEvents;
  _links: Links2;
}

interface ExternalLinks {
  twitter: Twitter[];
  facebook: Twitter[];
  wiki: Twitter[];
  instagram: Twitter[];
  homepage: Twitter[];
}

interface Twitter {
  url: string;
}

interface Venue {
  name: string;
  type: string;
  id: string;
  test: boolean;
  url: string;
  locale: string;
  images: Image[];
  postalCode: string;
  timezone: string;
  city: City;
  state: State;
  country: Country;
  address: Address;
  location: Location;
  markets: Segment[];
  dmas: Dma[];
  boxOfficeInfo?: BoxOfficeInfo;
  parkingDetail?: string;
  accessibleSeatingDetail?: string;
  generalInfo?: GeneralInfo;
  upcomingEvents: UpcomingEvents;
  _links: Links2;
}

interface Links2 {
  self: Self;
}

interface UpcomingEvents {
  ticketmaster: number;
  _total: number;
  _filtered: number;
}

interface GeneralInfo {
  generalRule: string;
  childRule: string;
}

interface BoxOfficeInfo {
  phoneNumberDetail: string;
  openHoursDetail: string;
  acceptedPaymentDetail: string;
  willCallDetail: string;
}

interface Dma {
  id: number;
}

interface Location {
  longitude: string;
  latitude: string;
}

interface Address {
  line1: string;
}

interface Country {
  name: string;
  countryCode: string;
}

interface State {
  name: string;
  stateCode: string;
}

interface City {
  name: string;
}

interface Links {
  self: Self;
  attractions: Self[];
  venues: Self[];
}

interface Self {
  href: string;
}

interface Ticketing {
  safeTix: SafeTix;
  allInclusivePricing: AllInclusivePricing;
  id: string;
}

interface AllInclusivePricing {
  enabled: boolean;
}

interface SafeTix {
  enabled: boolean;
  inAppOnlyEnabled: boolean;
}

interface AgeRestrictions {
  legalAgeEnforced: boolean;
  id: string;
}

interface TicketLimit {
  info: string;
  id: string;
}

interface Accessibility {
  ticketLimit: number;
  id: string;
}

interface Seatmap {
  staticUrl: string;
  id: string;
}

interface Product {
  name: string;
  id: string;
  url: string;
  type: string;
  classifications: Classification[];
}

interface PriceRange {
  type: string;
  currency: string;
  min: number;
  max: number;
}

interface Promoter {
  id: string;
  name: string;
  description: string;
}

interface Classification {
  primary: boolean;
  segment: Segment;
  genre: Segment;
  subGenre: Segment;
  type: Segment;
  subType: Segment;
  family: boolean;
}

interface Segment {
  id: string;
  name: string;
}

interface Dates {
  start: Start;
  timezone: string;
  status: Status;
  spanMultipleDays: boolean;
}

interface Status {
  code: string;
}

interface Start {
  localDate: string;
  localTime: string;
  dateTime: string;
  dateTBD: boolean;
  dateTBA: boolean;
  timeTBA: boolean;
  noSpecificTime: boolean;
}

interface Sales {
  public: Public;
}

interface Public {
  startDateTime: string;
  startTBD: boolean;
  startTBA: boolean;
  endDateTime: string;
}

interface Image {
  ratio: string;
  url: string;
  width: number;
  height: number;
  fallback: boolean;
}