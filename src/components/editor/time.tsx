import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface TimeProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Time = memo(({ component, style }: TimeProps) => {
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
    width: formatDimension(props.width) || '100%',
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    wrapperStyle.position = 'absolute';
    if (props.x !== undefined) wrapperStyle.left = formatDimension(props.x);
    if (props.y !== undefined) wrapperStyle.top = formatDimension(props.y);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: formatDimension(props.height) || '40px',
    backgroundColor: props.backgroundColor || '#FFFFFF',
    color: props.color || '#000000',
    borderColor: props.borderColor || '#E5E7EB',
    borderWidth: formatDimension(props.borderWidth) || '1px',
    borderStyle: props.borderStyle || 'solid',
    borderRadius: formatDimension(props.borderRadius) || '6px',
    fontSize: props.fontSize || '14px',
    padding: '8px 12px',
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: props.labelFontSize || '14px',
    fontWeight: props.labelFontWeight || '500',
    color: props.labelColor || '#374151',
  };

  const finalWrapperStyle = { ...wrapperStyle, ...style };

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      {props.label && (
        <label style={labelStyle}>
          {props.label}
          {props.required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input
        type="time"
        defaultValue={props.value || props.startTime || ''}
        disabled={Boolean(props.disabled)}
        required={Boolean(props.required)}
        name={props.name}
        style={inputStyle}
      />
    </div>
  );
});

Time.displayName = 'Time';
export { Time };
