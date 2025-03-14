import React from 'react';
import { HealthData } from '../types';
import { format, parseISO, isValid } from 'date-fns';
import { calculateBMI, getBMICategory } from '../utils/healthCalculations';
import { Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HealthDataTableProps {
  healthData: HealthData[];
  onDelete: () => void;
}

const HealthDataTable: React.FC<HealthDataTableProps> = ({ healthData, onDelete }) => {
  const [loading, setLoading] = React.useState<Record<string, boolean>>({});

  const handleDelete = async (id: string) => {
    setLoading(prev => ({ ...prev, [id]: true }));
    
    try {
      const { error } = await supabase
        .from('health_data')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      onDelete();
    } catch (error) {
      console.error('Error deleting health data:', error);
    } finally {
      setLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  // Sort by date (newest first), ensuring valid dates
  const sortedData = [...healthData].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {['Date', 'Weight (kg)', 'BMI', 'Steps', 'Sleep (hrs)', 'Heart Rate', 'Actions'].map((heading) => (
                <th key={heading} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((data) => {
              const bmi = calculateBMI(data.weight, data.height);
              const bmiCategory = getBMICategory(bmi);
              
              const getBMIColorClass = (bmiValue: number): string => {
                if (bmiValue < 18.5) return 'text-blue-500 dark:text-blue-400';
                if (bmiValue < 25) return 'text-green-500 dark:text-green-400';
                if (bmiValue < 30) return 'text-yellow-500 dark:text-yellow-400';
                return 'text-red-500 dark:text-red-400';
              };
              
              return (
                <tr key={data.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {data.date && isValid(parseISO(data.date)) ? format(parseISO(data.date), 'MMM d, yyyy') : 'No Date'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {data.weight ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getBMIColorClass(bmi)}`}>
                      {bmi.toFixed(1)} ({bmiCategory})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {data.steps ? data.steps.toLocaleString() : '0'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {data.sleep_hours ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {data.heart_rate ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <button
                      onClick={() => handleDelete(data.id)}
                      disabled={loading[data.id]}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                      aria-label="Delete entry"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
            
            {sortedData.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No health data available. Add your first entry above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HealthDataTable;
