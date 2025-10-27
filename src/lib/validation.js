/**
 * Comprehensive Input Validation Utilities
 *
 * Provides validation functions for common input types used in E-Bazar
 * All functions return { valid: boolean, error?: string }
 */

// ==================== EMAIL VALIDATION ====================

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return { valid: false, error: 'Email cannot be empty' };
  }

  // RFC 5322 simplified email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (trimmedEmail.length > 254) {
    return { valid: false, error: 'Email address is too long' };
  }

  return { valid: true };
};

// ==================== PASSWORD VALIDATION ====================

export const validatePassword = (password, options = {}) => {
  const {
    minLength = 6,
    maxLength = 128,
    requireUppercase = false,
    requireLowercase = false,
    requireNumbers = false,
    requireSpecialChars = false,
  } = options;

  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { valid: false, error: `Password must be at least ${minLength} characters long` };
  }

  if (password.length > maxLength) {
    return { valid: false, error: `Password must be less than ${maxLength} characters` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumbers && !/\d/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }

  return { valid: true };
};

export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true };
};

// ==================== PHONE NUMBER VALIDATION ====================

export const validatePhoneNumber = (phone, countryCode = 'PK') => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required' };
  }

  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  // Pakistan phone number validation
  if (countryCode === 'PK') {
    // Accepts formats: +92XXXXXXXXXX, 92XXXXXXXXXX, 0XXXXXXXXXX, 03XXXXXXXXX
    const pkRegex = /^(\+92|92|0)?3\d{9}$/;

    if (!pkRegex.test(cleaned)) {
      return { valid: false, error: 'Please enter a valid Pakistani phone number (e.g., 03XX XXXXXXX)' };
    }
  } else {
    // Generic international phone validation (8-15 digits)
    const genericRegex = /^\+?\d{8,15}$/;

    if (!genericRegex.test(cleaned)) {
      return { valid: false, error: 'Please enter a valid phone number' };
    }
  }

  return { valid: true };
};

// ==================== NAME VALIDATION ====================

export const validateName = (name, options = {}) => {
  const {
    minLength = 2,
    maxLength = 100,
    allowSpecialChars = false,
  } = options;

  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { valid: false, error: 'Name cannot be empty' };
  }

  if (trimmedName.length < minLength) {
    return { valid: false, error: `Name must be at least ${minLength} characters` };
  }

  if (trimmedName.length > maxLength) {
    return { valid: false, error: `Name must be less than ${maxLength} characters` };
  }

  if (!allowSpecialChars) {
    // Allow letters, spaces, hyphens, and apostrophes only
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(trimmedName)) {
      return { valid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
  }

  return { valid: true };
};

// ==================== URL VALIDATION ====================

export const validateURL = (url, options = {}) => {
  const { required = false, allowHttp = true } = options;

  if (!url || typeof url !== 'string') {
    if (required) {
      return { valid: false, error: 'URL is required' };
    }
    return { valid: true }; // Optional field
  }

  const trimmedURL = url.trim();

  if (trimmedURL.length === 0) {
    if (required) {
      return { valid: false, error: 'URL cannot be empty' };
    }
    return { valid: true }; // Optional field
  }

  try {
    const urlObj = new URL(trimmedURL);

    if (!allowHttp && urlObj.protocol !== 'https:') {
      return { valid: false, error: 'URL must use HTTPS protocol' };
    }

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { valid: false, error: 'URL must start with http:// or https://' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Please enter a valid URL' };
  }
};

// ==================== TEXT VALIDATION ====================

export const validateText = (text, options = {}) => {
  const {
    minLength = 1,
    maxLength = 1000,
    required = true,
    fieldName = 'Text',
  } = options;

  if (!text || typeof text !== 'string') {
    if (required) {
      return { valid: false, error: `${fieldName} is required` };
    }
    return { valid: true };
  }

  const trimmedText = text.trim();

  if (trimmedText.length === 0 && required) {
    return { valid: false, error: `${fieldName} cannot be empty` };
  }

  if (trimmedText.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (trimmedText.length > maxLength) {
    return { valid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  return { valid: true };
};

// ==================== ADDRESS VALIDATION ====================

export const validateAddress = (address) => {
  return validateText(address, {
    minLength: 10,
    maxLength: 500,
    required: true,
    fieldName: 'Address',
  });
};

// ==================== SHOP NAME VALIDATION ====================

export const validateShopName = (shopName) => {
  if (!shopName || typeof shopName !== 'string') {
    return { valid: false, error: 'Shop name is required' };
  }

  const trimmedName = shopName.trim();

  if (trimmedName.length < 3) {
    return { valid: false, error: 'Shop name must be at least 3 characters' };
  }

  if (trimmedName.length > 100) {
    return { valid: false, error: 'Shop name must be less than 100 characters' };
  }

  // Allow alphanumeric, spaces, and common business characters
  const shopNameRegex = /^[a-zA-Z0-9\s\-'&.]+$/;
  if (!shopNameRegex.test(trimmedName)) {
    return { valid: false, error: 'Shop name contains invalid characters' };
  }

  return { valid: true };
};

// ==================== FILE VALIDATION ====================

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    fieldName = 'File',
  } = options;

  if (!file) {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return { valid: false, error: `${fieldName} must be less than ${maxSizeMB}MB` };
  }

  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    return { valid: false, error: `${fieldName} must be one of: ${allowedExtensions}` };
  }

  return { valid: true };
};

export const validateImage = (file) => {
  return validateFile(file, {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'],
    fieldName: 'Image',
  });
};

export const validateVideo = (file) => {
  return validateFile(file, {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg'],
    fieldName: 'Video',
  });
};

// ==================== BATCH VALIDATION ====================

/**
 * Validate multiple fields at once
 * @param {Object} validations - Object with field names as keys and validation results as values
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export const validateBatch = (validations) => {
  const errors = {};
  let valid = true;

  for (const [field, result] of Object.entries(validations)) {
    if (!result.valid) {
      errors[field] = result.error;
      valid = false;
    }
  }

  return { valid, errors };
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Sanitize text input by removing dangerous characters
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
};

/**
 * Normalize phone number to standard format
 */
export const normalizePhoneNumber = (phone, countryCode = 'PK') => {
  if (!phone) return '';

  const cleaned = phone.replace(/[\s\-\(\)]/g, '');

  if (countryCode === 'PK') {
    // Convert to +92 format
    if (cleaned.startsWith('+92')) return cleaned;
    if (cleaned.startsWith('92')) return '+' + cleaned;
    if (cleaned.startsWith('0')) return '+92' + cleaned.substring(1);
    return '+92' + cleaned;
  }

  return cleaned;
};
