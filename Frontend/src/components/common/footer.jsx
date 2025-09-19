import { Heart, Mail, Phone, MapPin, Github, Twitter } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full py-8 mt-auto border-t bg-muted/30 border-border">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-6 px-4">
        <div className="footer-section mb-6 md:mb-0 max-w-md">
          <div className="flex items-center space-x-2 mb-4">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">HealthSync</span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">
            Revolutionizing Bangladesh's healthcare with AI-driven centralized
            medical records, seamless care coordination, and intelligent
            assistance for patients, doctors, and medical institutions.
          </p>
        </div>

        <div className="footer-section mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="list-none space-y-3">
            <li className="text-sm md:text-base">
              <button
                onClick={() => scrollToSection("features")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </button>
            </li>
            <li className="text-sm md:text-base">
              <button
                onClick={() => scrollToSection("ai-tools")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                AI Tools
              </button>
            </li>
            <li className="text-sm md:text-base">
              <button
                onClick={() => scrollToSection("benefits")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Benefits
              </button>
            </li>
            <li className="text-sm md:text-base">
              <button
                onClick={() => scrollToSection("technology")}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Technology
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-section mb-6 md:mb-0">
          <h3 className="text-lg font-semibold mb-4">Services</h3>
          <ul className="list-none space-y-3">
            <li className="text-sm md:text-base text-muted-foreground">
              Patient Dashboard
            </li>
            <li className="text-sm md:text-base text-muted-foreground">
              Doctor Portal
            </li>
            <li className="text-sm md:text-base text-muted-foreground">
              Hospital Management
            </li>
            <li className="text-sm md:text-base text-muted-foreground">
              AI Medical Assistant
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3">
            <p className="text-sm md:text-base flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href="mailto:contact@healthsync.bd"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                contact@healthsync.bd
              </a>
            </p>
            <p className="text-sm md:text-base flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">+880 1700-000000</span>
            </p>
            <p className="text-sm md:text-base flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Dhaka, Bangladesh</span>
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@healthsync.bd"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="text-center text-sm md:text-base text-muted-foreground">
        <p>
          &copy; 2025 HealthSync. Transforming healthcare in Bangladesh with
          AI-powered solutions.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
