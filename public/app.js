/**
 * University Research Opportunity Portal - Frontend Client Application
 * Communicates with backend REST API at /api/opportunities
 */

const API_BASE = '/api/opportunities';

// Application State
const state = {
  opportunities: [],
  selectedOpportunity: null,
  deleteTarget: null,
  filters: {
    search: '',
    status: 'all',
    department: 'all'
  }
};

// DOM Elements
const elements = {
  // Stats
  statTotal: document.getElementById('statTotal'),
  statOpen: document.getElementById('statOpen'),
  statClosed: document.getElementById('statClosed'),
  statPositions: document.getElementById('statPositions'),

  // Filters & Controls
  searchInput: document.getElementById('searchInput'),
  statusFilter: document.getElementById('statusFilter'),
  deptFilter: document.getElementById('deptFilter'),
  btnRefresh: document.getElementById('btnRefresh'),
  btnClearFilters: document.getElementById('btnClearFilters'),
  resultsCount: document.getElementById('resultsCount'),

  // List Views
  loadingState: document.getElementById('loadingState'),
  emptyState: document.getElementById('emptyState'),
  opportunitiesGrid: document.getElementById('opportunitiesGrid'),

  // Details Modal
  detailsModal: document.getElementById('detailsModal'),
  btnCloseDetailsModal: document.getElementById('btnCloseDetailsModal'),
  btnCloseDetailsBtn: document.getElementById('btnCloseDetailsBtn'),
  btnEditFromDetails: document.getElementById('btnEditFromDetails'),
  btnToggleStatusFromDetails: document.getElementById('btnToggleStatusFromDetails'),
  detailStatusBadge: document.getElementById('detailStatusBadge'),
  detailTitle: document.getElementById('detailTitle'),
  detailArea: document.getElementById('detailArea'),
  detailDepartment: document.getElementById('detailDepartment'),
  detailFaculty: document.getElementById('detailFaculty'),
  detailPositions: document.getElementById('detailPositions'),
  detailDeadline: document.getElementById('detailDeadline'),
  detailId: document.getElementById('detailId'),
  detailDescription: document.getElementById('detailDescription'),
  detailSkillsTags: document.getElementById('detailSkillsTags'),

  // Form Modal
  formModal: document.getElementById('formModal'),
  btnOpenCreateModal: document.getElementById('btnOpenCreateModal'),
  btnCloseFormModal: document.getElementById('btnCloseFormModal'),
  btnCancelFormModal: document.getElementById('btnCancelFormModal'),
  opportunityForm: document.getElementById('opportunityForm'),
  formModalTitle: document.getElementById('formModalTitle'),
  formModalSubtitle: document.getElementById('formModalSubtitle'),
  formOpportunityId: document.getElementById('formOpportunityId'),
  formAlert: document.getElementById('formAlert'),
  btnSubmitForm: document.getElementById('btnSubmitForm'),

  // Form Fields
  formTitle: document.getElementById('formTitle'),
  formFaculty: document.getElementById('formFaculty'),
  formDepartment: document.getElementById('formDepartment'),
  formArea: document.getElementById('formArea'),
  formPositions: document.getElementById('formPositions'),
  formStatus: document.getElementById('formStatus'),
  formDeadline: document.getElementById('formDeadline'),
  formSkills: document.getElementById('formSkills'),
  formDescription: document.getElementById('formDescription'),

  // Delete Modal
  deleteModal: document.getElementById('deleteModal'),
  btnCloseDeleteModal: document.getElementById('btnCloseDeleteModal'),
  btnCancelDelete: document.getElementById('btnCancelDelete'),
  btnConfirmDelete: document.getElementById('btnConfirmDelete'),
  deleteOpportunityTitle: document.getElementById('deleteOpportunityTitle'),
  deleteOpportunityId: document.getElementById('deleteOpportunityId'),

  // Toasts
  toastContainer: document.getElementById('toastContainer')
};

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info', title = '') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const defaultTitles = {
    success: 'Success',
    error: 'Error',
    info: 'Information'
  };

  const toastTitle = title || defaultTitles[type] || 'Notice';

  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-title">${escapeHtml(toastTitle)}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
    </div>
    <button class="toast-close" type="button" aria-label="Dismiss">&times;</button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => {
    toast.remove();
  });

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// Utility: HTML Escaping
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format Date string
function formatDate(dateStr) {
  if (!dateStr) return '-';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][parseInt(parts[1], 10) - 1];
      const day = parseInt(parts[2], 10);
      return `${month} ${day}, ${year}`;
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

