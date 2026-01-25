import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface IconProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Icon = memo(({ component, style }: IconProps) => {
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

  const iconSize = formatDimension(props.size) || formatDimension(props.width) || '24px';

  const iconStyle: React.CSSProperties = {
    width: iconSize,
    height: iconSize,
    color: props.color || '#374151',
    backgroundColor: props.backgroundColor,
    borderRadius: formatDimension(props.borderRadius),
    padding: formatDimension(props.padding),
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    iconStyle.position = 'absolute';
    if (props.x !== undefined) iconStyle.left = formatDimension(props.x);
    if (props.y !== undefined) iconStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...iconStyle, ...style };

  // Simple icon placeholder
  return (
    <div className={props.className || ''} style={finalStyle}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </div>
  );
});

Icon.displayName = 'Icon';
export { Icon };
