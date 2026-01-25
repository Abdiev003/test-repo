import React, { memo, useState } from 'react';
import { ComponentItem } from '@/types/editor';

interface AccordionProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Accordion = memo(({ component, children, style }: AccordionProps) => {
  const props = component.props;
  const [openIndex, setOpenIndex] = useState<number | null>(props.defaultOpen !== undefined ? Number(props.defaultOpen) : 0);

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

  const accordionStyle: React.CSSProperties = {
    width: formatDimension(props.width) || '100%',
    backgroundColor: props.backgroundColor,
    borderRadius: formatDimension(props.borderRadius) || '8px',
    borderWidth: formatDimension(props.borderWidth) || '1px',
    borderColor: props.borderColor || '#E5E7EB',
    borderStyle: props.borderStyle || 'solid',
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    overflow: 'hidden',
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    accordionStyle.position = 'absolute';
    if (props.x !== undefined) accordionStyle.left = formatDimension(props.x);
    if (props.y !== undefined) accordionStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...accordionStyle, ...style };

  // Default items
  const items = props.items || [
    { title: 'Accordion Item 1', content: 'Content for item 1' },
    { title: 'Accordion Item 2', content: 'Content for item 2' },
    { title: 'Accordion Item 3', content: 'Content for item 3' },
  ];

  const toggleItem = (index: number) => {
    if (props.allowMultiple) {
      // Multiple mode would need array state - simplified here
      setOpenIndex(openIndex === index ? null : index);
    } else {
      setOpenIndex(openIndex === index ? null : index);
    }
  };

  return (
    <div className={props.className || ''} style={finalStyle}>
      {children || items.map((item: any, index: number) => (
        <div key={index} style={{ borderBottom: index < items.length - 1 ? '1px solid #E5E7EB' : 'none' }}>
          {/* Header */}
          <button
            onClick={() => toggleItem(index)}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: props.headerBg || '#F9FAFB',
              cursor: 'pointer',
              fontSize: props.fontSize || '14px',
              fontWeight: '500',
              color: props.color || '#374151',
              textAlign: 'left',
            }}
          >
            <span>{item.title}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* Content */}
          {openIndex === index && (
            <div style={{
              padding: '12px 16px',
              fontSize: props.contentFontSize || '14px',
              color: props.contentColor || '#6B7280',
              backgroundColor: props.contentBg || '#FFFFFF',
            }}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

Accordion.displayName = 'Accordion';
export { Accordion };
