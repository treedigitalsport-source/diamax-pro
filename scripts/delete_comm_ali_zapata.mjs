import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

const KEY_PATH = 'C:/Users/fitne/Downloads/diamax-pro-f6f16-firebase-adminsdk-fbsvc-a2a2b8b042.json';
const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const claim = Buffer.from(JSON.stringify({
    iss: key.client_email,
    scope: 'https://www.googleapis.com/auth/cloud-platform https://www.googleapis.com/auth/datastore',
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
      res.on('end', () => resolve(JSON.parse(body).access_token));
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  const token = await getAccessToken();
  console.log('Token obtenido. Eliminando comm_ali_zapata de Firestore...');

  const req = https.request('https://firestore.googleapis.com/v1/projects/diamax-pro-f6f16/databases/(default)/documents/commentators/comm_ali_zapata', {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  }, res => {
    console.log('Respuesta eliminación comm_ali_zapata:', res.statusCode);
  });
  req.end();
}
run();
