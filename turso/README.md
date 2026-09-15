# ⚾ Configuración de Turso para DIAMAX PRO — Dugout Offline
## CEO Alí Zapata · 3Tree Digital Sport IA

## ¿Por qué Turso?
En los estadios de béisbol en Tampa, Caracas, Maracay — el internet falla.
Con Turso, el anotador trabaja SIN internet y sincroniza automáticamente cuando hay señal.

## 📋 Paso 1: Crear cuenta en Turso
1. Ve a **https://turso.tech** y regístrate gratis
2. Instala el CLI: `npm install -g @turso/cli`
3. Autentícate: `turso auth login`

## 📋 Paso 2: Crear una base de datos por liga
```bash
# Liga Tampa Junior
turso db create liga-tampa-junior-2026

# Liga Criollo Caracas
turso db create liga-criollo-caracas-2026

# Liga Preinfantil Maracay
turso db create liga-preinfantil-maracay-2026
```

## 📋 Paso 3: Ejecutar el schema en cada base de datos
```bash
turso db shell liga-tampa-junior-2026 < schema.sql
```

## 📋 Paso 4: Obtener credenciales de conexión
```bash
# Obtener URL
turso db show liga-tampa-junior-2026 --url

# Crear token de acceso
turso db tokens create liga-tampa-junior-2026
```

## 📋 Paso 5: Configurar en DIAMAX PRO
En la aplicación, vaya al panel de configuración e ingrese:
- **Turso DB URL**: libsql://liga-tampa-junior-2026-usuario.turso.io
- **Auth Token**: El token generado en el paso anterior

## ¿Cómo funciona el modo offline?
1. El coach anota un pitcheo → se guarda localmente al instante (0ms latencia)
2. Si no hay internet → se pone en cola automáticamente
3. Cuando regresa la señal → DIAMAX sincroniza todo automáticamente
4. Aparece una notificación: "✅ Sincronización completada"

## 💰 Costo: $0/mes
- Plan gratuito incluye: 100 bases de datos, 5GB, 500M lecturas/mes

## 📧 Soporte: admin@3treedigitalsport.com