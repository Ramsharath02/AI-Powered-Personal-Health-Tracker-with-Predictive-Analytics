import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { HealthData } from '../types';
import HealthDataForm from '../components/HealthDataForm';
import HealthDataTable from '../components/HealthDataTable';
import HealthInsightsCard from '../components/HealthInsightsCard';
import HealthDataChart from '../components/HealthDataChart';
import TrendAnalysisCard from '../components/TrendAnalysisCard';
import { PlusCircle, MinusCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchHealthData = async () => {
      try {
        const { data, error } = await supabase
          .from('health_data')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        if (error) throw error;
        setHealthData(data || []);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, [user, navigate]);

  const handleFormSuccess = async () => {
    setShowForm(false);
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('health_data')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setHealthData(data || []);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Health Dashboard</h1>
            <button
              onClick={toggleForm}
              className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              {showForm ? (
                <>
                  <MinusCircle className="h-5 w-5 mr-2" />
                  Hide Form
                </>
              ) : (
                <>
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Health Data
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {showForm && (
            <div className="mb-6">
              <HealthDataForm onSuccess={handleFormSuccess} />
            </div>
          )}

          {healthData.length > 0 ? (
            <>
              <div className="mb-6">
                <HealthInsightsCard healthData={healthData[0]} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300">
                  <HealthDataChart 
                    healthData={healthData} 
                    metric="weight" 
                    title="Weight Trend (kg)" 
                    color="#4f46e5" 
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300">
                  <HealthDataChart 
                    healthData={healthData} 
                    metric="steps" 
                    title="Daily Steps" 
                    color="#10b981" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300">
                  <HealthDataChart 
                    healthData={healthData} 
                    metric="sleep_hours" 
                    title="Sleep Duration (hours)" 
                    color="#8b5cf6" 
                  />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-colors duration-300">
                  <HealthDataChart 
                    healthData={healthData.filter(data => data.heart_rate)} 
                    metric="heart_rate" 
                    title="Heart Rate (bpm)" 
                    color="#ef4444" 
                  />
                </div>
              </div>

              <div className="mb-6">
                <TrendAnalysisCard healthData={healthData} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Health History</h2>
                <HealthDataTable healthData={healthData} onDelete={handleFormSuccess} />
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No health data available. Start tracking your health by adding your first entry.
              </p>
              {!showForm && (
                <button
                  onClick={toggleForm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Add Health Data
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;