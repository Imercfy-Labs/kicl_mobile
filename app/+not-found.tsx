import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import GradientBackground from '@/components/GradientBackground';

export default function NotFoundScreen() {
  const router = useRouter();

  const handleNavigation = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <GradientBackground>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity 
        style={styles.container} 
        activeOpacity={0.9}
        onPress={handleNavigation}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Coming Soon!</Text>
          <Text style={styles.description}>
            This feature is currently under development and will be available soon.
          </Text>
          <Text style={styles.tapText}>
            {router.canGoBack() ? 'Tap anywhere to go back' : 'Tap anywhere to go to dashboard'}
          </Text>
        </View>
      </TouchableOpacity>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: Platform.OS === 'web' ? 400 : undefined,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2E3192',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  tapText: {
    fontSize: 14,
    color: '#8CC63F',
    fontWeight: '500',
  },
});