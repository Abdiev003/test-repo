import React, { memo, useState } from 'react';
import { ComponentItem } from '@/types/editor';

interface CarouselProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Carousel = memo(({ component, children, style }: CarouselProps) => {
  const props = component.props;
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const carouselStyle: React.CSSProperties = {
    width: formatDimension(props.width) || '100%',
    height: formatDimension(props.height) || '300px',
    backgroundColor: props.backgroundColor || '#F3F4F6',
    borderRadius: formatDimension(props.borderRadius) || '8px',
    borderWidth: formatDimension(props.borderWidth),
    borderColor: props.borderColor,
    borderStyle: props.borderStyle,
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
    overflow: 'hidden',
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    carouselStyle.position = 'absolute';
    if (props.x !== undefined) carouselStyle.left = formatDimension(props.x);
    if (props.y !== undefined) carouselStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...carouselStyle, ...style };

  // Default slides
  const slides = props.slides || props.items || [
    { content: 'Slide 1' },
    { content: 'Slide 2' },
    { content: 'Slide 3' },
  ];

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const goToPrev = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className={props.className || ''} style={finalStyle}>
      {/* Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        fontSize: props.fontSize || '18px',
        color: props.color || '#374151',
      }}>
        {children || slides[currentIndex]?.content || `Slide ${currentIndex + 1}`}
      </div>

      {/* Navigation Arrows */}
      {props.showArrows !== false && slides.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            style={{
              position: 'absolute',
              left: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <button
            onClick={goToNext}
            style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255,255,255,0.8)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>
        </>
      )}

      {/* Dots */}
      {props.showDots !== false && slides.length > 1 && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
        }}>
          {slides.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: index === currentIndex ? '#3B82F6' : '#D1D5DB',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
});

Carousel.displayName = 'Carousel';
export { Carousel };
