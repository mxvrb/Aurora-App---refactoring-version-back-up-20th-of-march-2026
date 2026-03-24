import * as fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// Replace dark:bg-[#2C2C2E] with dark:bg-[#1A2B4C]
content = content.replace(/dark:bg-\[#2C2C2E\]/g, 'dark:bg-[#1A2B4C]');
// Replace dark:hover:bg-[#2C2C2E]/50 with dark:hover:bg-[#1A2B4C]/50
content = content.replace(/dark:hover:bg-\[#2C2C2E\]\/50/g, 'dark:hover:bg-[#1A2B4C]/50');

fs.writeFileSync('App.tsx', content);
console.log('Successfully updated dark mode colors.');
