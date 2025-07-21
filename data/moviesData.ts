import AsyncStorage from '@react-native-async-storage/async-storage';

// Dados dos filmes baseados nos links fornecidos
const initialMoviesData = [
  {
    id: '1',
    title: '#PartiuFama: Cancelado no Amor',
    year: '2022',
    category: 'Filmes | Comedia',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  },
  {
    id: '2',
    title: '#SeAcabó: Diário das Campeãs',
    year: '2024',
    category: 'Filmes | Lançamentos 2024',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg',
  },
  {
    id: '3',
    title: '(500) Dias com Ela',
    year: '2009',
    category: 'Filmes | Comedia',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '4',
    title: '(Re)Nascer',
    year: '2023',
    category: 'Filmes | Terror',
    url: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg',
  },
  {
    id: '5',
    title: 'Vingadores: Ultimato',
    year: '2019',
    category: 'Filmes | Ação',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '6',
    title: 'Homem-Aranha: Sem Volta Para Casa',
    year: '2021',
    category: 'Filmes | Ação',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '7',
    title: 'Coringa',
    year: '2019',
    category: 'Filmes | Drama',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg',
  },
  {
    id: '8',
    title: 'Parasita',
    year: '2019',
    category: 'Filmes | Drama',
    url: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg',
  },
  {
    id: '9',
    title: 'Invocação do Mal 3',
    year: '2021',
    category: 'Filmes | Terror',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg',
  },
  {
    id: '10',
    title: 'A Freira II',
    year: '2023',
    category: 'Filmes | Terror',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    poster: 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg',
  },
  {
    id: '11',
    title: 'Gente Grande',
    year: '2010',
    category: 'Filmes | Comedia',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  },
  {
    id: '12',
    title: 'Se Beber, Não Case!',
    year: '2009',
    category: 'Filmes | Comedia',
    url: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  },
  {
    id: '13',
    title: 'Interestelar',
    year: '2014',
    category: 'Filmes | Ficção Científica',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
  },
  {
    id: '14',
    title: 'Blade Runner 2049',
    year: '2017',
    category: 'Filmes | Ficção Científica',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    poster: 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg',
  },
  {
    id: '15',
    title: 'Titanic',
    year: '1997',
    category: 'Filmes | Romance',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '16',
    title: 'La La Land',
    year: '2016',
    category: 'Filmes | Romance',
    url: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '17',
    title: 'Velozes e Furiosos 9',
    year: '2021',
    category: 'Filmes | Ação',
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '18',
    title: 'John Wick 4',
    year: '2023',
    category: 'Filmes | Ação',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    poster: 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg',
  },
  {
    id: '19',
    title: 'Oppenheimer',
    year: '2023',
    category: 'Filmes | Lançamentos 2024',
    url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    poster: 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg',
  },
  {
    id: '20',
    title: 'Barbie',
    year: '2023',
    category: 'Filmes | Lançamentos 2024',
    url: 'https://www.w3schools.com/html/movie.mp4',
    poster: 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg',
  },
];

const MOVIE_IDS_KEY = 'allMovieIds';
const MOVIE_PREFIX = 'movie_';

// Função para carregar filmes do AsyncStorage
export async function loadMoviesData() {
  try {
    // Primeiro, tenta carregar a lista de IDs dos filmes
    const storedMovieIds = await AsyncStorage.getItem(MOVIE_IDS_KEY);
    
    if (storedMovieIds) {
      const movieIds = JSON.parse(storedMovieIds);
      const movies = [];
      
      // Carrega cada filme individualmente
      for (const id of movieIds) {
        try {
          const movieData = await AsyncStorage.getItem(`${MOVIE_PREFIX}${id}`);
          if (movieData) {
            movies.push(JSON.parse(movieData));
          }
        } catch (error) {
          console.error(`Erro ao carregar filme ${id}:`, error);
        }
      }
      
      return movies;
    }
    
    // Se não há dados salvos, usar dados iniciais e salvá-los
    await saveMoviesData(initialMoviesData);
    return initialMoviesData;
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
    return initialMoviesData;
  }
}

// Função para salvar filmes no AsyncStorage
export async function saveMoviesData(movies) {
  try {
    // Salva cada filme individualmente
    const movieIds = [];
    
    for (const movie of movies) {
      await AsyncStorage.setItem(`${MOVIE_PREFIX}${movie.id}`, JSON.stringify(movie));
      movieIds.push(movie.id);
    }
    
    // Salva a lista de IDs
    await AsyncStorage.setItem(MOVIE_IDS_KEY, JSON.stringify(movieIds));
  } catch (error) {
    console.error('Erro ao salvar filmes:', error);
  }
}

// Função para adicionar novos filmes
export async function addMovies(newMovies) {
  try {
    const currentMovies = await loadMoviesData();
    const existingUrls = new Set(currentMovies.map(movie => movie.url));
    
    // Filtrar filmes que já existem
    const uniqueNewMovies = newMovies.filter(movie => !existingUrls.has(movie.url));
    
    if (uniqueNewMovies.length === 0) {
      return { success: false, message: 'Todos os filmes já estão na lista' };
    }
    
    // Carrega IDs existentes
    const storedMovieIds = await AsyncStorage.getItem(MOVIE_IDS_KEY);
    const existingIds = storedMovieIds ? JSON.parse(storedMovieIds) : [];
    
    // Adiciona novos filmes individualmente
    const newIds = [];
    for (const movie of uniqueNewMovies) {
      await AsyncStorage.setItem(`${MOVIE_PREFIX}${movie.id}`, JSON.stringify(movie));
      newIds.push(movie.id);
    }
    
    // Atualiza a lista de IDs
    const updatedIds = [...existingIds, ...newIds];
    await AsyncStorage.setItem(MOVIE_IDS_KEY, JSON.stringify(updatedIds));
    
    return { 
      success: true, 
      message: `${uniqueNewMovies.length} filme(s) adicionado(s) com sucesso`,
      addedCount: uniqueNewMovies.length
    };
  } catch (error) {
    console.error('Erro ao adicionar filmes:', error);
    return { success: false, message: 'Erro ao adicionar filmes' };
  }
}

// Exportar dados iniciais para compatibilidade
export const moviesData = initialMoviesData;