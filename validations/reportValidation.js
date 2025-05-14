export const validateReportInput = (data) => {
  const errors = [];

  if (!data || typeof data !== "object") {
    throw "No data provided";
  }

  let {
    offense,
    location,
    city,
    borough,
    description,
    suspectDescription,
    date
  } = data;

  // Offense
  if (!offense || typeof offense !== "string" || offense.trim().length === 0) {
    errors.push("Offense is required");
  }
  offense = offense.trim()

  // Location
  if (
    !location ||
    typeof location !== "string" ||
    location.trim().length === 0
  ) {
    errors.push("Location is required");
  }
  location = location.trim()

  // Borough
  if (!borough || typeof borough !== "string" || borough.trim().length === 0) {
    errors.push("Borough is required");
  }
  borough = borough.trim()

  // City
  // if (!city || city.trim().toLowerCase() !== 'new york') {
  //   errors.push('City must be New York');
  // }
  city = 'New York'

  // Description
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    errors.push("Description must be at least 10 characters long");
  }
  description = description.trim()

  // Date
  if (!date || isNaN(Date.parse(date))) {
    errors.push("A valid date is required");
  }

  suspectDescription = suspectDescription.trim();

  if (errors.length > 0) {
    throw errors.join(", ");
  }

  return {
    offense,
    location,
    city,
    borough,
    description,
    suspectDescription,
    date,
  };
};

export default validateReportInput;
