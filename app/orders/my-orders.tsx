import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight } from 'lucide-react-native';
import GradientBackground from '@/components/GradientBackground';
import { getOrderSummary } from '@/services/ordersApi';

export default function MyOrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getOrderSummary();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order summary');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <GradientBackground>
        <Stack.Screen 
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#E8F5E9',
            },
            headerShadowVisible: true,
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()}
                style={styles.headerButton}
              >
                <ArrowLeft size={24} color="#000" />
              </TouchableOpacity>
            ),
            headerTitle: "My Orders",
            headerTitleStyle: styles.headerTitle,
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8CC63F" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#E8F5E9',
          },
          headerShadowVisible: true,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
          ),
          headerTitle: "My Orders",
          headerTitleStyle: styles.headerTitle,
        }}
      />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={loadOrders}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        ) : (
          orders.map((order, index) => (
            <TouchableOpacity 
              key={order.order_id} 
              style={styles.orderCard}
              onPress={() => router.push({
                pathname: '/orders/details',
                params: { orderId: order.order_id }
              })}
            >
              <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Order #{order.order_id}</Text>
                <Text style={styles.orderDate}>{formatDate(order.created_at)}</Text>
              </View>

              <View style={styles.dealerInfo}>
                <Text style={styles.dealerName}>{order.dealer_name}</Text>
                <Text style={styles.dealerId}>ID: {order.dealer_id}</Text>
              </View>

              <View style={styles.productsContainer}>
                {order.products.map((product, idx) => (
                  <View key={idx} style={styles.productItem}>
                    <Text style={styles.productName}>{product.product_name}</Text>
                    <View style={styles.productDetails}>
                      <Text style={styles.productQuantity}>Qty: {product.quantity}</Text>
                      <Text style={styles.productPrice}>₹{product.price}</Text>
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.totalAmount}>
                  Total: ₹{order.total_amount.toLocaleString()}
                </Text>
                <ChevronRight size={20} color="#666" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Platform.OS === 'web' ? 16 : 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: Platform.OS === 'web' ? 20 : 18,
    fontWeight: '600',
    color: '#000',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: Platform.OS === 'web' ? 32 : 16,
    maxWidth: Platform.OS === 'web' ? 800 : undefined,
    alignSelf: 'center',
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#8CC63F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: Platform.OS === 'web' ? 16 : 12,
    padding: Platform.OS === 'web' ? 24 : 16,
    marginBottom: Platform.OS === 'web' ? 24 : 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#666',
  },
  dealerInfo: {
    marginBottom: 12,
  },
  dealerName: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  dealerId: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#666',
  },
  productsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginBottom: 12,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#333',
  },
  productDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    color: '#666',
    marginRight: 12,
  },
  productPrice: {
    fontSize: Platform.OS === 'web' ? 16 : 14,
    fontWeight: '500',
    color: '#333',
    minWidth: 80,
    textAlign: 'right',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    fontWeight: '600',
    color: '#333',
  },
});