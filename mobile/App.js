import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView } from 'react-native';

const API_BASE_URL = 'https://cl-tech-core-backend.onrender.com/api';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('Aguardando login...');

  async function handleLogin() {
    try {
      setStatus('Fazendo login...');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setToken(data.token);
        setStatus('Login realizado com sucesso!');
      } else {
        setStatus(data.message || 'Erro de login');
      }
    } catch (error) {
      setStatus('Falha ao conectar com o backend');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>CL TECH CORE Mobile</Text>
      <Text style={styles.label}>Backend: {API_BASE_URL}</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuário"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.status}>{status}</Text>
      <Text style={styles.token}>{token ? `Token: ${token.substring(0, 30)}...` : ''}</Text>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#060b1e'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#33dd33',
    marginBottom: 14
  },
  label: {
    color: '#fff',
    marginBottom: 10
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#0f1224',
    color: '#fff'
  },
  status: {
    marginTop: 16,
    color: '#f4f4f4'
  },
  token: {
    marginTop: 8,
    color: '#a1ff9c'
  }
});
