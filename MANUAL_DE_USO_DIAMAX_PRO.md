# ⚾ MANUAL DE USO Y OPERACIÓN OFICIAL: DIAMAX PRO
## PLATAFORMA SABERMÉTRICA Y MOTOR DUGOUT EN TIEMPO REAL
**Equipo Oficial:** Guerreros de Venezuela +55  
**Plataforma Web:** [https://diamax-pro.vercel.app/](https://diamax-pro.vercel.app/)  
**Desarrollo Tecnológico:** 3Tree Digital Sport IA (Lutz, Florida, EE. UU.)  
**Dirección General:** Lic. Alí José Zapata Mendoza — CEO & Fundador  
**Versión:** 2.4 Enterprise / Senior Master Edition (2026)  

---

## 📋 1. INTRODUCCIÓN Y OBJETIVOS OPERATIVOS

**DIAMAX Pro** es la suite tecnológica oficial de anotación en vivo, análisis sabermétrico y prescripción táctica con Inteligencia Artificial (DIAMAX Tactical AI Engine™) diseñada específicamente para la categoría **Senior Master (+55)** y la alta competencia.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               DIAMAX PRO — OBJETIVOS CLAVE                             │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│ 1. ANOTACIÓN JUGADA A      │ 2. CONTROL DE FATIGA +55    │ 3. ASISTENTE TÁCTICO IA     │
│    JUGADA (PITCH-BY-PITCH) │    Límite 75 lanzamientos   │    Prescripciones en <1.5s  │
├────────────────────────────┼─────────────────────────────┼─────────────────────────────┤
│ 4. DATOS DE SEDE Y CLIMA   │ 5. TARJETA OFICIAL LINEUP   │ 6. SABERMETRÍA EN VIVO      │
│    Viento y Aerodinámica   │    Formato Umpire y PDF     │    OBP, SLG, OPS y wOBA     │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

---

## 🔐 2. CONTROL DE ACCESO Y MATRIZ DE ROLES (DIAMAX SECURITY)

Al ingresar a la plataforma en [https://diamax-pro.vercel.app/](https://diamax-pro.vercel.app/), cada usuario debe autenticarse según su responsabilidad mediante el teclado numérico PIN de 4 dígitos:

| Rol | Icono | Permisos y Atribuciones Operativas |
| :--- | :---: | :--- |
| **Mánager / Head Coach** | 👑 | Acceso total a decisiones tácticas, consultas en vivo con la IA DIAMAX, optimización de alineación con algoritmo Monte Carlo, sustituciones y firma digital de la Tarjeta Oficial (Lineup Card). |
| **Anotador Oficial** | ✍️ | Control absoluto del Dugout Keypad: registro lanzamiento a lanzamiento, conteo de bolas/strikes, outs, corredores en base, extrabases, jugadas defensivas y cierre de partido. |
| **Scout / Analista** | 📊 | Visualización de Spray Charts 2D, Mapas de Calor de Zona de Strike (Whiff%), análisis de tendencias de bateo (Pull/Oppo%) y reportes exportables. |

---

## ⚙️ 3. CONFIGURACIÓN PRE-JUEGO (ANTES DEL 1ER INNING)

```
[1. Cargar Nuevo Juego] ──> [2. Sede y Clima GPS] ──> [3. Orden al Bate (1-9)] ──> [4. Imprimir Lineup Card]
```

### Paso 1: Carga de Nuevo Juego y Datos de Sede
1. En el encabezado principal, presiona el botón verde **`🏟️ Cargar Nuevo Juego`**.
2. Completa los datos oficiales del encuentro:
   * **📅 Fecha del Partido:** (Ej: `2026-09-08`).
   * **⏰ Hora de Inicio:** (Ej: `09:30 AM`).
   * **⚔️ Equipo Rival:** (Ej: `Tigres de Tampa` / `Cardenales`).
   * **🏠 Condición:** Selecciona `Home Club (Local)` o `Visitante (Away)`.
   * **🏟️ Estadio / Sede:** (Ej: `Lutz Baseball Park - Campo #1`).
   * **📍 Dirección Completa:** (Ej: `5709 Kingfish Drive, Lutz, FL 33558`).
3. **Sensor de Clima en Tiempo Real:** Presiona **`🔄 Actualizar Clima GPS`** para capturar la temperatura (°F/°C), humedad (%), velocidad y dirección del viento, y el cálculo del **Impacto Aerodinámico Zapata** en el vuelo de la pelota.
4. Presiona **`⚡ Iniciar Partido / Activar Dugout`**.

### Paso 2: Generación y Validación del Lineup
1. Ve a la pestaña **`📋 Alineación / Lineup`**.
2. Ordena los 9 bateadores titulares utilizando los botones **`🔼 Subir`** y **`🔽 Bajar`**.
3. Asigna las posiciones defensivas oficiales: `1 (P)`, `2 (C)`, `3 (1B)`, `4 (2B)`, `5 (3B)`, `6 (SS)`, `7 (LF)`, `8 (CF)`, `9 (RF)`, `BD (Bateador Designado)`.
4. Revisa la lista de reservas (10 al 14) y designa al **Lanzador Abridor**.
5. Ve a la pestaña **`📋 Tarjeta Oficial`** y presiona **`🖨️ Imprimir / Guardar PDF`** para entregar la copia reglamentaria al Árbitro Principal (Umpire).

---

## ⚾ 4. OPERACIÓN EN VIVO (DURANTE EL JUEGO - DUGOUT KEYPAD)

Durante el encuentro, el Anotador Oficial utiliza la interfaz reactiva de alto contraste:

### A. Marcador y Situación de Juego
* **Conteo de Outs:** Toca los círculos de `OUT (0, 1, 2)` para incrementarlos. Al marcar el 3er out, el sistema cambia de media entrada y limpia las almohadillas automáticamente.
* **Corredores en Base:** Toca directamente las bases `1B`, `2B` y `3B` en el diamante SVG interactivo para posicionar o remover corredores.
* **Bateador de Turno:** La tarjeta de bateo muestra foto, dorsal, nombre, turnos de la jornada (`VB, H, 2B, 3B, HR, CI, AVE`) y bateador prevenido.

### B. Botonera Táctica de Jugadas (Dugout Keypad)

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│     HITS        │   OUTS / FLIES  │    ROLATAS      │  SITUACIONALES  │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ [1B] Sencillo   │ [F1] a [F9]     │ [6-3] SS a 1B   │ [K] Ponche Tir. │
│ [2B] Doble      │ (Elevados según │ [4-3] 2B a 1B   │ [Kc] P. Cantado │
│ [3B] Triple     │ posición del    │ [5-3] 3B a 1B   │ [BB] Base x Bola│
│ [HR] Cuadrangular│ fildeador 1-9) │ [DP 6-4-3]      │ [SB] Robo Base  │
│                 │                 │ [DP 4-6-3]      │ [SF] Fly Sacrif.│
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

---

## 🩺 5. MONITOR DE LANZADORES Y CONTROL DE FATIGA (+55)

Para preservar la salud de los brazos en la categoría Senior Master +55, DIAMAX Pro integra un semáforo de pitcheos con límite de **75 lanzamientos**:

```
 🟢 0 - 45 Pitches  ──> ZONA VERDE (Rendimiento Óptimo / Plena Potencia)
 🟡 46 - 60 Pitches ──> ZONA AMARILLA (Atención / Monitorear Velocidad y Control)
 🔴 61 - 75 Pitches ──> ZONA ROJA (Alerta Máxima de Fatiga / ¡Activar Bullpen!)
```

* **Botones de Pitcheo Rápido:** `[+1 Strike]` y `[+1 Bola]` para llevar el conteo exacto lanzamiento a lanzamiento.
* **Módulo de Bullpen:** Permite registrar los relevistas calentando y ejecutar la sustitución formal en el diamante con un solo clic.

---

## 🧠 6. DIAMAX TACTICAL AI (PRESCRIPCIÓN SABERMÉTRICA EN TIEMPO REAL)

El motor de IA con tecnología DIAMAX Tactical Engine™ responde en **menos de 1.5 segundos**:

* **Botones de Consulta Rápida en Dugout:**
  * `¿Tocar la bola o Batear libre?`
  * `¿Robo de base o Bateo y corrido?`
  * `¿Formación Defensiva Especial (Shift)?`
  * `¿Momento de cambio de Pitcher?`
  * `¿Base por bolas intencional?`
* **Caja de Preguntas Personalizadas:** Permite al mánager escribir cualquier situación específica del juego para recibir una recomendación probabilística instantánea.

---

## 📊 7. SPRAY CHARTS Y MAPAS DE CALOR 2D

1. **Spray Chart 2D Interactivo:** Muestra la dispersión de batazos por colores:
   * 🟢 Rodado (Ground Ball - GB)
   * 🔵 Elevado (Fly Ball - FB)
   * 🟡 Línea (Line Drive - LD)
   * 🔴 Jonrón (Home Run - HR)
2. **Mapa de Calor de Zona de Strike (9 Cuadrantes):**
   * 🔥 **Zona Caliente (AVG > .320):** Sectores donde el rival conecta con mayor poder.
   * ❄️ **Zona Fría (Whiff% > 35%):** Sectores ideales para colocar lanzamientos en dos strikes.
3. **Tendencias de Bateo:** Muestra el porcentaje hacia la banda (`Pull%`), centro (`Cent%`) y banda contraria (`Oppo%`) para ajustar la defensa.

---

## 🏁 8. CIERRE DE PARTIDO Y REPORTE POST-JUEGO

```
[1. Presionar 'Finalizar Partido'] ──> [2. Captura Hora Fin] ──> [3. Cálculo Duración] ──> [4. Certificar y Archivar]
```

1. Al caer el último out del juego, presiona el botón rojo **`🏁 Finalizar Partido`**.
2. El sistema abrirá el modal de cierre, capturando automáticamente:
   * **Hora Exacta de Finalización** (Ej: `11:45 AM`).
   * **Duración Total del Partido** ($T_{fin} - T_{ini}$, Ej: `2h 15m`).
   * **Resumen de Marcador y Resultado Final**.
3. Presiona **`✅ Confirmar y Sincronizar Tarjeta Oficial`**.
4. La Tarjeta Oficial y el Boxscore quedarán sellados y listos para su exportación final o envío a la directiva de la liga.

---

## ☀️ 9. MODO SOL / NOCHE (DAYLIGHT ERGONOMICS)

* En la esquina superior derecha, presiona **`☀️ Sol / Noche`** para alternar instantáneamente al **Modo Alto Brillo**, diseñado con fondo blanco puro y tipografía de contraste absoluto para evitar reflejos solares en el dugout.

---

## 💡 GUÍA RÁPIDA DE BOLSILLO PARA EL DUGOUT (CHECKLIST)

```
========================================================================================
                  GUÍA RÁPIDA DE DUGOUT: DIAMAX PRO ⚾
                  Guerreros de Venezuela +55 · Temporada 2026
========================================================================================

 1️⃣ PRE-JUEGO (30 minutos antes)
 --------------------------------------------------------------------------------------
 [ ] 1. Iniciar sesión con PIN de Mánager o Anotador.
 [ ] 2. Presionar '🏟️ Cargar Nuevo Juego', registrar Sede, Rival y sincronizar Clima.
 [ ] 3. Ajustar Lineup del 1 al 9 y asignar Pitcher Abridor.
 [ ] 4. Ir a '📋 Tarjeta Oficial' e imprimir/guardar PDF para los Umpires.

 2️⃣ EN JUEGO (Dugout Keypad)
 --------------------------------------------------------------------------------------
 [ ] 1. Marcar lanzamientos: [+1 Strike] / [+1 Bola].
 [ ] 2. Registrar turnos al bate con los botones correspondientes:
        • Hits: [1B] [2B] [3B] [HR]
        • Elevados: [F1] a [F9]
        • Rolatas: [6-3] [4-3] [5-3] [DP 6-4-3]
        • Situacionales: [K] [Kc] [BB] [SB] [SF]
 [ ] 3. Monitorear Semáforo de Pitcheo: 🟢 0-45 | 🟡 46-60 | 🔴 61-75 (Bullpen).
 [ ] 4. Consultar DIAMAX IA (<1.5s) en situaciones críticas de toque/robo/relevo.

 3️⃣ POST-JUEGO (Cierre)
 --------------------------------------------------------------------------------------
 [ ] 1. Presionar '🏁 Finalizar Partido' tras el último out.
 [ ] 2. Verificar Hora de Fin y Duración Total calculada.
 [ ] 3. Certificar y exportar el Boxscore oficial.

========================================================================================
               3Tree Digital Sport IA · Desarrollado para Ganar
========================================================================================
```

---
*Manual Oficial de Operación Certificado por 3Tree Digital Sport IA para los Guerreros de Venezuela +55.* ⚾🇻🇪🇺🇸
