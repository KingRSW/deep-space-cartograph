/* 把 lib/three.min.js、OrbitControls、app.js 内联进 index.html → 单文件版（双击即用） */
const fs = require('fs');
const path = require('path');
const dir = __dirname;

let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const inline = [
  ['<script src="./lib/three.min.js"></script>', 'lib/three.min.js'],
  ['<script src="./lib/OrbitControls.umd.js"></script>', 'lib/OrbitControls.umd.js'],
  ['<script src="./app.js"></script>', 'app.js'],
];
for (const [tag, file] of inline) {
  const code = fs.readFileSync(path.join(dir, file), 'utf8');
  if (code.includes('</script>')) throw new Error(`${file} 含 </script>，不能内联`);
  html = html.split(tag).join(`<script>\n${code}\n</script>`);
}
if (html.includes('src="./lib/') || html.includes('src="./app.js"')) {
  throw new Error('仍有未内联的 script 标签');
}
/* 贴图内联为 data URI（单文件离线可用） */
const TEX = {
  'lib/tex/day.jpg': 'image/jpeg',
  'lib/tex/night.jpg': 'image/jpeg',
  'lib/tex/clouds.png': 'image/png',
};
for (const [p, mime] of Object.entries(TEX)) {
  const uri = `data:${mime};base64,` + fs.readFileSync(path.join(dir, p)).toString('base64');
  html = html.split(p).join(uri);
}
fs.writeFileSync(path.join(dir, '深空制图仪.html'), html);
console.log('OK', (html.length / 1024 / 1024).toFixed(2) + ' MB');
