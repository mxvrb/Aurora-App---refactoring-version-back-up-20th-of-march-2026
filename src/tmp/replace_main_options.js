import * as fs from 'fs';

let content = fs.readFileSync('/App.tsx', 'utf8');
content = content.replaceAll('Main Options', 'General');
fs.writeFileSync('/App.tsx', content);

console.log("Replaced 'Main Options' with 'General'");
