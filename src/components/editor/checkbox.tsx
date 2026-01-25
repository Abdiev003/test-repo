import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface CheckboxProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Checkbox = memo(({ component, style }: CheckboxProps) => {
  const props = component.props;
  const [isChecked, setIsChecked] = React.useState(Boolean(props.checked));

  // Update local state if props change
  React.useEffect(() => {
    setIsChecked(Boolean(props.checked));
  }, [props.checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    setIsChecked(e.target.checked);
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

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={Boolean(props.disabled)}
        required={Boolean(props.required)}
        name={props.name}
        style={{
          width: formatDimension(props.checkboxSize) || '16px',
          height: formatDimension(props.checkboxSize) || '16px',
          accentColor: props.accentColor || props.backgroundColor || '#3B82F6',
        }}
      />
      {props.label && <span style={labelStyle}>{props.label}</span>}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
export { Checkbox };
