import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Settings as SettingsIcon, Upload, Download, Trash2, Info } from 'lucide-react-native';
import { parseM3U, fetchM3UFromUrl } from '@/utils/m3uParser';
import { addMovies, loadMoviesData, saveMoviesData } from '@/data/moviesData';

export default function SettingsScreen() {
  const [m3uUrl, setM3uUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const importM3U = async () => {
    if (!m3uUrl.trim()) {
      Alert.alert('Erro', 'Por favor, insira uma URL válida');
      return;
    }
    
    // Verificação básica de formato de URL
    try {
      new URL(m3uUrl.trim());
    } catch {
      Alert.alert(
        'URL Inválida',
        'Por favor, verifique se a URL está no formato correto (ex: http://exemplo.com/lista.m3u)'
      );
      return;
    }

    setIsImporting(true);
    
    try {
      // Buscar conteúdo M3U
      const m3uContent = await fetchM3UFromUrl(m3uUrl.trim());
      
      // Processar conteúdo M3U
      const newMovies = parseM3U(m3uContent);
      
      if (newMovies.length === 0) {
        Alert.alert('Erro', 'Nenhum filme encontrado na lista M3U');
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      if (errorMessage.includes('Network request failed')) {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar ao servidor da lista M3U.\n\n' +
          '🔍 Verificações necessárias:\n\n' +
          '• Verifique sua conexão com a internet\n' +
          '• Teste a URL em um navegador web\n' +
          '• Confirme se o servidor está online\n' +
          '• Verifique se não há firewall bloqueando\n\n' +
          '💡 Dica: Tente usar uma rede diferente se o problema persistir'
        );
      } else {
        Alert.alert(
          'Erro na Importação',
          'Ocorreu um problema ao processar a lista M3U.\n\n' +
          `Detalhes: ${errorMessage}\n\n` +
          'Verifique se o arquivo M3U está no formato correto.'
        );
      }
        setM3uUrl('');
      } else {
        Alert.alert('Aviso', result.message);
      }
      
    } catch (error) {
      console.error('Erro na importação:', error);
      
      // Verificar se é erro de rede
      if (error.message && error.message.includes('Network request failed')) {
        Alert.alert(
          'Erro de Conexão', 
          'Não foi possível conectar à internet ou acessar a URL fornecida.\n\n' +
          'Verifique:\n' +
          '• Sua conexão com a internet\n' +
          '• Se a URL está correta e acessível\n' +
          '• Se o servidor está funcionando'
        );
      } else {
        Alert.alert('Erro', `Falha ao importar lista: ${error.message}`);
      }
    } finally {
      setIsImporting(false);
    }
  };

  const clearData = async () => {
    Alert.alert(
      'Limpar Dados',
      'Isso removerá todos os favoritos e dados do app. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: async () => {
          try {
            await AsyncStorage.clear();
            Alert.alert('Sucesso', 'Dados limpos com sucesso!');
          } catch (error) {
            Alert.alert('Erro', 'Falha ao limpar dados');
          }
        }}
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Importar Lista M3U */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Importar Lista</Text>
          <Text style={styles.sectionDescription}>
            Cole a URL da sua lista M3U para importar novos filmes
          </Text>
          
          <TextInput
            style={styles.input}
            placeholder="URL da lista M3U..."
            placeholderTextColor="#8e8e93"
            value={m3uUrl}
            onChangeText={setM3uUrl}
            multiline
          />
          
          <TouchableOpacity 
            style={[styles.primaryButton, isImporting && styles.primaryButtonDisabled]} 
            onPress={importM3U}
            disabled={isImporting}
          >
            <Upload size={20} color="#000" />
            <Text style={styles.primaryButtonText}>
              {isImporting ? 'Importando...' : 'Importar Lista'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Opções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados</Text>
          
          <TouchableOpacity style={styles.optionButton}>
            <Download size={20} color="#00d4ff" />
            <Text style={styles.optionText}>Exportar Favoritos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton} onPress={clearData}>
            <Trash2 size={20} color="#ff6b6b" />
            <Text style={[styles.optionText, { color: '#ff6b6b' }]}>Limpar Dados</Text>
          </TouchableOpacity>
        </View>

        {/* Informações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          
          <TouchableOpacity style={styles.optionButton}>
            <Info size={20} color="#8e8e93" />
            <Text style={styles.optionText}>Versão 1.0.0</Text>
          </TouchableOpacity>
        </View>

        {/* Instrucões */}
        <View style={styles.instructionsSection}>
          <Text style={styles.instructionsTitle}>Como usar:</Text>
          <Text style={styles.instructionsText}>
            1. Cole a URL da sua lista M3U no campo acima{'\n'}
            2. Toque em "Importar Lista" para carregar os filmes{'\n'}
            3. Navegue pelas categorias na tela inicial{'\n'}
            4. Use a busca para encontrar filmes específicos{'\n'}
            5. Adicione filmes aos favoritos tocando no coração
          </Text>
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
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00d4ff',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#16213e',
    borderRadius: 12,
    marginBottom: 12,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  instructionsSection: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 12,
    marginBottom: 100,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#8e8e93',
    lineHeight: 22,
  },
});