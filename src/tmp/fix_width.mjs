import * as fs from 'fs';

const content = fs.readFileSync('App.tsx', 'utf8');
const replaced = content.replace(
  /className=\{`relative flex items-center \$\{\(isSplitViewMode \|\| isLeftSidebarCollapsed\) \? 'justify-center px-2' : 'px-3 mx-3'\} h-\[46px\] my-1 rounded-xl transition-all duration-300 \$\{/g,
  'className={`relative flex items-center ${(isSplitViewMode || isLeftSidebarCollapsed) ? \'justify-center px-2 mx-3\' : \'px-3 mx-3\'} h-[46px] my-1 rounded-xl transition-all duration-300 ${'
);
fs.writeFileSync('App.tsx', replaced);
console.log('Done');
