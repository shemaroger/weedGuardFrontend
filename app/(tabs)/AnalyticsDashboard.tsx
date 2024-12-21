import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LineChart, PieChart } from 'recharts';
import apiClient from '../services/api';
import { useToken } from '../hooks/TokenStorageHook';

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
  location_statistics: Array<{
    location: string;
    count: number;
  }>;
  monthly_trends: Array<{
    month: string;
    count: number;
  }>;
  weekly_trends: Array<{
    week: string;
    count: number;
  }>;
  site_statistics: Array<{
    site_name: string;
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
    try {
      const response = await apiClient.get('analytics/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Overview Cards */}
      <View style={styles.overviewContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Predictions</Text>
          <Text style={styles.cardValue}>{analytics?.overview.total_predictions}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent (30 days)</Text>
          <Text style={styles.cardValue}>{analytics?.overview.recent_predictions}</Text>
        </View>
      </View>

      {/* Monthly Trends Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Monthly Activity</Text>
        <LineChart
          width={350}
          height={200}
          data={analytics?.monthly_trends}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* Chart configuration */}
        </LineChart>
      </View>

      {/* Weed Statistics */}
      <View style={styles.chartContainer}>
        <Text style={styles.sectionTitle}>Weed Detection Results</Text>
        <PieChart width={350} height={200}>
          {/* Pie chart configuration */}
        </PieChart>
      </View>

      {/* Recent Activity */}
      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {analytics?.recent_activity.map((activity) => (
          <View key={activity.id} style={styles.activityCard}>
            <Text style={styles.activityResult}>{activity.result}</Text>
            <Text style={styles.activityLocation}>{activity.location}</Text>
            <Text style={styles.activityDate}>
              {new Date(activity.timestamp).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  overviewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '45%',
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
  chartContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
  recentActivityContainer: {
    padding: 16,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityResult: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#328A43',
  },
  activityLocation: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#999999',
    marginTop: 4,
  },
});

export default AnalyticsDashboard;