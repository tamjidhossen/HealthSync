import { cn } from "../../lib/utils";

export function MainContent({
  children,
  className,
  padding = "default",
  scroll = true,
}) {
  const paddingClasses = {
    none: "",
    small: "p-4",
    default: "p-6",
    large: "p-8",
  };

  return (
    <main
      className={cn(
        "flex-1 bg-background",
        scroll && "overflow-auto",
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </main>
  );
}
