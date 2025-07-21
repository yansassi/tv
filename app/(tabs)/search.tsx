import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Search as SearchIcon, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MovieCard } from '@/components/MovieCard';
import { loadMoviesData } from '@/data/moviesData';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [moviesData, setMoviesData] = useState([]);

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
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    }
  };

  const categories = useMemo(() => {
    const cats = ['Todos'];
    moviesData.forEach(movie => {
      if (!cats.includes(movie.category)) {
        cats.push(movie.category);
      }
    });
    return cats;
  }, [moviesData]);

  const filteredMovies = useMemo(() => {
    return moviesData.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todos' || movie.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const playMovie = (movie) => {
    router.push({
      pathname: '/player',
      params: { movieData: JSON.stringify(movie) }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Filmes</Text>
        
        {/* Barra de pesquisa */}
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#8e8e93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Digite o nome do filme..."
            placeholderTextColor="#8e8e93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros de categoria */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryChipText,
                selectedCategory === category && styles.categoryChipTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Resultados */}
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        {/* Indicadores temporários de contagem */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Total carregados: {moviesData.length} | Filtrados: {filteredMovies.length}
          </Text>
        </View>

        <Text style={styles.resultsCount}>
          {filteredMovies.length} filme{filteredMovies.length !== 1 ? 's' : ''} encontrado{filteredMovies.length !== 1 ? 's' : ''}
        </Text>
        
        <View style={styles.moviesGrid}>
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPress={() => playMovie(movie)}
              style={styles.gridMovieCard}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
  },
  categoriesContainer: {
    paddingRight: 20,
    gap: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#16213e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: '#00d4ff',
    borderColor: '#00d4ff',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsCount: {
    fontSize: 16,
    color: '#8e8e93',
    marginBottom: 16,
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  gridMovieCard: {
    width: '48%',
    marginBottom: 16,
  },
  debugInfo: {
    backgroundColor: '#ff6b6b',
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});