const fs = require('fs');
const path = require('path');

// Function to convert markdown to simple HTML
function markdownToHtml(markdown, title) {
  // Simple markdown to HTML conversion
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^\*\*(.*)\*\*/gm, '<strong>$1</strong>')
    .replace(/^\*(.*)\*/gm, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/```([^`]+)```/gm, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/gm, '<code>$1</code>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
  
  // Wrap with paragraph tags
  html = '<p>' + html + '</p>';
  
  // Fix list items
  html = html.replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
  
  const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
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
            text-align: center;
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
        
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        li {
            margin: 5px 0;
        }
        
        p {
            margin: 15px 0;
            text-align: justify;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 8px;
        }
        
        .header h1 {
            margin: 0;
            color: white;
            border: none;
        }
        
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
        }
        
        .footer {
            text-align: center;
            margin-top: 40px;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            color: #666;
        }
        
        @media print {
            body { 
                font-size: 12pt; 
                background-color: white;
            }
            .container { 
                box-shadow: none; 
                background-color: white;
            }
            .header {
                background: #333 !important;
                color: white !important;
            }
        }
        
        @page {
            margin: 1in;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${title}</h1>
            <p>Professional Documentation</p>
        </div>
        
        ${html}
        
        <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <p>AI Image Enhancer Pro - Professional Image Enhancement Solution</p>
        </div>
    </div>
</body>
</html>
`;
  
  return fullHtml;
}

// Create docs directory if it doesn't exist
function ensureDocsDirectory() {
  if (!fs.existsSync('docs')) {
    fs.mkdirSync('docs', { recursive: true });
  }
  if (!fs.existsSync('docs/html')) {
    fs.mkdirSync('docs/html', { recursive: true });
  }
}

// Main function
function main() {
  try {
    console.log('🚀 Starting HTML documentation generation...');
    
    ensureDocsDirectory();
    
    // Generate HTML documents
    const documents = [
      {
        input: 'docs/deployment-guide.md',
        output: 'docs/html/AI-Image-Enhancer-Deployment-Guide.html',
        title: 'AI Image Enhancer Pro - Deployment Guide'
      },
      {
        input: 'docs/user-manual.md',
        output: 'docs/html/AI-Image-Enhancer-User-Manual.html',
        title: 'AI Image Enhancer Pro - User Manual'
      },
      {
        input: 'docs/hostinger-deployment-guide.md',
        output: 'docs/html/AI-Image-Enhancer-Hostinger-Guide.html',
        title: 'AI Image Enhancer Pro - Hostinger Deployment Guide'
      },
      {
        input: 'docs/HOSTINGER-QUICK-START.md',
        output: 'docs/html/AI-Image-Enhancer-Hostinger-Quick-Start.html',
        title: 'AI Image Enhancer Pro - Hostinger Quick Start'
      }
    ];
    
    // Process each document
    documents.forEach(doc => {
      if (fs.existsSync(doc.input)) {
        console.log(`📄 Processing ${doc.input}...`);
        
        const markdown = fs.readFileSync(doc.input, 'utf8');
        const html = markdownToHtml(markdown, doc.title);
        
        fs.writeFileSync(doc.output, html);
        console.log(`✓ Generated: ${doc.output}`);
      } else {
        console.log(`⚠️  File not found: ${doc.input}`);
      }
    });
    
    console.log('✅ HTML documentation generation complete!');
    console.log('📁 Files available in docs/html/');
    console.log('💡 Tip: Open HTML files in browser and use Print -> Save as PDF for PDF versions');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();