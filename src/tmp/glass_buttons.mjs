import * as fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// Replace dark:bg-[#2C2C2E] with dark:bg-white/10 dark:border-white/5
const target1 = "dark:bg-[#2C2C2E]";
const replace1 = "dark:bg-white/10 dark:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border dark:border-white/5";

const target2 = "dark:hover:bg-[#2C2C2E]/50";
const replace2 = "dark:hover:bg-white/5";

if (content.includes(target1) || content.includes(target2)) {
  content = content.split(target1).join(replace1);
  content = content.split(target2).join(replace2);
  fs.writeFileSync('App.tsx', content);
  console.log('Successfully updated App.tsx with glassmorphism buttons in dark mode');
} else {
  console.log('Targets not found');
}
