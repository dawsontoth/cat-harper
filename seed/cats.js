import fs from 'fs';
import path from 'path';

seedCats();

async function seedCats() {
  try {
    console.log('Reading cats.csv file...');
    const csvContent = fs.readFileSync('./seed/cats.csv', 'utf8');

    const cats = parseCSV(csvContent);
    console.log(`Found ${cats.length} cats in the CSV file.`);

    console.log('Posting cats to the API...');
    for (const cat of cats) {
      await postCat(cat);
    }

    console.log('All cats have been successfully added!');
  } catch (error) {
    console.error('Error seeding cats:', error.message);
    process.exit(1);
  }
}

async function postCat(cat) {
  try {
    const response = await fetch('http://localhost:9926/cat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cat),
    });

    if (!response.ok) {
      throw new Error(`Failed to post cat ${cat.name}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully added cat: ${cat.name}`);
    return data;
  } catch (error) {
    console.error(`Error posting cat ${cat.name}:`, error.message);
    throw error;
  }
}

function parseCSV(csvContent) {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');

  return lines
    .slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',');
      const cat = {};

      for (let index = 0; index < headers.length; index++) {
        const header = headers[index];
        cat[header] = values[index];
      }

      return cat;
    });
}

