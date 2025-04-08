
/**
 * Format relationship goal text for display
 */
export const getGoalDisplayText = (goal?: 'long-term' | 'casual' | 'both') => {
  switch (goal) {
    case 'long-term':
      return 'Life-time Partner';
    case 'casual':
      return 'Casual Fun';
    case 'both':
      return 'Open to Both';
    default:
      return 'Not Specified';
  }
};

/**
 * Format gender preference text for display
 */
export const getGenderPreferenceText = (preference?: 'male' | 'female' | 'both') => {
  switch (preference) {
    case 'male':
      return 'men';
    case 'female':
      return 'women';
    case 'both':
      return 'everyone';
    default:
      return 'not specified';
  }
};
