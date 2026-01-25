'use client';

import React, { useEffect } from 'react';
import { ComponentItem } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Check,
  X,
  Calendar,
  Bell,
  Mail,
  Search,
  Settings,
  User,
  Home as HomeIcon,
  FileText,
  Image,
  ArrowLeft,
  ArrowRight,
  Menu as MenuIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

export function Menu({
  component,
  isSelected = false,
  deviceType = 'desktop',
  onChildSelect,
  selectedId,
}: {
  component: ComponentItem;
  isSelected?: boolean;
  deviceType?: 'desktop' | 'tablet' | 'mobile';
  onChildSelect?: (id: string) => void;
  selectedId?: string;
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Get device-specific props
  const getDeviceProps = () => {
    const deviceProps = {} as Record<string, any>;
    Object.entries(component.props).forEach(([key, value]) => {
      if (key.includes('_')) return;
      const deviceKey = `${deviceType}_${key}`;
      if (deviceKey in component.props) {
        // Device-specific prop var, onu kullan
        deviceProps[key] = component.props[deviceKey];
      } else if (deviceType === 'desktop') {
        // Desktop için device-specific prop yoksa base prop'u kullan
        deviceProps[key] = value;
      }
      // Mobile/tablet için device-specific prop yoksa undefined döner
    });
    return deviceProps;
  };

  const deviceProps = getDeviceProps();

  const iconMap: Record<string, React.ComponentType<any>> = {
    folder: FolderOpen,
    check: Check,
    close: X,
    calendar: Calendar,
    bell: Bell,
    mail: Mail,
    search: Search,
    settings: Settings,
    user: User,
    home: HomeIcon,
    file: FileText,
    image: Image,
    'chevron-down': ChevronDown,
    'chevron-up': ChevronUp,
    'chevron-left': ChevronLeft,
    'chevron-right': ChevronRight,
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
  };

  const getIconComponent = (
    type?: string,
    fallback: React.ComponentType<any> = ChevronDown,
  ) => {
    if (!type) return fallback;
    return iconMap[type] || fallback;
  };
  const getContrastColor = (
    hex: string,
    light: string = '#FFFFFF',
    dark: string = '#111827',
  ) => {
    if (!hex) return dark;
    let c = hex.trim();
    if (c.startsWith('#')) c = c.slice(1);
    if (c.length === 3)
      c = c
        .split('')
        .map((ch) => ch + ch)
        .join('');
    if (c.length !== 6) return dark;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128 ? light : dark;
  };
  const menuType = (component.props.menuType || 'navbar').toLowerCase();

  // Helper function to get prop value with fallback to base only for desktop
  const getPropValue = (key: string, defaultValue?: any) => {
    if (deviceProps[key] !== undefined) {
      return deviceProps[key];
    }
    // Desktop için base prop kullan, mobile/tablet için default değer kullan
    return deviceType === 'desktop'
      ? component.props[key] ?? defaultValue
      : defaultValue;
  };

  const containerStyle: React.CSSProperties = {
    backgroundColor: getPropValue('backgroundColor', '#FFFFFF'),
    color: getPropValue('menuColor') || getPropValue('color', '#111827'),
    borderColor: getPropValue('borderColor', '#e5e7eb'),
    borderWidth: getPropValue('borderWidth', '1px'),
    borderStyle: getPropValue('borderStyle', 'solid'),
    borderRadius: getPropValue(
      'borderRadius',
      menuType === 'sidebar' ? '8px' : undefined,
    ),
    borderTopLeftRadius:
      getPropValue('borderTopLeftRadius') ??
      getPropValue('borderRadius') ??
      undefined,
    borderTopRightRadius:
      getPropValue('borderTopRightRadius') ??
      getPropValue('borderRadius') ??
      undefined,
    borderBottomLeftRadius:
      getPropValue('borderBottomLeftRadius') ??
      getPropValue('borderRadius') ??
      undefined,
    borderBottomRightRadius:
      getPropValue('borderBottomRightRadius') ??
      getPropValue('borderRadius') ??
      undefined,
    padding: getPropValue('padding', '8px 16px'),
    paddingLeft:
      getPropValue('paddingLeft') ??
      (getPropValue('padding') ? undefined : '16px'),
    paddingRight:
      getPropValue('paddingRight') ??
      (getPropValue('padding') ? undefined : '16px'),
    height: getPropValue('height', menuType === 'sidebar' ? '300px' : '60px'),
    width: getPropValue(
      'width',
      deviceType === 'mobile' || deviceType === 'tablet'
        ? '100%'
        : menuType === 'sidebar'
        ? '260px'
        : '100%',
    ),
    position: menuType === 'sidebar' ? 'relative' : undefined,
    transition: menuType === 'sidebar' ? 'width 0.2s ease' : undefined,
  };

  const navItems =
    Array.isArray(component.props.menuItems) &&
    component.props.menuItems.length > 0
      ? (component.props.menuItems as any[]).map(
          (it: any) => it?.name || 'Item',
        )
      : [];

  const structuredNavItems: Array<{
    name: string;
    sub1?: string;
    sub2?: string;
    subtitles?: string[];
  }> =
    Array.isArray(component.props.menuItems) &&
    component.props.menuItems.length > 0
      ? component.props.menuItems
      : [];

  useEffect(() => {
    document.querySelector('#main-canvas')?.classList.add('overflow-visible');

    return () => {
      document
        .querySelector('#main-canvas')
        ?.classList.remove('overflow-visible');
    };
  }, []);

  if (menuType === 'sidebar') {
    const structuredItems: Array<{
      name: string;
      sub1?: string;
      sub2?: string;
      subtitles?: string[];
    }> =
      Array.isArray((component.props as any).menuItems) &&
      (component.props as any).menuItems.length > 0
        ? (component.props as any).menuItems
        : [];
    const homeItem = structuredItems.find(
      (it) => (it?.name || '').toLowerCase() === 'home',
    );
    const otherItems = structuredItems.filter(
      (it) => (it?.name || '').toLowerCase() !== 'home',
    );
    // Typography styles for menu and submenu
    const menuTypography: React.CSSProperties = {
      fontFamily: component.props.menuFontFamily,
      fontWeight: component.props.menuFontWeight,
      color: component.props.menuColor,
      fontSize: component.props.menuFontSize,
      letterSpacing: component.props.menuLetterSpacing,
      lineHeight: component.props.menuLineHeight,
      textAlign: component.props.menuTextAlign,
      textDecoration: component.props.menuTextDecoration,
    };

    const submenuTypography: React.CSSProperties = {
      fontFamily: component.props.submenuFontFamily,
      fontWeight: component.props.submenuFontWeight,
      color: component.props.submenuColor,
      fontSize: component.props.submenuFontSize,
      letterSpacing: component.props.submenuLetterSpacing,
      lineHeight: component.props.submenuLineHeight,
      textAlign: component.props.submenuTextAlign,
      textDecoration: component.props.submenuTextDecoration,
    };

    const logoTextTypography: React.CSSProperties = {
      ...menuTypography,
      fontWeight: (component.props as any).logoFontWeight ?? 500,
      fontSize: (component.props as any).logoFontSize || '12px',
      color: (component.props as any).logoColor || '#3B82F6',
    };

    const bg = component.props.backgroundColor || '#FFFFFF';
    const hoverBg = bg; // synced hover background to backgroundColor
    const lineColor = bg; // synced line color to backgroundColor
    const contrastColor = getContrastColor(bg);

    const SidebarOpenIcon = getIconComponent(
      component.props.openIconType,
      ChevronRight,
    );
    const SidebarCloseIcon = getIconComponent(
      component.props.closeIconType,
      ChevronLeft,
    );
    const openIconColor = component.props.openIconColor || contrastColor;
    const closeIconColor = component.props.closeIconColor || contrastColor;
    const openIconSize = Number(component.props.openIconSize) || 18;
    const closeIconSize = Number(component.props.closeIconSize) || 18;

    const computedStyle: React.CSSProperties = {
      ...containerStyle,
      width: isCollapsed ? 56 : containerStyle.width,
    };

    return (
      <div className="h-full w-full" style={computedStyle}>
        <div className="flex h-full flex-col gap-3">
          {/* Logo Section */}
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 pt-3">
              <Avatar
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#D9D9D9',
                }}
              >
                <AvatarImage
                  src={component.props.logoUrl}
                  alt={component.props.logoAlt || 'Avatar'}
                  className="rounded-full"
                />
                <AvatarFallback style={{ backgroundColor: '#D9D9D9' }}>
                  A
                </AvatarFallback>
              </Avatar>
              {/* <span className="text-base font-semibold" style={logoTextTypography}>
                Logo
              </span> */}
            </div>
          )}

          {/* Collapse Toggle */}
          <button
            type="button"
            aria-label={isCollapsed ? 'Open sidebar' : 'Close sidebar'}
            onClick={() => setIsCollapsed((v) => !v)}
            className="absolute top-3 -right-4 z-[999999] flex h-6 w-6 items-center justify-center rounded-full border bg-white shadow-sm"
            style={{ borderColor: lineColor }}
          >
            {isCollapsed ? (
              <SidebarOpenIcon size={openIconSize} color={openIconColor} />
            ) : (
              <SidebarCloseIcon size={closeIconSize} color={closeIconColor} />
            )}
          </button>

          {/* Nav list */}
          {!isCollapsed && (
            <nav className="flex-1 overflow-auto">
              <ul className="flex flex-col gap-1 text-sm">
                {homeItem && (
                  <li key="home" className="">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded px-3 py-2"
                      style={{ textAlign: menuTypography.textAlign }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = hoverBg)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <span style={menuTypography}>{homeItem.name}</span>
                    </button>
                  </li>
                )}
                <li className="">
                  <Accordion type="single" collapsible>
                    {otherItems.map((it, idx) => (
                      <AccordionItem
                        key={`${it.name}-${idx}`}
                        value={`${it.name}-${idx}`}
                        className="border-none"
                      >
                        <AccordionTrigger
                          className="flex w-full items-center justify-between rounded px-3 py-2"
                          style={{
                            justifyContent:
                              menuTypography.textAlign === 'center'
                                ? 'center'
                                : menuTypography.textAlign === 'right'
                                ? 'flex-end'
                                : menuTypography.textAlign === 'left'
                                ? 'space-between'
                                : 'space-between',
                          }}
                          icon={(() => {
                            return (
                              <ChevronDown className="pointer-events-none h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                            );
                          })()}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = hoverBg)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'transparent')
                          }
                        >
                          <span
                            style={{
                              ...menuTypography,
                              color: undefined as any,
                            }}
                          >
                            {it.name || `Item ${idx + 1}`}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-3">
                          <ul className="flex flex-col gap-1 py-1">
                            {(Array.isArray((it as any).subtitles) &&
                            (it as any).subtitles.length
                              ? (it as any).subtitles
                              : [it.sub1, it.sub2].filter(Boolean)
                            ).map((sub: string, idx: number) => (
                              <li
                                key={`${it.name}-sub-${idx}`}
                                className="rounded px-2 py-1"
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    hoverBg)
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    'transparent')
                                }
                                style={submenuTypography}
                              >
                                {sub || `Action ${idx + 1}`}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    );
  }

  // Typography styles for menu and submenu
  const menuTypography: React.CSSProperties = {
    fontFamily: component.props.menuFontFamily,
    fontWeight: component.props.menuFontWeight,
    color: component.props.menuColor,
    fontSize: component.props.menuFontSize,
    letterSpacing: component.props.menuLetterSpacing,
    lineHeight: component.props.menuLineHeight,
    textAlign: component.props.menuTextAlign,
    textDecoration: component.props.menuTextDecoration,
  };

  // Defaults for the center navigation items
  const centerItemTypography: React.CSSProperties = {
    ...menuTypography,
    fontWeight: (component.props as any).menuFontWeight ?? 500,
    fontSize: (component.props as any).menuFontSize || '12px',
    color: (component.props as any).menuColor || '#333A4A',
  };

  const submenuTypography: React.CSSProperties = {
    fontFamily: component.props.submenuFontFamily,
    fontWeight: component.props.submenuFontWeight,
    color: component.props.submenuColor,
    fontSize: component.props.submenuFontSize,
    letterSpacing: component.props.submenuLetterSpacing,
    lineHeight: component.props.submenuLineHeight,
    textAlign: component.props.submenuTextAlign,
    textDecoration: component.props.submenuTextDecoration,
  };

  const logoTextTypography: React.CSSProperties = {
    ...menuTypography,
    fontWeight: (component.props as any).logoFontWeight ?? 500,
    fontSize: (component.props as any).logoFontSize || '12px',
    color: (component.props as any).logoColor || '#3B82F6',
  };

  const bg = component.props.backgroundColor || '#FFFFFF';
  const hoverBg = bg; // sync hover background
  const lineColor = bg; // sync line color
  const menuAlign = (component.props.menuTextAlign || 'left')
    .toString()
    .toLowerCase();
  const navJustify =
    menuAlign === 'center'
      ? 'center'
      : menuAlign === 'right'
      ? 'flex-end'
      : 'flex-start';

  const DropdownIndicatorIcon = getIconComponent(
    component.props.openIconType,
    ChevronDown,
  );
  const indicatorColor = component.props.openIconColor || getContrastColor(bg);

  // Mobile View for Navbar
  if (deviceType === 'mobile') {
    const mobileMenuLayout = (
      component.props.mobileMenuLayout || 'center'
    ).toLowerCase();

    // Animation and position based on layout type
    const getMenuStyles = () => {
      if (mobileMenuLayout === 'left') {
        return {
          position: 'absolute' as const,
          top: '62px',
          left: '0',
          height: '100vh',
          transform: isMobileMenuOpen ? 'translateX(0)' : '',
          display: isMobileMenuOpen ? 'block' : 'none',
          transition: 'transform 0.3s ease-in-out',
        };
      } else if (mobileMenuLayout === 'right') {
        return {
          position: 'absolute' as const,
          top: '62px',
          right: '0',
          height: '100vh',
          transform: isMobileMenuOpen ? 'translateX(0)' : '',
          display: isMobileMenuOpen ? 'block' : 'none',
          transition: 'transform 0.3s ease-in-out',
        };
      } else {
        // center - slides down from top
        return {
          position: 'absolute' as const,
          top: '100%',
          left: '0',
          width: '100%',
          transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-20px)',
          opacity: isMobileMenuOpen ? 1 : 0,
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out',
        };
      }
    };

    const structuredItems: Array<{
      name: string;
      sub1?: string;
      sub2?: string;
      subtitles?: string[];
    }> =
      Array.isArray((component.props as any).menuItems) &&
      (component.props as any).menuItems.length > 0
        ? (component.props as any).menuItems
        : [];

    return (
      <div className="relative h-full w-full" style={containerStyle}>
        <div className="flex h-full items-center justify-between px-4">
          {/* Left: Logo + Text */}
          <div className="flex items-center gap-2">
            <Avatar
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#D9D9D9',
              }}
            >
              <AvatarImage
                src={component.props.logoUrl}
                alt={component.props.logoAlt || 'Logo'}
                className="rounded-full"
              />
              <AvatarFallback style={{ backgroundColor: '#D9D9D9' }}>
                A
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold" style={logoTextTypography}>
              Autanate
            </span>
          </div>

          {/* Right: Hamburger Icon */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex items-center justify-center p-2"
          >
            {isMobileMenuOpen ? (
              <X
                size={24}
                style={{ color: menuTypography.color || '#111827' }}
              />
            ) : (
              <MenuIcon
                size={24}
                style={{ color: menuTypography.color || '#111827' }}
              />
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              opacity: isMobileMenuOpen ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
              pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
            }}
          />
          <div
            className="z-50 flex flex-col gap-2 bg-white p-4 shadow-lg"
            style={{
              ...getMenuStyles(),
              backgroundColor: component.props.backgroundColor || '#FFFFFF',
              width:
                mobileMenuLayout === 'left' || mobileMenuLayout === 'right'
                  ? component.props.mobileMenuWidth || '280px'
                  : '100%',
              maxHeight:
                mobileMenuLayout === 'center' ? 'calc(100vh - 80px)' : '100vh',
              overflowY: 'auto',
              pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
            }}
          >
            {structuredItems.map((item, idx) => {
              const hasSubtitles =
                Array.isArray(item.subtitles) && item.subtitles.length > 0;
              const subtitlesList = hasSubtitles
                ? (item.subtitles || []).filter((s) => s && s.trim() !== '')
                : [];

              // If no subtitles, render simple item
              if (subtitlesList.length === 0) {
                return (
                  <div
                    key={`mobile-${idx}`}
                    className={`cursor-pointer border-b border-gray-100 px-3 py-3 transition-colors last:border-0 hover:bg-gray-50 ${
                      mobileMenuLayout === 'center'
                        ? 'text-center'
                        : 'text-left'
                    }`}
                    style={menuTypography}
                  >
                    {item.name}
                  </div>
                );
              }

              // If has subtitles, render with accordion
              return (
                <Accordion
                  key={`mobile-${idx}`}
                  type="single"
                  collapsible
                  className="border-b border-gray-100 last:border-0"
                >
                  <AccordionItem
                    value={`mobile-${idx}`}
                    className="border-none"
                  >
                    <AccordionTrigger
                      className="px-3 py-3 hover:bg-gray-50 hover:no-underline"
                      style={{
                        justifyContent:
                          mobileMenuLayout === 'center'
                            ? 'center'
                            : 'space-between',
                      }}
                    >
                      <span style={menuTypography}>{item.name}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-2">
                      <div className="flex flex-col gap-2">
                        {subtitlesList.map((subtitle, subIdx) => (
                          <div
                            key={`mobile-${idx}-sub-${subIdx}`}
                            className={`cursor-pointer rounded px-3 py-2 transition-colors hover:bg-gray-100 ${
                              mobileMenuLayout === 'center'
                                ? 'text-center'
                                : 'text-left'
                            }`}
                            style={submenuTypography}
                          >
                            {subtitle}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            })}

            {/* Auth Buttons in Mobile Menu */}
            {component.children && component.children.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4">
                {component.children.map((child: any) => {
                  if (child.type === 'component-Button') {
                    const buttonVariant = child.props.variant || 'default';
                    const isOutline = buttonVariant === 'outline';

                    return (
                      <Button
                        key={child.id}
                        className={isOutline ? '' : 'text-white'}
                        style={{
                          backgroundColor: isOutline
                            ? 'transparent'
                            : child.props.backgroundColor || '#3B82F6',
                          color:
                            child.props.color ||
                            (isOutline ? '#333A4A' : '#FFFFFF'),
                          width: '100%',
                          height: child.props.height || '36px',
                          borderRadius: child.props.borderRadius || '8px',
                          fontSize: child.props.fontSize || '12px',
                          fontWeight: child.props.fontWeight || 500,
                          // Typography properties
                          fontFamily: child.props.fontFamily,
                          letterSpacing: child.props.letterSpacing,
                          textAlign: child.props.textAlign,
                          textDecoration: child.props.textDecoration,
                          // Opacity
                          opacity: child.props.opacity,
                          // Border properties
                          borderWidth:
                            child.props.borderWidth ||
                            (isOutline ? '1px' : undefined),
                          borderStyle:
                            child.props.borderStyle ||
                            (isOutline ? 'solid' : undefined),
                          borderColor:
                            child.props.borderColor ||
                            (isOutline ? '#333A4A' : undefined),
                        }}
                      >
                        {child.props.text || 'Button'}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </>
      </div>
    );
  }

  return (
    <div className="h-full w-full" style={containerStyle}>
      <div
        className="grid h-full items-center px-4"
        style={{ gridTemplateColumns: '20% 60% 20%' }}
      >
        {/* Left: Logo (20%) */}
        <div className="flex h-full items-center gap-2">
          <Avatar
            style={{
              width: '36px',
              height: '36px',
              backgroundColor: '#D9D9D9',
            }}
          >
            <AvatarImage
              src={component.props.logoUrl}
              alt={component.props.logoAlt || 'Avatar'}
              className="rounded-full"
            />
            <AvatarFallback style={{ backgroundColor: '#D9D9D9' }}>
              A
            </AvatarFallback>
          </Avatar>
          {/* <span className="text-base font-semibold" style={logoTextTypography}>
            Logo
          </span> */}
        </div>

        {/* Middle: Nav (60%) */}
        <nav
          className="flex h-full items-center justify-center"
          style={{ justifyContent: navJustify }}
        >
          <ul className="flex items-center gap-6 text-sm">
            {structuredNavItems.map((item, idx) => {
              const hasSubtitles =
                Array.isArray(item.subtitles) && item.subtitles.length > 0;
              const subtitlesList = hasSubtitles
                ? (item.subtitles || []).filter((s) => s && s.trim() !== '')
                : [];

              return (
                <li key={`nav-${idx}`} className="flex items-center">
                  {subtitlesList.length === 0 ? (
                    <span
                      className="cursor-pointer"
                      style={centerItemTypography}
                    >
                      {item.name}
                    </span>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="group flex cursor-pointer items-center gap-1"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = hoverBg)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              'transparent')
                          }
                        >
                          <span style={centerItemTypography}>{item.name}</span>
                          <DropdownIndicatorIcon
                            className="h-3.5 w-3.5 transition-transform duration-150 group-data-[state=open]:rotate-180"
                            style={{ color: menuTypography.color }}
                          />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        className="z-[3000]"
                        style={{
                          zIndex: 3000,
                          width: '260px',
                          height: 'auto',
                          borderRadius: '8px',
                          backgroundColor: '#FFFFFF',
                          padding: '6px 16px',
                        }}
                      >
                        {(() => {
                          const align = (
                            component.props.submenuTextAlign || 'left'
                          )
                            .toString()
                            .toLowerCase();
                          const justify =
                            align === 'center'
                              ? 'center'
                              : align === 'right'
                              ? 'flex-end'
                              : 'flex-start';
                          const itemStyle: React.CSSProperties = {
                            ...submenuTypography,
                            width: '100%',
                            justifyContent: justify,
                            textAlign: align as any,
                          };
                          return (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                              }}
                            >
                              {subtitlesList.map((subtitle, subIdx) => (
                                <DropdownMenuItem
                                  key={`nav-${idx}-sub-${subIdx}`}
                                  className="w-full"
                                  style={itemStyle}
                                >
                                  {subtitle}
                                </DropdownMenuItem>
                              ))}
                            </div>
                          );
                        })()}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right: Auth Buttons (20%) */}
        <div className="flex h-full items-center justify-end gap-3">
          {component.children && component.children.length > 0
            ? component.children.map((child: any) => {
                if (child.type === 'component-Button') {
                  const buttonVariant = child.props.variant || 'default';
                  const isOutline = buttonVariant === 'outline';
                  const isButtonSelected = selectedId === child.id;

                  return (
                    <div
                      key={child.id}
                      className={
                        isButtonSelected
                          ? 'rounded-md ring-2 ring-[#5bb6ab]'
                          : ''
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onChildSelect?.(child.id);
                      }}
                    >
                      <Button
                        className={isOutline ? '' : 'text-white'}
                        style={{
                          backgroundColor: isOutline
                            ? 'transparent'
                            : child.props.backgroundColor || '#3B82F6',
                          color:
                            child.props.color ||
                            (isOutline ? '#333A4A' : '#FFFFFF'),
                          width: child.props.width || '93px',
                          height: child.props.height || '36px',
                          borderRadius: child.props.borderRadius || '8px',
                          fontSize: child.props.fontSize || '12px',
                          fontWeight: child.props.fontWeight || 500,
                          // Typography properties
                          fontFamily: child.props.fontFamily,
                          letterSpacing: child.props.letterSpacing,
                          textAlign: child.props.textAlign,
                          textDecoration: child.props.textDecoration,
                          // Opacity
                          opacity: child.props.opacity,
                          // Border properties
                          borderWidth:
                            child.props.borderWidth ||
                            (isOutline ? '1px' : undefined),
                          borderStyle:
                            child.props.borderStyle ||
                            (isOutline ? 'solid' : undefined),
                          borderColor:
                            child.props.borderColor ||
                            (isOutline ? '#333A4A' : undefined),
                        }}
                      >
                        {child.props.text || 'Button'}
                      </Button>
                    </div>
                  );
                }
                return null;
              })
            : null}
        </div>
      </div>
    </div>
  );
}
