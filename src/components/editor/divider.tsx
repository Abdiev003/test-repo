import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface DividerProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Divider = memo(({ component, style }: DividerProps) => {
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
  const isVertical = props.orientation === 'vertical';

  const dividerStyle: React.CSSProperties = {
    backgroundColor: props.color || props.backgroundColor || '#E5E7EB',
    width: isVertical ? (formatDimension(props.thickness) || '1px') : (formatDimension(props.width) || '100%'),
    height: isVertical ? (formatDimension(props.height) || '100%') : (formatDimension(props.thickness) || '1px'),
    margin: formatDimension(props.margin),
    marginTop: formatDimension(props.marginTop),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    marginLeft: formatDimension(props.marginLeft),
    marginRight: formatDimension(props.marginRight),
    borderRadius: formatDimension(props.borderRadius),
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    dividerStyle.position = 'absolute';
    if (props.x !== undefined) dividerStyle.left = formatDimension(props.x);
    if (props.y !== undefined) dividerStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...dividerStyle, ...style };

  return <div className={props.className || ''} style={finalStyle} />;
});

Divider.displayName = 'Divider';
export { Divider };
