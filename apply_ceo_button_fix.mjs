import fs from 'fs';

const indexPath = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\index.html';
console.log('Reading index.html...');
let html = fs.readFileSync(indexPath, 'utf-8');

// Replace the visible label on the button
const oldBtn = '<span>ENTRAR DIRECTO CON CLAVE CEO (113714)</span>';
const newBtn = '<span>ENTRAR DIRECTO CON CREDENCIAL CEO</span>';

if (html.includes(oldBtn)) {
  html = html.replace(oldBtn, newBtn);
  console.log('Replaced visible CEO key with secure credential label.');
} else {
  // Try regex if exact match failed due to encoding
  html = html.replace(/<span>ENTRAR DIRECTO CON CLAVE CEO \(113714\)<\/span>/g, '<span>ENTRAR DIRECTO CON CREDENCIAL CEO</span>');
  console.log('Replaced with regex.');
}

fs.writeFileSync(indexPath, html, 'utf-8');
console.log('Successfully saved index.html!');
