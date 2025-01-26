import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useToken } from '../hooks/TokenStorageHook';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import apiClient from '../services/api'; // Use the axios instance

const screenWidth = Dimensions.get('window').width;

type MaterialIconName = 'assessment' | 'date-range' | 'location-on' | 'public' | 'notifications';

interface AnalyticsData {
  overview: {
    total_predictions: number;
    recent_predictions: number;
    unique_locations: number;
    unique_sites: number;
  };
  weed_statistics: Array<{
    result: string;
    count: number;
  }>;
  monthly_trends: Array<{
    month: string;
    count: number;
  }>;
  recent_activity: Array<{
    id: string;
    result: string;
    timestamp: string;
    location: string;
    site_name: string;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { token } = useToken();

  const fetchAnalytics = async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in again');
      setLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/analytics/');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      Alert.alert('Error', 'Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DB8FF" />
      </LinearGradient>
    );
  }

  if (!analytics) {
    return (
      <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.loadingContainer}>
        <Text style={styles.errorText}>No analytics data available.</Text>
      </LinearGradient>
    );
  }

  const monthlyTrendData = {
    labels: analytics.monthly_trends.map((item) => item.month),
    datasets: [
      {
        data: analytics.monthly_trends.map((item) => item.count),
        color: (opacity = 1) => `rgba(50, 205, 50, ${opacity})`, // Green color
        strokeWidth: 3, // Line thickness
      },
    ],
  };

  const weedStatsData = {
    labels: analytics.weed_statistics.map((item) => item.result),
    datasets: [
      {
        data: analytics.weed_statistics.map((item) => item.count),
      },
    ],
  };

  return (
    <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4DB8FF" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics Dashboard</Text>
          <TouchableOpacity onPress={() => Alert.alert('Notifications', 'No new notifications')}>
            <MaterialIcons name="notifications" size={24} color="#32CD32" />
          </TouchableOpacity>
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          {[
            {
              title: 'Total Predictions',
              icon: 'assessment' as MaterialIconName,
              value: analytics.overview.total_predictions,
            },
            {
              title: 'Recent (30 days)',
              icon: 'date-range' as MaterialIconName,
              value: analytics.overview.recent_predictions,
            },
            {
              title: 'Unique Locations',
              icon: 'location-on' as MaterialIconName,
              value: analytics.overview.unique_locations,
            },
            {
              title: 'Unique Sites',
              icon: 'public' as MaterialIconName,
              value: analytics.overview.unique_sites,
            },
          ].map((card, index) => (
            <View key={index} style={styles.card}>
              <MaterialIcons name={card.icon} size={24} color="#32CD32" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardValue}>{card.value}</Text>
            </View>
          ))}
        </View>

        {/* Monthly Trends Graph */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <View style={styles.chartWrapper}>
            <LineChart
              data={monthlyTrendData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(50, 205, 50, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#32CD32',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>
        </View>

        {/* Weed Statistics Bar Chart */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>Weed Statistics</Text>
          <View style={styles.chartWrapper}>
            <BarChart
              data={weedStatsData}
              width={screenWidth - 32}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#FFFFFF',
                backgroundGradientFrom: '#FFFFFF',
                backgroundGradientTo: '#FFFFFF',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(50, 205, 50, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              style={styles.chart}
              fromZero
              showBarTops
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardIcon: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#FFFFFFFF',
    opacity: 0.8,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#32CD32',
    marginTop: 8,
  },
  graphContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#F5E5E5FF',
  },
  chartWrapper: {
    backgroundColor: '#A8A2A2FF',
    borderRadius: 16,
    padding: 16,
  },
  chart: {
    borderRadius: 8,
  },
});

export default AnalyticsDashboard;