import { HealthData } from '../types';

export const calculateBMI = (weight: number, height: number): number => {
  // BMI = weight(kg) / (height(m))^2
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obesity Class I';
  if (bmi < 40) return 'Obesity Class II';
  return 'Obesity Class III';
};

export const getHealthRisk = (bmi: number): string => {
  if (bmi < 18.5) return 'Increased risk for various health problems';
  if (bmi < 25) return 'Low risk';
  if (bmi < 30) return 'Increased risk for heart disease, high blood pressure, and type 2 diabetes';
  if (bmi < 35) return 'High risk for heart disease, high blood pressure, and type 2 diabetes';
  if (bmi < 40) return 'Very high risk for heart disease, high blood pressure, and type 2 diabetes';
  return 'Extremely high risk for heart disease, high blood pressure, and type 2 diabetes';
};

export const getRecommendation = (bmi: number, healthData: HealthData): string => {
  const bmiCategory = getBMICategory(bmi);
  const stepsPerDay = healthData.steps;
  const sleepHours = healthData.sleep_hours;
  
  let recommendation = '';
  
  // BMI-based recommendations
  if (bmi < 18.5) {
    recommendation += 'Consider increasing caloric intake with nutrient-dense foods. ';
  } else if (bmi >= 25) {
    recommendation += 'Focus on reducing caloric intake and increasing physical activity. ';
  }
  
  // Steps-based recommendations
  if (stepsPerDay < 5000) {
    recommendation += 'Try to increase your daily steps to at least 7,500 steps. ';
  } else if (stepsPerDay < 7500) {
    recommendation += 'Good job on activity! Aim for 10,000 steps for optimal health benefits. ';
  } else {
    recommendation += 'Excellent activity level! Maintain your current step count. ';
  }
  
  // Sleep-based recommendations
  if (sleepHours < 7) {
    recommendation += 'Aim for 7-9 hours of sleep for better health outcomes. ';
  } else if (sleepHours > 9) {
    recommendation += 'You might be sleeping too much. 7-9 hours is typically recommended. ';
  } else {
    recommendation += 'Your sleep duration is optimal. ';
  }
  
  return recommendation || 'Maintain a balanced diet and regular exercise routine.';
};

export const analyzeHealthTrend = (healthDataHistory: HealthData[]): string => {
  if (healthDataHistory.length < 2) {
    return "Not enough data to analyze trends. Please continue tracking your health metrics.";
  }
  
  // Sort by date
  const sortedData = [...healthDataHistory].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstEntry = sortedData[0];
  const lastEntry = sortedData[sortedData.length - 1];
  
  const weightChange = lastEntry.weight - firstEntry.weight;
  const stepsChange = lastEntry.steps - firstEntry.steps;
  const sleepChange = lastEntry.sleep_hours - firstEntry.sleep_hours;
  
  let analysis = "Based on your health data:\n";
  
  // Weight analysis
  if (Math.abs(weightChange) < 0.5) {
    analysis += "- Your weight has remained stable.\n";
  } else {
    analysis += `- You have ${weightChange > 0 ? 'gained' : 'lost'} ${Math.abs(weightChange).toFixed(1)} kg.\n`;
  }
  
  // Steps analysis
  if (stepsChange > 1000) {
    analysis += "- Your physical activity has increased significantly.\n";
  } else if (stepsChange < -1000) {
    analysis += "- Your physical activity has decreased. Consider being more active.\n";
  } else {
    analysis += "- Your physical activity level has remained consistent.\n";
  }
  
  // Sleep analysis
  if (Math.abs(sleepChange) < 0.5) {
    analysis += "- Your sleep pattern is consistent.\n";
  } else {
    analysis += `- You are sleeping ${sleepChange > 0 ? 'more' : 'less'} than before.\n`;
  }
  
  return analysis;
};