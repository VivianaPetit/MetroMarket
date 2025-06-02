import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OptionProps {
  icon: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function Option({ icon, title, subtitle, children }: OptionProps) {
  return (
    <View style={styles.option}>
      <Ionicons name={icon as any} size={24} color="#F68628" style={styles.icon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.optionTitle}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
      {children ?? <Ionicons name="chevron-forward" size={20} color="#aaa" />}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
