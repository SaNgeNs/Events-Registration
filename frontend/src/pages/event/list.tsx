import { API_URLS } from "@/api/ulrs";
import Container from "@/components/layouts/container";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { EventListItem } from "@/types";
import { forwardRef, useMemo, useState } from "react";
import { keepPreviousData, useGetInfiniteList } from "react-query-manager";
import { Link } from "react-router-dom";
import { VirtuosoGrid } from "react-virtuoso";
import { routeLinks } from "../routes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

const components: any = {
  List: forwardRef(({ style, children, ...props }: any, ref) => (
    <div
      ref={ref as any}
      {...props}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
      style={style}
    >
      {children}
    </div>
  )),
  Item: ({ children, ...props }: any) => (
    <div {...props} className="flex h-full">
      {children}
    </div>
  )
};

const options = {
  directions: [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ],
  fields: [
    { value: 'eventDate', label: 'Event date' },
    { value: 'title', label: 'Event title' },
  ],
};

const itemContent = (_index: number, event: EventListItem) => {
  return (
    <Card key={event.id} className="flex flex-col w-full">
      <CardHeader>
        <CardTitle className="line-clamp-2 h-8">{event.title}</CardTitle>

        <CardDescription className="line-clamp-3 h-16">
          {event.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm font-medium">
        <span className="mr-1.5">Start:</span>
        <span>{format(event.eventDate, 'yyyy-MM-dd h:mm a')}</span>
      </CardContent>

      <CardFooter className="flex flex-row justify-between gap-2">
        <Button asChild>
          <Link to={`${routeLinks.events}${event.id}/registration`}>Register</Link>
        </Button>

        <Button asChild variant="outline">
          <Link to={`${routeLinks.events}${event.id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function EventList() {
  const [direction, setDirection] = useState(options.directions[0].value);
  const [field, setField] = useState(options.fields[0].value);

  const queryEvents = useGetInfiniteList<typeof API_URLS.events, EventListItem>({
    resource: { path: API_URLS.events, params: {} },
    pagination: {
      page: ['page'],
      per_page: ['limit', 20],
    },
    queryOptions: {
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (Number(lastPage?.headers['x-total-pages']) === lastPageParam) {
          return undefined;
        }

        return Number(lastPageParam) + 1;
      },
      placeholderData: keepPreviousData,
    },
    params: {
      sortBy: field,
      sortOrder: direction,
    },
  });

  const items = useMemo(() => (
    queryEvents.data ? queryEvents.data.pages.reduce((accumulator, currentValue) => (
      [...accumulator, ...(currentValue && currentValue.data || [])]
    ), [] as EventListItem[]) : []
  ), [queryEvents.data]);

  return (
    <Container className="px-5 my-5">
      <h1 className="text-4xl mb-5 font-bold">Events</h1>

      <div className="mb-5 flex flex-row gap-5 flex-wrap">
        <div className="flex flex-row items-center">
          <p className="text-lg font-bold mr-3">Direction:</p>

          <Select value={direction} onValueChange={setDirection}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Direction" />
            </SelectTrigger>

            <SelectContent>
              {options.directions.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center">
          <p className="text-lg font-bold mr-3">Field:</p>

          <Select value={field} onValueChange={setField}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Field" />
            </SelectTrigger>

            <SelectContent>
              {options.fields.map((item) => (
                <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {queryEvents.isLoading && <Loader className="mx-auto flex" />}

      {items.length > 0 && (
        <>
          <VirtuosoGrid
            useWindowScroll
            data={items}
            itemContent={itemContent}
            endReached={() => {
              if (queryEvents.hasNextPage) { queryEvents.fetchNextPage(); }
            }}
            components={components}
          />

          {queryEvents.isFetching && <Loader className="flex mx-auto mt-5" />}
        </>
      )}

      {!queryEvents.isLoading && items.length === 0 && (
        <p className="text-xl">There are no events</p>
      )}
    </Container>
  );
}
