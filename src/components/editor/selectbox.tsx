import React, { memo, useEffect, useState, useMemo } from 'react';
import { ComponentItem } from '@/types/editor';
import { useFormContext } from './form-context';

interface SelectboxProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Selectbox = memo(({ component, style }: SelectboxProps) => {
  const props = component.props;
  const formContext = useFormContext();
  const options = props.selectboxOptions || [];

  // Get initial value from isDefault option or props
  const initialValue = useMemo(() => {
    if (props.selectedValue) return props.selectedValue;
    if (props.value) return props.value;
    const defaultOption = options.find((opt: any) => opt.isDefault);
    return defaultOption ? defaultOption.id : '';
  }, [props.selectedValue, props.value, options]);

  const [selectedValue, setSelectedValue] = useState(initialValue);

  // Reset to initial value when form resets
  useEffect(() => {
    if (formContext?.resetKey !== undefined && formContext.resetKey > 0) {
      setSelectedValue(initialValue);
    }
  }, [formContext?.resetKey, initialValue]);

  // Update local state if props change
  useEffect(() => {
    const newValue = props.selectedValue || props.value || '';
    if (newValue) {
      setSelectedValue(newValue);
    }
  }, [props.selectedValue, props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (props.disabled) return;
    setSelectedValue(e.target.value);
  };

  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === 'string') {
      if (
        ['auto', 'inherit', 'initial', 'unset', 'none'].includes(
          value.toLowerCase(),
        )
      )
        return value;
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw)$/)) return value;
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? undefined : `${num}px`;
  };

  const isChildComponent = props.position === 'relative';

  const wrapperStyle: React.CSSProperties = {
    width: formatDimension(props.width) || '100%',
    margin: formatDimension(props.margin),
    marginBottom:
      formatDimension(props.marginBottom) ||
      (isChildComponent ? '16px' : undefined),
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    wrapperStyle.position = 'absolute';
    if (props.x !== undefined) wrapperStyle.left = formatDimension(props.x);
    if (props.y !== undefined) wrapperStyle.top = formatDimension(props.y);
  }

  const selectStyle: React.CSSProperties = {
    width: '100%',
    height: formatDimension(props.height) || '40px',
    backgroundColor: props.backgroundColor || '#FFFFFF',
    color: props.color || '#000000',
    borderColor: props.borderColor || '#E5E7EB',
    borderWidth: formatDimension(props.borderWidth) || '1px',
    borderStyle: props.borderStyle || 'solid',
    borderRadius: formatDimension(props.borderRadius) || '6px',
    fontSize: props.fontSize || '14px',
    fontWeight: props.fontWeight,
    fontFamily: props.fontFamily,
    padding: '8px 12px',
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontSize: props.labelFontSize || '14px',
    fontWeight: props.labelFontWeight || '500',
    color: props.labelColor || '#374151',
    fontFamily: props.labelFontFamily,
  };

  const finalWrapperStyle = { ...wrapperStyle, ...style };

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      {props.label && (
        <label style={labelStyle}>
          {props.label}
          {props.required && (
            <span style={{ color: '#EF4444', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}
      <select
        disabled={Boolean(props.disabled)}
        required={Boolean(props.required)}
        name={props.name}
        value={selectedValue}
        onChange={handleChange}
        style={selectStyle}
      >
        {props.placeholder && (
          <option value="" disabled>
            {props.placeholder}
          </option>
        )}
        {options.map((option: any, index: number) => (
          <option
            key={index}
            value={option.id}
            defaultChecked={option.isDefault}
          >
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
});

Selectbox.displayName = 'Selectbox';
export { Selectbox };
