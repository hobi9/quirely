import Logo from '@/components/Logo';
import { Link } from '@tanstack/react-router';

const Navbar = () => {
  return (
    <header className="fixed top-0 z-50 h-14 w-full bg-slate-50 shadow-md">
      <div className="flex h-full items-center justify-between px-5">
        <div className="flex h-4 items-center md:gap-x-5">
          <div className="hidden md:block">
            <Logo />
          </div>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link
                to="/auth/login"
                className="text-muted-foreground hover:text-primary"
              >
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
