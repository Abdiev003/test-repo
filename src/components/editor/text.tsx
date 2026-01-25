import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface TextProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Text = memo(({ component, children, style }: TextProps) => {
  const props = component.props;

  // Helper to format dimension values
  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === 'string') {
      if (['auto', 'inherit', 'initial', 'unset', 'none'].includes(value.toLowerCase())) {
        return value;
      }
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw)$/)) {
        return value;
      }
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? undefined : `${num}px`;
  };

  // Check if component is a child (relative positioned)
  const isChildComponent = props.position === 'relative';

  // Wrapper style for positioning
  const wrapperStyle: React.CSSProperties = {
    width: formatDimension(props.width) || 'auto',
    height: formatDimension(props.height) || 'auto',
    marginBottom: props.marginBottom || '16px',
    position: 'relative' as const,
  };

  // Only apply absolute positioning for root-level components
  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    wrapperStyle.position = 'absolute';
    if (props.x !== undefined) {
      wrapperStyle.left = formatDimension(props.x);
    }
    if (props.y !== undefined) {
      wrapperStyle.top = formatDimension(props.y);
    }
  }

  // Merge with external style
  const finalWrapperStyle = { ...wrapperStyle, ...style };

  // Text content styles
  const textStyle: React.CSSProperties = {
    fontSize: props.fontSize || '16px',
    fontWeight: props.fontWeight || 'normal',
    fontFamily: props.fontFamily,
    color: props.color || '#000000',
    backgroundColor: props.backgroundColor,
    textAlign: (props.textAlign as any) || 'left',
    letterSpacing: props.letterSpacing,
    lineHeight: props.lineHeight,
    textDecoration: props.textDecoration,
    opacity: props.opacity !== undefined ? props.opacity : 1,
  };

  const content = props.text || 'Text';
  const variant = props.variant || 'p';
  const className = props.className || '';

  const getTextElement = () => {
    switch (variant) {
      case 'h1':
        return <h1 className={`text-4xl font-bold ${className}`} style={textStyle}>{content}</h1>;
      case 'h2':
        return <h2 className={`text-3xl font-semibold ${className}`} style={textStyle}>{content}</h2>;
      case 'h3':
        return <h3 className={`text-2xl font-medium ${className}`} style={textStyle}>{content}</h3>;
      case 'h4':
        return <h4 className={`text-xl font-medium ${className}`} style={textStyle}>{content}</h4>;
      case 'h5':
        return <h5 className={`text-lg font-medium ${className}`} style={textStyle}>{content}</h5>;
      case 'h6':
        return <h6 className={`text-base font-medium ${className}`} style={textStyle}>{content}</h6>;
      case 'span':
        return <span className={className} style={textStyle}>{content}</span>;
      default:
        return <p className={className} style={textStyle}>{content}</p>;
    }
  };

  return (
    <div style={finalWrapperStyle}>
      {getTextElement()}
      {children}
    </div>
  );
});

Text.displayName = 'Text';
export { Text };
