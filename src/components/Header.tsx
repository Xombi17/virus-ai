import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-primary text-white w-full py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center">
          <span className="text-secondary mr-2">Virus</span>AI
        </Link>
        <nav className="flex space-x-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-secondary transition-colors">
            Dashboard
          </Link>
          <Link href="/scan" className="hover:text-secondary transition-colors">
            Scan
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header; 