import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Save, Shield, Clock, Activity, FileText, Camera, Mail, Key, LogOut } from 'lucide-react';
import { useRef } from 'react';


interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  bio?: string;
  location?: string;
  phone?: string;
  height?: string;
  weight?: string;
  birthdate?: string;
  gender?: string;
  fitness_goal?: string;
  created_at: string;
  updated_at?: string;
}

const Profile: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    avatar_url: '',
    bio: '',
    location: '',
    phone: '',
    height: '',
    weight: '',
    birthdate: '',
    gender: '',
    fitness_goal: 'maintain'
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
  
        if (error && error.code !== "PGRST116") throw error;
  
        if (data) {
          setProfile(data);
          setFormData({
            full_name: data.full_name || '',
            avatar_url: data.avatar_url || '',
            bio: data.bio || '',
            location: data.location || '',
            phone: data.phone || '',
            height: data.height || '',
            weight: data.weight || '',
            birthdate: data.birthdate || '',
            gender: data.gender || '',
            fitness_goal: data.fitness_goal || 'maintain'
          });
        } else {
          const newProfile: UserProfile = {
            id: user.id,
            email: user.email || "",
            full_name: '',
            avatar_url: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
  
          const { error: insertError } = await supabase.from("profiles").insert([newProfile]);
  
          if (insertError) throw insertError;
  
          setProfile(newProfile);
        }
      } catch (error) {
        if (error instanceof Error) setError(error.message);
        else setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleAvatarClick = () => {
    if (avatarInputRef.current) {
      avatarInputRef.current.click();
    }
  };
  
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;
  
    setUpdating(true);
    setError(null);
    setSuccess(null);
  
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`; // Unique filename
      const filePath = `avatars/${fileName}`;
  
      // Upload image to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
  
      if (uploadError) throw uploadError;
  
      if (!data) throw new Error("Failed to upload image.");
  
      // ✅ Get the public URL from Supabase
      const { data: publicURLData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const avatarURL = publicURLData.publicUrl;
  
      // ✅ Update user's profile with the new avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarURL })
        .eq('id', user.id);
  
      if (updateError) throw updateError;
  
      // ✅ Update state so the image appears in UI
      setFormData((prev) => ({ ...prev, avatar_url: avatarURL }));
  
      setSuccess("Avatar updated successfully!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setUpdating(false);
    }
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          phone: formData.phone,
          height: formData.height,
          weight: formData.weight,
          birthdate: formData.birthdate,
          gender: formData.gender,
          fitness_goal: formData.fitness_goal,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setSuccess('Profile updated successfully');
      
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          ...formData,
          updated_at: new Date().toISOString()
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {updating ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        );
      
      case 'health':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Height (cm)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="175"
                />
              </div>
              
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="70"
                />
              </div>

              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="fitness_goal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fitness Goal
                </label>
                <select
                  id="fitness_goal"
                  name="fitness_goal"
                  value={formData.fitness_goal}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="lose">Lose weight</option>
                  <option value="maintain">Maintain weight</option>
                  <option value="gain">Gain weight</option>
                  <option value="muscle">Build muscle</option>
                  <option value="endurance">Improve endurance</option>
                  <option value="flexibility">Improve flexibility</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updating}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Save className="h-4 w-4 mr-2" />
                {updating ? 'Saving...' : 'Save Health Info'}
              </button>
            </div>
          </form>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-md">
              <p className="text-yellow-800 dark:text-yellow-200">
                Password changes and security settings are managed through Supabase Auth.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Key className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Change your password to keep your account secure.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Change Password
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Email Address
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Your current email: <span className="font-medium">{user?.email}</span>
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Change Email
                </button>
              </div>
              
              <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                  Account Security
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Manage your account security settings.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="notifications"
                        name="notifications"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="notifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                        Email notifications for login attempts
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'data':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Data Export
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Download all your health data in CSV or JSON format.
              </p>
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Export as CSV
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Export as JSON
                </button>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                Data Retention
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Control how long we keep your health data.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="retention-indefinite"
                    name="retention"
                    type="radio"
                    defaultChecked
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="retention-indefinite" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Keep data indefinitely
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="retention-year"
                    name="retention"
                    type="radio"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="retention-year" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Keep data for 1 year
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="retention-month"
                    name="retention"
                    type="radio"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <label htmlFor="retention-month" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Keep data for 3 months
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
              <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">Danger Zone</h3>
              <p className="text-red-600 dark:text-red-300 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Delete Account
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  {success}
                </div>
              )}
              
              <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
              <div 
  className="h-24 w-24 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 relative group cursor-pointer"
  onClick={handleAvatarClick} // Ensure it's used here
>
    {formData.avatar_url ? (
      <img 
        src={formData.avatar_url} 
        alt={formData.full_name || 'User'} 
        className="h-24 w-24 rounded-full object-cover"
      />
    ) : (
      <User className="h-12 w-12" />
    )}

    {/* Hover Effect for Upload */}
    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
      <Camera className="h-6 w-6 text-white" />
    </div>

    {/* Hidden File Input for Image Upload */}
    <input
      ref={avatarInputRef}
      type="file"
      accept="image/*"
      className="hidden"
      onChange={handleAvatarChange}
    />

                </div>
                <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {profile?.full_name || 'Health Tracker User'}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                  {formData.location && (
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{formData.location}</p>
                  )}
                  <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {formData.fitness_goal === 'lose' && 'Weight Loss'}
                      {formData.fitness_goal === 'maintain' && 'Weight Maintenance'}
                      {formData.fitness_goal === 'gain' && 'Weight Gain'}
                      {formData.fitness_goal === 'muscle' && 'Muscle Building'}
                      {formData.fitness_goal === 'endurance' && 'Endurance Training'}
                      {formData.fitness_goal === 'flexibility' && 'Flexibility'}
                    </span>
                    {formData.gender && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                        {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
                      </span>
                    )}
                    {profile?.created_at && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Member since {new Date(profile.created_at).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-auto mt-4 md:mt-0 hidden md:block">
                  <button
                    onClick={handleSignOut}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </div>
              
              {formData.bio && (
                <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</h3>
                  <p className="text-gray-700 dark:text-gray-300">{formData.bio}</p>
                </div>
              )}
              
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'profile'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <User className="h-5 w-5 inline mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('health')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'health'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Activity className="h-5 w-5 inline mr-2" />
                    Health Info
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'security'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Shield className="h-5 w-5 inline mr-2" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('data')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'data'
                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <FileText className="h-5 w-5 inline mr-2" />
                    Data & Privacy
                  </button>
                </nav>
              </div>
              
              <div className="mt-6">
                {renderTabContent()}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 md:hidden">
                <button
                  onClick={handleSignOut}
                  className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
              Account Activity
            </h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-indigo-500 pl-4 py-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">Account created</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-white">Last login</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date().toLocaleString()} (current session)
                </p>
              </div>
              
              {profile?.updated_at && (
                <div className="border-l-4 border-yellow-500 pl-4 py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">Profile updated</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    {new Date(profile.updated_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;