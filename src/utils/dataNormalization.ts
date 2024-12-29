interface NormalizedContact {
  fullName: string;
  firstName: string;
  lastName: string;
}

export const normalizeContactData = (data: any): NormalizedContact => {
  // Try to get full name from various possible field names
  let fullName = data.full_name || data.fullName || data.name || '';
  let firstName = data.first_name || data.firstName || '';
  let lastName = data.last_name || data.lastName || '';

  // If we have first and last name but no full name, construct it
  if (!fullName && (firstName || lastName)) {
    fullName = `${firstName} ${lastName}`.trim();
  }

  // If we have full name but no first/last name, try to split it
  if (fullName && (!firstName || !lastName)) {
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      firstName = firstName || nameParts[0];
      lastName = lastName || nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1) {
      firstName = firstName || nameParts[0];
      lastName = lastName || '';
    }
  }

  return {
    fullName,
    firstName,
    lastName,
  };
};