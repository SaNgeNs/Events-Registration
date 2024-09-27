import Container from "@/components/layouts/container";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { formatInTimeZone } from "date-fns-tz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API_URLS } from "@/api/ulrs";
import { useCreate, useGetList, useGetOne } from "react-query-manager";
import { EventDetailItem, ReferralSource, UserEvent, UserEventRegistrate } from "@/types";
import { DatePicker } from "@/components/ui/datepicker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { routeLinks } from "../routes";
import Loader from "@/components/ui/loader";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "name must be at least 3 characters.",
  }),
  email: z.string().email("Email is required."),
  birthday: z.date({
    required_error: "A date of birth is required.",
  }),
  referralSourceId: z.string().min(1, {
    message: 'Referral source is required.'
  }),
});

export default function EventRegistration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const goToList = () => {
    navigate(routeLinks.events);
  };

  const queryEvent = useGetOne<typeof API_URLS.events, EventDetailItem>({
    resource: { path: API_URLS.events, params: {} },
    id: String(id),
  });

  const queryReferralSource = useGetList<typeof API_URLS.referral_source, ReferralSource>({
    resource: { path: API_URLS.referral_source, params: {} },
  });

  const mutateRegistate = useCreate<typeof API_URLS.events_users, UserEvent, UserEventRegistrate>({
    resourcePath: API_URLS.events_users,
    cacheAddItemTo: 'end',
    extraResources: [
      { path: API_URLS.events_users_statistics, params: { id: String(id) } }
    ],
    mutationOptions: {
      onSuccess: () => {
        navigate(`${routeLinks.events}${id}`);
      },
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      referralSourceId: '',
      birthday: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutateRegistate.create({
      resourceParams: { id: String(id) },
      data: {
        ...values,
        birthday: formatInTimeZone(new Date(), 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      },
    });
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

      {queryEvent.isLoading && <Loader className="flex mx-auto mt-5" />}

      {queryEvent.data && (
        <h1 className="text-2xl mb-5">
          <span>Registration to</span>
          <span className="ml-1.5 font-bold">{`"${queryEvent.data?.data.title || ''}"`}</span>
        </h1>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthday"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of birth</FormLabel>

                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralSourceId"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Where did you hear about this event?</FormLabel>

                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-5"
                  >
                    {queryReferralSource.data?.data.map((source) => (
                      <FormItem key={source.id} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={source.id} />
                        </FormControl>

                        <FormLabel>
                          {source.sourceName}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={mutateRegistate.mutation.isPending}>
            Submit
          </Button>
        </form>
      </Form>
    </Container>
  );
}
