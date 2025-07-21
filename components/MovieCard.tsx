import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play } from 'lucide-react-native';

interface MovieCardProps {
  movie: {
    id: string;
    title: string;
    year: string;
    category: string;
    poster?: string;
  };
  onPress: () => void;
  style?: any;
}

export function MovieCard({ movie, onPress, style }: MovieCardProps) {
  const defaultPoster = 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg';

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <ImageBackground
        source={{ uri: movie.poster || defaultPoster }}
        style={styles.poster}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.playButton}>
            <Play size={16} color="#000" fill="#000" />
          </View>
          
          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={2}>
              {movie.title}
            </Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#16213e',
  },
  poster: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 12,
  },
  playButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
  },
  info: {
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 18,
  },
  year: {
    fontSize: 12,
    color: '#bbb',
  },
});