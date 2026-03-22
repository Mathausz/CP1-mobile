import * as FileSystem from "expo-file-system/legacy";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const documentDirectory = (FileSystem as any).documentDirectory;

interface Formulario {
  id: string;
  nome: string;
  curso: string;
  disciplina: string;
  descricao: string;
  data: string;
}

export default function History() {
  const [historico, setHistorico] = useState<Formulario[]>([]);

  useEffect(() => {
    carregarHistorico();
  }, []);

  // ✅ FUNÇÃO CORRIGIDA (cria o arquivo automaticamente na primeira vez)
  const carregarHistorico = async () => {
    try {
      const fileUri = documentDirectory + "historico_formularios.json";

      // Verifica se o arquivo existe
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (!fileInfo.exists) {
        // Cria o arquivo vazio pela primeira vez
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
        setHistorico([]);
        return;
      }

      // Se existe, carrega normalmente
      const conteudo = await FileSystem.readAsStringAsync(fileUri);
      setHistorico(JSON.parse(conteudo));
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setHistorico([]); // evita crash
    }
  };

  const limparHistorico = async () => {
    try {
      const fileUri = documentDirectory + "historico_formularios.json";
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
      setHistorico([]);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  };

  const renderItem = ({ item }: { item: Formulario }) => (
    <View style={styles.item}>
      <Text style={styles.tituloItem}>Formulário - {item.data}</Text>
      <Text style={styles.dado}>Nome: {item.nome}</Text>
      <Text style={styles.dado}>Curso: {item.curso}</Text>
      <Text style={styles.dado}>Disciplina: {item.disciplina}</Text>
      <Text style={styles.dado}>Descrição: {item.descricao}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Histórico de Formulários</Text>
        {historico.length > 0 && (
          <TouchableOpacity
            style={styles.botaoLimpar}
            onPress={limparHistorico}
          >
            <Text style={styles.textoBotao}>Limpar Histórico</Text>
          </TouchableOpacity>
        )}
      </View>

      {historico.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.textoVazio}>
            Nenhum formulário enviado ainda.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ed145b" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  botaoLimpar: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  textoBotao: {
    color: "#ed145b",
    fontWeight: "bold",
  },
  vazio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textoVazio: {
    fontSize: 18,
    color: "#fff",
  },
  lista: {
    padding: 20,
  },
  item: {
    backgroundColor: "#fff",
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 3,
  },
  tituloItem: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ed145b",
    marginBottom: 10,
  },
  dado: {
    fontSize: 16,
    marginVertical: 2,
    color: "#333",
  },
});
