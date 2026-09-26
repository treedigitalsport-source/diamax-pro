const fs = require('fs');
const auditCode = fs.readFileSync('tests/forensic_audit_all_devices_and_buttons.js', 'utf8');

console.log(auditCode.substring(0, 3000));
