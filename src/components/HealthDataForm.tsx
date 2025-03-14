import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';



interface HealthDataFormProps {
  onSuccess: () => void;
}

const HealthDataForm: React.FC<HealthDataFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    weight: '',
    height: '',
    steps: '',
    sleep_hours: '',
    heart_rate: '',
    blood_pressure: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!user) {
    console.error("User is not logged in.");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    console.log("Submitting form data:", JSON.stringify(formData, null, 2)); // Log formatted form data

    const { data, error } = await supabase
      .from('health_data')
      .insert([
        {
          user_id: user.id,
          date: formData.date,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          steps: formData.steps ? parseInt(formData.steps) : null,
          sleep_hours: formData.sleep_hours ? parseFloat(formData.sleep_hours) : null,
          blood_pressure: formData.blood_pressure || null,
          heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
          notes: formData.notes || null,
        }
      ]);

    console.log("Supabase response data:", data);
    console.log("Supabase response error:", error);
    

    if (error) {
      console.error("Supabase error details:", error);
      throw new Error(error.message || "An unexpected error occurred ram");
    }

    // Reset form after successful submission
    setFormData({
      date: format(new Date(), 'yyyy-MM-dd'),
      weight: '',
      height: '',
      steps: '',
      sleep_hours: '',
      heart_rate: '',
      blood_pressure: '',
      notes: ''
    });
   

    onSuccess();
  } catch (error) {
    console.error("Caught error:", error);
    setError(error instanceof Error ? error.message : "An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Health Data</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              id="weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              placeholder="70.5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Height (cm)
            </label>
            <input
              type="number"
              step="0.1"
              id="height"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              placeholder="175"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="steps" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Steps
            </label>
            <input
              type="number"
              id="steps"
              name="steps"
              value={formData.steps}
              onChange={handleChange}
              required
              placeholder="8000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="sleep_hours" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sleep Hours
            </label>
            <input
              type="number"
              step="0.1"
              id="sleep_hours"
              name="sleep_hours"
              value={formData.sleep_hours}
              onChange={handleChange}
              required
              placeholder="7.5"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="heart_rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Heart Rate (bpm)
            </label>
            <input
              type="number"
              id="heart_rate"
              name="heart_rate"
              value={formData.heart_rate}
              onChange={handleChange}
              placeholder="72"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          
          <div>
            <label htmlFor="blood_pressure" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Blood Pressure
            </label>
            <input
              type="text"
              id="blood_pressure"
              name="blood_pressure"
              value={formData.blood_pressure}
              onChange={handleChange}
              placeholder="120/80"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Any additional notes about your health today..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Saving...' : 'Save Health Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HealthDataForm;