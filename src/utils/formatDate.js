/**
 * Convert any input to a PostgreSQL-friendly date string (YYYY-MM-DD)
 * If input is undefined, use today's date
 * @param {string | number | Date} input
 * @returns {string} formatted date string
 */
function formatDate(input) {
  try {
    const date = input ? new Date(input) : new Date();
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  } catch (e) {
    throw new Error("Invalid date format");
  }
}

module.exports = formatDate;