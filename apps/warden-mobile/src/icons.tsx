import { MaterialCommunityIcons } from '@expo/vector-icons';

const iconMap = {
  home: 'home',
  'clipboard-check': 'clipboard-check-outline',
  alert: 'alert-circle-outline',
  'account-group': 'account-group',
  'account-plus': 'account-plus',
  'chevron-right': 'chevron-right',
  phone: 'phone',
  'message-text': 'message-text-outline',
  'shield-alert': 'shield-alert',
  'check-circle': 'check-circle-outline',
  clock: 'clock-outline',
  bell: 'bell-outline',
  'calendar-clock': 'calendar-clock',
  'account-check': 'account-check',
  check: 'check',
  'close-circle': 'close-circle',
  calendar: 'calendar',
  magnify: 'magnify',
  'calendar-range': 'calendar-range',
  'format-list-checks': 'format-list-checks',
  server: 'server',
  wrench: 'wrench',
  'lightning-bolt': 'lightning-bolt',
  archive: 'archive-outline',
  wifi: 'wifi',
  clipboard: 'clipboard-outline',
  plus: 'plus',
  close: 'close',
  'map-marker': 'map-marker',
  hammer: 'hammer-wrench',
  logout: 'logout',
  school: 'school',
  account: 'account',
  'alert-circle': 'alert-circle',
  'shield-check': 'shield-check',
  'clock-fast': 'clock-fast',
  'flag-outline': 'flag-outline',
  'fire-alert': 'fire-alert',
};

export function Icon({ name, size = 24, color = '#000', ...props }) {
  const mappedName = iconMap[name] || name;
  return <MaterialCommunityIcons name={mappedName} size={size} color={color} {...props} />;
}

export default Icon;
