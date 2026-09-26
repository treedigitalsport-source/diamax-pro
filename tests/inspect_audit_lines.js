const fs = require('fs');
const auditCode = fs.readFileSync('tests/forensic_audit_all_devices_and_buttons.js', 'utf8');

const lines = auditCode.split('\n');
console.log(lines.slice(25, 80).join('\n'));