// ==================== API CALLS ====================

// GET /api/opportunities
async function fetchOpportunities() {
  try {
    elements.loadingState.style.display = 'flex';
    elements.opportunitiesGrid.style.display = 'none';
    elements.emptyState.style.display = 'none';

    const response = await fetch(API_BASE);
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `HTTP ${response.status}`);
    }

    state.opportunities = json.data || [];
    populateDepartmentFilter();
    updateStatistics();
    renderOpportunities();
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    showToast(error.message, 'error', 'Failed to load opportunities');
    elements.loadingState.style.display = 'none';
    elements.emptyState.style.display = 'flex';
  }
}

// GET /api/opportunities/:id
async function fetchOpportunityById(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}`);
    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || `HTTP ${response.status}`);
    }

    return json.data;
  } catch (error) {
    showToast(error.message, 'error', 'Error retrieving opportunity');
    throw error;
  }
}

// POST /api/opportunities
async function createOpportunity(data) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    const err = new Error(json.error || `HTTP ${response.status}`);
    err.details = json.details;
    err.status = response.status;
    throw err;
  }

  return json.data;
}

// PUT /api/opportunities/:id
async function updateOpportunity(id, data) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    const err = new Error(json.error || `HTTP ${response.status}`);
    err.details = json.details;
    err.status = response.status;
    throw err;
  }

  return json.data;
}

// DELETE /api/opportunities/:id
async function deleteOpportunity(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    const err = new Error(json.error || `HTTP ${response.status}`);
    err.status = response.status;
    throw err;
  }

  return json.data;
}

// ==================== RENDERING & UI ====================

// Statistics
function updateStatistics() {
  const total = state.opportunities.length;
  const openCount = state.opportunities.filter(o => o.status === 'Open').length;
  const closedCount = total - openCount;
  const positions = state.opportunities.reduce((acc, o) => acc + (parseInt(o.available_positions, 10) || 0), 0);

  elements.statTotal.textContent = total;
  elements.statOpen.textContent = openCount;
  elements.statClosed.textContent = closedCount;
  elements.statPositions.textContent = positions;
}

// Populate department filter dropdown
function populateDepartmentFilter() {
  const departments = Array.from(new Set(state.opportunities.map(o => o.department))).filter(Boolean).sort();
  const currentVal = elements.deptFilter.value;

  elements.deptFilter.innerHTML = '<option value="all">All Departments</option>';
  departments.forEach(dept => {
    const opt = document.createElement('option');
    opt.value = dept;
    opt.textContent = dept;
    elements.deptFilter.appendChild(opt);
  });

  if (departments.includes(currentVal)) {
    elements.deptFilter.value = currentVal;
  }
}

// Render cards
function renderOpportunities() {
  elements.loadingState.style.display = 'none';

  const query = state.filters.search.toLowerCase().trim();
  const statusFilter = state.filters.status;
  const deptFilter = state.filters.department;

  const filtered = state.opportunities.filter(item => {
    // Status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }

    // Department filter
    if (deptFilter !== 'all' && item.department !== deptFilter) {
      return false;
    }

    // Search query matching
    if (query) {
      const matchTitle = item.title && item.title.toLowerCase().includes(query);
      const matchFaculty = item.faculty_name && item.faculty_name.toLowerCase().includes(query);
      const matchArea = item.research_area && item.research_area.toLowerCase().includes(query);
      const matchDept = item.department && item.department.toLowerCase().includes(query);
      const matchSkills = item.required_skills && item.required_skills.toLowerCase().includes(query);
      const matchDesc = item.description && item.description.toLowerCase().includes(query);

      return matchTitle || matchFaculty || matchArea || matchDept || matchSkills || matchDesc;
    }

    return true;
  });

  elements.resultsCount.textContent = `${filtered.length} opportunity${filtered.length === 1 ? '' : 'ies'}`;

  if (filtered.length === 0) {
    elements.opportunitiesGrid.style.display = 'none';
    elements.emptyState.style.display = 'flex';
    return;
  }

  elements.emptyState.style.display = 'none';
  elements.opportunitiesGrid.style.display = 'grid';
  elements.opportunitiesGrid.innerHTML = '';

  filtered.forEach(item => {
    const card = createOpportunityCard(item);
    elements.opportunitiesGrid.appendChild(card);
  });
}

// Build card DOM element
function createOpportunityCard(item) {
  const card = document.createElement('div');
  card.className = 'opp-card';
  card.id = `opp-card-${item.id}`;

  const isOpen = item.status === 'Open';
  const statusBadgeClass = isOpen ? 'badge-open' : 'badge-closed';
  const toggleActionLabel = isOpen ? 'Close Opening' : 'Reopen';

  // Format skills as tags
  const skillsArray = (item.required_skills || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const skillsHtml = skillsArray.slice(0, 4).map(skill =>
    `<span class="skill-pill">${escapeHtml(skill)}</span>`
  ).join('') + (skillsArray.length > 4 ? `<span class="skill-pill">+${skillsArray.length - 4} more</span>` : '');

  card.innerHTML = `
    <div>
      <div class="opp-card-header">
        <span class="opp-area-tag">${escapeHtml(item.research_area)}</span>
        <span class="badge ${statusBadgeClass}">${escapeHtml(item.status)}</span>
      </div>

      <h3 class="opp-title">${escapeHtml(item.title)}</h3>

      <div class="opp-meta-list">
        <div class="opp-meta-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <strong>${escapeHtml(item.faculty_name)}</strong> &bull; ${escapeHtml(item.department)}
        </div>
        <div class="opp-meta-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>Deadline: <strong>${formatDate(item.application_deadline)}</strong></span>
          &bull;
          <span><strong>${item.available_positions}</strong> position${item.available_positions > 1 ? 's' : ''}</span>
        </div>
      </div>

      <p class="opp-description">${escapeHtml(item.description)}</p>

      <div class="opp-skills">
        ${skillsHtml}
      </div>
    </div>

    <div class="opp-card-footer">
      <div class="opp-actions">
        <button class="btn-card-action btn-action-view" data-id="${item.id}" type="button">Details</button>
        <button class="btn-card-action btn-action-edit" data-id="${item.id}" type="button">Edit</button>
        <button class="btn-card-action btn-action-status" data-id="${item.id}" data-status="${item.status}" type="button">${toggleActionLabel}</button>
      </div>
      <div>
        <button class="btn-card-action btn-action-delete" data-id="${item.id}" data-title="${escapeHtml(item.title)}" type="button" title="Delete Opportunity">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </div>
    </div>
  `;

  // Attach card event listeners
  card.querySelector('.btn-action-view').addEventListener('click', () => openDetailsModal(item.id));
  card.querySelector('.btn-action-edit').addEventListener('click', () => openEditModal(item.id));
  card.querySelector('.btn-action-status').addEventListener('click', () => toggleOpportunityStatus(item.id, item.status));
  card.querySelector('.btn-action-delete').addEventListener('click', () => openDeleteModal(item.id, item.title));

  return card;
}

// ==================== MODAL CONTROLS ====================

// Details Modal
async function openDetailsModal(id) {
  try {
    const opp = await fetchOpportunityById(id);
    state.selectedOpportunity = opp;

    elements.detailId.textContent = `#${opp.id}`;
    elements.detailTitle.textContent = opp.title;
    elements.detailArea.textContent = opp.research_area;
    elements.detailDepartment.textContent = opp.department;
    elements.detailFaculty.textContent = opp.faculty_name;
    elements.detailPositions.textContent = `${opp.available_positions} Available`;
    elements.detailDeadline.textContent = formatDate(opp.application_deadline);
    elements.detailDescription.textContent = opp.description;

    const isOpen = opp.status === 'Open';
    elements.detailStatusBadge.className = `badge ${isOpen ? 'badge-open' : 'badge-closed'}`;
    elements.detailStatusBadge.textContent = opp.status;

    elements.btnToggleStatusFromDetails.textContent = isOpen ? 'Change to Closed' : 'Change to Open';

    // Skills
    const skills = (opp.required_skills || '').split(',').map(s => s.trim()).filter(Boolean);
    elements.detailSkillsTags.innerHTML = skills.map(skill => `<span class="skill-pill">${escapeHtml(skill)}</span>`).join('');

    elements.detailsModal.classList.add('active');
    elements.detailsModal.setAttribute('aria-hidden', 'false');
  } catch (error) {
    // Toast already shown
  }
}

