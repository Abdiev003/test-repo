import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';
import { FormProvider, useFormContext } from './form-context';

interface FormProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

// Default design system values
const DEFAULT_STYLES = {
  backgroundColor: '#FFFFFF',
  borderColor: '#E5E7EB',
  borderWidth: '1px',
  borderStyle: 'solid' as const,
  borderRadius: '8px',
  padding: '16px',
  minHeight: '120px',
  height: 'auto',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
};

const Form = memo(({ component, children, style }: FormProps) => {
  const props = component.props;

  // Helper to format dimension values
  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === 'string') {
      if (
        [
          'auto',
          'inherit',
          'initial',
          'unset',
          'none',
          'min-content',
          'max-content',
          'fit-content',
        ].includes(value.toLowerCase())
      ) {
        return value;
      }
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw|vmin|vmax|fr|ch|ex)$/)) {
        return value;
      }
      if (value.startsWith('calc(')) {
        return value;
      }
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? undefined : `${num}px`;
  };

  // Build dynamic styles from component props
  const dynamicStyles: React.CSSProperties = {
    ...DEFAULT_STYLES,
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  };

  // Apply dimension styles
  if (props.width !== undefined) {
    dynamicStyles.width = formatDimension(props.width);
  }
  if (props.height !== undefined) {
    dynamicStyles.height = formatDimension(props.height);
  } else {
    dynamicStyles.height = 'auto';
  }
  if (props.minWidth !== undefined) {
    dynamicStyles.minWidth = formatDimension(props.minWidth);
  }
  if (props.minHeight !== undefined) {
    dynamicStyles.minHeight = formatDimension(props.minHeight);
  }
  if (props.maxWidth !== undefined) {
    dynamicStyles.maxWidth = formatDimension(props.maxWidth);
  }
  if (props.maxHeight !== undefined) {
    dynamicStyles.maxHeight = formatDimension(props.maxHeight);
  }

  // Apply background styles
  if (props.backgroundColor) {
    dynamicStyles.backgroundColor = props.backgroundColor;
  }
  if (props.backgroundImage) {
    dynamicStyles.backgroundImage = `url(${props.backgroundImage})`;
    dynamicStyles.backgroundSize = props.backgroundSize || 'cover';
    dynamicStyles.backgroundPosition = props.backgroundPosition || 'center';
    dynamicStyles.backgroundRepeat = props.backgroundRepeat || 'no-repeat';
  }

  // Apply border styles
  if (props.borderColor) {
    dynamicStyles.borderColor = props.borderColor;
  }
  if (props.borderWidth !== undefined) {
    dynamicStyles.borderWidth = formatDimension(props.borderWidth);
  }
  if (props.borderStyle) {
    dynamicStyles.borderStyle = props.borderStyle;
  }
  if (props.borderRadius !== undefined) {
    dynamicStyles.borderRadius = formatDimension(props.borderRadius);
  }

  // Apply individual border radius
  if (props.borderTopLeftRadius !== undefined) {
    dynamicStyles.borderTopLeftRadius = formatDimension(
      props.borderTopLeftRadius,
    );
  }
  if (props.borderTopRightRadius !== undefined) {
    dynamicStyles.borderTopRightRadius = formatDimension(
      props.borderTopRightRadius,
    );
  }
  if (props.borderBottomLeftRadius !== undefined) {
    dynamicStyles.borderBottomLeftRadius = formatDimension(
      props.borderBottomLeftRadius,
    );
  }
  if (props.borderBottomRightRadius !== undefined) {
    dynamicStyles.borderBottomRightRadius = formatDimension(
      props.borderBottomRightRadius,
    );
  }

  // Apply spacing styles
  if (props.margin !== undefined) {
    dynamicStyles.margin = formatDimension(props.margin);
  }
  if (props.marginTop !== undefined) {
    dynamicStyles.marginTop = formatDimension(props.marginTop);
  }
  if (props.marginRight !== undefined) {
    dynamicStyles.marginRight = formatDimension(props.marginRight);
  }
  if (props.marginBottom !== undefined) {
    dynamicStyles.marginBottom = formatDimension(props.marginBottom);
  }
  if (props.marginLeft !== undefined) {
    dynamicStyles.marginLeft = formatDimension(props.marginLeft);
  }

  if (props.padding !== undefined) {
    dynamicStyles.padding = formatDimension(props.padding);
  }
  if (props.paddingTop !== undefined) {
    dynamicStyles.paddingTop = formatDimension(props.paddingTop);
  }
  if (props.paddingRight !== undefined) {
    dynamicStyles.paddingRight = formatDimension(props.paddingRight);
  }
  if (props.paddingBottom !== undefined) {
    dynamicStyles.paddingBottom = formatDimension(props.paddingBottom);
  }
  if (props.paddingLeft !== undefined) {
    dynamicStyles.paddingLeft = formatDimension(props.paddingLeft);
  }

  // Apply opacity
  if (props.opacity !== undefined) {
    dynamicStyles.opacity = parseFloat(String(props.opacity));
  }

  // Apply z-index
  if (props.zIndex !== undefined) {
    dynamicStyles.zIndex = parseInt(String(props.zIndex));
  }

  // Apply box shadow
  if (props.boxShadow) {
    dynamicStyles.boxShadow = props.boxShadow;
  }

  // Apply x/y positioning for root-level forms (not relative positioned)
  if (props.position !== 'relative') {
    if (props.x !== undefined || props.y !== undefined) {
      dynamicStyles.position = 'absolute';
      if (props.x !== undefined) {
        dynamicStyles.left = formatDimension(props.x);
      }
      if (props.y !== undefined) {
        dynamicStyles.top = formatDimension(props.y);
      }
    }
  }

  // Apply scroll style to ensure content is accessible if it overflows
  dynamicStyles.overflowY = 'auto'; // Fix for scroll structure issues
  dynamicStyles.overflowX = 'hidden';

  // Merge with external style prop
  const finalStyles = { ...dynamicStyles, ...style };

  return (
    <FormProvider>
      <form
        className={`form-container ${props.className || ''}`}
        style={finalStyles}
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Form Title */}
        {props.formTitle && (
          <div className="mb-2 text-lg font-semibold text-gray-900">
            {props.formTitle}
          </div>
        )}

        {/* Form Description */}
        {props.formText && (
          <div className="mb-2 text-sm text-gray-600">{props.formText}</div>
        )}

        {/* Form Children */}
        <div className="flex flex-col gap-4">{children}</div>
      </form>
    </FormProvider>
  );
});

Form.displayName = 'Form';
export { Form };
