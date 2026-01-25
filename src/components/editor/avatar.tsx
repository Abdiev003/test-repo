import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface AvatarProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Avatar = memo(({ component, style }: AvatarProps) => {
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
  const size = formatDimension(props.size) || formatDimension(props.width) || '40px';

  const avatarStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: props.rounded === false ? (formatDimension(props.borderRadius) || '8px') : '50%',
    backgroundColor: props.backgroundColor || '#E5E7EB',
    color: props.color || '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: props.fontSize || '14px',
    fontWeight: props.fontWeight || '500',
    borderWidth: formatDimension(props.borderWidth),
    borderColor: props.borderColor,
    borderStyle: props.borderStyle || 'solid',
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    avatarStyle.position = 'absolute';
    if (props.x !== undefined) avatarStyle.left = formatDimension(props.x);
    if (props.y !== undefined) avatarStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...avatarStyle, ...style };

  // Get initials from name
  const getInitials = (name: string): string => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className={props.className || ''} style={finalStyle}>
      {props.src || props.url ? (
        <img
          src={props.src || props.url}
          alt={props.alt || props.name || 'Avatar'}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span>{getInitials(props.name || props.text || '')}</span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';
export { Avatar };
