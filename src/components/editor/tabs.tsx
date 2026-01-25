import React, { memo, useState } from 'react';
import { ComponentItem } from '@/types/editor';

interface TabsProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Tabs = memo(({ component, children, style }: TabsProps) => {
  const props = component.props;
  const [activeTab, setActiveTab] = useState(0);

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

  const tabsStyle: React.CSSProperties = {
    width: formatDimension(props.width) || '100%',
    backgroundColor: props.backgroundColor,
    borderRadius: formatDimension(props.borderRadius),
    borderWidth: formatDimension(props.borderWidth),
    borderColor: props.borderColor,
    borderStyle: props.borderStyle,
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    tabsStyle.position = 'absolute';
    if (props.x !== undefined) tabsStyle.left = formatDimension(props.x);
    if (props.y !== undefined) tabsStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...tabsStyle, ...style };

  // Default tabs
  const tabs = props.tabs || [
    { label: 'Tab 1', content: 'Content 1' },
    { label: 'Tab 2', content: 'Content 2' },
    { label: 'Tab 3', content: 'Content 3' },
  ];

  return (
    <div className={props.className || ''} style={finalStyle}>
      {/* Tab Headers */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #E5E7EB',
        backgroundColor: props.tabHeaderBg || '#F9FAFB',
      }}>
        {tabs.map((tab: any, index: number) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              fontSize: props.fontSize || '14px',
              fontWeight: activeTab === index ? '600' : '400',
              color: activeTab === index ? (props.activeColor || '#3B82F6') : (props.color || '#6B7280'),
              borderBottom: activeTab === index ? `2px solid ${props.activeColor || '#3B82F6'}` : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{
        padding: formatDimension(props.contentPadding) || '16px',
        fontSize: props.contentFontSize || '14px',
        color: props.contentColor || '#374151',
      }}>
        {children || tabs[activeTab]?.content || `Tab ${activeTab + 1} content`}
      </div>
    </div>
  );
});

Tabs.displayName = 'Tabs';
export { Tabs };
