const fs = require('fs').promises;

/**
 * 
 * @param {string} destination 
 * @param {object} content 
 * @returns {void} 
 */
const writeToFile = async (destination, content) => {
  try {
    await fs.writeFile(destination, JSON.stringify(content, null, 4));
    console.info(`\nData written to ${destination}`);
  } catch (err) {
    console.error(err);
  }
};

/**
 * 
 * @param {object} content 
 * @param {string} file 
 * @returns {void} 
 */
const readAndAppend = async (content, file) => {
  try {
    const data = await fs.readFile(file, 'utf8');
    const parsedData = JSON.parse(data);
    parsedData.push(content);
    await writeToFile(file, parsedData);
  } catch (err) {
    console.error(err);
  }
};

module.exports = { writeToFile, readAndAppend };