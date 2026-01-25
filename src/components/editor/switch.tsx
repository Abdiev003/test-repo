import React, { memo, useEffect, useState } from 'react';
import { ComponentItem } from '@/types/editor';
import { useFormContext } from './form-context';

interface SwitchProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Switch = memo(({ component, style }: SwitchProps) => {
  const props = component.props;
  const formContext = useFormContext();
  const initialChecked = Boolean(props.checked);
  const [isChecked, setIsChecked] = useState(initialChecked);

  // Reset to initial value when form resets
  useEffect(() => {
    if (formContext?.resetKey !== undefined && formContext.resetKey > 0) {
      setIsChecked(initialChecked);
    }
  }, [formContext?.resetKey, initialChecked]);

  // Update local state if props change
  useEffect(() => {
    setIsChecked(Boolean(props.checked));
  }, [props.checked]);

  const handleToggle = () => {
    if (props.disabled) return;
    setIsChecked(!isChecked);
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: formatDimension(props.width) || 'auto',
    margin: formatDimension(props.margin),
    marginBottom:
      formatDimension(props.marginBottom) ||
      (isChildComponent ? '16px' : undefined),
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

  const switchWidth = 44;
  const switchHeight = 24;

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        disabled={Boolean(props.disabled)}
        style={{
          width: `${switchWidth}px`,
          height: `${switchHeight}px`,
          backgroundColor: isChecked
            ? props.activeColor || '#3B82F6'
            : props.inactiveColor || '#D1D5DB',
          borderRadius: `${switchHeight / 2}px`,
          border: 'none',
          cursor: props.disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'background-color 0.2s',
          opacity: props.disabled ? 0.5 : 1,
        }}
      >
        <span
          style={{
            position: 'absolute',
            width: `${switchHeight - 4}px`,
            height: `${switchHeight - 4}px`,
            backgroundColor: '#FFFFFF',
            borderRadius: '50%',
            top: '2px',
            left: isChecked ? `${switchWidth - switchHeight + 2}px` : '2px',
            transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }}
        />
      </button>
      {props.label && <span style={labelStyle}>{props.label}</span>}
    </div>
  );
});

Switch.displayName = 'Switch';
export { Switch };
