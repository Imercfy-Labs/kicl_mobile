import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../config/firebase';  // Correct import path for firebase.js
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://devkicl.duckdns.org/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    branch_id: string;
  };
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  try {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new Error(isJson ? data.message || 'An error occurred' : 'Network error');
    }

    return { data: data as T };
  } catch (error) {
    console.error('Error handling response:', error);
    throw error;
  }
}

export async function login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    return await handleResponse<LoginResponse>(response);
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: error.message || 'Failed to connect to the server' };
  }
}


export async function sendOTP(phoneNumber: string): Promise<ApiResponse<{ message: string }>> {
  try {
    console.log('Sending OTP to:', phoneNumber);

    // Create a reCAPTCHA verifier for Firebase Phone Authentication
    const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',  // Invisible reCAPTCHA
      callback: () => console.log('reCAPTCHA solved'),
    }, auth);

    const formattedPhoneNumber = `+91${phoneNumber}`;  // Ensure country code is added

    // Send OTP using Firebase Authentication
    const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, recaptchaVerifier);

    // Store confirmationResult (for verification later)
    localStorage.setItem('confirmationResult', JSON.stringify(confirmationResult));

    console.log('OTP sent successfully!');
    return { data: { message: 'OTP sent successfully' } };

  } catch (error: any) {
    console.error('Error during OTP send:', error);
    return { error: error.message || 'Failed to send OTP' };
  }
}

export async function verifyOTP(phoneNumber: string, otp: string): Promise<ApiResponse<{ message: string }>> {
  try {
    // Retrieve the stored confirmationResult
    const confirmationResult: firebase.auth.ConfirmationResult = JSON.parse(localStorage.getItem('confirmationResult') || '{}');

    if (!confirmationResult) {
      throw new Error('OTP session has expired or was not started.');
    }

    // Confirm OTP using the confirmationResult from Firebase
    const userCredential = await confirmationResult.confirm(otp);

    // Send the verification data to your backend for session management or user creation
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        otp,
        sessionInfo: userCredential.user, // Pass the authenticated user info to backend
      }),
    });

    return await handleResponse<{ message: string }>(response);

  } catch (error: any) {
    return { error: error.message || 'Failed to verify OTP' };
  }
}
export async function resetPassword(email: string): Promise<ApiResponse<{ message: string }>> {
  try {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    return await handleResponse<{ message: string }>(response);
  } catch (error: any) {
    return { error: error.message || 'Failed to connect to the server' };
  }
}