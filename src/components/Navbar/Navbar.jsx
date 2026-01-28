import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/40">
      <div className="container mx-auto px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-xl md:text-2xl transform group-hover:scale-110 transition-transform">
              🎬
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CineMania
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">Discover Movies</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <Link to="/">
              <Button 
                variant={isActive('/') ? 'default' : 'ghost'} 
                size="lg"
                className="gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Button>
            </Link>
            
            <Link to="/favorites">
              <Button 
                variant={isActive('/favorites') ? 'default' : 'ghost'} 
                size="lg"
                className="gap-2 relative"
              >
                <svg className="w-4 h-4" fill={isActive('/favorites') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favorites
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <Link to="/" onClick={() => setOpen(false)}>
                    <Button 
                      variant={isActive('/') ? 'default' : 'ghost'} 
                      className="w-full justify-start gap-3 text-base h-12"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Home
                    </Button>
                  </Link>
                  
                  <Link to="/favorites" onClick={() => setOpen(false)}>
                    <Button 
                      variant={isActive('/favorites') ? 'default' : 'ghost'} 
                      className="w-full justify-start gap-3 text-base h-12"
                    >
                      <svg className="w-5 h-5" fill={isActive('/favorites') ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Favorites
                    </Button>
                  </Link>
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