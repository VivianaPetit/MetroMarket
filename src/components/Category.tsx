import React from 'react';
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
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ label, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.categoryButton, style]} onPress={onPress}>
      <Text style={[styles.categoryButtonText, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default CategoryBadge;

const styles = StyleSheet.create({
  categoryButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 6,
    margin: 10,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',

    // Sombra naranja
    shadowColor: '#FF8C00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 6,
  },
  categoryButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});
