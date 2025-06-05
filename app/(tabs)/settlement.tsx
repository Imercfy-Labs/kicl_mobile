import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function SettlementScreen() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/+not-found');
  }, []);
  
  return null;
}