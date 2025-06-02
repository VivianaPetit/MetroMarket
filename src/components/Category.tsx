import React, { useState } from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type CategoryBadgeProps = {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isSelected?: boolean; // Opcional: si quieres controlar la selección desde el padre
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  label, 
  onPress, 
  isSelected = false, // Valor por defecto
  style, 
  textStyle 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.categoryButton,
        isSelected ? styles.selected : styles.unselected,
        style,
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.categoryButtonText,
        isSelected ? styles.selectedText : styles.unselectedText,
        textStyle,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    margin: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 6,
  },
  selected: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  unselected: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  selectedText: {
    color: '#fff',
  },
  unselectedText: {
    color: '#333',
  },
});