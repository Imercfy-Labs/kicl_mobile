import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import * as api from '@/services/api';

export default function ForgotPasswordScreen() {
  const [phoneNumber] = useState('7397551335'); // Hardcoded for now
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await api.sendOTP(phoneNumber);
      
      if (response.error) {
        throw new Error(response.error);
      }

      router.push('/otp-verification');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.subtitle}>
        Don't worry! It happens. Please enter your phone number to receive OTP.
      </Text>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Text style={styles.label}>Phone Number:</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          editable={false}
          keyboardType="phone-pad"
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSendOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  backButton: {
    marginTop: Platform.OS === 'ios' ? 40 : 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#8CC63F',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});