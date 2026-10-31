import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';
import zlib from 'zlib';

const KEY_PATH = 'C:\\Users\\fitne\\Downloads\\diamax-pro-f6f16-firebase-adminsdk-fbsvc-a2a2b8b042.json';
const BASE_DIR = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX';

async function getAccessToken() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase.hosting',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  })).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(header + '.' + claim);
  const signature = sign.sign(key.private_key, 'base64url');
  const jwt = header + '.' + claim + '.' + signature;

  const postData = 'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=' + jwt;

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        const data = JSON.parse(body);
        if (data.access_token) resolve(data.access_token);
        else reject(new Error('Failed to get token: ' + body));
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'node_modules' || file === '.git' || file === '.github' || file === '.vscode' || 
        file === 'scratch' || file === 'dist' || file.startsWith('.env') || file.endsWith('.bak') || 
        file.endsWith('.log') || (file.endsWith('.json') && file.includes('adminsdk')) || 
        file === '.firebaserc' || file === '.gitignore' || file === 'firebase.json' ||
        file === 'deploy_hosting_api.mjs') continue;
    const filePath = path.join(dir, file);
    const relPath = path.join(base, file).replace(/\\/g, '/');
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(filePath, relPath));
    } else {
      results.push({ full: filePath, rel: '/' + relPath });
    }
  }
  return results;
}

async function apiRequest(token, urlStr, method = 'GET', data = null) {
  const url = new URL(urlStr);
  return new Promise((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }
    const req = https.request(options, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        try {
          const parsed = body ? JSON.parse(body) : {};
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsed);
          } else {
            reject(new Error(`API Error ${res.statusCode}: ${body}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(body);
          else reject(new Error(`API Error ${res.statusCode}: ${body}`));
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function uploadGzippedBuffer(token, uploadUrl, buffer) {
  const url = new URL(uploadUrl);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length
      }
    }, res => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`Upload failed ${res.statusCode}: ${body}`));
      });
    });
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

async function deployToSite(token, siteId) {
  console.log(`\n========================================`);
  console.log(`DESPLEGANDO A SITIO: ${siteId}`);
  console.log(`URL: https://${siteId}.web.app`);
  console.log(`========================================`);

  // Step 1: Create Version
  console.log('1. Creando nueva version...');
  const versionRes = await apiRequest(token, `https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/versions`, 'POST', {
    config: {
      headers: [{
        glob: '**',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      }],
      rewrites: [{
        glob: '**',
        path: '/index.html'
      }]
    }
  });
  const versionName = versionRes.name;
  console.log('Version creada:', versionName);

  // Step 2: Gzip each file and calculate hash of the gzipped bytes
  console.log('2. Comprimiendo e indexando archivos...');
  const allFiles = getFiles(BASE_DIR);
  const filesMap = {};
  const bufferMap = {};
  for (const f of allFiles) {
    const raw = fs.readFileSync(f.full);
    const gzipped = zlib.gzipSync(raw, { level: 9 });
    const hash = crypto.createHash('sha256').update(gzipped).digest('hex');
    filesMap[f.rel] = hash;
    bufferMap[hash] = gzipped;
  }
  console.log(`Total archivos indexados: ${Object.keys(filesMap).length}`);

  // Step 3: Populate Files
  console.log('3. Notificando a Google de los archivos...');
  const populateRes = await apiRequest(token, `https://firebasehosting.googleapis.com/v1beta1/${versionName}:populateFiles`, 'POST', {
    files: filesMap
  });

  const uploadUrl = populateRes.uploadUrl;
  const requiredHashes = populateRes.uploadRequiredHashes || [];
  console.log(`Archivos que necesitan subida: ${requiredHashes.length} de ${Object.keys(filesMap).length}`);

  // Step 4: Upload missing files in small concurrent batches
  if (requiredHashes.length > 0 && uploadUrl) {
    console.log('4. Subiendo archivos a los servidores de Google...');
    let uploadedCount = 0;
    const batchSize = 10;
    for (let i = 0; i < requiredHashes.length; i += batchSize) {
      const slice = requiredHashes.slice(i, i + batchSize);
      await Promise.all(slice.map(hash => {
        const buf = bufferMap[hash];
        return uploadGzippedBuffer(token, `${uploadUrl}/${hash}`, buf);
      }));
      uploadedCount += slice.length;
      process.stdout.write(`Progreso: ${uploadedCount}/${requiredHashes.length} (${Math.round(uploadedCount/requiredHashes.length*100)}%)\r`);
    }
    console.log('\nSubida completada al 100%.');
  } else {
    console.log('Todos los archivos ya estaban sincronizados en cache de Google.');
  }

  // Step 5: Finalize Version
  console.log('5. Finalizando version...');
  await apiRequest(token, `https://firebasehosting.googleapis.com/v1beta1/${versionName}?update_mask=status`, 'PATCH', {
    status: 'FINALIZED'
  });

  // Step 6: Release Version
  console.log('6. Publicando en el canal live...');
  await apiRequest(token, `https://firebasehosting.googleapis.com/v1beta1/sites/${siteId}/releases?versionName=${encodeURIComponent(versionName)}`, 'POST');

  console.log(`\n>>> DESPLIEGUE EXITOSO EN: https://${siteId}.web.app <<<`);
}

async function main() {
  try {
    const token = await getAccessToken();
    console.log('Token de Google obtenido con exito.');
    
    // Deploy to diamaxpro (clean domain, 1 web, zero numbers)
    await deployToSite(token, 'diamaxpro');
    // Also deploy to default site
    await deployToSite(token, 'diamax-pro-f6f16');
    
    console.log('\n======================================================');
    console.log('TODO EL SISTEMA DIAMAX PRO QUEDO 100% EN VIVO!');
    console.log('Enlace Limpio Oficial (UN SOLO WEB, CERO NUMEROS):');
    console.log('>>> https://diamaxpro.web.app <<<');
    console.log('Enlace de respaldo: https://diamax-pro-f6f16.web.app');
    console.log('======================================================');
  } catch (err) {
    console.error('ERROR EN DESPLIEGUE:', err);
    process.exit(1);
  }
}

main();
