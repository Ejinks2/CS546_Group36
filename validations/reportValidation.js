export const validateReportInput = (data) => {
    const errors = [];
  
    if (!data || typeof data !== 'object') {
      throw 'No data provided';
    }
  
    const {
      offense,
      location,
      city,
      state,
      description,
      date
    } = data;
  
    // Offense
    if (!offense || typeof offense !== 'string' || offense.trim().length === 0) {
      errors.push('Offense is required');
    }
  
    // Location
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      errors.push('Location is required');
    }
  
    // City
    if (!city || city.trim().toLowerCase() !== 'new york') {
      errors.push('City must be New York');
    }
  
    // State
    if (!state || state.trim().toUpperCase() !== 'NY') {
      errors.push('State must be NY');
    }
  
    // Description
    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }
  
    // Date
    if (!date || isNaN(Date.parse(date))) {
      errors.push('A valid date is required');
    }
  
    if (errors.length > 0) {
      throw errors.join(', ');
    }
  };
  
export default validateReportInput;