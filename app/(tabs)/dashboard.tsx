import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { Menu, Bell } from 'lucide-react-native';
import { DrawerContext } from './_layout';
import { useRouter } from 'expo-router';
import { secureStore } from '@/services/secureStore';

interface PunchData {
  isPunchedIn: boolean;
  lastInTime: string;
  lastOutTime: string;
  lastPunchDate: string;
}

export default function DashboardScreen() {
  const { user } = useAuth();
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [lastInTime, setLastInTime] = useState('--:--');
  const [lastOutTime, setLastOutTime] = useState('--:--');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toggleDrawer } = React.useContext(DrawerContext);
  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    loadPunchData();
    const interval = setInterval(checkDayChange, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadPunchData = async () => {
    try {
      const data = await secureStore.getItem('punchData');
      if (data) {
        const punchData: PunchData = JSON.parse(data);
        const today = new Date().toDateString();
        
        if (punchData.lastPunchDate !== today) {
          await resetPunchData();
        } else {
          setIsPunchedIn(punchData.isPunchedIn);
          setLastInTime(punchData.lastInTime);
          setLastOutTime(punchData.lastOutTime);
        }
      }
    } catch (error) {
      console.error('Error loading punch data:', error);
    }
  };

  const savePunchData = async (data: PunchData) => {
    try {
      await secureStore.setItem('punchData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving punch data:', error);
    }
  };

  const resetPunchData = async () => {
    const defaultData: PunchData = {
      isPunchedIn: false,
      lastInTime: '--:--',
      lastOutTime: '--:--',
      lastPunchDate: new Date().toDateString()
    };
    
    await savePunchData(defaultData);
    setIsPunchedIn(false);
    setLastInTime('--:--');
    setLastOutTime('--:--');
  };

  const checkDayChange = async () => {
    const data = await secureStore.getItem('punchData');
    if (data) {
      const punchData: PunchData = JSON.parse(data);
      const today = new Date().toDateString();
      
      if (punchData.lastPunchDate !== today) {
        await resetPunchData();
      }
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
  };

  const handlePunch = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const currentTime = getCurrentTime();
      const newPunchData: PunchData = {
        isPunchedIn: !isPunchedIn,
        lastInTime: !isPunchedIn ? currentTime : lastInTime,
        lastOutTime: isPunchedIn ? currentTime : lastOutTime,
        lastPunchDate: new Date().toDateString()
      };
      
      await savePunchData(newPunchData);
      
      if (isPunchedIn) {
        setLastOutTime(currentTime);
      } else {
        setLastInTime(currentTime);
      }
      setIsPunchedIn(!isPunchedIn);
    } catch (error) {
      console.error('Error handling punch:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { height: windowHeight }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={toggleDrawer} style={styles.iconButton}>
            <Menu size={24} color="#000" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.punchContainer}>
          <TouchableOpacity 
            style={[
              styles.punchButton, 
              isPunchedIn ? styles.punchOutButton : styles.punchInButton,
              isSubmitting && styles.punchButtonDisabled
            ]}
            onPress={handlePunch}
            disabled={isSubmitting}
          >
            <Text style={[
              styles.punchButtonText,
              isSubmitting && styles.punchButtonTextDisabled
            ]}>
              {isSubmitting ? 'Processing...' : isPunchedIn ? 'Punch Out' : 'Punch In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.timeInfo}>
            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>Last In Time</Text>
              <Text style={styles.timeValue}>{lastInTime}</Text>
            </View>
            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>Last Out Time</Text>
              <Text style={styles.timeValue}>{lastOutTime}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Platform.OS === 'web' ? 32 : 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    backgroundColor: '#E8F5E9',
    borderBottomWidth: 1,
    borderBottomColor: '#D1E7DD',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: Platform.OS === 'web' ? 32 : 20,
  },
  punchContainer: {
    maxWidth: Platform.OS === 'web' ? 600 : undefined,
    width: '100%',
    alignSelf: 'center',
  },
  punchButton: {
    width: Platform.OS === 'web' ? 240 : 200,
    height: Platform.OS === 'web' ? 240 : 200,
    borderRadius: Platform.OS === 'web' ? 120 : 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Platform.OS === 'web' ? 48 : 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  punchButtonDisabled: {
    opacity: 0.7,
  },
  punchButtonTextDisabled: {
    opacity: 0.7,
  },
  punchInButton: {
    backgroundColor: '#8CC63F',
  },
  punchOutButton: {
    backgroundColor: '#FF3B30',
  },
  punchButtonText: {
    color: '#fff',
    fontSize: Platform.OS === 'web' ? 32 : 28,
    fontWeight: '600',
  },
  timeInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Platform.OS === 'web' ? 32 : 20,
  },
  timeCard: {
    backgroundColor: '#fff',
    borderRadius: Platform.OS === 'web' ? 20 : 16,
    padding: Platform.OS === 'web' ? 24 : 20,
    minWidth: Platform.OS === 'web' ? 200 : 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeLabel: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#666',
    marginBottom: Platform.OS === 'web' ? 12 : 8,
  },
  timeValue: {
    fontSize: Platform.OS === 'web' ? 24 : 20,
    fontWeight: '600',
    color: '#000',
  },
});
