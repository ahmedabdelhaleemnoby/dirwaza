import { TrainingApiResponse, TrainingData, TrainingCategory } from '@/types/training';

// Helper function to get API URL
const getApiUrl = () => {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
};

// Training API functions
export const getTrainingData = async (): Promise<TrainingData> => {
  const apiUrl = getApiUrl();
  
  try {
    const response = await fetch(`${apiUrl}/training`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: TrainingApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch training data');
    }

    // Transform API response to match our TrainingData interface
    const transformedData: TrainingData = {
      categories: result.data.map((category: TrainingCategory) => ({
        ...category,
        id: category.category, // Use category field as id for backward compatibility
        icon:`/icons/${category.category}.svg`
      })),
      availableDates: {
        // Combine disabled dates from all categories
        disabledDates: result.data.flatMap(category => 
          category.disabledDates.map(d => d.date)
        ),
        // Use timeSlots from first category (assuming they're the same for all)
        timeSlots: result.data[0]?.timeSlots || {
          weekdays: ['17:00', '18:00', '19:00', '20:00'],
          weekends: ['16:00', '17:00', '18:00', '19:00', '20:00']
        }
      }
    };

    return transformedData;
  } catch (error) {
    console.error('Error fetching training data:', error);
    throw error;
  }
};

// Export other existing functions if any
export * from './actions';
export * from './authActions';
export * from './plantActions';
export * from './restActions';
