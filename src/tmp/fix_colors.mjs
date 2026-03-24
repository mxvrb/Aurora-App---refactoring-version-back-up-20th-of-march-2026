import * as fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

// 1. Revert the sidebar container
content = content.replace('bg-[#f5f5f7] dark:bg-[#060E18]', 'bg-[#f5f5f7] dark:bg-[#131C28]');

// 2. Change buttons selected state
const targetSelected = "bg-white shadow-sm dark:bg-white/10 dark:shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:border dark:border-white/5";
const replaceSelected = "bg-white shadow-sm dark:bg-[#060E18]";
content = content.split(targetSelected).join(replaceSelected);

// 3. Change buttons hover state
const targetHover = "hover:bg-gray-200/50 dark:hover:bg-white/5";
const replaceHover = "hover:bg-gray-200/50 dark:hover:bg-[#060E18]/60";
content = content.split(targetHover).join(replaceHover);

fs.writeFileSync('App.tsx', content);
console.log('Successfully reverted container and updated buttons to 060E18');