function closeDetailsModal() {
  elements.detailsModal.classList.remove('active');
  elements.detailsModal.setAttribute('aria-hidden', 'true');
  state.selectedOpportunity = null;
}

// Form Modal (Create or Edit)
function openCreateModal() {
  elements.opportunityForm.reset();
  elements.formOpportunityId.value = '';
  elements.formModalTitle.textContent = 'Post New Research Opportunity';
  elements.formModalSubtitle.textContent = 'Fill out the details below to publish an opening for university students.';
  clearFormErrors();
  elements.formStatus.value = 'Open';
  elements.formModal.classList.add('active');
  elements.formModal.setAttribute('aria-hidden', 'false');
  elements.formTitle.focus();
}

async function openEditModal(id) {
  try {
    const opp = await fetchOpportunityById(id);
    clearFormErrors();

    elements.formOpportunityId.value = opp.id;
    elements.formModalTitle.textContent = `Edit Research Opportunity #${opp.id}`;
    elements.formModalSubtitle.textContent = `Update information for: "${opp.title}"`;

    elements.formTitle.value = opp.title || '';
    elements.formFaculty.value = opp.faculty_name || '';
    elements.formDepartment.value = opp.department || '';
    elements.formArea.value = opp.research_area || '';
    elements.formPositions.value = opp.available_positions || '';
    elements.formStatus.value = opp.status || 'Open';
    elements.formDeadline.value = opp.application_deadline || '';
    elements.formSkills.value = opp.required_skills || '';
    elements.formDescription.value = opp.description || '';

    // If details modal was open, close it
    closeDetailsModal();

    elements.formModal.classList.add('active');
    elements.formModal.setAttribute('aria-hidden', 'false');
    elements.formTitle.focus();
  } catch (error) {
    // Error already handled
  }
}

