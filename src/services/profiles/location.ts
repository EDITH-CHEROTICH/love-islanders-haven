
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Updates the user's current location in their profile
 */
export const updateUserLocation = async (location: UserLocation): Promise<boolean> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;

    if (!userId) {
      console.error('User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        latitude: location.latitude,
        longitude: location.longitude,
        location_updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating location:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating location:', error);
    return false;
  }
};

/**
 * Gets the user's current location using the browser's geolocation API
 */
export const getCurrentLocation = (): Promise<UserLocation> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * Request and update the user's current location
 */
export const requestAndUpdateLocation = async (): Promise<boolean> => {
  try {
    // Get current location
    const location = await getCurrentLocation();
    
    // Update location in database
    const success = await updateUserLocation(location);
    
    if (success) {
      toast.success('Location updated successfully');
    } else {
      toast.error('Failed to update location');
    }
    
    return success;
  } catch (error) {
    console.error('Error requesting and updating location:', error);
    
    if (error instanceof GeolocationPositionError) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Location permission denied. Please enable location services.');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          toast.error('Location request timed out.');
          break;
        default:
          toast.error('An unknown error occurred while getting location.');
      }
    } else {
      toast.error('Failed to update location');
    }
    
    return false;
  }
};
