const mongoose = require('mongoose');

/**
 * Validate if string is a valid MongoDB ObjectId
 */
exports.isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate ObjectId and return error response if invalid
 */
exports.validateObjectId = (id, fieldName = 'ID') => {
  if (!this.isValidObjectId(id)) {
    return {
      error: true,
      status: 400,
      message: `Invalid ${fieldName} format`,
      field: fieldName,
      code: 'INVALID_ID_FORMAT'
    };
  }
  return { error: false };
};

/**
 * Validate required fields
 */
exports.validateRequired = (data, fields) => {
  const missing = fields.filter(field => !data[field]);
  
  if (missing.length > 0) {
    return {
      error: true,
      status: 400,
      message: `${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} required`,
      missingFields: missing,
      code: 'MISSING_REQUIRED_FIELDS'
    };
  }
  
  return { error: false };
};

/**
 * Handle Mongoose validation errors
 */
exports.handleValidationError = (err) => {
  if (err.name === 'ValidationError') {
    const errors = Object.entries(err.errors).map(([field, error]) => ({
      field,
      message: error.message,
      value: error.value
    }));

    return {
      status: 400,
      message: Object.values(err.errors).map(e => e.message).join(', '),
      errors,
      code: 'VALIDATION_ERROR'
    };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return {
      status: 409,
      message: `${field} already exists`,
      field,
      duplicate: err.keyValue[field],
      code: 'DUPLICATE_ENTRY'
    };
  }

  return null;
};

/**
 * Send validation error response directly
 */
exports.sendValidationError = (res, validation) => {
  if (validation.error) {
    return res.status(validation.status).json({
      ok: false,
      message: validation.message,
      code: validation.code || 'VALIDATION_ERROR',
      ...(validation.field && { field: validation.field }),
      ...(validation.missingFields && { missingFields: validation.missingFields })
    });
  }
  return null;
};

/**
 * Send error response
 */
exports.sendError = (res, status, message, code = 'ERROR') => {
  return res.status(status).json({
    ok: false,
    message,
    code
  });
};
