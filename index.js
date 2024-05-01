const puppeteer = require('puppeteer');
const fs = require('fs');

async function convertSVGsToPDF(svgFiles, outputPDF, pageSize) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set up PDF options with custom page size
    const pdfOptions = {
        path: outputPDF,
        width: pageSize.width,
        height: pageSize.height,
        margin: {
            top: '0px',
            bottom: '0px',
            left: '0px',
            right: '0px'
        }
    };

    // Accumulate content of each SVG
    let pdfContent = '';
    for (const svgFile of svgFiles) {
        const svgContent = fs.readFileSync(svgFile, 'utf8');
        pdfContent += `<div style="page-break-before: always;">${svgContent}</div>`;
    }

    // Generate PDF with accumulated SVG content
    await page.setContent(pdfContent, { waitUntil: 'networkidle0' });
    await page.pdf(pdfOptions);

    await browser.close();
}

// Usage
const svgFiles = ['file1.svg', 'file2.svg']; // Array of SVG file paths
const outputPDF = 'output.pdf'; // Output PDF file path
const customPageSize = { width: '700px', height: '500px' }; // Custom page size in pixels

convertSVGsToPDF(svgFiles, outputPDF,customPageSize)
    .then(() => console.log('Conversion completed.'))
    .catch(error => console.error('Error during conversion:', error));
