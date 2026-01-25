import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface BadgeProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Badge = memo(({ component, style }: BadgeProps) => {
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

  const badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: props.backgroundColor || '#3B82F6',
    color: props.color || '#FFFFFF',
    fontSize: props.fontSize || '12px',
    fontWeight: props.fontWeight || '500',
    fontFamily: props.fontFamily,
    padding: formatDimension(props.padding) || '4px 8px',
    borderRadius: formatDimension(props.borderRadius) || '9999px',
    borderWidth: formatDimension(props.borderWidth),
    borderColor: props.borderColor,
    borderStyle: props.borderStyle,
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    minWidth: formatDimension(props.minWidth),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    badgeStyle.position = 'absolute';
    if (props.x !== undefined) badgeStyle.left = formatDimension(props.x);
    if (props.y !== undefined) badgeStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...badgeStyle, ...style };

  return (
    <span className={props.className || ''} style={finalStyle}>
      {props.text || props.label || 'Badge'}
    </span>
  );
});

Badge.displayName = 'Badge';
export { Badge };
