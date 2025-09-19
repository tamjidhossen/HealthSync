import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    handleLinkClick();
  };

  return (
    <nav className="p-4 bg-background/50 sticky top-0 backdrop-blur border-b z-50">
      <div className="container mx-auto max-w-7xl flex justify-between items-center">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => scrollToSection("hero")}
        >
          <Heart className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold">HealthSync</span>
        </div>

        <div className="hidden md:flex space-x-6 items-center">
          <button
            onClick={() => scrollToSection("features")}
            className="hover:scale-105 hover:font-semibold duration-100 hover:text-blue-600 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => scrollToSection("ai-tools")}
            className="hover:scale-105 hover:font-semibold duration-100 hover:text-blue-600 transition-colors"
          >
            AI Tools
          </button>
          <button
            onClick={() => scrollToSection("benefits")}
            className="hover:scale-105 hover:font-semibold duration-100 hover:text-blue-600 transition-colors"
          >
            Benefits
          </button>
          <button
            onClick={() => scrollToSection("technology")}
            className="hover:scale-105 hover:font-semibold duration-100 hover:text-blue-600 transition-colors"
          >
            Technology
          </button>
          <ModeToggle />
          <Button variant="outline">Sign In</Button>
          <Button>Get Started</Button>
        </div>

        <div className="md:hidden flex items-center space-x-2">
          <ModeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-blue-600" />
                  <span>HealthSync</span>
                </SheetTitle>
                <SheetDescription>
                  Navigate through HealthSync sections
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-left hover:text-blue-600 transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("ai-tools")}
                  className="text-left hover:text-blue-600 transition-colors"
                >
                  AI Tools
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="text-left hover:text-blue-600 transition-colors"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection("technology")}
                  className="text-left hover:text-blue-600 transition-colors"
                >
                  Technology
                </button>
                <div className="flex flex-col gap-3 mt-4">
                  <Button variant="outline" onClick={handleLinkClick}>
                    Sign In
                  </Button>
                  <Button onClick={handleLinkClick}>Get Started</Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