function closeFormModal() {
  elements.formModal.classList.remove('active');
  elements.formModal.setAttribute('aria-hidden', 'true');
  elements.opportunityForm.reset();
  clearFormErrors();
}

function clearFormErrors() {
  elements.formAlert.style.display = 'none';
  elements.formAlert.textContent = '';
  const errorSpans = elements.opportunityForm.querySelectorAll('.field-error');
  errorSpans.forEach(el => el.textContent = '');
  const invalidInputs = elements.opportunityForm.querySelectorAll('.is-invalid');
  invalidInputs.forEach(el => el.classList.remove('is-invalid'));
}

// Client-side Form Validation
function validateForm() {
  clearFormErrors();
  let isValid = true;

  const title = elements.formTitle.value.trim();
  const faculty = elements.formFaculty.value.trim();
  const dept = elements.formDepartment.value.trim();
  const area = elements.formArea.value.trim();
  const positions = parseInt(elements.formPositions.value, 10);
  const deadline = elements.formDeadline.value.trim();
  const skills = elements.formSkills.value.trim();
  const desc = elements.formDescription.value.trim();

  if (!title) {
    document.getElementById('errTitle').textContent = 'Title is required.';
    elements.formTitle.classList.add('is-invalid');
    isValid = false;
  }

  if (!faculty) {
    document.getElementById('errFaculty').textContent = 'Faculty member name is required.';
    elements.formFaculty.classList.add('is-invalid');
    isValid = false;
  }

  if (!dept) {
    document.getElementById('errDepartment').textContent = 'Please select a department.';
    elements.formDepartment.classList.add('is-invalid');
    isValid = false;
  }

  if (!area) {
    document.getElementById('errArea').textContent = 'Research area is required.';
    elements.formArea.classList.add('is-invalid');
    isValid = false;
  }

  if (isNaN(positions) || positions <= 0) {
    document.getElementById('errPositions').textContent = 'Must be at least 1 position.';
    elements.formPositions.classList.add('is-invalid');
    isValid = false;
  }

  if (!deadline) {
    document.getElementById('errDeadline').textContent = 'Deadline date is required.';
    elements.formDeadline.classList.add('is-invalid');
    isValid = false;
  }

  if (!skills) {
    document.getElementById('errSkills').textContent = 'Please enter required skills.';
    elements.formSkills.classList.add('is-invalid');
    isValid = false;
  }

  if (!desc) {
    document.getElementById('errDescription').textContent = 'Description is required.';
    elements.formDescription.classList.add('is-invalid');
    isValid = false;
  }

  return isValid;
}

