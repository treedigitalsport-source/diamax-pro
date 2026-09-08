# ⚾ DIAMAX Pro (`PJ-DIAMAX-001`)
> **Sistema Táctico de Béisbol Profesional, Anotador Dugout Pitch-by-Pitch & Inteligencia Sabermétrica en Tiempo Real**  
> *Desarrollada por 3Tree Digital Sport IA Lutz, Florida Usa / Todos los derechos reservados 2026. Aplicacion oficial DIAMAX.*

---

## 🌟 Características Principales

1. **🏟️ Anotador Dugout Ergonómico (Alto Contraste):**
   - Diseñado para tablets y teléfonos bajo sol intenso en el banquillo.
   - Selector espacial de elevados (Fly 1 a 9) y control de conteo táctil.
   - Marcador interactivo y Diamante SVG reactivo.

2. **🧠 DIAMAX Tactical AI (Groq LPU Engine):**
   - Inferencia en vivo con `llama-3.3-70b-versatile` en menos de 1.5 segundos.
   - Prescripciones tácticas instantáneas: Pitcheo Sugerido, Shift Defensivo, Robo/Sacrificio y Alerta de Bullpen.
   - Fallback sabermétrico determinista 100% offline.

3. **🕸️ Baseball Knowledge Graph (GraphRAG en Memoria):**
   - Subgrafos semánticos `(Bateador)-[:BATEA]->(Lado)` y cálculo dinámico de *Leverage Index (LI)*.

4. **🎲 Motor de Simulación Monte Carlo (10,000 iteraciones):**
   - Modelo de Markov de 24 estados que proyecta carreras esperadas ($E[R]$) y probabilidad de anotación.

5. **🛡️ Portal de Seguridad & PIN Dugout:**
   - Cifrado SHA-256 en memoria y teclado numérico táctil de 4 dígitos para desbloqueo rápido.
   - Control de roles (`MANAGER`, `ANOTADOR`, `SCOUT`).

6. **☁️ Sincronización Cloud Offline-First:**
   - Respaldos criptográficos `.json` exportables e importables con un solo clic.

7. **📋 Tarjeta Oficial & Boxscore PDF Imprimible:**
   - Hoja de anotación oficial con firmas reglamentarias de árbitros y mánagers.

8. **📊 Spray Charts 2D & Mapas de Calor por Zona (1-9):**
   - Dispersión de batazos (*GB, FB, LD, HR*) y matriz de calor de abanicados (*Whiff%*).

9. **⚾ Gestor de Bullpen & Contador de Pitcheos:**
   - Monitoreo de fatiga calibrado a la regla reglamentaria Senior +55 (75 lanzamientos).

---

## 🚀 Despliegue en Vercel & Ejecución Local

### Ejecución Local:
```bash
python -m http.server 5050
# Abre http://localhost:5050 en tu navegador
```

### Despliegue en Vercel (Zero-Config):
```bash
npm install -g vercel
vercel
```

---

## 🏢 Autoría y Créditos
- **Desarrollado por:** 3Tree Digital Sport IA
- **Sede Oficial:** 5709 Kingfish Drive, Lutz, Florida, USA 33558
- **Proyecto:** `PJ-DIAMAX-001`
