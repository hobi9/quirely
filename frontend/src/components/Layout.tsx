import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="h-screen">
      <Navbar />
      <main className="mx-auto h-full w-full px-4 pt-24 xl:max-w-screen-2xl">
        <div className="flex h-full gap-x-4">
          <div className="hidden h-full w-64 shrink-0 md:block">
            <Sidebar />
          </div>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
