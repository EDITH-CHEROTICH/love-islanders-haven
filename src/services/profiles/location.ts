
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Updates the user's current location in their profile using the edge function
 */
export const updateUserLocation = async (location: UserLocation): Promise<boolean> => {
  try {
    console.log('Updating location for user:', location);
    
    // Call the location-services edge function
    const { data, error } = await supabase.functions.invoke("location-services", {
      body: {
        action: "update",
        location
      }
    });

    if (error) {
      console.error('Error calling location-services function:', error);
      return false;
    }

    if (!data.success) {
      console.error('Error from location-services function:', data.error);
      return false;
    }

    console.log('Location updated successfully via edge function');
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
    console.log('Got location, updating via edge function:', location);
    
    // Update location using edge function
    const success = await updateUserLocation(location);
    
    if (success) {
      console.log('Location updated successfully');
      toast.success('Your location has been updated successfully');
      return true;
    } else {
      console.error('Failed to update location');
      toast.error('Failed to update your location');
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
