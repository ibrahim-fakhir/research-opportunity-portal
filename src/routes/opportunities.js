/**
 * Research Opportunities API Router
 * Endpoints:
 *   POST   /api/opportunities
 *   GET    /api/opportunities
 *   GET    /api/opportunities/:id
 *   PUT    /api/opportunities/:id
 *   DELETE /api/opportunities/:id
 */

const express = require('express');
const router = express.Router();

const {
  validateId,
  validateCreateOpportunity,
  validateUpdateOpportunity
} = require('../middleware/validator');

const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');

// 1. Create a Research Opportunity
router.post('/', validateCreateOpportunity, createOpportunity);

// 2. Retrieve All Research Opportunities
router.get('/', getAllOpportunities);

// 3. Retrieve One Research Opportunity
router.get('/:id', validateId, getOpportunityById);

// 4. Update a Research Opportunity
router.put('/:id', validateId, validateUpdateOpportunity, updateOpportunity);

// 5. Delete a Research Opportunity
router.delete('/:id', validateId, deleteOpportunity);

module.exports = router;
