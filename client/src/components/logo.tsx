import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}

export function Logo({ size = "md", showTagline = true, className }: LogoProps) {
  const sizeMap = {
    sm: {
      container: "p-2 mb-0",
      location: "w-6 h-6",
      title: "text-lg",
      tagline: "text-xs",
      crossSize: "w-8 h-8",
    },
    md: {
      container: "p-3 mb-3",
      location: "w-8 h-8",
      title: "text-xl",
      tagline: "text-base",
      crossSize: "w-12 h-12",
    },
    lg: {
      container: "p-3 mb-3",
      location: "w-10 h-10",
      title: "text-3xl",
      tagline: "text-lg",
      crossSize: "w-16 h-16",
    },
  };

  return (
    <div className={cn("text-center animate-fade-in-fast", className)}>
      <div className={cn(
        "inline-flex items-center justify-center bg-white/10 rounded-full mb-2 relative",
        "animate-heartbeat",
        sizeMap[size].container
      )}>
        <div className={cn("absolute animate-spin-slow", sizeMap[size].crossSize)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L12 22M2 12L22 12" stroke="#FF0000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={cn("absolute z-10", sizeMap[size].location)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#22c55e"/>
          </svg>
        </div>
      </div>
      <h1 className={cn("font-bold text-white font-sans mb-1 animate-slide-up-fast", sizeMap[size].title)}>
        <span className="text-red-500 animate-[fade_1.5s_ease-in-out_infinite]">Medi</span>
        <span className="text-emerald-400 animate-[fade_1.5s_ease-in-out_infinite] [animation-delay:0.2s]">Track</span>
      </h1>
      {showTagline && (
        <p className={cn(
          "text-emerald-400 font-medium tracking-wide animate-slide-up-delayed-fast",
          "hover:text-emerald-300 transition-colors duration-200",
          "animate-[fade_1.5s_ease-in-out_infinite] [animation-delay:0.4s]",
          sizeMap[size].tagline
        )}>
          Track Emergencies, Save Lives
        </p>
      )}
    </div>
  );
}

export default Logo;
