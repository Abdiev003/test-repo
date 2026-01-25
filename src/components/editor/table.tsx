import React, { useMemo, useRef, useEffect, useState } from "react";
import { ComponentItem } from "@/types/editor";
import { cn } from "@/lib/utils";

export default function Table({
  component,
  isSelected = false,
}: {
  component: ComponentItem;
  isSelected?: boolean;
}) {
  const props = component.props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [computedRowSpacing, setComputedRowSpacing] = useState<string>("0");

  // Helper function to format dimension values
  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === "string") {
      if (
        ["auto", "inherit", "initial", "unset", "none"].includes(
          value.toLowerCase(),
        )
      ) {
        return value;
      }
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw|vmin|vmax|fr|ch|ex)$/)) {
        return value;
      }
      if (value.startsWith("calc(")) {
        return value;
      }
      if (value.match(/^[\d.]+$/)) {
        return `${value}px`;
      }
      return value;
    }
    if (typeof value === "number") {
      return `${value}px`;
    }
    return undefined;
  };

  // Get table properties from component props
  const headers = Array.isArray(props.headers)
    ? props.headers
    : ["Column 1", "Column 2", "Column 3"];

  const rows = Array.isArray(props.rows)
    ? props.rows
    : [
        ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
        ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"],
      ];

  const displayHeaders = props.displayHeaders !== false;
  
  // Convert percentage rowSpacing to pixels
  useEffect(() => {
    const rawRowSpacing = formatDimension(props.rowSpacing) || "0";
    
    const calculateSpacing = () => {
      // Check if rowSpacing is a percentage value
      if (rawRowSpacing.includes("%") && containerRef.current) {
        const percentMatch = rawRowSpacing.match(/^([\d.]+)%$/);
        if (percentMatch) {
          const percentValue = parseFloat(percentMatch[1]);
          // Get container height to calculate percentage
          const containerHeight = containerRef.current.offsetHeight;
          
          // If container has height, calculate pixel value
          if (containerHeight > 0) {
            const pixelValue = (containerHeight * percentValue) / 100;
            setComputedRowSpacing(`${pixelValue}px`);
            return;
          }
        }
      }
      
      // If not percentage or no match, use as is
      setComputedRowSpacing(rawRowSpacing);
    };
    
    // Initial calculation
    calculateSpacing();
    
    // Set up ResizeObserver to recalculate on container size change
    if (rawRowSpacing.includes("%") && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        calculateSpacing();
      });
      
      resizeObserver.observe(containerRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [props.rowSpacing, props.height, rows.length]);

  const rowSpacing = computedRowSpacing;

  // Build comprehensive style object for table container
  const containerStyle: React.CSSProperties = useMemo(
    () => ({
      width: formatDimension(props.width) || "fit-content",
      height: formatDimension(props.height) || "auto",
      padding: formatDimension(props.padding) || "0",
      margin: formatDimension(props.margin) || "0",
      opacity: props.opacity || 1,
    }),
    [props],
  );

  // Header styles
  const headerStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: props.headerFontFamily || "Inter",
      fontSize: formatDimension(props.headerFontSize) || "14px",
      fontWeight: props.headerFontWeight || "600",
      color: props.headerTextColor || "#000000",
      backgroundColor: props.headerBackgroundColor || "#f5f5f5",
      padding: formatDimension(props.headerPadding) || "12px",
      textAlign: (props.headerTextAlign as any) || "left",
      letterSpacing: formatDimension(props.headerLetterSpacing) || undefined,
      lineHeight: props.headerLineHeight || undefined,
    }),
    [props],
  );

  // Row styles
  const rowStyle: React.CSSProperties = useMemo(
    () => ({
      fontFamily: props.rowFontFamily || "Inter",
      fontSize: formatDimension(props.rowFontSize) || "14px",
      fontWeight: props.rowFontWeight || "400",
      color: props.rowTextColor || "#000000",
      backgroundColor: props.rowBackgroundColor || "transparent",
      padding: formatDimension(props.rowPadding) || "12px",
      textAlign: (props.rowTextAlign as any) || "left",
      letterSpacing: formatDimension(props.rowLetterSpacing) || undefined,
      lineHeight: props.rowLineHeight || undefined,
    }),
    [props],
  );

  // Border styles
  const borderStyle = useMemo(() => {
    const borderWidth = formatDimension(props.borderWidth) || "1px";
    const borderStyleProp = props.borderStyle || "solid";
    const borderColor = props.borderColor || "#e5e7eb";
    
    return {
      border: `${borderWidth} ${borderStyleProp} ${borderColor}`,
    };
  }, [props]);

  // Table border radius
  const tableBorderRadius = useMemo(() => {
    return {
      borderTopLeftRadius: formatDimension(props.borderTopLeftRadius) || "0",
      borderTopRightRadius: formatDimension(props.borderTopRightRadius) || "0",
      borderBottomLeftRadius: formatDimension(props.borderBottomLeftRadius) || "0",
      borderBottomRightRadius: formatDimension(props.borderBottomRightRadius) || "0",
    };
  }, [props]);

  return (
    <div
      ref={containerRef}
      id={component.id}
      className={cn(
        "h-full",
        isSelected && "outline-2 outline-[#5BB6AB]",
        props.className,
        props.class,
      )}
      style={{
        ...containerStyle,
        position: "relative",
        transform: "translate3d(0,0,0)",
      }}
      data-type={component.type}
      data-can-drop="true"
    >
      <div
        style={{
          width: props.width ? "100%" : "fit-content",
          height: "fit-content",
          overflow: "hidden",
          // Sadece row spacing yoksa wrapper'a border ekle
          ...(rowSpacing === "0" && borderStyle),
          ...(rowSpacing === "0" && tableBorderRadius),
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: rowSpacing !== "0" ? "separate" : "collapse",
            ...(rowSpacing !== "0" && { borderSpacing: `0 ${rowSpacing}` }),
          }}
        >
        {displayHeaders && (
          <thead>
            <tr>
              {headers.map((header: string, index: number) => (
                <th
                  key={index}
                  style={{
                    ...headerStyle,
                    // Row spacing varsa her hücreye tam border ve border radius
                    ...(rowSpacing !== "0" && borderStyle),
                    ...(rowSpacing !== "0" && index === 0 && {
                      borderTopLeftRadius: tableBorderRadius.borderTopLeftRadius,
                    }),
                    ...(rowSpacing !== "0" && index === headers.length - 1 && {
                      borderTopRightRadius: tableBorderRadius.borderTopRightRadius,
                    }),
                    // Row spacing yoksa sadece iç kenarlıklar
                    ...(rowSpacing === "0" && index !== headers.length - 1 && {
                      borderRight: `${formatDimension(props.borderWidth) || "1px"} ${props.borderStyle || "solid"} ${props.borderColor || "#e5e7eb"}`,
                    }),
                    // Header'ın altına border ekle (her durumda)
                    ...(rowSpacing === "0" && {
                      borderBottom: `${formatDimension(props.borderWidth) || "1px"} ${props.borderStyle || "solid"} ${props.borderColor || "#e5e7eb"}`,
                    }),
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row: string[], rowIndex: number) => (
            <tr key={rowIndex}>
              {row.map((cell: string, cellIndex: number) => (
                <td
                  key={cellIndex}
                  style={{
                    ...rowStyle,
                    // Row spacing varsa her hücreye tam border ve border radius
                    ...(rowSpacing !== "0" && borderStyle),
                    // Header yoksa ilk satırın üst border-radius'u
                    ...(rowSpacing !== "0" && !displayHeaders && rowIndex === 0 && cellIndex === 0 && {
                      borderTopLeftRadius: tableBorderRadius.borderTopLeftRadius,
                    }),
                    ...(rowSpacing !== "0" && !displayHeaders && rowIndex === 0 && cellIndex === row.length - 1 && {
                      borderTopRightRadius: tableBorderRadius.borderTopRightRadius,
                    }),
                    // Son satırın alt border-radius'u
                    ...(rowSpacing !== "0" && rowIndex === rows.length - 1 && cellIndex === 0 && {
                      borderBottomLeftRadius: tableBorderRadius.borderBottomLeftRadius,
                    }),
                    ...(rowSpacing !== "0" && rowIndex === rows.length - 1 && cellIndex === row.length - 1 && {
                      borderBottomRightRadius: tableBorderRadius.borderBottomRightRadius,
                    }),
                    // Row spacing yoksa sadece iç kenarlıklar (son satır ve son sütun hariç)
                    ...(rowSpacing === "0" && cellIndex !== row.length - 1 && {
                      borderRight: `${formatDimension(props.borderWidth) || "1px"} ${props.borderStyle || "solid"} ${props.borderColor || "#e5e7eb"}`,
                    }),
                    ...(rowSpacing === "0" && rowIndex !== rows.length - 1 && {
                      borderBottom: `${formatDimension(props.borderWidth) || "1px"} ${props.borderStyle || "solid"} ${props.borderColor || "#e5e7eb"}`,
                    }),
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

