import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Dimensions, ScrollView } from 'react-native';
import GradientBackground from '@/components/GradientBackground';
import { ShoppingCart, ClipboardCheck, Truck as TruckDelivery, Menu, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { DrawerContext } from './_layout';
import Logo from '@/components/Logo';

export default function OrdersScreen() {
  const router = useRouter();
  const windowHeight = Dimensions.get('window').height;
  const isWeb = Platform.OS === 'web';
  const { toggleDrawer } = React.useContext(DrawerContext);
  
  return (
    <GradientBackground>
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
        
        <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Orders</Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/orders/place')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(61, 211, 158, 0.1)' }]}>
                <ShoppingCart color="#3DD39E" size={isWeb ? 28 : 24} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Place Order</Text>
                <Text style={styles.actionSubtitle}>Create a new order</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/orders/my-orders')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(63, 81, 181, 0.1)' }]}>
                <ClipboardCheck color="#3F51B5" size={isWeb ? 28 : 24} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>My Orders</Text>
                <Text style={styles.actionSubtitle}>View your orders</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/orders/track')}
            >
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]}>
                <TruckDelivery color="#FF9800" size={isWeb ? 28 : 24} />
              </View>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Track Order</Text>
                <Text style={styles.actionSubtitle}>Check order status</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
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
  title: {
    fontSize: Platform.OS === 'web' ? 32 : 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: Platform.OS === 'web' ? 32 : 24,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Platform.OS === 'web' ? 32 : 16,
    flexGrow: 1,
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Platform.OS === 'web' ? 24 : 16,
    maxWidth: Platform.OS === 'web' ? 800 : '100%',
    alignSelf: 'center',
    width: '100%',
    paddingVertical: Platform.OS === 'web' ? 48 : 24,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: Platform.OS === 'web' ? 20 : 16,
    padding: Platform.OS === 'web' ? 32 : 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    transform: [{ scale: 1 }],
    transition: Platform.OS === 'web' ? 'all 0.3s ease' : undefined,
    cursor: Platform.OS === 'web' ? 'pointer' : undefined,
  },
  iconContainer: {
    width: Platform.OS === 'web' ? 64 : 56,
    height: Platform.OS === 'web' ? 64 : 56,
    borderRadius: Platform.OS === 'web' ? 32 : 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Platform.OS === 'web' ? 28 : 20,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: Platform.OS === 'web' ? 24 : 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: Platform.OS === 'web' ? 8 : 6,
  },
  actionSubtitle: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#666',
  },
});