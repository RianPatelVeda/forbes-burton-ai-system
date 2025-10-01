/**
 * Zoho CRM API Service
 * Handles all interactions with the Zoho CRM API
 * @module services/zohoApi
 */

// Load environment variables
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const ZOHO_REDIRECT_URI = process.env.ZOHO_REDIRECT_URI;
const ZOHO_API_BASE = process.env.ZOHO_API_BASE || 'https://www.zohoapis.com';
const ZOHO_ACCESS_TOKEN = process.env.ZOHO_ACCESS_TOKEN;

/**
 * Fetch leads from Zoho CRM
 * @async
 * @param {Object} options - Query options
 * @param {number} options.page - Page number for pagination (default: 1)
 * @param {number} options.perPage - Results per page (default: 200, max: 200)
 * @param {string} options.sortBy - Field to sort by
 * @param {string} options.sortOrder - Sort order ('asc' or 'desc')
 * @returns {Promise<Object>} Response containing leads data
 * @throws {Error} If the API request fails
 */
export const fetchLeads = async (options = {}) => {
  const {
    page = 1,
    perPage = 200,
    sortBy = 'Modified_Time',
    sortOrder = 'desc'
  } = options;

  try {
    if (!ZOHO_ACCESS_TOKEN) {
      throw new Error('ZOHO_ACCESS_TOKEN is not configured in environment variables');
    }

    const url = new URL(`${ZOHO_API_BASE}/crm/v3/Leads`);
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', perPage);
    url.searchParams.append('sort_by', sortBy);
    url.searchParams.append('sort_order', sortOrder);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Zoho API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leads from Zoho CRM:', error);
    throw error;
  }
};

/**
 * Fetch a single lead by ID from Zoho CRM
 * @async
 * @param {string} leadId - The ID of the lead to fetch
 * @returns {Promise<Object>} Response containing lead data
 * @throws {Error} If the API request fails
 */
export const fetchLeadById = async (leadId) => {
  try {
    if (!ZOHO_ACCESS_TOKEN) {
      throw new Error('ZOHO_ACCESS_TOKEN is not configured in environment variables');
    }

    const url = `${ZOHO_API_BASE}/crm/v3/Leads/${leadId}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Zoho API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching lead ${leadId} from Zoho CRM:`, error);
    throw error;
  }
};

/**
 * Search leads in Zoho CRM
 * @async
 * @param {string} criteria - COQL query criteria
 * @returns {Promise<Object>} Response containing search results
 * @throws {Error} If the API request fails
 */
export const searchLeads = async (criteria) => {
  try {
    if (!ZOHO_ACCESS_TOKEN) {
      throw new Error('ZOHO_ACCESS_TOKEN is not configured in environment variables');
    }

    const url = `${ZOHO_API_BASE}/crm/v3/Leads/search`;

    const response = await fetch(`${url}?criteria=${encodeURIComponent(criteria)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Zoho-oauthtoken ${ZOHO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Zoho API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching leads in Zoho CRM:', error);
    throw error;
  }
};

// Export the API object for backward compatibility
export const zohoApi = {
  fetchLeads,
  fetchLeadById,
  searchLeads
};

export default zohoApi;
