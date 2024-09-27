import { routeLinks } from '@/pages/routes';
import { Link, Outlet } from 'react-router-dom';

function MainLayouts() {
  return (
    <div className='flex flex-col min-h-dvh'>
      <header className="z-50 sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4">
        <Link
          to={routeLinks.events}
          className='font-semibold underline'
        >
          Events Registration
        </Link>
      </header>

      <main className='flex-1'>
        <Outlet />
      </main>

      <footer className="z-50 flex h-16 items-center gap-4 border-t bg-background px-4">
        © 2024 Events Registration. All rights reserved.
      </footer>
    </div>
  );
}

export default MainLayouts;