// Form Submit Handler (Create / Update)
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) {
    elements.formAlert.style.display = 'block';
    elements.formAlert.textContent = 'Please correct the highlighted errors before submitting.';
    return;
  }

  const id = elements.formOpportunityId.value;
  const isEditing = Boolean(id);

  const payload = {
    title: elements.formTitle.value.trim(),
    faculty_name: elements.formFaculty.value.trim(),
    department: elements.formDepartment.value.trim(),
    research_area: elements.formArea.value.trim(),
    available_positions: parseInt(elements.formPositions.value, 10),
    status: elements.formStatus.value,
    application_deadline: elements.formDeadline.value.trim(),
    required_skills: elements.formSkills.value.trim(),
    description: elements.formDescription.value.trim()
  };

  const btnText = elements.btnSubmitForm.querySelector('.btn-text');
  const btnSpinner = elements.btnSubmitForm.querySelector('.btn-spinner');
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  elements.btnSubmitForm.disabled = true;

  try {
    if (isEditing) {
      await updateOpportunity(id, payload);
      showToast(`Updated opportunity "${payload.title}"`, 'success', 'Opportunity Updated');
    } else {
      await createOpportunity(payload);
      showToast(`Published new opportunity "${payload.title}"`, 'success', 'Opportunity Created');
    }

    closeFormModal();
    await fetchOpportunities();
  } catch (error) {
    console.error('Submission error:', error);
    elements.formAlert.style.display = 'block';
    if (error.details && Array.isArray(error.details)) {
      elements.formAlert.innerHTML = `<strong>Validation Error:</strong><br>${error.details.join('<br>')}`;
    } else {
      elements.formAlert.textContent = error.message || 'An error occurred while saving.';
    }
    showToast(error.message, 'error', 'Save Failed');
  } finally {
    btnText.style.display = 'inline-block';
    btnSpinner.style.display = 'none';
    elements.btnSubmitForm.disabled = false;
  }
}

