import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface ListProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const List = memo(({ component, children, style }: ListProps) => {
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

  const listStyle: React.CSSProperties = {
    width: formatDimension(props.width) || '100%',
    backgroundColor: props.backgroundColor,
    borderRadius: formatDimension(props.borderRadius),
    borderWidth: formatDimension(props.borderWidth),
    borderColor: props.borderColor,
    borderStyle: props.borderStyle,
    padding: formatDimension(props.padding),
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
    listStyleType: props.listStyleType || 'none',
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    listStyle.position = 'absolute';
    if (props.x !== undefined) listStyle.left = formatDimension(props.x);
    if (props.y !== undefined) listStyle.top = formatDimension(props.y);
  }

  const itemStyle: React.CSSProperties = {
    padding: formatDimension(props.itemPadding) || '12px 16px',
    borderBottom: props.divider !== false ? '1px solid #E5E7EB' : 'none',
    fontSize: props.fontSize || '14px',
    color: props.color || '#374151',
  };

  const finalStyle = { ...listStyle, ...style };

  // Default items if no children
  const items = props.items || [
    { text: 'List Item 1' },
    { text: 'List Item 2' },
    { text: 'List Item 3' },
  ];

  const ListTag = props.ordered ? 'ol' : 'ul';

  return (
    <ListTag className={props.className || ''} style={finalStyle}>
      {children || items.map((item: any, index: number) => (
        <li key={index} style={itemStyle}>
          {item.text || item.label || `Item ${index + 1}`}
        </li>
      ))}
    </ListTag>
  );
});

List.displayName = 'List';
export { List };
