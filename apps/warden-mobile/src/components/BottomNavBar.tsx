import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../icons';
import { colors } from '../theme';

export default function BottomNavBar({ activeTab, onTabChange }) {
  const insets = useSafeAreaInsets();

  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'attendance', label: 'Attendance', icon: 'clipboard-check' },
    { id: 'complaints', label: 'Complaints', icon: 'alert' },
    { id: 'visitors', label: 'Visitors', icon: 'account-group' },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.inner}>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onTabChange(item.id)}
              style={[styles.tab, isActive && styles.activeTab]}
            >
              <Icon
                name={item.icon}
                size={20}
                color={isActive ? colors.onSecondaryContainer : colors.onSurfaceVariant}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: colors.surfaceContainerLowest,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
  },
  inner: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 600,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
  },
  activeTab: {
    backgroundColor: colors.secondaryContainer,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: colors.onSurfaceVariant,
  },
  activeLabel: {
    color: colors.onSecondaryContainer,
    fontWeight: '600',
  },
});
