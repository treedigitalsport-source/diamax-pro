const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf('id="modal-nuevo-juego"');
const endIdx = html.indexOf('</div>\n</div>\n\n<script', idx);
console.log(html.substring(idx, idx + 4000));
