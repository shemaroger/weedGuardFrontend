import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
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
          'Authorization': `Bearer ${token}`,
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
      Alert.alert('Error', 'Failed to load analytics data');
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
        </View>

        {/* Recent Activity */}
        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {analytics?.recent_activity && analytics.recent_activity.length > 0 ? (
            analytics.recent_activity.map((activity) => (
              <View key={activity.id} style={styles.activityCard}>
                <Text style={styles.activityResult}>{activity.result}</Text>
                <Text style={styles.activityLocation}>
                  {activity.location || 'No location'}
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(activity.timestamp).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No recent activity</Text>
          )}
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    width: '48%',
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
  recentActivityContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
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
  noDataText: {
    color: '#666666',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default AnalyticsDashboard;
