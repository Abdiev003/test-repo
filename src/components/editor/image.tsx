import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface ImageProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Image = memo(({ component, style }: ImageProps) => {
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
    height: formatDimension(props.height) || 'auto',
    minWidth: formatDimension(props.minWidth),
    maxWidth: formatDimension(props.maxWidth),
    minHeight: formatDimension(props.minHeight),
    maxHeight: formatDimension(props.maxHeight),
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    borderRadius: formatDimension(props.borderRadius),
    overflow: 'hidden',
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    boxShadow: props.boxShadow || props.shadow,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    wrapperStyle.position = 'absolute';
    if (props.x !== undefined) wrapperStyle.left = formatDimension(props.x);
    if (props.y !== undefined) wrapperStyle.top = formatDimension(props.y);
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: (props.objectFit as any) || 'cover',
    objectPosition: props.objectPosition || 'center',
    borderRadius: formatDimension(props.borderRadius),
  };

  const finalWrapperStyle = { ...wrapperStyle, ...style };

  return (
    <div style={finalWrapperStyle} className={props.className || ''}>
      {props.url || props.src ? (
        <img
          src={props.url || props.src}
          alt={props.alt || 'Image'}
          style={imageStyle}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: formatDimension(props.height) || '200px',
            backgroundColor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9CA3AF',
            fontSize: '14px',
          }}
        >
          No image
        </div>
      )}
    </div>
  );
});

Image.displayName = 'Image';
export { Image };
