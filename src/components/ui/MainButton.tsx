import React, { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

interface MainButtonProps {
  onClick?: () => void;
  href?: string; // optional href for link behavior
  target?: string;
  rel?: string;
  children: ReactNode;
  className?: string; 
  disabled?: boolean;
}

const MainButton: React.FC<MainButtonProps> = ({
  onClick,
  href,
  target,
  rel,
  children,
  className,
  disabled,
}) => {
  const commonClasses = `relative group flex items-center justify-center px-4 py-1 min-w-[80px] border border-blue-400 rounded-lg overflow-hidden transition-colors duration-300 text-blue-400 hover:text-blue-400 ${className}`;

  // Render as <a> if href exists
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={commonClasses}
      >
        <span className="relative z-10 transition-all duration-300 group-hover:-translate-x-2">
          {children}
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-blue-400 group-hover:text-blue-400">
          <ArrowRight className="w-4 h-4" strokeWidth={3} />
        </span>
      </a>
    );
  }

  // Default: render as <button>
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={commonClasses}
    >
      <span className="relative z-10 transition-all duration-300 group-hover:-translate-x-2">
        {children}
      </span>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 transform translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-blue-400 group-hover:text-blue-400">
        <ArrowRight className="w-4 h-4" strokeWidth={3} />
      </span>
    </button>
  );
};

export default MainButton;
