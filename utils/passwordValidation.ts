export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const getPasswordValidationMessage = (value: string): string => {
  if (value.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/[A-Z]/.test(value)) {
    return 'Password must include at least one uppercase letter';
  }
  if (!/[a-z]/.test(value)) {
    return 'Password must include at least one lowercase letter';
  }
  if (!/\d/.test(value)) {
    return 'Password must include at least one number';
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    return 'Password must include at least one special character';
  }
  return '';
};
