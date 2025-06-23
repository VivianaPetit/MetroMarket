import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type CommentCardProps = {
  commentText?: string;
  fecha?: string;
  calificacion?: number; // del 1 al 5
};

const CommentCard = ({
  commentText = "Comentario",
  fecha,
  calificacion = 0,
}: CommentCardProps) => {
  const formattedDate = fecha
    ? new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text key={i} style={i <= count ? styles.starFilled : styles.starEmpty}>
          ★
        </Text>
      );
    }
    return stars;
  };

  return (
    <View style={styles.commentBox}>
      <View>
        {formattedDate && <Text style={styles.date}>{formattedDate}</Text>}
        <View style={styles.starsContainer}>{renderStars(calificacion)}</View>
        <View style={styles.commentContainer}>
          <Text style={styles.commentText}>{commentText}</Text>
        </View>
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  commentBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#00318D',
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginBottom: 2,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  starFilled: {
    color: '#FFD700', // dorado
    fontSize: 16,
  },
  starEmpty: {
    color: '#CCC',
    fontSize: 16,
  },
  commentContainer: {
    backgroundColor: '#F6F6F6',
    padding: 8,
    borderRadius: 5,
    maxWidth: '90%',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
});
