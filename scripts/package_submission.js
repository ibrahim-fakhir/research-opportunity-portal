/**
 * Submission Package Generator
 * Generates the official assignment submission ZIP archive:
 *   P24_0000_NAME_CLASS.zip
 * conforming to Section 8 of Assignment #01.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config();

const rollNo = (process.env.STUDENT_ROLL_NO || 'P24_0000').replace(/[^a-zA-Z0-9]/g, '_');
const name = (process.env.STUDENT_NAME || 'NAME').replace(/[^a-zA-Z0-9]/g, '_');
const className = (process.env.STUDENT_CLASS || 'CLASS').replace(/[^a-zA-Z0-9]/g, '_');

const zipName = `${rollNo}_${name}_${className}.zip`;
const rootDir = path.resolve(__dirname, '..');
const tempDir = path.join(rootDir, 'temp_submission_build');
const zipPath = path.join(rootDir, zipName);

console.log(`\nCreating submission package: ${zipName}...`);

// Items to include in submission archive
const itemsToInclude = [
  'src',
  'public',
  'database',
  'postman',
  'bruno',
  'scripts',
  'README.md',
  'DEMO_VIDEO_GUIDE.md',
  'package.json',
  '.env.example',
  '.gitignore'
];

try {
  // Clean up any existing temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  fs.mkdirSync(tempDir, { recursive: true });

  // Copy selected files & directories
  for (const item of itemsToInclude) {
    const srcPath = path.join(rootDir, item);
    const destPath = path.join(tempDir, item);

    if (fs.existsSync(srcPath)) {
      const stats = fs.statSync(srcPath);
      if (stats.isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
      console.log(`  + Included: ${item}`);
    }
  }

  // Remove existing zip if any
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  // Use PowerShell Compress-Archive
  const psCommand = `powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipPath}' -Force"`;
  execSync(psCommand, { stdio: 'inherit' });

  // Clean temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  const stats = fs.statSync(zipPath);
  console.log(`\n✓ Submission archive created successfully!`);
  console.log(`  Archive Name: ${zipName}`);
  console.log(`  File Size:    ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`  Location:     ${zipPath}\n`);
} catch (error) {
  console.error('Error creating submission archive:', error);
  process.exit(1);
}
