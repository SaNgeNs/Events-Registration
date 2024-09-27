import { Area, AreaChart, Brush, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { API_URLS } from "@/api/ulrs";
import { useGetList } from "react-query-manager";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { UserStatistic } from "@/types";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export default function UserStatistics() {
  const { id } = useParams();

  const [open, setOpen] = useState(false);

  const queryStatistics = useGetList<typeof API_URLS.events_users_statistics, UserStatistic>({
    resource: { path: API_URLS.events_users_statistics, params: { id: String(id) } },
  });

  const chartData = useMemo(() => (
    queryStatistics.data ? queryStatistics.data.data.map((item) => ({
      label: item.date,
      count: item.count,
    })) : []
  ), [queryStatistics.data]);

  const chartConfig = {
    count: {
      label: "Registrations:",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const endIndex = chartData.length < 40 ? chartData.length - 1 : 40;

  return chartData.length > 0 ? (
    <Collapsible className="mb-5" open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="flex ml-auto">
          {open ? 'Hide Statistic' : 'Show Statistic'}
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-5">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart data={chartData}>
            <ChartTooltip content={<ChartTooltipContent />} />
            <XAxis dataKey="label" />
            <YAxis />

            <CartesianGrid />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#535353"
              fill="#535353"
            />

            <Brush
              startIndex={0}
              endIndex={endIndex}
              height={50}
            >
              <AreaChart data={chartData}>
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#535353"
                  fill="#535353"
                />
              </AreaChart>
            </Brush>
          </AreaChart>
        </ChartContainer>
      </CollapsibleContent>
    </Collapsible>

  ) : null;
}
