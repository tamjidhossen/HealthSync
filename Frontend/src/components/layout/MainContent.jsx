import { cn } from "../../lib/utils";
import { useEffect, useRef } from "react";
import { useDashboard } from "../../hooks/useDashboard";

export function MainContent({
  children,
  className,
  padding = "default",
  scroll = true,
}) {
  const { activeTab } = useDashboard();
  const mainRef = useRef(null);

  // Scroll to top when activeTab changes
  useEffect(() => {
    const scrollToTop = () => {
      // Try multiple scroll methods to ensure compatibility
      if (mainRef.current) {
        mainRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      // Also try scrolling the window as fallback
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Try document.body as another fallback
      if (document.body.scrollTop > 0) {
        document.body.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      // Try document.documentElement as final fallback
      if (document.documentElement.scrollTop > 0) {
        document.documentElement.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    };

    scrollToTop();
  }, [activeTab]);

  const paddingClasses = {
    none: "",
    small: "p-4",
    default: "p-6",
    large: "p-8",
  };

  return (
    <main
      ref={mainRef}
      className={cn(
        "flex-1 bg-background",
        scroll && "overflow-auto h-[calc(100vh-4rem)]",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </main>
  );
}
