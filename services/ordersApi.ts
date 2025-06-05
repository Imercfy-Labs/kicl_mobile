import Constants from 'expo-constants';
import { secureStore } from './secureStore';

const API_URL = Constants.expoConfig?.extra?.apiUrl || 'https://devkicl.duckdns.org/api';

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

interface OrderSummary {
  order_id: string;
  created_at: string;
  dealer_name: string;
  dealer_id: string;
  credit_limit: number;
  sales_officer_name: string;
  products: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
}

export async function placeOrder(orderData: {
  dealer_id: any;
  sales_officer_id: string;
  branch_id: any;
  items: OrderItem[];
}) {
  try {
    const token = await secureStore.getItem('token');
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to place order');
    }

    return data;
  } catch (error: any) {
    console.error('Error placing order:', error);
    throw new Error(error.message || 'Failed to place order');
  }
}

export async function getOrderSummary(): Promise<OrderSummary[]> {
  try {
    const token = await secureStore.getItem('token');
    const response = await fetch(`${API_URL}/orders/summary`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch order summary');
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching order summary:', error);
    throw new Error(error.message || 'Failed to fetch order summary');
  }
}