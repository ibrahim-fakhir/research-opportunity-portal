/**
 * Controller for University Research Opportunities
 * Handles all business logic and database queries for CRUD operations.
 */

const { getDb } = require('../config/db');

// Helper to format date strings consistently if needed
function formatOpportunity(row) {
  if (!row) return null;
  // If application_deadline is a Date object (from MySQL), convert to YYYY-MM-DD string
  if (row.application_deadline instanceof Date) {
    row.application_deadline = row.application_deadline.toISOString().split('T')[0];
  }
  return row;
}

// 1. Create a Research Opportunity (POST /api/opportunities)
async function createOpportunity(req, res, next) {
  try {
    const db = await getDb();
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
    } = req.validatedData;

    const sql = `
      INSERT INTO opportunities (
        title, description, research_area, faculty_name,
        department, required_skills, available_positions,
        application_deadline, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      title,
      description,
      research_area,
      faculty_name,
      department,
      required_skills,
      available_positions,
      application_deadline,
      status
    ]);

    const newId = result.insertId;
    const [rows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [newId]);
    const createdItem = formatOpportunity(rows[0]);

    return res.status(201).json({
      success: true,
      message: 'Research opportunity created successfully.',
      data: createdItem
    });
  } catch (error) {
    next(error);
  }
}

// 2. Retrieve All Research Opportunities (GET /api/opportunities)
async function getAllOpportunities(req, res, next) {
  try {
    const db = await getDb();
    const [rows] = await db.query('SELECT * FROM opportunities ORDER BY id DESC');
    const formattedRows = rows.map(formatOpportunity);

    return res.status(200).json({
      success: true,
      count: formattedRows.length,
      data: formattedRows
    });
  } catch (error) {
    next(error);
  }
}

// 3. Retrieve One Research Opportunity (GET /api/opportunities/:id)
async function getOpportunityById(req, res, next) {
  try {
    const db = await getDb();
    const id = req.validatedId;

    const [rows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Research opportunity not found with ID: ${id}`
      });
    }

    const opportunity = formatOpportunity(rows[0]);

    return res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    next(error);
  }
}

// 4. Update a Research Opportunity (PUT /api/opportunities/:id)
async function updateOpportunity(req, res, next) {
  try {
    const db = await getDb();
    const id = req.validatedId;
    const updateData = req.validatedData;

    // Check if opportunity exists
    const [existingRows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Cannot update. Research opportunity not found with ID: ${id}`
      });
    }

    const fields = Object.keys(updateData);
    const values = Object.values(updateData);

    const setClauses = fields.map(field => `${field} = ?`).join(', ');
    const sql = `UPDATE opportunities SET ${setClauses} WHERE id = ?`;

    await db.query(sql, [...values, id]);

    // Fetch updated record
    const [updatedRows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    const updatedItem = formatOpportunity(updatedRows[0]);

    return res.status(200).json({
      success: true,
      message: 'Research opportunity updated successfully.',
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
}

// 5. Delete a Research Opportunity (DELETE /api/opportunities/:id)
async function deleteOpportunity(req, res, next) {
  try {
    const db = await getDb();
    const id = req.validatedId;

    // Check if opportunity exists
    const [existingRows] = await db.query('SELECT * FROM opportunities WHERE id = ?', [id]);
    if (!existingRows || existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Cannot delete. Research opportunity not found with ID: ${id}`
      });
    }

    const itemToDelete = formatOpportunity(existingRows[0]);

    await db.query('DELETE FROM opportunities WHERE id = ?', [id]);

    return res.status(200).json({
      success: true,
      message: 'Research opportunity deleted successfully.',
      data: itemToDelete
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
};
