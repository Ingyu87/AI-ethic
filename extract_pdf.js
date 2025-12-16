const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

async function extractPdf(filename) {
    console.log(`Reading ${filename}...`);
    try {
        const dataBuffer = fs.readFileSync(filename);
        console.log(`Parsing ${filename}...`);
        const data = await pdf(dataBuffer);
        console.log(`\n\n--- Start of ${filename} ---\n`);
        console.log(data.text.slice(0, 3000));
        const outputPath = filename + '.txt';
        fs.writeFileSync(outputPath, data.text);
        console.log(`Extracted to ${outputPath}`);
    } catch (e) {
        console.error(`Error processing ${filename}:`, e);
    }
}

const files = [
    'ai_ethics.pdf', // Run smaller one first to verify success
    'digital_citizenship.pdf'
];

(async () => {
    for (const file of files) {
        await extractPdf(path.join(__dirname, file));
    }
})();
