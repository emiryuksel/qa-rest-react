function Footer() {
  return (
    <footer className="bg-[#1f1f1f] text-neutral-400 text-sm mt-10 border-t border-[#2b2b2b]">
      <div className="max-w-4xl mx-auto py-6 px-4 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left space-y-4 sm:space-y-0">
        <p>© {new Date().getFullYear()} Q&A Platform – All rights reserved.</p>

        <div className="space-x-4">
          <a href="#" className="hover:text-white transition">
            LinkedIn
          </a>
          <a href="#" className="hover:text-white transition">
            GitHub
          </a>
          <a href="#" className="hover:text-white transition">
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
