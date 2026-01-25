import React, { useEffect, useState, useRef } from "react";
import { ComponentItem } from "@/types/editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import moment from "moment";

// DataTimePicker component (date + time inputs)
// Inspired by shadcn "Date and Time Picker" example:
// https://ui.shadcn.com/docs/components/date-picker
// We compose native date and time inputs for editor compatibility

export default function DataTimePickerComponent({
  component,
  onUpdate,
}: {
  component: ComponentItem;
  onUpdate?: (updated: ComponentItem) => void;
}) {
  const {
    // Settings
    testId,
    name,
    description,

    // Visual
    backgroundColor = "#FFFFFF",
    color = "#000000",
    borderColor = "#e5e7eb",
    borderWidth = "1px",
    borderStyle = "solid",
    borderRadius = "6px",
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    fontSize = "14px",
    fontFamily,
    fontWeight = "400",
    letterSpacing,
    lineHeight,
    textAlign,
    opacity = 1,
    shadow,
    className,
    size = "md",
    variant = "default",
    iconColor,

    // Label Typography
    labelColor,
    labelFontFamily,
    labelFontSize,
    labelFontWeight,
    labelLetterSpacing,
    labelLineHeight,

    // Placeholder
    placeholder = "Select date",
    placeholderFontSize,
    placeholderFontWeight,
    placeholderColor,

    // Layout
    display,
    float,
    width,
    height,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    // Behavior
    disabled = false,
    required = false,
    autoComplete,

    // Values
    dateValue = "",
    defaultValue,
    step = 1, // seconds for time input
    labelDate = "Date",
    label,
  } = component.props as any;

  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === "string") {
      if (
        ["auto", "inherit", "initial", "unset", "none"].includes(
          value.toLowerCase(),
        )
      )
        return value;
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw|vmin|vmax|fr|ch|ex)$/))
        return value;
      if (value.startsWith("calc(")) return value;
      if (value.match(/^[\d.]+$/)) return `${value}px`;
      return value;
    }
    if (typeof value === "number") return `${value}px`;
    return undefined;
  };

  const getBorderRadius = () => {
    if (
      borderTopLeftRadius ||
      borderTopRightRadius ||
      borderBottomLeftRadius ||
      borderBottomRightRadius
    ) {
      return `${formatDimension(borderTopLeftRadius) || formatDimension(borderRadius) || "6px"} ${formatDimension(borderTopRightRadius) || formatDimension(borderRadius) || "6px"} ${formatDimension(borderBottomRightRadius) || formatDimension(borderRadius) || "6px"} ${formatDimension(borderBottomLeftRadius) || formatDimension(borderRadius) || "6px"}`;
    }
    return formatDimension(borderRadius);
  };

  const wrapperStyle = {
    display: display || "block",
    float: float || undefined,
    width: formatDimension(width) || "100%",
  } as React.CSSProperties;

  const labelStyle = {
    color: labelColor,
    fontFamily: labelFontFamily,
    fontSize: formatDimension(labelFontSize),
    fontWeight: labelFontWeight,
    letterSpacing: formatDimension(labelLetterSpacing),
    lineHeight: labelLineHeight,
  } as React.CSSProperties;

  const baseInputStyle = {
    backgroundColor: backgroundColor || "#FFFFFF",
    color,
    borderColor,
    borderWidth: formatDimension(borderWidth),
    borderStyle,
    borderRadius: getBorderRadius(),
    fontSize: formatDimension(fontSize),
    fontFamily,
    fontWeight,
    letterSpacing: formatDimension(letterSpacing),
    lineHeight,
    textAlign,
    opacity:
      typeof opacity === "string" && (opacity as string).includes("%")
        ? parseFloat((opacity as string).replace("%", "")) / 100
        : typeof opacity === "number"
          ? opacity
          : 1,
    boxShadow: shadow,
    padding:
      padding ||
      (size === "sm"
        ? "6px 8px"
        : size === "lg"
          ? "12px 16px"
          : size === "xl"
            ? "16px 20px"
            : "8px 12px"),
    paddingTop: formatDimension(paddingTop),
    paddingRight: formatDimension(paddingRight),
    paddingBottom: formatDimension(paddingBottom),
    paddingLeft: formatDimension(paddingLeft),
    width: "100%",
    height:
      formatDimension(height) ||
      (size === "sm"
        ? "32px"
        : size === "lg"
          ? "48px"
          : size === "xl"
            ? "56px"
            : "40px"),
    minHeight:
      formatDimension(height) ||
      (size === "sm"
        ? "32px"
        : size === "lg"
          ? "48px"
          : size === "xl"
            ? "56px"
            : "40px"),
  } as React.CSSProperties;

  const getVariantClasses = () => {
    const baseClasses =
      "w-full block focus:outline-none focus:ring-0 rounded-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0";
    switch (variant) {
      case "outline":
        return `${baseClasses} bg-transparent border`;
      case "filled":
        return `${baseClasses} bg-gray-100 border-0`;
      case "flushed":
        return `${baseClasses} bg-transparent border-0 border-b`;
      case "unstyled":
        return `${baseClasses} bg-transparent border-0`;
      default:
        return `${baseClasses} bg-white border`;
    }
  };

  const [localDateTime, setLocalDateTime] = useState<string>(dateValue || "");
  
  // Track previous defaultValue to only apply when it actually changes
  const prevDefaultValueRef = useRef<string | undefined>(undefined);
  const isFirstRenderRef = useRef(true);

  // Sync local state with component props
  useEffect(() => {
    setLocalDateTime((component.props as any).dateValue || "");
  }, [(component.props as any).dateValue]);

  // Handle defaultValue changes - only when defaultValue actually changes
  useEffect(() => {
    if (!onUpdate) return;
    
    const isFirstRender = isFirstRenderRef.current;
    const hasDefaultValueChanged = prevDefaultValueRef.current !== defaultValue;
    
    // Only apply if:
    // 1. First render and defaultValue is "now" (to set initial value)
    // 2. defaultValue has actually changed
    if (!isFirstRender && !hasDefaultValueChanged) {
      return;
    }
    
    // Update refs
    if (isFirstRender) {
      isFirstRenderRef.current = false;
    }
    prevDefaultValueRef.current = defaultValue;
    
    if (defaultValue === "now") {
      // Only set "now" if there's no existing value OR defaultValue just changed to "now"
      if (!dateValue || hasDefaultValueChanged) {
        const nowDate = moment().format("YYYY-MM-DD");
        const updatedComponent: ComponentItem = {
          ...component,
          props: {
            ...component.props,
            dateValue: nowDate,
            value: nowDate,
          },
        };
        onUpdate(updatedComponent);
      }
    } else if (defaultValue === "none") {
      // Clear value when defaultValue is set to "none"
      const updatedComponent: ComponentItem = {
        ...component,
        props: {
          ...component.props,
          dateValue: "",
          value: "",
        },
      };
      onUpdate(updatedComponent);
    }
  }, [defaultValue, dateValue, onUpdate, component]);

  const splitDateTime = (value: string): { d: string; t: string } => {
    if (!value) return { d: "", t: "" };
    const [d, t] = value.split("T");
    return { d: d || "", t: (t || "").replace(/Z$/, "") };
  };

  const commit = () => {
    if (!onUpdate) return;
    const { d } = splitDateTime(localDateTime);
    const updatedComponent: ComponentItem = {
      ...component,
      props: {
        ...component.props,
        dateValue: d,
        value: combineDateTime(d),
      },
    };
    onUpdate(updatedComponent);
  };

  const combineDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    // Combine as ISO-like string
    return `${dateStr}`;
  };

  // Create unique class name for this specific input to avoid conflicts
  const uniqueClassName = `datetime-picker-${component.id || Math.random().toString(36).substr(2, 9)}`;

  // Create placeholder styles using CSS-in-JS approach
  const placeholderStyles = {
    fontSize: placeholderFontSize || undefined,
    fontWeight: placeholderFontWeight || undefined,
    color: placeholderColor || undefined,
  };

  // Calendar SVG icon component
  const CalendarIcon = ({ color }: { color?: string }) => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <path
        d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
        stroke={color || '#666'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M16 2V6M8 2V6M3 10H21"
        stroke={color || '#666'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div
      style={wrapperStyle}
      className={className}
      data-testid={testId}
      data-name={name}
      data-description={description}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col gap-2">
        <Label
          htmlFor={`${component.id}-datetime`}
          className="px-1"
          style={labelStyle}
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          {label || labelDate}
        </Label>
        <div className="relative">
          <Input
            id={`${component.id}-datetime`}
            type="date"
            step={Number(step) || 60}
            className={`${getVariantClasses()} ${uniqueClassName}`}
            style={baseInputStyle}
            data-interactive="true"
            data-testid={testId}
            value={localDateTime}
            onChange={(e) => setLocalDateTime(e.target.value)}
            onBlur={commit}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            disabled={disabled}
            required={required}
            name={name}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-label={label || labelDate}
            aria-description={description}
          />
          <div
            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={() => {
              const input = document.getElementById(`${component.id}-datetime`) as HTMLInputElement;
              if (input) {
                input.showPicker?.();
              }
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            data-interactive="true"
          >
            <CalendarIcon color={iconColor} />
          </div>
        </div>
      </div>
      
      {/* Apply placeholder styles using a style tag with unique class */}
      <style>
        {`
          .${uniqueClassName}::placeholder {
            font-size: ${placeholderStyles.fontSize || "inherit"} !important;
            color: ${placeholderStyles.color || "#9ca3af"} !important;
            font-weight: ${placeholderStyles.fontWeight || "inherit"} !important;
            text-decoration: none !important;
          }
          .${uniqueClassName}::-ms-input-placeholder {
            font-size: ${placeholderStyles.fontSize || "inherit"} !important;
            color: ${placeholderStyles.color || "#9ca3af"} !important;
            font-weight: ${placeholderStyles.fontWeight || "inherit"} !important;
            text-decoration: none !important;
          }
        `}
      </style>
    </div>
  );
}
