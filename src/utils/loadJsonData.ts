import * as fs from "fs";
import * as path from "path";

/**
 * Load test data from a JSON file.
 * @param fileName - Name of the test data file (e.g., 'messages.json').
 * @returns Parsed JSON data from the file.
 */
export function loadJsonData(fileName: string): any {
  const filePath = path.join(__dirname, "..", "..", "tests", "testData", fileName);

  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading json data from ${filePath}:`, error);
    throw new Error("Failed to load test data.");
  }
}
