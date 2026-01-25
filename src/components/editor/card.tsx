import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface CardProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Card = memo(({ component, children, style }: CardProps) => {
  const props = component.props;

  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === 'string') {
      if (['auto', 'inherit', 'initial', 'unset', 'none'].includes(value.toLowerCase())) return value;
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw)$/)) return value;
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? undefined : `${num}px`;
  };

  const isChildComponent = props.position === 'relative';

  const cardStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor || '#FFFFFF',
    borderRadius: formatDimension(props.borderRadius) || '12px',
    borderColor: props.borderColor || '#E5E7EB',
    borderWidth: formatDimension(props.borderWidth) || '1px',
    borderStyle: props.borderStyle || 'solid',
    padding: formatDimension(props.padding) || '16px',
    width: formatDimension(props.width) || '100%',
    height: formatDimension(props.height) || 'auto',
    minWidth: formatDimension(props.minWidth),
    maxWidth: formatDimension(props.maxWidth),
    minHeight: formatDimension(props.minHeight),
    maxHeight: formatDimension(props.maxHeight),
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    borderTopLeftRadius: formatDimension(props.borderTopLeftRadius),
    borderTopRightRadius: formatDimension(props.borderTopRightRadius),
    borderBottomLeftRadius: formatDimension(props.borderBottomLeftRadius),
    borderBottomRightRadius: formatDimension(props.borderBottomRightRadius),
    boxShadow: props.boxShadow || props.shadow || '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    cardStyle.position = 'absolute';
    if (props.x !== undefined) cardStyle.left = formatDimension(props.x);
    if (props.y !== undefined) cardStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...cardStyle, ...style };

  return (
    <div className={`card ${props.className || ''}`} style={finalStyle}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
export { Card };
