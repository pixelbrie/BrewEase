function sanitizeLetters(value = "") {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function getRandomDigitsFromDob(dateOfBirth) {
  const dobDigits = (dateOfBirth || "").replace(/\D/g, "");

  if (dobDigits.length < 3) {
    throw new Error("Date of birth must contain at least 3 digits");
  }

  let result = "";

  for (let i = 0; i < 3; i += 1) {
    const randomIndex = Math.floor(Math.random() * dobDigits.length);
    result += dobDigits[randomIndex];
  }

  return result;
}

export function buildEmployeeUsername(firstName, lastName, dateOfBirth) {
  const cleanFirst = sanitizeLetters(firstName);
  const cleanLast = sanitizeLetters(lastName);

  if (!cleanFirst || !cleanLast) {
    throw new Error("First name and last name are required");
  }

  const firstInitial = cleanFirst.charAt(0);
  const lastPart = cleanLast.slice(0, 4).padEnd(4, "x");
  const dobPart = getRandomDigitsFromDob(dateOfBirth);

  return `${firstInitial}${lastPart}${dobPart}`;
}
