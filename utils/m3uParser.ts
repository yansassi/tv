export interface Movie {
  id: string;
  title: string;
  year: string;
  category: string;
  url: string;
  poster?: string;
}

export function parseM3U(m3uContent: string): Movie[] {
  const lines = m3uContent.split('\n').map(line => line.trim()).filter(line => line);
  const movies: Movie[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Procurar por linhas EXTINF
    if (line.startsWith('#EXTINF:')) {
      const nextLine = lines[i + 1];
      
      if (nextLine && !nextLine.startsWith('#')) {
        // Extrair informações da linha EXTINF
        const movie = parseExtinfLine(line, nextLine);
        if (movie) {
          movies.push(movie);
        }
        i++; // Pular a próxima linha pois já foi processada
      }
    }
  }
  
  return movies;
}

function parseExtinfLine(extinf: string, url: string): Movie | null {
  try {
    // Extrair tvg-name ou o título no final da linha
    let title = '';
    let category = 'Sem Categoria';
    
    // Procurar por tvg-name
    const tvgNameMatch = extinf.match(/tvg-name="([^"]+)"/);
    if (tvgNameMatch) {
      title = tvgNameMatch[1];
    } else {
      // Se não encontrar tvg-name, pegar o texto após a última vírgula
      const parts = extinf.split(',');
      if (parts.length > 1) {
        title = parts[parts.length - 1].trim();
      }
    }
    
    // Procurar por group-title
    const groupTitleMatch = extinf.match(/group-title="([^"]+)"/);
    if (groupTitleMatch) {
      category = groupTitleMatch[1];
    }
    
    // Extrair ano do título se possível
    let year = '';
    const yearMatch = title.match(/\((\d{4})\)/);
    if (yearMatch) {
      year = yearMatch[1];
    } else {
      // Procurar por ano no final do título
      const yearEndMatch = title.match(/(\d{4})$/);
      if (yearEndMatch) {
        year = yearEndMatch[1];
      }
    }
    
    // Gerar ID único baseado na URL
    const id = btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    
    // Poster padrão baseado na categoria
    const poster = getDefaultPosterByCategory(category);
    
    return {
      id,
      title: title || 'Filme sem título',
      year: year || 'N/A',
      category: category || 'Sem Categoria',
      url: url.trim(),
      poster
    };
  } catch (error) {
    console.error('Erro ao processar linha EXTINF:', error);
    return null;
  }
}

function getDefaultPosterByCategory(category: string): string {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('ação') || categoryLower.includes('action')) {
    return 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg';
  } else if (categoryLower.includes('comédia') || categoryLower.includes('comedy')) {
    return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg';
  } else if (categoryLower.includes('terror') || categoryLower.includes('horror')) {
    return 'https://images.pexels.com/photos/2179483/pexels-photo-2179483.jpeg';
  } else if (categoryLower.includes('drama')) {
    return 'https://images.pexels.com/photos/3709369/pexels-photo-3709369.jpeg';
  } else if (categoryLower.includes('ficção') || categoryLower.includes('sci-fi')) {
    return 'https://images.pexels.com/photos/2832382/pexels-photo-2832382.jpeg';
  } else if (categoryLower.includes('romance')) {
    return 'https://images.pexels.com/photos/1117132/pexels-photo-1117132.jpeg';
  } else {
    return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg';
  }
}

export async function fetchM3UFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    throw new Error(`Erro ao buscar lista M3U: ${error.message}`);
  }
}