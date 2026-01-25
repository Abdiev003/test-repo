import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface ColumnProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Column = memo(({ component, children, style }: ColumnProps) => {
  const props = component.props;

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

  const columnStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: (props.direction || 'column') as any,
    backgroundColor: props.backgroundColor,
    borderRadius: formatDimension(props.borderRadius),
    borderColor: props.borderColor,
    borderWidth: formatDimension(props.borderWidth),
    borderStyle: props.borderStyle,
    padding: formatDimension(props.padding),
    width: formatDimension(props.width) || '100%',
    height: formatDimension(props.height) || 'auto',
    minWidth: formatDimension(props.minWidth),
    maxWidth: formatDimension(props.maxWidth),
    minHeight: formatDimension(props.minHeight),
    maxHeight: formatDimension(props.maxHeight),
    margin: formatDimension(props.margin),
    marginBottom:
      formatDimension(props.marginBottom) ||
      (isChildComponent ? '16px' : undefined),
    gap: formatDimension(props.gap) || '16px',
    justifyContent: props.justifyContent || props.justify,
    alignItems: props.alignItems || props.align,
    flexWrap: props.flexWrap || props.wrap,
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    columnStyle.position = 'absolute';
    if (props.x !== undefined) columnStyle.left = formatDimension(props.x);
    if (props.y !== undefined) columnStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...columnStyle, ...style };

  // For column children, we need to ensure they take up available space and don't collapse
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        // @ts-ignore
        style: { ...child.props.style, position: 'relative', flex: '1 1 auto' },
      });
    }
    return child;
  });

  return (
    <div className={props.className || ''} style={finalStyle}>
      {childrenWithProps || children}
    </div>
  );
});

Column.displayName = 'Column';
export { Column };
