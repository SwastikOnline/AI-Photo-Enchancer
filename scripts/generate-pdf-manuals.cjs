const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Check if required tools are available
function checkDependencies() {
  return new Promise((resolve, reject) => {
    exec('which pandoc', (error, stdout, stderr) => {
      if (error) {
        console.log('Installing pandoc...');
        exec('sudo apt-get update && sudo apt-get install -y pandoc texlive-latex-base texlive-fonts-recommended texlive-latex-extra', (installError) => {
          if (installError) {
            reject('Failed to install pandoc. Please install manually.');
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  });
}

// Generate PDF from markdown
function generatePDF(inputFile, outputFile, title) {
  return new Promise((resolve, reject) => {
    const command = `pandoc "${inputFile}" -o "${outputFile}" --pdf-engine=pdflatex --variable geometry:margin=1in --variable fontsize=11pt --variable documentclass=article --variable title="${title}" --variable author="AI Image Enhancer Pro" --variable date="$(date '+%B %Y')" --table-of-contents --number-sections --highlight-style=github`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error generating PDF: ${error.message}`);
      } else {
        console.log(`✓ Generated: ${outputFile}`);
        resolve();
      }
    });
  });
}

// Create HTML version as fallback
function generateHTML(inputFile, outputFile, title) {
  return new Promise((resolve, reject) => {
    const command = `pandoc "${inputFile}" -o "${outputFile}" --standalone --css=styles.css --variable title="${title}" --table-of-contents --number-sections --highlight-style=github`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error generating HTML: ${error.message}`);
      } else {
        console.log(`✓ Generated: ${outputFile}`);
        resolve();
      }
    });
  });
}

// Create CSS file for HTML styling
function createCSS() {
  const cssContent = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9f9f9;
    }
    
    .container {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 30px;
      margin-bottom: 15px;
    }
    
    h1 {
      border-bottom: 3px solid #3498db;
      padding-bottom: 10px;
      color: #2980b9;
    }
    
    h2 {
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 5px;
    }
    
    code {
      background-color: #f8f9fa;
      padding: 2px 4px;
      border-radius: 3px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }
    
    pre {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
      border-left: 4px solid #3498db;
    }
    
    blockquote {
      border-left: 4px solid #3498db;
      padding-left: 20px;
      margin: 20px 0;
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    
    .toc {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 5px;
      margin-bottom: 30px;
    }
    
    .toc h2 {
      margin-top: 0;
      color: #2980b9;
    }
    
    .toc ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .toc li {
      margin: 5px 0;
    }
    
    .toc a {
      color: #3498db;
      text-decoration: none;
    }
    
    .toc a:hover {
      text-decoration: underline;
    }
    
    @media print {
      body { font-size: 12pt; }
      .container { box-shadow: none; }
    }
  `;
  
  fs.writeFileSync(path.join(__dirname, '../docs/styles.css'), cssContent);
}

// Main function
async function main() {
  try {
    console.log('🚀 Starting PDF generation...');
    
    // Check dependencies
    await checkDependencies();
    
    // Create CSS file
    createCSS();
    
    // Create docs directory if it doesn't exist
    if (!fs.existsSync('docs/pdfs')) {
      fs.mkdirSync('docs/pdfs', { recursive: true });
    }
    
    // Generate PDFs
    const documents = [
      {
        input: 'docs/deployment-guide.md',
        pdfOutput: 'docs/pdfs/AI-Image-Enhancer-Deployment-Guide.pdf',
        htmlOutput: 'docs/pdfs/AI-Image-Enhancer-Deployment-Guide.html',
        title: 'AI Image Enhancer Pro - Deployment Guide'
      },
      {
        input: 'docs/user-manual.md',
        pdfOutput: 'docs/pdfs/AI-Image-Enhancer-User-Manual.pdf',
        htmlOutput: 'docs/pdfs/AI-Image-Enhancer-User-Manual.html',
        title: 'AI Image Enhancer Pro - User Manual'
      }
    ];
    
    // Generate documents
    for (const doc of documents) {
      try {
        await generatePDF(doc.input, doc.pdfOutput, doc.title);
      } catch (error) {
        console.log(`⚠️  PDF generation failed, creating HTML fallback: ${error}`);
        await generateHTML(doc.input, doc.htmlOutput, doc.title);
      }
    }
    
    console.log('✅ Documentation generation complete!');
    console.log('📁 Files available in docs/pdfs/');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
main();