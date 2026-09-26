const fs = require('fs');
const auditCode = fs.readFileSync('tests/forensic_audit_all_devices_and_buttons.js', 'utf8');

const lines = auditCode.split('\n');
lines.forEach((l, i) => {
  if (l.includes('btn-undo')) {
    console.log(`${i + 1}: ${l}`);
  }
});
