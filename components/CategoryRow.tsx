import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MovieCard } from './MovieCard';

interface CategoryRowProps {
  title: string;
  movies: any[];
  onMoviePress: (movie: any) => void;
}

export function CategoryRow({ title, movies, onMoviePress }: CategoryRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moviesContainer}
      >
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onPress={() => onMoviePress(movie)}
            style={styles.movieCard}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    marginLeft: 20,
  },
  moviesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  movieCard: {
    width: 140,
  },
});