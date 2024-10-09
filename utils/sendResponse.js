/**
 * Utility to send a JSON response with standard format.
 *
 * @param {Object} h - Hapi response toolkit
 * @param {boolean} status - Success status
 * @param {any} data - The response data
 * @param {string} message - Response message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} - Hapi response object
 */
const sendResponse = (h, status, data, message, statusCode) => {
  return h
    .response({
      status,
      data,
      message,
      statusCode,
    })
    .code(statusCode);
};

module.exports = sendResponse;
