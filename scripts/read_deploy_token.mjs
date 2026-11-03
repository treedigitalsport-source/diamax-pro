import fs from 'fs';

const script = fs.readFileSync('deploy_hosting_api.mjs', 'utf8');
console.log(script.slice(0, 1000));
