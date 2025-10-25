// patch-api.mjs
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const requestFile = join(__dirname, 'lib/api/generated/core/request.ts');

let content = readFileSync(requestFile, 'utf8');

// Supprimer l'import de form-data
content = content.replace(
  /import FormData from ['"]form-data['"];?\n/g,
  '// FormData est disponible nativement dans le browser\n'
);

// Corriger base64
content = content.replace(
  /\/\/ @ts-ignore\s+return Buffer\.from\(str\)\.toString\('base64'\);/g,
  '// Fallback\n        return str;'
);

// Corriger getHeaders
content = content.replace(
  /const formHeaders = typeof formData\?\.getHeaders === 'function' && formData\?\.getHeaders\(\) \|\| {}/g,
  'const formHeaders = {}'
);

writeFileSync(requestFile, content, 'utf8');
console.log('✅ API patched!');
