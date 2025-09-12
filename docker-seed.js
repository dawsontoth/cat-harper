import fs from 'fs';

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
    // Use environment variables or defaults for connection details
    const host = process.env.HARPERDB_HOST || 'localhost';
    const port = process.env.HARPERDB_PORT || '9962';
    const username = process.env.HARPERDB_USERNAME || 'admin';
    const password = process.env.HARPERDB_PASSWORD || 'password';

    const response = await fetch(`http://${host}:${port}/cat/`, {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
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
