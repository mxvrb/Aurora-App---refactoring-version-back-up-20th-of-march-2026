import * as fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

const target1 = "dark:bg-[#2C2C2E]";
const replace1 = "dark:bg-[#1A2B4C]";

const target2 = "dark:hover:bg-[#2C2C2E]/50";
const replace2 = "dark:hover:bg-[#1A2B4C]/50";

if (content.includes(target1) || content.includes(target2)) {
  content = content.split(target1).join(replace1);
  content = content.split(target2).join(replace2);
  fs.writeFileSync('App.tsx', content);
  console.log('Successfully updated App.tsx with dark blue colors');
} else {
  console.log('Targets not found');
}
