import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';

const KEY_PATH = 'C:\\Users\\fitne\\Downloads\\diamax-pro-f6f16-firebase-adminsdk-fbsvc-a2a2b8b042.json';
const RULES_PATH = 'C:\\Users\\fitne\\Documents\\3Tree_Codebase\\DIAMAX\\firestore.rules';
const PROJECT_ID = 'diamax-pro-f6f16';

async function getAccessToken() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
  const now = Math.floor(Date.now() / 1000);

  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/firebase',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  })).toString('base64url');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(`${header}.${claim}`);
  const signature = sign.sign(key.private_key, 'base64url');
  const jwt = `${header}.${claim}.${signature}`;

  return new Promise((resolve, reject) => {
    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;
    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.access_token) resolve(parsed.access_token);
          else reject(new Error('Token error: ' + data));
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function apiRequest(token, method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'firebaserules.googleapis.com',
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch(e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function deployRules() {
  console.log('1. Obteniendo token OAuth...');
  const token = await getAccessToken();
  console.log('✓ Token obtenido.');

  const rulesContent = fs.readFileSync(RULES_PATH, 'utf8');

  console.log('2. Creando Ruleset en Firebase Rules API...');
  const createRulesetRes = await apiRequest(token, 'POST', `/v1/projects/${PROJECT_ID}/rulesets`, {
    source: {
      files: [
        {
          name: 'firestore.rules',
          content: rulesContent
        }
      ]
    }
  });

  if (createRulesetRes.status !== 200 && createRulesetRes.status !== 201) {
    console.error('Error creando ruleset:', createRulesetRes);
    return;
  }

  const rulesetName = createRulesetRes.data.name;
  console.log('✓ Ruleset creado:', rulesetName);

  console.log('3. Publicando Release para cloud.firestore...');
  // Intentar PATCH o POST release
  let releaseRes = await apiRequest(token, 'PATCH', `/v1/projects/${PROJECT_ID}/releases/cloud.firestore`, {
    release: {
      name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
      rulesetName: rulesetName
    }
  });

  if (releaseRes.status === 404) {
    // Si la release aún no existe, crearla con POST
    releaseRes = await apiRequest(token, 'POST', `/v1/projects/${PROJECT_ID}/releases`, {
      name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
      rulesetName: rulesetName
    });
  }

  if (releaseRes.status === 200 || releaseRes.status === 201) {
    console.log('🎉 REGLAS DE FIRESTORE PUBLICADAS EXITOSAMENTE EN FIREBASE!');
    console.log(releaseRes.data);
  } else {
    console.log('Respuesta release:', releaseRes);
  }
}

deployRules().catch(err => {
  console.error('Error en despliegue de reglas:', err);
});
