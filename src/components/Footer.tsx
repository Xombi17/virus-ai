const Footer = () => {
  return (
    <footer className="bg-primary text-white w-full py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm">
          &copy; {new Date().getFullYear()} VirusAI. All rights reserved.
        </div>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="#" className="text-white hover:text-secondary transition-colors">
            Terms
          </a>
          <a href="#" className="text-white hover:text-secondary transition-colors">
            Privacy
          </a>
          <a href="#" className="text-white hover:text-secondary transition-colors">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 