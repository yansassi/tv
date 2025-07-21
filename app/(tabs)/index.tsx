import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Star, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MovieCard } from '@/components/MovieCard';
import { CategoryRow } from '@/components/CategoryRow';
import { loadMoviesData } from '@/data/moviesData';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const [moviesData, setMoviesData] = useState([]);
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [categorizedMovies, setCategorizedMovies] = useState({});

  // Carregar filmes quando a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      loadMovies();
    }, [])
  );

  const loadMovies = async () => {
    try {
      const movies = await loadMoviesData();
      setMoviesData(movies);
      if (movies.length > 0) {
        setFeaturedMovie(movies[0]);
      }
      organizeMoviesByCategory(movies);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    }
  };

  const organizeMoviesByCategory = (movies) => {
    const categories = {};
    movies.forEach(movie => {
      if (!categories[movie.category]) {
        categories[movie.category] = [];
      }
      categories[movie.category].push(movie);
    });
    setCategorizedMovies(categories);
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const playMovie = (movie) => {
    router.push({
      pathname: '/player',
      params: { movieData: JSON.stringify(movie) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header com filme em destaque */}
        {featuredMovie && (
          <View style={styles.featuredSection}>
          <ImageBackground
            source={{ uri: featuredMovie.poster || 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg' }}
            style={styles.featuredBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={['rgba(26,26,46,0.1)', 'rgba(26,26,46,0.8)', '#1a1a2e']}
              style={styles.featuredGradient}
            >
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>{featuredMovie.title}</Text>
                <Text style={styles.featuredYear}>{featuredMovie.year}</Text>
                
                <View style={styles.featuredActions}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={() => playMovie(featuredMovie)}
                  >
                    <Play size={20} color="#000" fill="#000" />
                    <Text style={styles.playButtonText}>Assistir</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.addButton}>
                    <Plus size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Minha Lista</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
          </View>
        )}

        {/* Seções de categorias */}
        <View style={styles.categoriesSection}>
          {Object.entries(categorizedMovies).map(([category, movies]) => (
            <CategoryRow
              key={category}
              title={category}
              movies={movies}
              onMoviePress={playMovie}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollView: {
    flex: 1,
  },
  featuredSection: {
    height: 500,
    position: 'relative',
  },
  featuredBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuredYear: {
    fontSize: 16,
    color: '#bbb',
    marginBottom: 24,
  },
  featuredActions: {
    flexDirection: 'row',
    gap: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesSection: {
    paddingBottom: 100,
  },
});