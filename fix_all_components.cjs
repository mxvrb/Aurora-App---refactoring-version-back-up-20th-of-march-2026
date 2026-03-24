const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src/components/ui');

function convertToPascalCase(kebabCase) {
    return kebabCase
        .split('-')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join('');
}

function fixComponentFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if it's a placeholder component
    if (content.includes('Placeholder for') && content.includes('export function ()')) {
        const baseName = path.basename(filePath, '.tsx');
        const componentName = convertToPascalCase(baseName);

        console.log(`Fixing ${baseName} -> ${componentName}`);

        // Create proper component
        const properContent = `"use client";

import * as React from "react";

export function ${componentName}() {
  return (
    <div>
      Placeholder for ${baseName} component
    </div>
  );
}`;

        fs.writeFileSync(filePath, properContent, 'utf8');
        return true;
    }
    return false;
}

// Find all .tsx files
const files = [];
function walkDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (item.endsWith('.tsx')) {
            files.push(fullPath);
        }
    }
}

walkDir(uiDir);

let fixedCount = 0;
for (const file of files) {
    if (fixComponentFile(file)) {
        fixedCount++;
    }
}

console.log(`Fixed ${fixedCount} component files.`);