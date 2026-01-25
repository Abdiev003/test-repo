import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';
import { Button as UIButton } from '@/components/ui/button';
import Link from 'next/link';
import { useFormContext } from './form-context';

interface ButtonProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const ButtonComponent = memo(({ component, children, style }: ButtonProps) => {
  const props = component.props;
  const formContext = useFormContext();

  // Helper to format dimension values
  const formatDimension = (value: any): string | undefined => {
    if (!value && value !== 0) return undefined;
    if (typeof value === 'string') {
      if (
        ['auto', 'inherit', 'initial', 'unset', 'none'].includes(
          value.toLowerCase(),
        )
      ) {
        return value;
      }
      if (value.match(/^[\d.]+(%|px|em|rem|vh|vw)$/)) {
        return value;
      }
    }
    const num = parseFloat(String(value));
    return isNaN(num) ? undefined : `${num}px`;
  };

  // Check if component is a child (relative positioned or inside form)
  const isChildComponent = props.position === 'relative';

  // Button styles
  const buttonStyle: React.CSSProperties = {
    backgroundColor: props.backgroundColor,
    color: props.color,
    fontSize: props.fontSize || '14px',
    fontWeight: props.fontWeight || '500',
    fontFamily: props.fontFamily,
    borderRadius: formatDimension(props.borderRadius) || '6px',
    borderColor: props.borderColor,
    borderWidth: props.borderWidth,
    borderStyle: props.borderStyle,
    width: formatDimension(props.width) || 'auto',
    height: formatDimension(props.height) || 'auto',
    minWidth: formatDimension(props.minWidth),
    maxWidth: formatDimension(props.maxWidth),
    minHeight: formatDimension(props.minHeight),
    padding: props.padding || '10px 16px',
    opacity: props.opacity !== undefined ? props.opacity : 1,
  };

  // Apply positioning only for root-level components
  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    buttonStyle.position = 'absolute';
    if (props.x !== undefined) {
      buttonStyle.left = formatDimension(props.x);
    }
    if (props.y !== undefined) {
      buttonStyle.top = formatDimension(props.y);
    }
  }

  // Merge with external style
  const finalStyle = { ...buttonStyle, ...style };

  // Handle reset button click
  const handleClick = () => {
    if (props.buttonType === 'reset' && formContext?.resetForm) {
      formContext.resetForm();
    }
  };

  const buttonElement = (
    <UIButton
      variant={(props.variant as any) || 'default'}
      size={(props.size as any) || 'default'}
      type={props.buttonType || 'button'}
      disabled={Boolean(props.disabled)}
      className={props.className}
      style={finalStyle}
      onClick={handleClick}
    >
      {props.text || 'Button'}
      {children}
    </UIButton>
  );

  // Handle navigation
  if (props.url || props.link) {
    const target = props.url || props.link;
    const isExternal = target.startsWith('http') || target.startsWith('//');

    if (isExternal) {
      return (
        <a
          href={target}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          {buttonElement}
        </a>
      );
    }

    return (
      <Link
        href={target}
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        {buttonElement}
      </Link>
    );
  }

  return buttonElement;
});

ButtonComponent.displayName = 'Button';

export { ButtonComponent as Button };
