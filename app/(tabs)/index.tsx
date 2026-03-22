import * as FileSystem from "expo-file-system/legacy";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const documentDirectory = (FileSystem as any).documentDirectory;

export default function Index() {
  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [descricao, setDescricao] = useState("");
  const [mostrarDados, setMostrarDados] = useState(false);

  useEffect(() => {
    console.log("✅ Aplicativo CP1 iniciado - Checkpoint 01");
  }, []);

  const salvarNoHistorico = async () => {
    const fileUri =
      (FileSystem as any).documentDirectory + "historico_formularios.json";
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      let historico = [];
      if (fileInfo.exists) {
        const dadosExistentes = await FileSystem.readAsStringAsync(fileUri);
        historico = JSON.parse(dadosExistentes);
      } else {
        await FileSystem.writeAsStringAsync(fileUri, JSON.stringify([]));
      }
      const novoFormulario = {
        id: Date.now().toString(),
        nome,
        curso,
        disciplina,
        descricao,
        data: new Date().toLocaleDateString("pt-BR"),
      };
      historico.push(novoFormulario);
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(historico));
      Alert.alert("Sucesso", "Formulário salvo no histórico com sucesso! ✅");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert("Erro", "Falha ao salvar no histórico.");
    }
  };

  const enviarDados = async () => {
    if (nome && curso && disciplina) {
      setMostrarDados(true);
      salvarNoHistorico();
    } else {
      alert("Preencha pelo menos Nome, Curso e Disciplina!");
    }
  };

  const limparFormulario = () => {
    setNome("");
    setCurso("");
    setDisciplina("");
    setDescricao("");
    setMostrarDados(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.titulo}>Formulário de Cadastro</Text>

        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          autoCapitalize="words"
          maxLength={50}
          value={nome}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          placeholder="Curso"
          value={curso}
          onChangeText={setCurso}
        />

        <TextInput
          style={styles.input}
          placeholder="Disciplina"
          value={disciplina}
          onChangeText={setDisciplina}
        />

        <TextInput
          style={styles.textArea}
          placeholder="Breve descrição ou apresentação pessoal (2-3 linhas)"
          multiline
          numberOfLines={4}
          value={descricao}
          onChangeText={setDescricao}
        />

        <Button title="Enviar Dados" color="#ed145b" onPress={enviarDados} />

        {/* Botão Limpar - aparece só depois do envio */}
        {mostrarDados && (
          <Button
            title="Limpar Formulário"
            color="#666"
            onPress={limparFormulario}
          />
        )}
      </View>

      {/* Resultado */}
      {mostrarDados && (
        <View style={styles.resultado}>
          <Text style={styles.tituloResultado}>Dados Enviados ✅</Text>
          <Text style={styles.dado}>Nome: {nome}</Text>
          <Text style={styles.dado}>Curso: {curso}</Text>
          <Text style={styles.dado}>Disciplina: {disciplina}</Text>
          <Text style={styles.dado}>Descrição: {descricao}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ed145b" },
  form: { flex: 1, padding: 20, justifyContent: "center" },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 100,
    textAlignVertical: "top",
  },
  resultado: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  tituloResultado: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ed145b",
    marginBottom: 15,
    textAlign: "center",
  },
  dado: { fontSize: 18, marginVertical: 8, color: "#333" },
});
