
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
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      console.error('User not authenticated');
      return false;
    }

    console.log('Updating location for user:', userId, location);

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

    console.log('Location updated successfully');
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

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'denied') {
        reject(new Error('Location permission is denied. Please enable location services in your browser settings.'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got location:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  });
};

/**
 * Request and update the user's current location
 */
export const requestAndUpdateLocation = async (): Promise<boolean> => {
  try {
    console.log('Requesting user location...');
    // Get current location
    const location = await getCurrentLocation();
    console.log('Got location, updating in database:', location);
    
    // Update location in database
    const success = await updateUserLocation(location);
    
    if (success) {
      console.log('Location updated successfully');
      return true;
    } else {
      console.error('Failed to update location in database');
      return false;
    }
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
    } else if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to update location');
    }
    
    return false;
  }
};
