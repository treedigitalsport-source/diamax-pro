import fs from 'fs';
import https from 'https';
import crypto from 'crypto';

const KEY_PATH = 'C:\\Users\\fitne\\Downloads\\diamax-pro-f6f16-firebase-adminsdk-fbsvc-a2a2b8b042.json';
const PROJECT_ID = 'diamax-pro-f6f16';

async function getAccessToken() {
  const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));
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

  const postData = 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=' + jwt;

  return new Promise((resolve, reject) => {
    const req = https.request('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const j = JSON.parse(data);
        if (j.access_token) resolve(j.access_token);
        else reject(new Error('Token error: ' + data));
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function apiRequest(url, method, token, body = null) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const headers = {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    };
    if (body) {
      headers['Content-Length'] = Buffer.byteLength(JSON.stringify(body));
    }
    const req = https.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: method,
      headers: headers
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
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

async function main() {
  console.log('1. Obteniendo Google OAuth2 Access Token...');
  const token = await getAccessToken();
  console.log('Token obtenido con éxito.');

  // 1. Desplegar firestore.rules
  console.log('\n2. Publicando firestore.rules en Google Firebase Rules API...');
  const rulesContent = fs.readFileSync('firestore.rules', 'utf8');
  const rulesetRes = await apiRequest(
    `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/rulesets`,
    'POST',
    token,
    {
      source: {
        files: [{
          name: 'firestore.rules',
          content: rulesContent
        }]
      }
    }
  );

  console.log('Respuesta creación ruleset:', rulesetRes.status, rulesetRes.body?.name || rulesetRes.raw);
  const rulesetName = rulesetRes.body?.name;

  if (rulesetName) {
    const releaseRes = await apiRequest(
      `https://firebaserules.googleapis.com/v1/projects/${PROJECT_ID}/releases/cloud.firestore`,
      'PATCH',
      token,
      {
        release: {
          name: `projects/${PROJECT_ID}/releases/cloud.firestore`,
          rulesetName: rulesetName
        }
      }
    );
    console.log('Respuesta publicación release:', releaseRes.status, releaseRes.body?.name || releaseRes.raw);
  }

  // 2. Sembrar colección commentators en Cloud Firestore
  console.log('\n3. Creando e inicializando colección "commentators" en Firestore...');
  const commentators = [
    {
      id: 'comm_pedro_chavez',
      name: 'Pedro Chávez',
      handle: '@pedro_chavez_narrador',
      mediaOutlet: 'YouTube Live / Radio 101.5 FM',
      role: 'NARRADOR_PLAY_BY_PLAY',
      channelUrl: 'https://youtube.com/live/diamax_baseball',
      activeGameId: 'game_master',
      catchphrase: '¡A lo profundo... y noooo... no regresará jamás! Cuadrangular descomunal',
      assignedSponsors: [
        {
          id: 'spons_1',
          brand: 'Seguros Diamante Pro',
          trigger: 'PITCH_CHANGE',
          text: 'Llamada al bullpen y visita a la lomita. Este relevo seguro llega gracias a Seguros Diamante Pro: respaldando cada jugada de tu vida.'
        },
        {
          id: 'spons_2',
          brand: 'Ferretería La Solución',
          trigger: 'DP',
          text: '¡Doble play relampagueante por la vía 6-4-3! La doble matanza llega por cortesía de Ferretería La Solución: herramientas que resuelven en el clutch.'
        }
      ],
      stats: {
        gamesBroadcasted: 48,
        pillsRead: 142
      },
      status: 'on_air',
      createdAt: '2026-11-03T00:00:00Z'
    },
    {
      id: 'comm_ali_zapata',
      name: 'Lic. Alí Zapata',
      handle: '@alizapata_ceo',
      mediaOutlet: '3Tree Digital Sport Network',
      role: 'COMENTARISTA_SABERMETRICO',
      channelUrl: 'https://diamaxpro.web.app/cabina',
      activeGameId: 'game_master',
      catchphrase: 'Decisión fundamentada en sabermetría: los números dominan el diamante.',
      assignedSponsors: [
        {
          id: 'spons_titan',
          brand: 'Baterías Titán',
          trigger: 'HR',
          text: '¡Poder descomunal! Batazo con la fuerza de Baterías Titán: la energía que no falla.'
        }
      ],
      stats: {
        gamesBroadcasted: 64,
        pillsRead: 210
      },
      status: 'on_air',
      createdAt: '2026-11-03T00:00:00Z'
    },
    {
      id: 'comm_beto_mendez',
      name: 'Beto Méndez',
      handle: '@betomendez_radio',
      mediaOutlet: 'Circuito Radial Diamante 98.9 FM',
      role: 'VOZ_COMERCIAL_Y_COLOR',
      channelUrl: 'https://twitch.tv/diamax_deportes',
      activeGameId: 'game_master',
      catchphrase: '¡La bola va rodando a las praderas, emoción garantizada!',
      assignedSponsors: [
        {
          id: 'spons_medica_55',
          brand: 'Clínica Deportiva Máster',
          trigger: 'FATIGUE_75',
          text: 'Alerta médica de 75 pitcheos: Cuidamos a nuestras leyendas con Clínica Deportiva Máster.'
        }
      ],
      stats: {
        gamesBroadcasted: 35,
        pillsRead: 98
      },
      status: 'standby',
      createdAt: '2026-11-03T00:00:00Z'
    }
  ];

  for (const c of commentators) {
    const docPath = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/commentators/${c.id}`;
    // Convert to Firestore REST format
    const fields = {
      id: { stringValue: c.id },
      name: { stringValue: c.name },
      handle: { stringValue: c.handle },
      mediaOutlet: { stringValue: c.mediaOutlet },
      role: { stringValue: c.role },
      channelUrl: { stringValue: c.channelUrl },
      activeGameId: { stringValue: c.activeGameId },
      catchphrase: { stringValue: c.catchphrase },
      status: { stringValue: c.status },
      createdAt: { stringValue: c.createdAt },
      stats: {
        mapValue: {
          fields: {
            gamesBroadcasted: { integerValue: String(c.stats.gamesBroadcasted) },
            pillsRead: { integerValue: String(c.stats.pillsRead) }
          }
        }
      },
      assignedSponsors: {
        arrayValue: {
          values: c.assignedSponsors.map(s => ({
            mapValue: {
              fields: {
                id: { stringValue: s.id },
                brand: { stringValue: s.brand },
                trigger: { stringValue: s.trigger },
                text: { stringValue: s.text }
              }
            }
          }))
        }
      }
    };

    const res = await apiRequest(docPath, 'PATCH', token, { fields });
    console.log(`✓ Comentarista ${c.name} (${c.id}) creado/actualizado en Firestore:`, res.status);
  }

  // 3. Sembrar colección broadcast_sponsors en Cloud Firestore
  console.log('\n4. Creando e inicializando colección "broadcast_sponsors" en Firestore...');
  const sponsors = [
    {
      id: 'spons_titan',
      brandName: 'Baterías Titán',
      category: 'ENERGIA_AUTOMOTRIZ',
      triggerEvent: 'HR',
      scriptText: '¡A lo profundo... JONRÓN DESCOMUNAL! Ese batazo de cuatro esquinas llega con el poder inagotable de Baterías Titán: la energía que no falla.',
      durationSeconds: 10,
      active: true
    },
    {
      id: 'spons_diamante',
      brandName: 'Seguros Diamante Pro',
      category: 'SEGUROS_PATRIMONIALES',
      triggerEvent: 'PITCH_CHANGE',
      scriptText: 'Llamada al bullpen y visita a la lomita. Este relevo seguro llega gracias a Seguros Diamante Pro: respaldando cada jugada de tu vida.',
      durationSeconds: 8,
      active: true
    },
    {
      id: 'spons_ferreteria',
      brandName: 'Ferretería La Solución',
      category: 'CONSTRUCCION_HERRAMIENTAS',
      triggerEvent: 'DP',
      scriptText: '¡Doble play relampagueante por la vía 6-4-3! La doble matanza llega por cortesía de Ferretería La Solución: herramientas que resuelven en el clutch.',
      durationSeconds: 8,
      active: true
    },
    {
      id: 'spons_medica_55',
      brandName: 'Clínica Especializada +55',
      category: 'SALUD_DEPORTIVA',
      triggerEvent: 'FATIGUE_75',
      scriptText: 'Atención médica en el montículo: El lanzador ha alcanzado la barrera de 75 pitcheos reglamentarios. Salud y rendimiento garantizados por Clínica Especializada +55.',
      durationSeconds: 10,
      active: true
    }
  ];

  for (const s of sponsors) {
    const docPath = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/broadcast_sponsors/${s.id}`;
    const fields = {
      id: { stringValue: s.id },
      brandName: { stringValue: s.brandName },
      category: { stringValue: s.category },
      triggerEvent: { stringValue: s.triggerEvent },
      scriptText: { stringValue: s.scriptText },
      durationSeconds: { integerValue: String(s.durationSeconds) },
      active: { booleanValue: s.active }
    };
    const res = await apiRequest(docPath, 'PATCH', token, { fields });
    console.log(`✓ Patrocinador ${s.brandName} (${s.id}) creado/actualizado en Firestore:`, res.status);
  }

  console.log('\n=== BASE DE DATOS DE COMENTARISTAS Y PATROCINIOS CREADA CON ÉXITO EN CLOUD FIRESTORE ===');
}

main().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
