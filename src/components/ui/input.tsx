import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type = "text",
  startAdornment,
  endAdornment,
  ...props
}: React.ComponentProps<"input"> & {
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
}) {
  return (
    <div className="relative flex w-full items-center">
      {startAdornment && (
        <div className="pointer-events-none absolute left-3 z-20 flex items-center text-[#93979F]">
          {startAdornment}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground flex h-11 w-full min-w-0 rounded-md border border-[#F1F1F2] bg-[#FDFDFD] px-3 py-1 text-[#505664] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#93979F] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs dark:bg-white",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[0.5px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          startAdornment && "pl-8",
          endAdornment && "pr-8",
          type === "number" &&
            "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          className,
        )}
        {...props}
      />
      {endAdornment && (
        <div className="pointer-events-none absolute right-3 z-20 flex items-center text-[#93979F]">
          {endAdornment}
        </div>
      )}
    </div>
  );
}

function PasswordInput({ className, ...props }: React.ComponentProps<"input">) {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Input
      type={isVisible ? "text" : "password"}
      className={className}
      startAdornment={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      }
      endAdornment={
        <button
          type="button"
          onClick={toggleVisibility}
          className="pointer-events-auto cursor-pointer text-[#93979F] hover:text-[#505664]"
          tabIndex={-1}
        >
          {isVisible ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          )}
        </button>
      }
      {...props}
    />
  );
}

export { Input, PasswordInput };