// Status Toggle Handler (Quick Open <-> Closed)
async function toggleOpportunityStatus(id, currentStatus) {
  const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';
  try {
    await updateOpportunity(id, { status: newStatus });
    showToast(`Status changed to "${newStatus}"`, 'success', 'Status Updated');
    await fetchOpportunities();

    // If modal is open for this item, update it
    if (state.selectedOpportunity && state.selectedOpportunity.id == id) {
      openDetailsModal(id);
    }
  } catch (error) {
    showToast(`Failed to update status: ${error.message}`, 'error');
  }
}

// Delete Modal
function openDeleteModal(id, title) {
  state.deleteTarget = { id, title };
  elements.deleteOpportunityTitle.textContent = title;
  elements.deleteOpportunityId.textContent = `Opportunity ID: #${id}`;
  elements.deleteModal.classList.add('active');
  elements.deleteModal.setAttribute('aria-hidden', 'false');
}

function closeDeleteModal() {
  elements.deleteModal.classList.remove('active');
  elements.deleteModal.setAttribute('aria-hidden', 'true');
  state.deleteTarget = null;
}

async function handleConfirmDelete() {
  if (!state.deleteTarget) return;

  const { id, title } = state.deleteTarget;
  elements.btnConfirmDelete.disabled = true;
  elements.btnConfirmDelete.textContent = 'Deleting...';

  try {
    await deleteOpportunity(id);
    showToast(`Opportunity #${id} "${title}" deleted successfully.`, 'success', 'Deleted');
    closeDeleteModal();
    closeDetailsModal();
    await fetchOpportunities();
  } catch (error) {
    showToast(`Failed to delete: ${error.message}`, 'error');
  } finally {
    elements.btnConfirmDelete.disabled = false;
    elements.btnConfirmDelete.textContent = 'Delete Opportunity';
  }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Search and filter inputs
  elements.searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    renderOpportunities();
  });

  elements.statusFilter.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    renderOpportunities();
  });

  elements.deptFilter.addEventListener('change', (e) => {
    state.filters.department = e.target.value;
    renderOpportunities();
  });

  elements.btnRefresh.addEventListener('click', () => {
    fetchOpportunities();
    showToast('Refreshed listings from server.', 'info');
  });

  elements.btnClearFilters.addEventListener('click', () => {
    state.filters.search = '';
    state.filters.status = 'all';
    state.filters.department = 'all';
    elements.searchInput.value = '';
    elements.statusFilter.value = 'all';
    elements.deptFilter.value = 'all';
    renderOpportunities();
  });

  // Create Modal Open & Close
  elements.btnOpenCreateModal.addEventListener('click', openCreateModal);
  elements.btnCloseFormModal.addEventListener('click', closeFormModal);
  elements.btnCancelFormModal.addEventListener('click', closeFormModal);

  // Form submission
  elements.opportunityForm.addEventListener('submit', handleFormSubmit);

  // Details Modal Close
  elements.btnCloseDetailsModal.addEventListener('click', closeDetailsModal);
  elements.btnCloseDetailsBtn.addEventListener('click', closeDetailsModal);

  // Actions from Details Modal
  elements.btnEditFromDetails.addEventListener('click', () => {
    if (state.selectedOpportunity) {
      openEditModal(state.selectedOpportunity.id);
    }
  });

  elements.btnToggleStatusFromDetails.addEventListener('click', () => {
    if (state.selectedOpportunity) {
      toggleOpportunityStatus(state.selectedOpportunity.id, state.selectedOpportunity.status);
    }
  });

  // Delete Modal
  elements.btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
  elements.btnCancelDelete.addEventListener('click', closeDeleteModal);
  elements.btnConfirmDelete.addEventListener('click', handleConfirmDelete);

  // Close modals on clicking outside or pressing Escape
  window.addEventListener('click', (e) => {
    if (e.target === elements.detailsModal) closeDetailsModal();
    if (e.target === elements.formModal) closeFormModal();
    if (e.target === elements.deleteModal) closeDeleteModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetailsModal();
      closeFormModal();
      closeDeleteModal();
    }
  });
}

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  fetchOpportunities();
});
