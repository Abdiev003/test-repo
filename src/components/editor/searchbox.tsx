import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface SearchBoxProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const SearchBox = memo(({ component, style }: SearchBoxProps) => {
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
    borderRadius: formatDimension(props.borderRadius) || '8px',
    fontSize: props.fontSize || '14px',
    paddingLeft: '40px',
    paddingRight: '12px',
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
  };

  const finalWrapperStyle = { ...wrapperStyle, ...style };

  return (
    <div className={props.className || ''} style={finalWrapperStyle}>
      <div style={{ position: 'relative' }}>
        {/* Search Icon */}
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          type="search"
          placeholder={props.placeholder || 'Search...'}
          defaultValue={props.value || ''}
          disabled={Boolean(props.disabled)}
          name={props.name}
          style={inputStyle}
          className="focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500"
        />
      </div>
    </div>
  );
});

SearchBox.displayName = 'SearchBox';
export { SearchBox };
