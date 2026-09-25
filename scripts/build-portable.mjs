import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
const files=['engine','questions','inhabitants','renderer','wiki','audio','app'];
const parts=[];
for(const name of files){
  const code=await readFile(new URL(`src/${name}.js`,root),'utf8');
  const bundled=code.replace(/^import .*;\r?\n/gm,'').replace(/^export /gm,'');
  if(/^import |^export /m.test(bundled))throw new Error(`Unsupported module syntax in ${name}`);
  parts.push(`// ${name}.js\n${bundled}`);
}
let html=await readFile(new URL('index.html',root),'utf8');
const css=await readFile(new URL('style.css',root),'utf8');
html=html.replace('  <link rel="icon" href="./favicon.svg" type="image/svg+xml">','');
html=html.replace('<link rel="stylesheet" href="./style.css">',`<style>\n${css}\n</style>`);
html=html.replace('<script type="module" src="./src/app.js"></script>',`<script>\n'use strict';\n(()=>{\n${parts.join('\n')}\n})();\n</script>`);
await mkdir(new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/reMindMaze.html',root),html);
console.log(`Portable game: ${fileURLToPath(new URL('dist/reMindMaze.html',root))}`);
