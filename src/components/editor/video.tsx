import React, { memo } from 'react';
import { ComponentItem } from '@/types/editor';

interface VideoProps {
  component: ComponentItem;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Video = memo(({ component, style }: VideoProps) => {
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

  const videoWrapperStyle: React.CSSProperties = {
    width: formatDimension(props.width) || '100%',
    height: formatDimension(props.height) || 'auto',
    backgroundColor: props.backgroundColor || '#000000',
    borderRadius: formatDimension(props.borderRadius) || '8px',
    borderWidth: formatDimension(props.borderWidth),
    borderColor: props.borderColor,
    borderStyle: props.borderStyle,
    margin: formatDimension(props.margin),
    marginBottom: formatDimension(props.marginBottom) || (isChildComponent ? '16px' : undefined),
    boxShadow: props.boxShadow || props.shadow,
    opacity: props.opacity !== undefined ? Number(props.opacity) : 1,
    overflow: 'hidden',
    position: 'relative' as const,
  };

  if (!isChildComponent && (props.x !== undefined || props.y !== undefined)) {
    videoWrapperStyle.position = 'absolute';
    if (props.x !== undefined) videoWrapperStyle.left = formatDimension(props.x);
    if (props.y !== undefined) videoWrapperStyle.top = formatDimension(props.y);
  }

  const finalStyle = { ...videoWrapperStyle, ...style };

  // Check if it's a YouTube/Vimeo URL
  const getEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return null;
  };

  const src = props.src || props.url;
  const embedUrl = src ? getEmbedUrl(src) : null;

  return (
    <div className={props.className || ''} style={finalStyle}>
      {embedUrl ? (
        <iframe
          src={embedUrl}
          style={{
            width: '100%',
            height: formatDimension(props.height) || '315px',
            border: 'none',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : src ? (
        <video
          src={src}
          controls={props.controls !== false}
          autoPlay={Boolean(props.autoPlay)}
          loop={Boolean(props.loop)}
          muted={Boolean(props.muted)}
          poster={props.poster}
          style={{
            width: '100%',
            height: '100%',
            objectFit: (props.objectFit as any) || 'cover',
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: formatDimension(props.height) || '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#9CA3AF',
          fontSize: '14px',
        }}>
          No video source
        </div>
      )}
    </div>
  );
});

Video.displayName = 'Video';
export { Video };
