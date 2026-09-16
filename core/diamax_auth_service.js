/**
 * DIAMAX PRO — AUTH & MULTI-TENANT RBAC SERVICE V2.0
 * 3Tree Digital Sport IA · CEO Alí Zapata (Lutz, Florida USA)
 * 
 * Elimina contraseñas en texto plano y proporciona gestión de sesiones JWT,
 * validación de claims multi-tenant y control de acceso basado en roles (RBAC).
 */

const crypto = require('crypto');

// ROLES OFICIALES DIAMAX PRO
const ROLES = {
  CEO: 'CEO',
  ADMIN_LIGA: 'ADMIN_LIGA',
  MANAGER: 'MANAGER',
  COACH: 'COACH',
  JUGADOR: 'JUGADOR'
};

// MATRIZ DE PERMISOS POR ROL
const ROLE_PERMISSIONS = {
  CEO: ['*'],
  ADMIN_LIGA: [
    'league:read', 'league:write',
    'team:read', 'team:write',
    'roster:read', 'roster:write',
    'game:read', 'game:write',
    'event:append', 'event:read',
    'stats:recalculate', 'stats:read'
  ],
  MANAGER: [
    'league:read',
    'team:read', 'team:write',
    'roster:read', 'roster:write',
    'game:read', 'game:write',
    'event:append', 'event:read',
    'stats:recalculate', 'stats:read'
  ],
  COACH: [
    'league:read',
    'team:read',
    'roster:read',
    'game:read', 'game:write',
    'event:append', 'event:read',
    'stats:read'
  ],
  JUGADOR: [
    'league:read',
    'team:read',
    'roster:read',
    'game:read',
    'event:read',
    'stats:read'
  ]
};

class DiamaxAuthService {
  constructor(secretKey = 'diamax_enterprise_secret_key_2026') {
    this.secretKey = secretKey;
    this.usersDb = new Map(); // Simulación de auth.users / public.profiles
    this.activeSessions = new Map();
  }

  // Hash de contraseñas seguro con salt
  hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { hash, salt };
  }

  verifyPassword(password, storedHash, salt) {
    const { hash } = this.hashPassword(password, salt);
    return hash === storedHash;
  }

  // Registro de usuario con tenant_id y rol
  registerUser({ email, password, fullName, role = ROLES.JUGADOR, tenantId, teamName, category }) {
    if (!email || !password || !tenantId) {
      throw new Error('AUTH_INVALID_PAYLOAD: email, password y tenantId son obligatorios.');
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (this.usersDb.has(normalizedEmail)) {
      throw new Error(`AUTH_USER_EXISTS: El usuario ${normalizedEmail} ya existe.`);
    }
    if (!ROLES[role]) {
      throw new Error(`AUTH_INVALID_ROLE: Rol ${role} no reconocido.`);
    }

    const { hash, salt } = this.hashPassword(password);
    const userId = crypto.randomUUID();

    const userProfile = {
      id: userId,
      email: normalizedEmail,
      fullName: fullName || 'Usuario DIAMAX',
      role,
      tenantId,
      teamName: teamName || null,
      category: category || null,
      passwordHash: hash,
      salt,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    this.usersDb.set(normalizedEmail, userProfile);
    return {
      id: userProfile.id,
      email: userProfile.email,
      fullName: userProfile.fullName,
      role: userProfile.role,
      tenantId: userProfile.tenantId
    };
  }

  // Inicio de sesión y emisión de JWT simulado con firma HMAC-SHA256
  login(email, password) {
    const normalizedEmail = email.toLowerCase().trim();
    const user = this.usersDb.get(normalizedEmail);
    if (!user) {
      throw new Error('AUTH_INVALID_CREDENTIALS: Credenciales incorrectas.');
    }

    const isValid = this.verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      throw new Error('AUTH_INVALID_CREDENTIALS: Credenciales incorrectas.');
    }

    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({
      sub: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      tenant_id: user.tenantId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24h
    })).toString('base64url');

    const signature = crypto.createHmac('sha256', this.secretKey)
      .update(`${header}.${payload}`)
      .digest('base64url');

    const token = `${header}.${payload}.${signature}`;
    const session = {
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId
      }
    };

    this.activeSessions.set(token, session);
    return session;
  }

  // Verificación de token JWT y extracción de claims
  verifyToken(token) {
    if (!token || typeof token !== 'string') {
      throw new Error('AUTH_INVALID_TOKEN: Token no proporcionado.');
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('AUTH_MALFORMED_TOKEN: Formato JWT inválido.');
    }

    const [header, payload, signature] = parts;
    const expectedSig = crypto.createHmac('sha256', this.secretKey)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSig) {
      throw new Error('AUTH_SIGNATURE_MISMATCH: Firma de token alterada o inválida.');
    }

    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('AUTH_TOKEN_EXPIRED: Token de sesión expirado.');
    }

    return claims;
  }

  // Verificación de permiso RBAC
  hasPermission(role, requiredPermission) {
    if (!ROLES[role]) return false;
    const permissions = ROLE_PERMISSIONS[role] || [];
    if (permissions.includes('*')) return true;
    return permissions.includes(requiredPermission);
  }

  // Enforcer de aislamiento de Tenant
  assertTenantAccess(claims, targetTenantId) {
    if (claims.role === ROLES.CEO) {
      return true; // Superadmin global
    }
    if (claims.tenant_id !== targetTenantId) {
      throw new Error(`SECURITY_RLS_VIOLATION: Acceso denegado. Tenant ${claims.tenant_id} no puede acceder a recursos del Tenant ${targetTenantId}.`);
    }
    return true;
  }

  // Enforcer de mutación
  assertCanMutateGame(claims, gameTenantId) {
    this.assertTenantAccess(claims, gameTenantId);
    if (!this.hasPermission(claims.role, 'event:append')) {
      throw new Error(`SECURITY_RBAC_VIOLATION: El rol ${claims.role} no tiene permisos para modificar eventos de juego.`);
    }
    return true;
  }
}

module.exports = {
  ROLES,
  ROLE_PERMISSIONS,
  DiamaxAuthService
};
