import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface AutocompleteProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}) => {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        className={cn(
          "file:text-foreground selection:bg-primary selection:text-primary-foreground flex w-full min-w-0 items-center rounded-md border border-[#F1F1F2] bg-[#FDFDFD] px-3 py-1 text-[#505664] shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#93979F] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xs dark:bg-white",
          "min-h-[44px]",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          value.length === 0 && "text-[#93979F]",
        )}
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto">
          {value.length > 0 ? (
            options
              .filter((opt) => value.includes(opt.value))
              .map((opt) => (
                <span
                  key={opt.value}
                  className="flex items-center gap-1 rounded-[2px] border border-[#97DAD2] bg-[transparent] px-2 py-0.5 text-xs font-medium whitespace-nowrap text-[#31998a]"
                >
                  {opt.label}
                  <button
                    type="button"
                    className="ml-1 text-[#5EC6B3] hover:text-[#31998a] focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(value.filter((v) => v !== opt.value));
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="6" y1="6" x2="14" y2="14" />
                      <line x1="14" y1="6" x2="6" y2="14" />
                    </svg>
                  </button>
                </span>
              ))
          ) : (
            <span className="truncate text-[#93979F]">{placeholder}</span>
          )}
        </div>
        {open ? (
          <ChevronUp size={20} strokeWidth={1.75} />
        ) : (
          <ChevronDown size={20} strokeWidth={1.75} />
        )}
      </div>
      {open && (
        <div className="absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-md border border-[#F1F1F2] bg-[#FDFDFD] shadow-lg">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 hover:bg-[#F1F1F2]"
            >
              <Checkbox
                checked={value.includes(option.value)}
                onCheckedChange={() => handleSelect(option.value)}
                className="h-4 max-h-[16px] min-h-[16px] w-4 max-w-[16px] min-w-[16px] rounded border border-[#D1D5DB] text-white"
              />
              <span className="mt-[1.5px] text-xs text-[#0F172A]">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
