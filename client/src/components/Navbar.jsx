import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      location.pathname === path
        ? 'bg-red-600 text-white'
        : 'text-gray-300 hover:text-white'
    }`;

  return (
    <nav className="flex justify-center gap-2 py-4 bg-gray-950">
      <Link to="/" className={linkClass('/')}>
        SOS
      </Link>
      <Link to="/share" className={linkClass('/share')}>
  Share
</Link>
      <Link to="/contacts" className={linkClass('/contacts')}>
        Contacts
      </Link>
      <Link to="/history" className={linkClass('/history')}>
        History
      </Link>
    </nav>
  );
}

export default Navbar;