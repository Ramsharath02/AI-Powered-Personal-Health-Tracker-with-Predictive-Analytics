import React from 'react';
import { HealthData } from '../types';
import { analyzeHealthTrend } from '../utils/healthCalculations';
import { TrendingUp } from 'lucide-react';

interface TrendAnalysisCardProps {
  healthData: HealthData[];
}

const TrendAnalysisCard: React.FC<TrendAnalysisCardProps> = ({ healthData }) => {
  const analysis = analyzeHealthTrend(healthData);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <TrendingUp className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        Health Trend Analysis
      </h2>
      
      {healthData.length < 2 ? (
        <p className="text-gray-600 dark:text-gray-300">
          Not enough data to analyze trends. Please add more health entries to see your progress over time.
        </p>
      ) : (
        <div className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
          {analysis}
        </div>
      )}
    </div>
  );
};

export default TrendAnalysisCard;