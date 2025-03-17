
import { Json } from "@/integrations/supabase/types";

// Helper function to safely merge settings with defaults
export const safelyMergeSettings = <T>(defaults: T, data: Json | null): T => {
  if (!data) return { ...defaults };
  
  // Convert Json to object we can work with
  const dataObj = typeof data === 'object' ? data : {};
  return { ...defaults, ...dataObj as Partial<T> };
};
