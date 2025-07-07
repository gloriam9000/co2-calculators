const fs = require('fs');
const path = require('path');

console.log('Starting to trim owid-co2-data.json to only 2023 data...');

const inputFile = path.join(__dirname, 'data', 'owid-co2-data.json');
const outputFile = path.join(__dirname, 'data', 'owid-co2-data-2023.json');
const backupFile = path.join(__dirname, 'data', 'owid-co2-data-backup.json');

try {
  // First, let's create a backup of the original file
  console.log('Creating backup of original file...');
  fs.copyFileSync(inputFile, backupFile);
  console.log('Backup created at:', backupFile);

  // Read the large JSON file
  console.log('Reading original data file...');
  const rawData = fs.readFileSync(inputFile, 'utf8');
  
  console.log('Parsing JSON data...');
  const data = JSON.parse(rawData);
  
  console.log('Original data keys:', Object.keys(data).length);
  
  // Filter data to keep only 2023 entries for each country
  const filtered2023Data = {};
  
  let totalEntries = 0;
  let filtered2023Entries = 0;
  
  for (const [country, countryData] of Object.entries(data)) {
    if (Array.isArray(countryData)) {
      totalEntries += countryData.length;
      
      // Find the 2023 entry for this country
      const entry2023 = countryData.find(entry => entry.year === 2023);
      
      if (entry2023) {
        filtered2023Data[country] = [entry2023];
        filtered2023Entries++;
      } else {
        // If no 2023 data, try to find the most recent data
        const sortedByYear = countryData.sort((a, b) => b.year - a.year);
        if (sortedByYear.length > 0) {
          console.log(`No 2023 data for ${country}, using most recent: ${sortedByYear[0].year}`);
          filtered2023Data[country] = [sortedByYear[0]];
          filtered2023Entries++;
        }
      }
    } else {
      // If it's not an array, keep it as is (might be metadata)
      filtered2023Data[country] = countryData;
    }
  }
  
  console.log(`Filtered from ${totalEntries} total entries to ${filtered2023Entries} entries (2023 or most recent)`);
  console.log('Countries with data:', Object.keys(filtered2023Data).length);
  
  // Write the filtered data to a new file
  console.log('Writing filtered data to new file...');
  fs.writeFileSync(outputFile, JSON.stringify(filtered2023Data, null, 2));
  
  // Get file sizes for comparison
  const originalSize = fs.statSync(inputFile).size;
  const newSize = fs.statSync(outputFile).size;
  
  console.log(`Original file size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New file size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Size reduction: ${(((originalSize - newSize) / originalSize) * 100).toFixed(1)}%`);
  
  // Replace the original file with the trimmed version
  console.log('Replacing original file with trimmed version...');
  fs.copyFileSync(outputFile, inputFile);
  
  // Clean up the temporary file
  fs.unlinkSync(outputFile);
  
  console.log('✅ Successfully trimmed owid-co2-data.json!');
  console.log('Original file backed up as owid-co2-data-backup.json');
  console.log('The original file now contains only 2023 (or most recent) data for each country.');
  
} catch (error) {
  console.error('❌ Error processing file:', error.message);
  
  // If there was an error and we created a backup, we could restore it
  if (fs.existsSync(backupFile)) {
    console.log('Backup file available at:', backupFile);
    console.log('You can restore the original by running:');
    console.log(`cp "${backupFile}" "${inputFile}"`);
  }
}
