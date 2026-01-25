export type ComponentType =
  | 'component-Button'
  | 'component-Input'
  | 'component-Card'
  | 'component-Container'
  | 'component-Column'
  | 'component-Row'
  | 'component-Text'
  | 'component-Image'
  | 'component-Time'
  | 'component-Radio'
  | 'component-Checkbox'
  | 'component-TextArea'
  | 'component-Selectbox'
  | 'component-Switch'
  | 'component-Date'
  | 'component-Input'
  | 'component-SearchBox'
  | 'component-Avatar'
  | 'component-Badge'
  | 'component-Divider'
  | 'component-Video'
  | 'component-Icon'
  | 'component-DropdownMenu'
  | 'component-Popover'
  | 'component-Accordion'
  | 'component-List'
  | 'component-Carousel'
  | 'component-Tabs'
  | 'component-Toast'
  | 'component-Form'
  | 'Button'
  | 'Input'
  | 'Text'
  | 'Container'
  | 'Image'
  | 'Card'
  | 'Column'
  | 'Divider'
  | 'DropdownMenu'
  | 'Avatar'
  | 'SearchBox'
  | 'Video'
  | 'Carousel';

export type DeviceVisibility = 'mobile' | 'tablet' | 'desktop';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface ComponentItem {
  id: string;
  type: ComponentType;
  children?: ComponentItem[];
  columnChildren?: ComponentItem[][]; // For column components: array of arrays, each representing a column
  props: {
    // Base positioning and sizing
    x: number;
    y: number;
    width: number | string;
    height: number | string;

    // Column specific properties
    columnWidths?: string[];

    // Device-specific positioning and sizing
    mobile_x?: number;
    mobile_y?: number;
    mobile_width?: number | string;
    mobile_height?: number | string;

    tablet_x?: number;
    tablet_y?: number;
    tablet_width?: number | string;
    tablet_height?: number | string;

    // Device visibility
    deviceVisibility?: DeviceVisibility[];

    // Common properties
    text?: string;
    backgroundColor?: string;
    borderRadius?: string;
    borderColor?: string;
    borderWidth?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    color?: string;
    url?: string;
    iconType?: string;
    opacity?: number;
    shadow?: string;
    padding?: string;
    className?: string;
    border?: string;

    // Device-specific common properties
    mobile_backgroundColor?: string;
    mobile_fontSize?: string;
    mobile_padding?: string;

    tablet_backgroundColor?: string;
    tablet_fontSize?: string;
    tablet_padding?: string;

    // Button specific properties
    variant?: string;
    size?: string;
    state?: string;
    radius?: string;
    disabled?: boolean;
    isLoading?: boolean;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    fullWidth?: boolean;
    hoverAnimation?: boolean;
    elevation?: number;

    // Card specific properties
    hover?: string;
    hasHeader?: boolean;
    hasFooter?: boolean;
    headerText?: string;
    headerBg?: string;
    headerColor?: string;
    headerBorderBottom?: string;
    headerPadding?: string;
    headerIcon?: React.ReactNode;
    headerAction?: React.ReactNode;
    footerBg?: string;
    footerBorderTop?: string;
    footerPadding?: string;
    footerContent?: React.ReactNode;
    actionText?: string;
    maxWidth?: string;
    minHeight?: string;

    // Container specific properties
    layout?: string;
    justify?: string;
    align?: string;
    direction?: string;
    gap?: string;
    borderStyle?: string;
    wrap?: boolean;
    gridCols?: string;
    gridRows?: string;
    flex?: string;
    elementPosition?: string;
    overflow?: string;
    glassMorphism?: boolean;
    gradient?: string;
    hoverEffect?: boolean;
    children?: React.ReactNode;

    // Text specific properties
    decoration?: string;
    transform?: string;
    truncate?: string;
    fontFamily?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textShadow?: string;
    highlight?: boolean;
    hoverable?: boolean;
    animateIn?: boolean;
    italic?: boolean;
    badge?: string;

    // Input specific properties
    type?: string;
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
    label?: string;
    helperText?: string;
    readOnly?: boolean;
    required?: boolean;
    autoFocus?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;

    // Image specific properties
    objectFit?: string;
    imagePosition?: string;
    aspectRatio?: string;
    loadingStrategy?: string;
    blur?: number;
    brightness?: number;
    contrast?: number;
    grayscale?: number;
    hueRotate?: number;
    invert?: number;
    saturate?: number;
    sepia?: number;
    borderType?: string;
    maxHeight?: string;
    placeholderIcon?: React.ReactNode;
    placeholderText?: string;
    placeholderUrl?: string;
    alt?: string;
    blurhash?: string;
    rounded?: boolean;
    caption?: string;
    overlay?: boolean;
    overlayContent?: string;

    // Divider specific properties
    orientation?: string;
    thickness?: string;
    margin?: string;
    textClassName?: string;
    textColor?: string;
    textWeight?: string;
    textSize?: string;
    animation?: string;

    // Icon specific properties
    background?: string;
    customIcon?: React.ReactNode;
    rotate?: number;

    // Dropdown Menu specific properties
    triggerText?: string;
    items?: string[] | string;
    maxItems?: number;
    minItems?: number;
    itemSpacing?: string;

    // Avatar specific properties
    imageUrl?: string;
    fallbackText?: string;
    shape?: string;
    avatarSize?: string;

    // Any additional properties that might be added dynamically
    [key: string]: any;
  };
}

export interface StateItem {
  name: string;
  _id: string;
  description: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
