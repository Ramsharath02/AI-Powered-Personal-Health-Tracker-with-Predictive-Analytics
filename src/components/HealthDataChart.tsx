import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Filler, // Import Filler plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { HealthData } from '../types';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../context/ThemeContext';

// Register plugins including Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Register the Filler plugin
);

interface HealthDataChartProps {
  healthData: HealthData[];
  metric: 'weight' | 'steps' | 'sleep_hours' | 'heart_rate';
  title: string;
  color: string;
}

const HealthDataChart: React.FC<HealthDataChartProps> = ({ 
  healthData, 
  metric, 
  title,
  color
}) => {
  const { darkMode } = useTheme();
  
  // Sort data by date
  const sortedData = [...healthData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const labels = sortedData.map(data => format(parseISO(data.date), 'MMM d'));
  const values = sortedData.map(data => data[metric] || 0);
  
  const gridColor = darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        color: textColor,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
      },
      y: {
        grid: {
          color: gridColor,
        },
        ticks: {
          color: textColor,
        },
        beginAtZero: metric !== 'weight',
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
  };
  
  const data = {
    labels,
    datasets: [
      {
        label: title,
        data: values,
        borderColor: color,
        backgroundColor: `${color}33`,
        fill: true, // Uses the Filler plugin
      },
    ],
  };
  
  return (
    <div className="h-64">
      <Line options={options} data={data} />
    </div>
  );
};

export default HealthDataChart;
