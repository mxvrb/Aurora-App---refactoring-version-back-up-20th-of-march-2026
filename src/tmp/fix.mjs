import * as fs from 'fs';

let content = fs.readFileSync('App.tsx', 'utf8');

const targetStr = "className={`relative flex items-center ${(isSplitViewMode || isLeftSidebarCollapsed) ? 'justify-center px-2' : 'px-3 mx-3'} h-[46px] my-1 rounded-xl transition-all duration-300 ${";
const replacementStr = "className={`relative flex items-center ${(isSplitViewMode || isLeftSidebarCollapsed) ? 'justify-center px-2 mx-3' : 'px-3 mx-3'} h-[46px] my-1 rounded-xl transition-all duration-300 ${";

if (content.includes(targetStr)) {
  content = content.split(targetStr).join(replacementStr);
  fs.writeFileSync('App.tsx', content);
  console.log('Successfully replaced all occurrences.');
} else {
  console.log('Target string not found.');
}
