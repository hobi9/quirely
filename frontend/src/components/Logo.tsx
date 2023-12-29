import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/">
      <div className="inline-flex items-center gap-1 transition hover:opacity-75">
        <img src="/logo.svg" className="h-8 w-8" />
        <span className="font-logo text-xl capitalize">quirely</span>
      </div>
    </Link>
  );
};

export default Logo;
