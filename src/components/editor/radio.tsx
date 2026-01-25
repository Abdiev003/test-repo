import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface RadioProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Radio = memo(({ component, style }: RadioProps) => {
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
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    width: formatDimension(props.width) || 'auto',
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    padding: formatDimension(props.padding),
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    wrapperStyle.position = 'absolute';
    if (props.x !== undefined) wrapperStyle.left = formatDimension(props.x);
    if (props.y !== undefined) wrapperStyle.top = formatDimension(props.y);
  }

  const labelStyle: React.CSSProperties = {
    fontSize: props.fontSize || '14px',
    fontWeight: props.fontWeight,
    color: props.color || '#374151',
    fontFamily: props.fontFamily,
  };

  const finalWrapperStyle = { ...wrapperStyle, ...style };

  // Options for radio buttons
  const options = props.options || [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
  ];

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      {props.label && (
        <label style={{ ...labelStyle, fontWeight: '500', marginBottom: '4px' }}>
          {props.label}
          {props.required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      {options.map((option: any, index: number) => (
        <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="radio"
            name={props.name || `radio-${component.id}`}
            value={option.value}
            defaultChecked={option.checked || props.selectedValue === option.value}
            disabled={Boolean(props.disabled)}
            style={{
              width: formatDimension(props.radioSize) || '16px',
              height: formatDimension(props.radioSize) || '16px',
              accentColor: props.accentColor || props.backgroundColor || '#3B82F6',
            }}
          />
          <span style={labelStyle}>{option.label}</span>
        </label>
      ))}
    </div>
  );
});

Radio.displayName = 'Radio';
export { Radio };
