import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Dimensions,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Heart,
} from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function PlayerScreen() {
  const router = useRouter();
  const { movieData } = useLocalSearchParams();
  const movie = movieData ? JSON.parse(movieData as string) : null;
  
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!movie) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Erro ao carregar o filme</Text>
      </SafeAreaView>
    );
  }

  const playPause = () => {
    if (status.isLoaded) {
      if (status.isPlaying) {
        videoRef.current?.pauseAsync();
      } else {
        videoRef.current?.playAsync();
      }
    }
  };

  const toggleMute = () => {
    videoRef.current?.setIsMutedAsync(!isMuted);
    setIsMuted(!isMuted);
  };

  const goBack = () => {
    // Restaurar orientação ao sair
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    router.back();
  };

  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        // Sair da tela cheia - voltar para retrato
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
        setIsFullscreen(false);
      } else {
        // Entrar em tela cheia - rotacionar para paisagem
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        setIsFullscreen(true);
      }
    } catch (error) {
      console.error('Erro ao alterar orientação:', error);
    }
  };

  const seekBackward = () => {
    if (status.positionMillis) {
      const newPosition = Math.max(0, status.positionMillis - 10000);
      videoRef.current?.setPositionAsync(newPosition);
    }
  };

  const seekForward = () => {
    if (status.positionMillis && status.durationMillis) {
      const newPosition = Math.min(status.durationMillis, status.positionMillis + 10000);
      videoRef.current?.setPositionAsync(newPosition);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Aqui você implementaria a lógica para salvar/remover dos favoritos
  };

  const formatTime = (milliseconds) => {
    if (!milliseconds) return '00:00';
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!status.positionMillis || !status.durationMillis) return 0;
    return (status.positionMillis / status.durationMillis) * 100;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" hidden />
      
      {/* Player de Vídeo */}
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={() => setIsControlsVisible(!isControlsVisible)}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: movie.url }}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={true}
          isLooping={false}
          onPlaybackStatusUpdate={setStatus}
          onError={(error) => {
            console.error('Erro no vídeo:', error);
            Alert.alert('Erro', 'Não foi possível reproduzir o vídeo');
          }}
        />

        {/* Controles do Player */}
        {isControlsVisible && (
          <View style={styles.controlsOverlay}>
            {/* Header */}
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <ArrowLeft size={24} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.movieInfo}>
                <Text style={styles.movieTitle} numberOfLines={1}>
                  {movie.title}
                </Text>
                <Text style={styles.movieYear}>{movie.year}</Text>
              </View>

              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={toggleFavorite}
              >
                <Heart
                  size={24}
                  color={isFavorite ? '#ff6b6b' : '#fff'}
                  fill={isFavorite ? '#ff6b6b' : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            {/* Controles Centrais */}
            <View style={styles.centerControls}>
              <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
                <RotateCcw size={32} color="#fff" />
                <Text style={styles.controlLabel}>-10s</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.playPauseButton} onPress={playPause}>
                {status.isPlaying ? (
                  <Pause size={48} color="#fff" fill="#fff" />
                ) : (
                  <Play size={48} color="#fff" fill="#fff" />
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
                <RotateCw size={32} color="#fff" />
                <Text style={styles.controlLabel}>+10s</Text>
              </TouchableOpacity>
            </View>

            {/* Controles Inferiores */}
            <View style={styles.bottomControls}>
              {/* Barra de Progresso */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]}
                  />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {formatTime(status.positionMillis)}
                  </Text>
                  <Text style={styles.timeText}>
                    {formatTime(status.durationMillis)}
                  </Text>
                </View>
              </View>

              {/* Controles de Volume */}
              <View style={styles.volumeControls}>
                <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
                  {isFullscreen ? (
                    <Minimize size={24} color="#fff" />
                  ) : (
                    <Maximize size={24} color="#fff" />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity onPress={toggleMute}>
                  {isMuted ? (
                    <VolumeX size={24} color="#fff" />
                  ) : (
                    <Volume2 size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Loading State */}
        {!status.isLoaded && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Carregando...</Text>
          </View>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    backgroundColor: '#000',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  movieYear: {
    fontSize: 14,
    color: '#bbb',
  },
  favoriteButton: {
    padding: 8,
  },
  centerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  playPauseButton: {
    padding: 16,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00d4ff',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 12,
    color: '#fff',
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  fullscreenButton: {
    padding: 4,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 18,
    color: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});