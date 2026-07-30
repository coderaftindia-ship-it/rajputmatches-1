/** Matches backend UserProfile email + mobile rules for login username. */
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MOBILE_REGEX = /^\+?[1-9]\d{5,14}$/;

export function isValidLoginUsername(value) {
  const trimmed = value.trim();
  return EMAIL_REGEX.test(trimmed) || MOBILE_REGEX.test(trimmed);
}

export function validateLoginUsername(value) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Email or mobile number is required.";
  }

  if (!isValidLoginUsername(trimmed)) {
    return "Enter a valid email or mobile number.";
  }

  return "";
}
