import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface DropdownMenuProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const DropdownMenu = memo(({ component, style }: DropdownMenuProps) => {
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

  const wrapperStyle: React.CSSProperties = {
    width: formatDimension(props.width) || 'auto',
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    wrapperStyle.position = 'absolute';
    if (props.x !== undefined) wrapperStyle.left = formatDimension(props.x);
    if (props.y !== undefined) wrapperStyle.top = formatDimension(props.y);
  }

  const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: props.backgroundColor || '#FFFFFF',
    color: props.color || '#374151',
    borderColor: props.borderColor || '#E5E7EB',
    borderWidth: formatDimension(props.borderWidth) || '1px',
    borderStyle: props.borderStyle || 'solid',
    borderRadius: formatDimension(props.borderRadius) || '6px',
    fontSize: props.fontSize || '14px',
    fontWeight: props.fontWeight || '500',
    padding: formatDimension(props.padding) || '8px 16px',
    cursor: 'pointer',
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
  };

  const finalWrapperStyle = { ...wrapperStyle, ...style };

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      <button type="button" style={buttonStyle}>
        {props.text || props.label || 'Menu'}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
});

DropdownMenu.displayName = 'DropdownMenu';
export { DropdownMenu };
