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
} from 'react-native';
import { useToken } from '../hooks/TokenStorageHook';
import { BarChart, LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

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
      const response = await fetch('http://192.168.8.107:8000/api/analytics/', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAnalytics(data);
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#328A43" />
      </View>
    );
  }

  const monthlyTrendData = {
    labels: analytics?.monthly_trends.map((item) => item.month) || [],
    datasets: [
      {
        data: analytics?.monthly_trends.map((item) => item.count) || [],
        color: (opacity = 1) => `rgba(50, 138, 67, ${opacity})`, // Custom color for the line
        strokeWidth: 2, // Line thickness
      },
    ],
  };

  const weedStatsData = {
    labels: analytics?.weed_statistics.map((item) => item.result) || [],
    datasets: [
      {
        data: analytics?.weed_statistics.map((item) => item.count) || [],
        colors: [
          (opacity = 1) => `rgba(50, 138, 67, ${opacity})`, // Custom colors for bars
          (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
          (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Predictions</Text>
            <Text style={styles.cardValue}>
              {analytics?.overview.total_predictions || 0}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent (30 days)</Text>
            <Text style={styles.cardValue}>
              {analytics?.overview.recent_predictions || 0}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Unique Locations</Text>
            <Text style={styles.cardValue}>
              {analytics?.overview.unique_locations || 0}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Unique Sites</Text>
            <Text style={styles.cardValue}>
              {analytics?.overview.unique_sites || 0}
            </Text>
          </View>
        </View>

        {/* Monthly Trends Graph */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <LineChart
            data={monthlyTrendData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(50, 138, 67, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
              style: {
                borderRadius: 8,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#328A43',
              },
            }}
            bezier // Smooth line curve
            style={styles.chart}
          />
        </View>

        {/* Weed Statistics Bar Chart */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>Weed Statistics</Text>
          <BarChart
            data={weedStatsData}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(50, 138, 67, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(102, 102, 102, ${opacity})`,
            }}
            style={styles.chart}
            fromZero // Start Y-axis from zero
            showBarTops // Show tops of bars
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666666',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#328A43',
    marginTop: 8,
  },
  graphContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  chart: {
    borderRadius: 8,
  },
});

export default AnalyticsDashboard;