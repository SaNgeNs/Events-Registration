import { API_URLS } from "@/api/ulrs";
import Container from "@/components/layouts/container";
import { EventDetailItem, User } from "@/types";
import { useGetInfiniteList, useGetOne } from "react-query-manager";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card, CardDescription,
  CardHeader, CardTitle
} from "@/components/ui/card";
import { forwardRef, useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import Loader from "@/components/ui/loader";
import { routeLinks } from "@/pages/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSearch from "@/hooks/useSearch";
import UserStatistics from "./user-statistics";

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
    <div {...props}>
      {children}
    </div>
  )
};

const itemContent = (_index: number, user: User) => {
  return (
    <Card key={user.id}>
      <CardHeader>
        <CardTitle className="truncate">{user.name}</CardTitle>
        <CardDescription className="truncate">{user.email}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const goToList = () => {
    navigate(routeLinks.events);
  };

  const { search, inputValue, onSearch } = useSearch();

  const queryEvent = useGetOne<typeof API_URLS.events, EventDetailItem>({
    resource: { path: API_URLS.events, params: {} },
    id: String(id),
  });

  const queryUsers = useGetInfiniteList<typeof API_URLS.events_users, User>({
    resource: { path: API_URLS.events_users, params: { id: String(id) } },
    pagination: {
      page: ['page'],
      per_page: ['limit', 20],
    },
    params: { search },
    queryOptions: {
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (Number(lastPage?.headers['x-total-pages']) === lastPageParam) {
          return undefined;
        }

        return Number(lastPageParam) + 1;
      },
    },
  });

  const users = useMemo(() => (
    queryUsers.data ? queryUsers.data.pages.reduce((accumulator, currentValue) => (
      [...accumulator, ...(currentValue && currentValue.data || [])]
    ), [] as User[]) : []
  ), [queryUsers.data]);

  if (queryEvent.error || queryUsers.error) {
    goToList();
  }

  return (
    <Container className="px-5 my-5">
      <Button
        variant="outline"
        className="mb-5"
        onClick={goToList}
      >
        Back
      </Button>

      {queryEvent.data && (
        <>
          <h1 className="text-2xl font-bold mb-2">{queryEvent.data?.data.title}</h1>
          <p className="break-words whitespace-pre-line mb-3">{queryEvent.data?.data.description}</p>
        </>
      )}

      {queryEvent.isLoading || queryUsers.isLoading && <Loader className="flex mt-5 mx-auto" />}

      {users.length > 0 && (
        <>
          <h2 className="text-2xl font-bold">Participants:</h2>

          <Input
            className="mb-5"
            placeholder="Enter name or email"
            onChange={onSearch}
            value={inputValue}
          />

          <UserStatistics />

          <VirtuosoGrid
            useWindowScroll
            data={users}
            itemContent={itemContent}
            endReached={() => {
              if (queryUsers.hasNextPage) { queryUsers.fetchNextPage(); }
            }}
            components={components}
          />

          {queryUsers.isFetching && <Loader className="flex mx-auto mt-5" />}
        </>
      )}
    </Container>
  );
}
