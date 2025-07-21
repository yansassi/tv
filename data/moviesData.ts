import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Movie {
  id: string;
  title: string;
  year: string;
  category: string;
  url: string;
  poster?: string;
}

// Lista de filmes padrão para quando não há dados importados
const defaultMovies: Movie[] = [
  {
    id: '1',
    title: 'Vingadores: Ultimato',
    year: '2019',
    category: 'Ação',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg'
  },
  {
    id: '2',
    title: 'Parasita',
    year: '2019',
    category: 'Drama',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg'
  },
  {
    id: '3',
    title: 'Coringa',
    year: '2019',
    category: 'Drama',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg'
  },
  {
    id: '4',
    title: 'Toy Story 4',
    year: '2019',
    category: 'Animação',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
  },
  {
    id: '5',
    title: 'John Wick 3',
    year: '2019',
    category: 'Ação',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg'
  },
  {
    id: '6',
    title: 'It: Capítulo 2',
    year: '2019',
    category: 'Terror',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    poster: 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg'
  },
  {
    id: '7',
    title: 'Capitã Marvel',
    year: '2019',
    category: 'Ação',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg'
  },
  {
    id: '8',
    title: 'Aladdin',
    year: '2019',
    category: 'Aventura',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
  },
  {
    id: '9',
    title: 'Homem-Aranha: Longe de Casa',
    year: '2019',
    category: 'Ação',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg'
  },
  {
    id: '10',
    title: 'Frozen 2',
    year: '2019',
    category: 'Animação',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
  },
  {
    id: '11',
    title: 'Star Wars: A Ascensão Skywalker',
    year: '2019',
    category: 'Ficção Científica',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
    poster: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg'
  },
  {
    id: '12',
    title: 'Jumanji: Próxima Fase',
    year: '2019',
    category: 'Aventura',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg'
  },
  {
    id: '13',
    title: 'Knives Out',
    year: '2019',
    category: 'Mistério',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg'
  },
  {
    id: '14',
    title: 'Ford vs Ferrari',
    year: '2019',
    category: 'Drama',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg'
  },
  {
    id: '15',
    title: 'Bombshell',
    year: '2019',
    category: 'Drama',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg'
  }
];

export async function loadMoviesData(): Promise<Movie[]> {
  try {
    // Primeiro, tentar carregar filmes importados
    const movieIds = await AsyncStorage.getItem('allMovieIds');
    
    if (movieIds) {
      const ids = JSON.parse(movieIds);
      const movies: Movie[] = [];
      
      for (const id of ids) {
        try {
          const movieData = await AsyncStorage.getItem(`movie_${id}`);
          if (movieData) {
            movies.push(JSON.parse(movieData));
          }
        } catch (error) {
          console.error(`Erro ao carregar filme ${id}:`, error);
        }
      }
      
      // Se encontrou filmes importados, retornar eles
      if (movies.length > 0) {
        console.log(`Carregados ${movies.length} filmes importados`);
        return movies;
      }
    }
    
    // Se não há filmes importados, retornar filmes padrão
    console.log(`Carregando ${defaultMovies.length} filmes padrão`);
    return defaultMovies;
    
  } catch (error) {
    console.error('Erro ao carregar dados dos filmes:', error);
    // Em caso de erro, sempre retornar filmes padrão
    console.log(`Erro - retornando ${defaultMovies.length} filmes padrão`);
    return defaultMovies;
  }
}

export async function saveMoviesData(movies: Movie[]): Promise<void> {
  try {
    const movieIds: string[] = [];
    
    for (const movie of movies) {
      await AsyncStorage.setItem(`movie_${movie.id}`, JSON.stringify(movie));
      movieIds.push(movie.id);
    }
    
    await AsyncStorage.setItem('allMovieIds', JSON.stringify(movieIds));
    console.log(`Salvos ${movies.length} filmes`);
  } catch (error) {
    console.error('Erro ao salvar dados dos filmes:', error);
    throw error;
  }
}

export async function addMovies(newMovies: Movie[]): Promise<{success: boolean, message: string}> {
  try {
    // Carregar filmes existentes
    const existingMovies = await loadMoviesData();
    
    // Filtrar filmes que já existem (baseado no ID)
    const existingIds = new Set(existingMovies.map(m => m.id));
    const uniqueNewMovies = newMovies.filter(movie => !existingIds.has(movie.id));
    
    if (uniqueNewMovies.length === 0) {
      return {
        success: false,
        message: 'Todos os filmes já existem na lista'
      };
    }
    
    // Combinar filmes existentes com novos
    const allMovies = [...existingMovies, ...uniqueNewMovies];
    
    // Salvar todos os filmes
    await saveMoviesData(allMovies);
    
    return {
      success: true,
      message: `${uniqueNewMovies.length} novo(s) filme(s) adicionado(s) com sucesso!`
    };
    
  } catch (error) {
    console.error('Erro ao adicionar filmes:', error);
    return {
      success: false,
      message: 'Erro ao adicionar filmes'
    };
  }
}