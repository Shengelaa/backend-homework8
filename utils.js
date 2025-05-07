const { read } = require("fs");
const fs = require("fs/promises");

const readFileAndParse = async (filePath, isParse) => {
  if (!filePath) return;
  const readData = await fs.readFile(filePath, "utf-8");

  return isParse ? JSON.parse(readData) : readData;
};

const writeFileAndStringify = async (filePath, data, isStringify) => {
  if (!filePath) return;

  const readData = isStringify ? JSON.stringify(data) : data;
  await fs.writeFile(filePath, readData);
  console.log("writed successfully");
};

module.exports = { readFileAndParse, writeFileAndStringify };
