import Loader from '@/components/ui/loader';
import loadable from '@/utils/loadable';
import { Navigate } from 'react-router-dom';

const LoaderChunk = () => (
  <div className='flex justify-center w-full mt-4'>
    <Loader></Loader>
  </div>
);

const MainLayout = loadable(() => import('@/components/layouts/main'), { fallback: <LoaderChunk /> });

const MainEvent = loadable(() => import('@/pages/event'), { fallback: <LoaderChunk /> });
const EventList = loadable(() => import('@/pages/event/list'), { fallback: <LoaderChunk /> });
const EventDetail = loadable(() => import('@/pages/event/detail'), { fallback: <LoaderChunk /> });
const EventRegistration = loadable(() => import('@/pages/event/registration'), { fallback: <LoaderChunk /> });

const NotFound = loadable(() => import('@/pages/not-found'), { fallback: <LoaderChunk /> });

export const routeLinks = {
  events: '/events/',
};

/**
 * appRoutes returns an array of routes for the main router.
 * It contains the main routes for the application, including the home page,
 * contacts page, build page, inventory page, dashboard page, and a catch-all
 * for unknown routes.
 *
 * @returns {Array} An array of routes for the main router.
 */
function appRoutes() {
  const routes = [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { index: true, element: <Navigate to={routeLinks.events} replace />, name: 'Home' },
        {
          element: <MainEvent />,
          name: 'Main Event',
          path: routeLinks.events,
          children: [
            { index: true, element: <EventList />, name: 'Event List' },
            { path: ':id/', element: <EventDetail />, name: 'Event Detail' },
            { path: ':id/registration/', element: <EventRegistration />, name: 'Event Registration' },
            // { path: 'create/', element: <Contact />, name: 'Contact' },
          ],
        },
        { path: '*', element: <NotFound />, name: '404' },
      ],
    },
  ];

  return routes;
}

export default appRoutes;
