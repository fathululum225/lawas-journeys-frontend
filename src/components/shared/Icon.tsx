/**
 * Icon.tsx
 * Inline SVG icon set (24x24 grid, stroke based). Colors follow `currentColor`,
 * so an icon is tinted by the CSS color of its parent.
 */

const ICON_PATHS = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  'calendar-days': '<rect x="3.5" y="5" width="17" height="15.5" rx="2.2"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.2"/>',
  users: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><circle cx="17" cy="9.5" r="2.4"/><path d="M17.5 14.2c2.3.2 3.9 1.9 3.9 4.3"/>',
  user: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c.7-3.6 3.5-5.5 7-5.5s6.3 1.9 7 5.5"/>',
  'user-guide': '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c.6-3.7 3.2-5.6 6.5-5.6s5.9 1.9 6.5 5.6"/><path d="M8.2 6.2c.7-2 2.2-3 3.8-3s3.1 1 3.8 3"/>',
  people: '<circle cx="8" cy="9" r="2.6"/><circle cx="16.5" cy="9" r="2.6"/><path d="M2.8 19c.3-2.9 2.3-4.6 5.2-4.6 1 0 1.8.2 2.5.6M21.2 19c-.3-2.9-2.3-4.6-4.7-4.6-1.4 0-2.5.4-3.4 1.1"/><path d="M9.2 19.5c.2-2.4 1.5-3.6 2.8-3.6s2.6 1.2 2.8 3.6"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.7 5.3 3.7 8.5s-1.3 6.1-3.7 8.5M12 3.5C9.6 5.9 8.3 8.8 8.3 12s1.3 6.1 3.7 8.5"/>',
  'map-pin': '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  map: '<path d="M3.5 6.5 9 4.5l6 2 5.5-2v13L15 19.5l-6-2-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/>',
  'map-route': '<path d="M12 12.5s-4-3.4-4-6.6a4 4 0 1 1 8 0c0 3.2-4 6.6-4 6.6Z"/><circle cx="12" cy="6" r="1.4"/><path d="M5 15.5c-1.2.5-1.5 1.7-.5 2.5 2.2 1.7 6.6 2.3 9.8 1.5 1.5-.4 2.5-1.3 2-2.2M17 14.5l2.2.6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  star: '<path d="m12 3.2 2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1-4.5-4.2 6.1-.8z" fill="currentColor" stroke="none"/>',
  'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
  'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-up': '<path d="m6 15 6-6 6 6"/>',
  'chevron-right': '<path d="m9 6 6 6-6 6"/>',
  'chevron-left': '<path d="m15 6-6 6 6 6"/>',
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.8V20h13V9.8"/><path d="M10 20v-5.5h4V20"/>',
  grid: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2"/>',
  history: '<rect x="5" y="4" width="14" height="16.5" rx="2"/><path d="M9 4v-.5h6V4M8.5 9.5h7M8.5 13h7M8.5 16.5h4"/>',
  archaeology: '<path d="m13.5 4.5 6 6-7.8 7.8a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2z"/><path d="M5 19.5 8 16.5M10 7.5l6.5 6.5"/>',
  mask: '<path d="M5 5.5c3 .9 11 .9 14 0V12c0 4-3 7.5-7 7.5S5 16 5 12V5.5Z"/><path d="M8.3 10.3c.6-.5 1.4-.5 2 0M13.7 10.3c.6-.5 1.4-.5 2 0M9.5 14.6c1.4 1.2 3.6 1.2 5 0"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5z"/>',
  bookmark: '<path d="M7 4h10v16l-5-3.5L7 20z"/>',
  mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m3.5 7.2 8.5 6 8.5-6"/>',
  phone: '<path d="M6.5 4h3l1.5 4-2 1.3a11 11 0 0 0 5.7 5.7L16 13l4 1.5v3a2 2 0 0 1-2 2A14.5 14.5 0 0 1 4.5 6a2 2 0 0 1 2-2Z"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none"/>',
  facebook: '<circle cx="12" cy="12" r="8.5"/><path d="M13.2 20.2v-6.4h2.1l.4-2.5h-2.5v-1.5c0-.8.4-1.3 1.3-1.3h1.3V6.3a14 14 0 0 0-1.9-.1c-1.9 0-3.2 1.2-3.2 3.3v1.8H8.6v2.5h2.1v6.4"/>',
  youtube: '<rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="m10.3 9.6 4.2 2.4-4.2 2.4z" fill="currentColor"/>',
  tripadvisor: '<circle cx="7.5" cy="13.2" r="3.3"/><circle cx="16.5" cy="13.2" r="3.3"/><circle cx="7.5" cy="13.2" r="1" fill="currentColor"/><circle cx="16.5" cy="13.2" r="1" fill="currentColor"/><path d="M2.5 9.8c2.4-1.8 5.4-2.6 9.5-2.6s7.1.8 9.5 2.6M12 7.2v-1"/>',
  send: '<path d="M21 4 3.5 11l6.7 2.7L12.8 20 21 4Z"/><path d="m10.2 13.7 4.3-4.1"/>',
  whatsapp: '<path d="M4 20l1.2-4.2A8.5 8.5 0 1 1 8.3 18.9L4 20Z"/><path d="M9.3 8.7c-.3.5-.4 1.3.1 2.3.6 1.2 1.7 2.3 3 3 1 .5 1.8.4 2.3 0l.7-.9-1.9-1-.8.6c-.8-.4-1.6-1.1-2-2l.6-.8-1-1.9z" fill="currentColor" stroke="none"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  'check-circle': '<circle cx="12" cy="12" r="8.5"/><path d="m8.2 12.2 2.8 2.8 4.8-5.2"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M18.7 5.3l-1.8 1.8M7.1 16.9l-1.8 1.8"/>',
  'cloud-rain': '<path d="M7 15.5a4 4 0 0 1-.3-8 5.5 5.5 0 0 1 10.6 1.3A3.4 3.4 0 0 1 17 15.5H7Z"/><path d="m8.5 18.5-1 2M12.5 18.5l-1 2M16.5 18.5l-1 2"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  temple: '<path d="M12 3v2.5M9.5 8c0-1.5 1.1-2.5 2.5-2.5s2.5 1 2.5 2.5V10h-5V8ZM7 10h10M6 13.5c0-1.8 1.3-3.5 2.7-3.5h6.6c1.4 0 2.7 1.7 2.7 3.5M4.5 13.5h15V17h-15zM3.5 17h17v3.5h-17z"/>',
  amphora: '<path d="M9.5 3.5h5M10.5 3.5c0 2-2.8 3-2.8 6.5 0 4 1.9 8 4.3 10.5 2.4-2.5 4.3-6.5 4.3-10.5 0-3.5-2.8-4.5-2.8-6.5"/><path d="M7.7 8c-2.1 0-2.6 2-1.6 3.5s2 .5 2 .5M16.3 8c2.1 0 2.6 2 1.6 3.5s-2 .5-2 .5"/>',
  bowl: '<path d="M3.5 11.5h17a8.5 8.5 0 0 1-17 0Z"/><path d="M8 9c0-1.6.8-2.6 1.7-3.5M12 9c0-2 1-3 1.9-4.2M16 9c0-1.5.7-2.4 1.5-3.2M9 20.5h6"/>',
  mountain: '<path d="m3 19 6.5-11 4 6.5 2.5-3.5L21 19H3Z"/><path d="m9.5 8 1.8 3"/>',
  route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6.5a3 3 0 0 0 0-6H9.5a3 3 0 0 1 0-6H16"/>',
  leaf: '<path d="M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19Z"/><path d="M5 19c2-4 5-7 9-9"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13.5 6.5 4 4"/>',
  trash: '<path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v6M14 11v6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  dashboard: '<rect x="3.5" y="3.5" width="7" height="9" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="5" rx="1.5"/><rect x="13.5" y="11.5" width="7" height="9" rx="1.5"/><rect x="3.5" y="15.5" width="7" height="5" rx="1.5"/>',
  suitcase: '<rect x="3.5" y="7.5" width="17" height="12" rx="2"/><path d="M9 7.5V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5v2M3.5 13h17"/>',
  ticket: '<path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"/><path d="M14 6.5v2M14 11v2M14 15.5v2"/>',
  article: '<rect x="5" y="3.5" width="14" height="17" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4"/>',
  inbox: '<path d="M4 13.5 6.5 5h11L20 13.5V18a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18v-4.5Z"/><path d="M4 13.5h4.5a2 2 0 0 0 2 2h3a2 2 0 0 0 2-2H20"/>',
  'log-out': '<path d="M10 4.5H6.5A1.5 1.5 0 0 0 5 6v12a1.5 1.5 0 0 0 1.5 1.5H10M14.5 8l4 4-4 4M18.5 12H9.5"/>',
  'credit-card': '<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="M3 10h18M7 15h3"/>',
  shield: '<path d="M12 3.5 5 6v5.5c0 4.2 2.8 7.3 7 9 4.2-1.7 7-4.8 7-9V6l-7-2.5Z"/><path d="m9 12 2.2 2.2L15.2 10"/>',
  info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01" stroke-width="2"/>',
  alert: '<path d="M12 4 3 19.5h18L12 4Z"/><path d="M12 10v4.5M12 17h.01" stroke-width="2"/>',
  refresh: '<path d="M4.5 12a7.5 7.5 0 0 1 13-5l2 2M19.5 12a7.5 7.5 0 0 1-13 5l-2-2M19.5 5v4h-4M4.5 19v-4h4"/>',
  external: '<path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 18.5v-10A1.5 1.5 0 0 1 6.5 7H11"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
  bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15L6 16.5Z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 20, className = '' }: IconProps) {
  const classes = ['icon', `icon--${name}`, className].filter(Boolean).join(' ');

  return (
    <svg
      className={classes}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      // The path data is a constant defined above, never user input.
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] }}
    />
  );
}
