import React from 'react';
import { HealthData, HealthInsight } from '../types';
import { calculateBMI, getBMICategory, getHealthRisk, getRecommendation } from '../utils/healthCalculations';
import { Activity, Heart, Scale, Zap } from 'lucide-react';

interface HealthInsightsCardProps {
  healthData: HealthData;
}

const HealthInsightsCard: React.FC<HealthInsightsCardProps> = ({ healthData }) => {
  const bmi = calculateBMI(healthData.weight, healthData.height);
  const bmiCategory = getBMICategory(bmi);
  const healthRisk = getHealthRisk(bmi);
  const recommendation = getRecommendation(bmi, healthData);

  const getBMIColorClass = (bmiValue: number): string => {
    if (bmiValue < 18.5) return 'text-blue-500';
    if (bmiValue < 25) return 'text-green-500';
    if (bmiValue < 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <Zap className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        AI Health Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <Scale className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">BMI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your BMI is <span className={`font-bold ${getBMIColorClass(bmi)}`}>{bmi.toFixed(1)}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Category: <span className="font-medium">{bmiCategory}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Heart className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Health Risk Assessment</h3>
              <p className="text-gray-600 dark:text-gray-300">{healthRisk}</p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-start">
            <Activity className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-white">Personalized Recommendations</h3>
              <p className="text-gray-600 dark:text-gray-300">{recommendation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthInsightsCard;