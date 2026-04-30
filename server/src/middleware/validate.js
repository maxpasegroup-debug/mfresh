function checkValue(value, rules, field) {
  const errors = [];

  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push({ field, message: `${field} is required` });
    return errors;
  }

  if (value === undefined || value === null || value === '') {
    return errors;
  }

  if (rules.type && typeof value !== rules.type) {
    errors.push({ field, message: `${field} must be ${rules.type}` });
  }

  if (rules.min !== undefined && String(value).length < rules.min) {
    errors.push({ field, message: `${field} must be at least ${rules.min} characters` });
  }

  if (rules.max !== undefined && String(value).length > rules.max) {
    errors.push({ field, message: `${field} must be at most ${rules.max} characters` });
  }

  if (rules.pattern && !rules.pattern.test(String(value))) {
    errors.push({ field, message: `${field} is invalid` });
  }

  if (rules.enum && !rules.enum.includes(value)) {
    errors.push({ field, message: `${field} must be one of ${rules.enum.join(', ')}` });
  }

  return errors;
}

export const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [source, rules] of Object.entries(schema)) {
    for (const [field, fieldRules] of Object.entries(rules)) {
      errors.push(...checkValue(req[source]?.[field], fieldRules, field));
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  return next();
};
