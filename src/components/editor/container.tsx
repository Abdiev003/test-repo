import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface ContainerProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Container = memo(({ component, children, style }: ContainerProps) => {
  const props = component.props;

  // Helper to format dimension values
  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === 'string') {
      if (['auto', 'inherit', 'initial', 'unset', 'none', 'min-content', 'max-content', 'fit-content'].includes(value.toLowerCase())) {
        return value;
      }
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw|vmin|vmax)$/)) {
        return value;
      }
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? undefined : `${num}px`;
  };

  const isChildComponent = props.position === 'relative';

  const containerStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor || '#FFFFFF',
    borderRadius: formatDimension(props.borderRadius) || '8px',
    borderColor: props.borderColor || '#E5E7EB',
    borderWidth: formatDimension(props.borderWidth) || '1px',
    borderStyle: props.borderStyle || 'solid',
    padding: formatDimension(props.padding) || '16px',
    width: formatDimension(props.width) || '100%',
    height: formatDimension(props.height) || 'auto',
    minWidth: formatDimension(props.minWidth),
    maxWidth: formatDimension(props.maxWidth),
    minHeight: formatDimension(props.minHeight),
    maxHeight: formatDimension(props.maxHeight),
    margin: formatDimension(props.margin),
    marginTop: formatDimension(props.marginTop),
    marginRight: formatDimension(props.marginRight),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    marginLeft: formatDimension(props.marginLeft),
    paddingTop: formatDimension(props.paddingTop),
    paddingRight: formatDimension(props.paddingRight),
    paddingBottom: formatDimension(props.paddingBottom),
    paddingLeft: formatDimension(props.paddingLeft),
    borderTopLeftRadius: formatDimension(props.borderTopLeftRadius),
    borderTopRightRadius: formatDimension(props.borderTopRightRadius),
    borderBottomLeftRadius: formatDimension(props.borderBottomLeftRadius),
    borderBottomRightRadius: formatDimension(props.borderBottomRightRadius),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    zIndex: props.zIndex !== undefined ? Number(props.zIndex) : undefined,
    display: props.display || 'flex',
    flexDirection: (props.flexDirection || props.direction || 'column') as any,
    gap: formatDimension(props.gap) || '16px',
    justifyContent: props.justifyContent || props.justify,
    alignItems: props.alignItems || props.align,
    flexWrap: props.flexWrap || props.wrap,
    overflow: props.overflow,
    overflowX: props.overflowX,
    overflowY: props.overflowY,
    position: 'relative' as const,
  };

  // Apply absolute positioning for root-level components
  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    containerStyle.position = 'absolute';
    if (props.x !== undefined) containerStyle.left = formatDimension(props.x);
    if (props.y !== undefined) containerStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...containerStyle, ...style };

  return (
    <div className={props.className || ''} style={finalStyle}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';
export { Container };
