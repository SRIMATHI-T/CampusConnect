export const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
export const isValidName = value => String(value || '').trim().length >= 2 && String(value || '').trim().length <= 100;
export const isValidPassword = value => typeof value === 'string' && value.length >= 8 && value.length <= 128;
