import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface InputProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Input = memo(({ component, style }: InputProps) => {
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
    width: formatDimension(props.width) || '100%',
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

  // Input custom styles
  const inputStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: props.backgroundColor || '#FFFFFF',
    color: props.color || '#000000',
    borderColor: props.borderColor || '#E5E7EB',
    borderWidth: props.borderWidth || '1px',
    borderStyle: props.borderStyle || 'solid',
    borderRadius: formatDimension(props.borderRadius) || '6px',
    fontSize: props.fontSize || '14px',
    fontWeight: props.fontWeight,
    fontFamily: props.fontFamily,
    letterSpacing: props.letterSpacing,
    lineHeight: props.lineHeight,
    height: formatDimension(props.height) || '40px',
    textAlign: (props.textAlign as any) || 'left',
    padding: props.padding || '8px 12px',
    boxShadow: props.shadow,
    opacity: props.opacity !== undefined ? props.opacity : 1,
  };

  // Label styles
  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: props.labelFontSize || '14px',
    fontWeight: props.labelFontWeight || '500',
    color: props.labelColor || '#374151',
    fontFamily: props.labelFontFamily,
  };

  return (
    <div style={finalWrapperStyle}>
      {/* Label */}
      {props.label && (
        <label style={labelStyle}>
          {props.label}
          {props.required && <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      {/* Input */}
      <input
        type={props.inputType || props.type || 'text'}
        placeholder={props.placeholder || 'Enter value'}
        disabled={Boolean(props.disabled)}
        required={Boolean(props.required)}
        readOnly={Boolean(props.readOnly)}
        name={props.name}
        defaultValue={props.value || props.text || ''}
        maxLength={props.maxLength ? Number(props.maxLength) : undefined}
        minLength={props.minLength ? Number(props.minLength) : undefined}
        pattern={props.pattern}
        step={props.step}
        min={props.min}
        max={props.max}
        autoComplete={props.autoComplete}
        className={`focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}
        style={inputStyle}
      />

      {/* Helper Text */}
      {props.helperText && (
        <div style={{
          fontSize: '12px',
          color: props.state === 'error' ? '#EF4444' : '#6B7280',
          marginTop: '4px'
        }}>
          {props.helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
