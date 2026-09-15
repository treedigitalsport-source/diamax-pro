# ☁️ Configuración de Supabase para DIAMAX PRO
## CEO Alí Zapata · 3Tree Digital Sport IA

## 📋 Paso 1: Crear cuenta y proyecto
1. Ve a **https://supabase.com** y regístrate gratis
2. Haz clic en **"New Project"**
3. Nombre: `DIAMAX-PRO` · Región: `us-east-1` (Florida)
4. Guarda la Database Password en un lugar seguro
5. Espera ~2 minutos mientras se crea el proyecto

## 📋 Paso 2: Ejecutar los SQL (en este orden)
1. Ve a **SQL Editor** → **New Query**
2. Pega `schema.sql` → Run ✅
3. Pega `rls_policies.sql` → Run ✅
4. (Opcional) Pega `seed_data.sql` → Run ✅

## 📋 Paso 3: Obtener credenciales
1. Ve a **Settings** ⚙️ → **API**
2. Copia **Project URL** (ej: https://xyzabc.supabase.co)
3. Copia **anon / public key** (clave larga)

## 📋 Paso 4: Configurar en DIAMAX PRO
La aplicación tiene un panel de configuración donde ingresa:
- **Supabase URL**: Su Project URL
- **Anon Key**: Su clave pública

## 💰 Costo: $0/mes (Plan Gratuito de Supabase)
## 📧 Soporte: admin@3treedigitalsport.com