import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Search, X, Heart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function Navbar({ onSearch, searchText }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchInputRef = useRef(null);
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchToggle = () => {
    if (searchOpen && searchText) {
      onSearch("");
    }
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/favorites", label: "My List" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-netflix-black"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="flex items-center px-4 md:px-12 h-16 md:h-[68px]">
        <Link to="/" className="flex-shrink-0 mr-6 md:mr-10">
          <span className="text-netflix-red font-black text-2xl md:text-3xl tracking-tighter">
            WATCHPARTY
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm transition-colors hover:text-white/80 ${
                isActive(link.path)
                  ? "text-white font-semibold"
                  : "text-netflix-light-gray"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center transition-[width,box-shadow,background-color] duration-300 ease-out ${
              searchOpen
                ? "w-[min(22rem,calc(100vw-6rem))] min-h-[44px] rounded-full bg-neutral-950/85 pl-1 pr-1 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85),inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-2xl backdrop-saturate-150 focus-within:bg-neutral-900/90 focus-within:shadow-[0_0_36px_-6px_rgba(229,9,20,0.28),0_16px_48px_-10px_rgba(0,0,0,0.92),inset_0_1px_0_0_rgba(255,255,255,0.09)]"
                : "h-10 w-10 shrink-0 justify-center rounded-full"
            }`}
          >
            <button
              type="button"
              onClick={handleSearchToggle}
              className={`flex shrink-0 items-center justify-center text-white transition-colors hover:bg-white/[0.08] hover:text-white ${
                searchOpen
                  ? "h-9 w-9 rounded-full text-netflix-light-gray hover:text-white"
                  : "h-10 w-10 rounded-full"
              }`}
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              {searchOpen ? <X size={18} strokeWidth={2.25} /> : <Search size={20} />}
            </button>
            {searchOpen && (
              <input
                ref={searchInputRef}
                type="search"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="Titles, people, genres"
                autoComplete="off"
                enterKeyHint="search"
                className="min-w-0 flex-1 bg-transparent py-2 pr-3 text-[15px] leading-snug text-white placeholder:text-white/45 placeholder:text-[15px] caret-white outline-none selection:bg-netflix-red/40"
              />
            )}
          </div>

          {/* Favorites shortcut (desktop) */}
          <Link
            to="/favorites"
            className="hidden md:flex items-center text-white hover:text-white/80 transition-colors"
            aria-label="My List"
          >
            <Heart size={20} />
          </Link>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-1.5 text-white" aria-label="Menu">
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-64 bg-netflix-black border-l border-white/10 p-0"
              >
                <div className="flex flex-col pt-12 px-6">
                  <span className="text-netflix-red font-black text-xl tracking-tighter mb-8">
                    WATCHPARTY
                  </span>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileOpen(false)}
                      className={`py-3 text-base border-b border-white/5 transition-colors ${
                        isActive(link.path)
                          ? "text-white font-semibold"
                          : "text-netflix-light-gray hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
