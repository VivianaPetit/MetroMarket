import React from 'react';
import {
  GestureResponderEvent,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';

type CategoryBadgeProps = {
  label: string;
  imageSource: string; // URL o path local
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isSelected?: boolean;
};

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  label,
  imageSource,
  onPress,
  isSelected = false,
  style,
  textStyle,
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
      <View style={styles.innerContainer}>
        <Image source={{ uri: imageSource }} style={styles.image} />
        <Text
          style={[
            styles.categoryButtonText,
            isSelected ? styles.selectedText : styles.unselectedText,
            textStyle,
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  categoryButton: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    margin: 6,
    alignItems: 'center',
    borderWidth: 1,
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  selected: {
    borderColor: '#FF8C00',
    backgroundColor: '#FFF7EF',
  },
  unselected: {
    borderColor: '#ddd',
  },
  innerContainer: {
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedText: {
    color: '#FF8C00',
  },
  unselectedText: {
    color: '#333',
  },
});
