/**
 * Input Validation Middleware for Research Opportunities
 * Validates request parameters and payload, returning 400 Bad Request on failure.
 */

function isValidDateString(str) {
  if (!str || typeof str !== 'string') return false;
  // Match YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(str)) return false;
  const date = new Date(str);
  return !isNaN(date.getTime());
}

// Validate ID parameter
function validateId(req, res, next) {
  const { id } = req.params;
  const numId = parseInt(id, 10);

  if (isNaN(numId) || numId <= 0 || String(numId) !== String(id).trim()) {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID parameter. ID must be a positive integer.'
    });
  }

  req.validatedId = numId;
  next();
}

// Validate Create Opportunity payload
function validateCreateOpportunity(req, res, next) {
  const {
    title,
    description,
    research_area,
    faculty_name,
    department,
    required_skills,
    available_positions,
    application_deadline,
    status
  } = req.body;

  const errors = [];

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('title is required and must be a non-empty string.');
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    errors.push('description is required and must be a non-empty string.');
  }

  if (!research_area || typeof research_area !== 'string' || !research_area.trim()) {
    errors.push('research_area is required and must be a non-empty string.');
  }

  if (!faculty_name || typeof faculty_name !== 'string' || !faculty_name.trim()) {
    errors.push('faculty_name is required and must be a non-empty string.');
  }

  if (!department || typeof department !== 'string' || !department.trim()) {
    errors.push('department is required and must be a non-empty string.');
  }

  if (!required_skills || typeof required_skills !== 'string' || !required_skills.trim()) {
    errors.push('required_skills is required and must be a non-empty string.');
  }

  const positions = parseInt(available_positions, 10);
  if (available_positions === undefined || available_positions === null || isNaN(positions) || positions <= 0) {
    errors.push('available_positions is required and must be a positive integer.');
  }

  if (!application_deadline || !isValidDateString(application_deadline)) {
    errors.push('application_deadline is required and must be in valid YYYY-MM-DD format.');
  }

  if (status !== undefined && status !== null) {
    if (status !== 'Open' && status !== 'Closed') {
      errors.push("status must be either 'Open' or 'Closed'.");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  // Sanitize / normalize data for controller
  req.validatedData = {
    title: title.trim(),
    description: description.trim(),
    research_area: research_area.trim(),
    faculty_name: faculty_name.trim(),
    department: department.trim(),
    required_skills: required_skills.trim(),
    available_positions: positions,
    application_deadline: application_deadline.trim(),
    status: status ? status.trim() : 'Open'
  };

  next();
}

// Validate Update Opportunity payload
function validateUpdateOpportunity(req, res, next) {
  const {
    title,
    description,
    research_area,
    faculty_name,
    department,
    required_skills,
    available_positions,
    application_deadline,
    status
  } = req.body;

  const errors = [];
  const fields = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || !title.trim()) {
      errors.push('title must be a non-empty string.');
    } else {
      fields.title = title.trim();
    }
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || !description.trim()) {
      errors.push('description must be a non-empty string.');
    } else {
      fields.description = description.trim();
    }
  }

  if (research_area !== undefined) {
    if (typeof research_area !== 'string' || !research_area.trim()) {
      errors.push('research_area must be a non-empty string.');
    } else {
      fields.research_area = research_area.trim();
    }
  }

  if (faculty_name !== undefined) {
    if (typeof faculty_name !== 'string' || !faculty_name.trim()) {
      errors.push('faculty_name must be a non-empty string.');
    } else {
      fields.faculty_name = faculty_name.trim();
    }
  }

  if (department !== undefined) {
    if (typeof department !== 'string' || !department.trim()) {
      errors.push('department must be a non-empty string.');
    } else {
      fields.department = department.trim();
    }
  }

  if (required_skills !== undefined) {
    if (typeof required_skills !== 'string' || !required_skills.trim()) {
      errors.push('required_skills must be a non-empty string.');
    } else {
      fields.required_skills = required_skills.trim();
    }
  }

  if (available_positions !== undefined) {
    const positions = parseInt(available_positions, 10);
    if (isNaN(positions) || positions <= 0) {
      errors.push('available_positions must be a positive integer.');
    } else {
      fields.available_positions = positions;
    }
  }

  if (application_deadline !== undefined) {
    if (!isValidDateString(application_deadline)) {
      errors.push('application_deadline must be in valid YYYY-MM-DD format.');
    } else {
      fields.application_deadline = application_deadline.trim();
    }
  }

  if (status !== undefined) {
    if (status !== 'Open' && status !== 'Closed') {
      errors.push("status must be either 'Open' or 'Closed'.");
    } else {
      fields.status = status;
    }
  }

  if (Object.keys(fields).length === 0 && errors.length === 0) {
    errors.push('At least one field must be provided for update.');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors
    });
  }

  req.validatedData = fields;
  next();
}

module.exports = {
  validateId,
  validateCreateOpportunity,
  validateUpdateOpportunity
};
