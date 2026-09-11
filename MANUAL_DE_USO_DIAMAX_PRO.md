# ⚾ MANUAL OFICIAL DE USO Y OPERACIÓN MAESTRA: DIAMAX PRO
## SUITE INTEGRAL SABERMÉTRICA, ANOTACIÓN DUGOUT EN VIVO & ASISTENCIA TÁCTICA IA
**Equipo Oficial:** Guerreros de Venezuela +55  
**Plataforma Web en Producción:** [https://diamax-pro.vercel.app/](https://diamax-pro.vercel.app/)  
**Desarrollo Tecnológico:** 3Tree Digital Sport IA (Lutz, Florida, EE. UU.)  
**Dirección General:** Lic. Alí José Zapata Mendoza — CEO & Fundador  
**Versión:** 2.5 Master Championship Edition (2026)  

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              DIAMAX PRO — ARQUITECTURA GENERAL DEL SISTEMA                             │
├──────────────────────────────┬──────────────────────────────┬──────────────────────────────────────────┤
│ 1. 🏟️ ANOTADOR DUGOUT (LIVE) │ 2. 📋 LINEUP BUILDER 9vs9    │ 3. 🎯 CAMPO 2D & HEATMAP 3x3             │
│    Anotación pitch-by-pitch  │    Validación anti-duplicado │    Spray chart y radar de pitcheo        │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────────────────┤
│ 4. 🖨️ TARJETA OFICIAL DUAL   │ 5. 📋 INFORME TÉCNICO DÍA    │ 6. 📊 DASHBOARD & GRÁFICOS SVG           │
│    Formato Umpire 16 personas│    Scouting comparativo      │    Barras, curvas 1-9 y sabermetría      │
├──────────────────────────────┼──────────────────────────────┼──────────────────────────────────────────┤
│ 7. 🩺 SEMÁFORO DE FATIGA +55 │ 8. 🧠 DIAMAX TACTICAL AI™    │ 9. 🛡️ SEGURIDAD PIN & FIREBASE           │
│    Límite 75 lanzamientos    │    Decisiones en < 1.5s      │    Cifrado SHA-256 y nube NoSQL          │
└──────────────────────────────┴──────────────────────────────┴──────────────────────────────────────────┘
```

---

## 📋 1. ROSTER OFICIAL CALIBRADO: 16 PERSONAS (GUERREROS DE VENEZUELA +55)

El equipo oficial cuenta con exactamente **16 integrantes oficiales** registrados en el sistema, distribuidos entre 9 titulares y 7 reservas/lanzadores:

### ⚔️ Alineación Titular (1 al 9):
| # | Jugador | Posición Defensiva | Batea / Lanza | Perfil Sabermétrico |
| :-: | :--- | :---: | :---: | :--- |
| **1** | **Johan Olivo** | CF (Jardín Central) | L / R | Bateador zurdo de contacto y velocidad (.380 OBP) |
| **2** | **Pablo Morales** | 1B (Primera Base) | R / R | Bateador de poder y cobertura en el cuadro (.510 SLG) |
| **3** | **Raul Lozada** | SS (Campocorto) | R / R | Ancla defensiva y ejecutor de doble play (.360 OBP) |
| **4** | **Jorge Mitchell** | 2B (Segunda Base) | R / R | Constructor de jugadas intermedias y bateo colocado |
| **5** | **Oswaldo Grillo** | 3B (Tercera Base) | R / R | Esquina caliente de reflejos rápidos (.420 SLG) |
| **6** | **Nestor Vera** | LF (Jardín Izquierdo) | L / R | Bateador zurdo de poder hacia las bandas (.520 SLG) |
| **7** | **Pedro Moreno** | RF (Jardín Derecho) | L / R | Brazo potente en los jardines y clutch (.480 SLG) |
| **8** | **Juan Perez** | C (Receptor) | R / R | Director de pitcheo, bloqueo y control de corredores |
| **9** | **Martin Rojas** | DH (Bateador Designado) | R / R | Eje ofensivo enfocado en carreras impulsadas |

### ⚾ Lanzador Abridor & Cuerpo de Reservas (7 Integrantes):
| # | Integrante | Rol Oficial | Batea / Lanza | Especialidad Técnica |
| :-: | :--- | :---: | :---: | :--- |
| **23** | **Pedro Chavez** | Lanzador Abridor (P) | R / RHP | As de rotación (3.20 ERA, control de 75 pitcheos) |
| **11** | **Lic. Alí Zapata** | Mánager / Jardinero (OF/MGR) | R / R | Conductor estratégico y bateador emergente |
| **12** | **Carlos Santana** | Jardinero / Bateador Extra (OF) | S / R | Bateador ambidiestro de poder situacional |
| **34** | **Félix Hernández** | Lanzador Relevista (P) | R / RHP | Relevo largo y control de zona (2.85 ERA) |
| **42** | **Mariano Rivera** | Lanzador Cerrador (P) | R / RHP | Especialista de salvamentos y rescate en 9º inning |
| **27** | **José Altuve** | Infielder / Segunda Base (2B) | R / R | Bateador de alto promedio y chispa en base |
| **24** | **Miguel Cabrera** | Primera Base / Bateador (1B/DH) | R / R | Productor de extrabases y líder ofensivo |

---

## 🏟️ 2. PROTOCOLO PRE-JUEGO: WIZARD DE 5 PASOS (ORLANDO SÁNCHEZ 2026)

Antes de cada encuentro, el Mánager o Anotador debe abrir el modal de configuración presionando **`🏟️ Cargar Nuevo Juego`**:

```
[1. Rival & Logo] ──> [2. Sede, Clima GPS & Localía] ──> [3. Abridor GVE] ──> [4. Lineup 1-9] ──> [5. Tarjeta Oficial]
```

1. **Paso 1: Selección y Registro del Rival:**
   * Selecciona el rival de la base de datos oficial (`DAYTONA BEACH`, `SARASOTA RED SOX`, `TIBURONES`, etc.) o presiona `➕ Registrar Nuevo Rival`.
   * Sube el logo oficial del rival con el botón de cámara `📷` (soporta PNG/JPG).
   * Gestiona el orden al bate del rival, agrega bateadores extras o realiza sustituciones directas.
2. **Paso 2: Sede, Horario, Clima GPS y Localía:**
   * Registra la fecha, hora de inicio y nombre/dirección del estadio.
   * Presiona `🔄 Actualizar GPS` para sincronizar la telemetría climática (Temperatura, Humedad, Viento, Presión y el **Impacto Aerodinámico Zapata** en elevados al Center Field).
   * **Regla Oficial de Localía:**
     * **🏠 HOME CLUB:** Guerreros defiende en la Alta (▲) y batea en la Baja (▼).
     * **✈️ VISITANTE:** Guerreros batea en la Alta (▲) y abre el 1er inning al bate.
3. **Paso 3 & 4: Lanzador Abridor (+55) y Bateador Clave de Guerreros:**
   * Selecciona al abridor `#23 Pedro Chavez` y al referente ofensivo clutch.
   * Organiza a los 9 bateadores titulares verificando que **no existan posiciones defensivas duplicadas** en el campo (1 al 9).
4. **Paso 5: Vista Previa y Certificación:**
   * Presiona `📋 Vista Previa Tarjeta Oficial` para validar la integridad 9vs9.
   * Presiona `💾 Guardar, Certificar e Iniciar Dugout` para comenzar el Inning 1.

---

## ⌨️ 3. OPERACIÓN EN VIVO (DUGOUT KEYPAD & ANOTACIÓN PITCH-BY-PITCH)

Durante el encuentro, el sistema registra cada evento en tiempo real:

```
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│     HITS        │   OUTS / FLIES  │    ROLATAS      │  SITUACIONALES  │
├─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│ [1B] Sencillo   │ [F1] a [F9]     │ [6-3] SS a 1B   │ [K] Ponche Tir. │
│ [2B] Doble      │ (Elevados según │ [4-3] 2B a 1B   │ [Kc] P. Cantado │
│ [3B] Triple     │ posición del    │ [5-3] 3B a 1B   │ [BB] Boleto     │
│ [HR] Jonrón     │ fildeador 1-9)  │ [DP 6-4-3]      │ [SB] Robo Base  │
│                 │                 │ [DP 4-6-3]      │ [SF] Fly Sacrif.│
│                 │                 │                 │ [WP] Wild Pitch │
│                 │                 │                 │ [HBP] Golpeado  │
│                 │                 │                 │ [E] Error Fild. │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

* **Conteo LED de Bolas, Strikes y Outs:** Actualización instantánea con cambio automático de media entrada al completar el 3er out.
* **Diamante SVG Interactivo:** Toca las bases `1B`, `2B` o `3B` para avanzar o colocar corredores en posición anotadora.
* **Tarjeta del Bateador:** Muestra foto, dorsal, nombre, turnos de hoy (`VB, H, 2B, HR, CI, AVE`) y bateador prevenido en el círculo de espera (*On Deck*).

---

## 🩺 4. PROTOCOLO DE SALUD: SEMÁFORO DE FATIGA (+55)

Para proteger la integridad de los lanzadores veteranos en la categoría Senior Master:

```
 🟢 0 - 45 LANZAMIENTOS ──> ZONA VERDE (Rendimiento Óptimo / Plena Potencia)
 🟡 46 - 60 LANZAMIENTOS ──> ZONA AMARILLA (Precaución / Monitorear Velocidad y Control)
 🔴 61 - 75 LANZAMIENTOS ──> ZONA ROJA (Alerta Máxima / ¡Activar y Calentar Bullpen!)
```

* Al alcanzar los **75 pitcheos**, el sistema emite una alerta roja y sugiere el ingreso del relevista correspondiente.

---

## 🖨️ 5. TARJETA OFICIAL DUAL (LINEUP CARD 9vs9 PARA UMPIRES)

Accesible directamente en: [**https://diamax-pro.vercel.app/#tarjeta-oficial**](https://diamax-pro.vercel.app/#tarjeta-oficial)

* **Formato Reglamentario Homologado:** Muestra lado a lado las tarjetas de ambos equipos con números dorsales, nombres, posiciones y brazo bateador/lanzador.
* **Roster Completo de 16 Personas:** 9 titulares en la tabla superior y 7 reservas/cuerpo técnico en la tabla inferior.
* **Selector de Vistas:** Permite alternar entre *Vista Dual*, *Solo Guerreros* o *Solo Rival*.
* **Motor de Impresión PDF `@media print`:** Diseño de alta definición en blanco y negro, sin consumo excesivo de tinta y con líneas de firma para:
  1. *Lic. Alí Zapata Mendoza (Mánager GVE)*
  2. *Mánager del Equipo Contrario*
  3. *Árbitro Principal (Chief Umpire)*

---

## 📋 6. INFORME TÉCNICO OFICIAL DEL PARTIDO & EVALUACIÓN COMPARATIVA (DEL DÍA)

Accesible directamente en: [**https://diamax-pro.vercel.app/#informe-tecnico**](https://diamax-pro.vercel.app/#informe-tecnico)

Documento ejecutivo para gerencia, delegados de liga y cuerpo técnico que incluye:
1. **Ficha Técnica & Condiciones del Juego:** Estadio, dirección GPS, horario, duración oficial y telemetría climática Zapata.
2. **Pizarra Inning a Inning (Boxscore 1 al 9):** Tabla completa con carreras por entrada y totales de **C, H, E y LOB (Dejados en Base)**.
3. **Rendimiento Técnico Comparativo de Ambos Equipos:**
   * **Ofensiva:** VB, C, H, 2B, 3B, HR, CI, BB, Promedio (.AVE), OBP, OPS Colectivo y Bateo Oportuno con Corredores en Posición Anotadora (**RISP**).
   * **Pitcheo:** IP, H, CL, BB, K, Pitches Totales, % de Strikes, Efectividad (ERA) y control del límite +55.
   * **Defensa:** Errores, Doble Plays concretados y Porcentaje de Fildeo (% FLD).
4. **Evaluación Táctica & Scouting:**
   * 🌟 **MVP del Juego:** Elección automática del jugador más valioso con medalla dorada.
   * ⚡ **Punto de Inflexión (Turning Point):** Análisis del momento clave del juego.
   * 🧠 **Recomendaciones Tácticas:** Dictamen técnico para el próximo partido.
5. **Acciones Inmediatas:**
   * `🖨️ Imprimir Informe / PDF`
   * `📋 Copiar Informe (WhatsApp/Texto)`
   * `📧 Enviar por Correo a la Liga`

---

## 📊 7. DASHBOARD DE ANALÍTICA & SUITE DE GRÁFICOS SVG

Accesible directamente en: [**https://diamax-pro.vercel.app/#dashboard**](https://diamax-pro.vercel.app/#dashboard)

* **Gráfico de Barras Sabermétrico:** Permite alternar entre métricas clave (`Hits`, `CI`, `TB/SLG`, `HR`, `AVE`, `OPS`) con resaltado dorado para el líder ofensivo y tooltips interactivos.
* **Gráfico Lineal de Progresión Inning por Inning (1 a 9):** Curva comparativa de carreras acumuladas entre Guerreros y el Rival con área gradiente.
* **Control de Pitcheo y Disciplina:** Monitoreo visual de % de Strikes vs % de Bolas y barras de repertorio de lanzamientos.
* **Tabla Sabermétrica Completa del Roster:** Estadísticas individuales acumuladas en vivo.

---

## 🎯 8. CAMPO 2D, RADAR & SPRAY CHART

Accesible directamente en: [**https://diamax-pro.vercel.app/#campo**](https://diamax-pro.vercel.app/#campo)

* **Posicionamiento Defensivo 2D:** Visualización gráfica de los 9 defensores en el diamante.
* **Spray Chart de Batazos:** Registro de conexiones hacia la banda contraria (Oppo), centro (CF) o tirando a su banda (Pull).
* **Mapa de Calor de Zona de Strike 3x3:** Identificación de zonas calientes (*Hot Zones*) y frías (*Cold Zones*) para cada bateador.

---

## 🧠 9. ASISTENTE TÁCTICO IA (DIAMAX TACTICAL AI™)

Motor de Inteligencia Artificial que procesa en **menos de 1.5 segundos**:
* Ajustes de formación defensiva (*Shifts*) contra bateadores de poder.
* Probabilidad matemática de éxito en robo de base o toque de sacrificio según inning, conteo y outs.
* Momento probabilístico ideal para activar el relevo del bullpen.

---

## 🛡️ 10. SEGURIDAD, ROLES & RESPALDO EN LA NUBE

* **Portal de Autenticación SHA-256:** Acceso seguro con teclado PIN táctil de 4 dígitos.
* **Matriz de Roles:** Mánager (Acceso Total + IA), Anotador (Control de Dugout) y Scout (Analítica).
* **Firebase Cloud Firestore:** Sincronización en tiempo real entre múltiples dispositivos en el dugout.

---

## 🔗 11. ENLACES DIRECTOS EN PRODUCCIÓN

* 📋 **Informe Técnico Oficial:** [https://diamax-pro.vercel.app/#informe-tecnico](https://diamax-pro.vercel.app/#informe-tecnico)
* 🖨️ **Tarjeta Oficial de Alineación (16 Personas):** [https://diamax-pro.vercel.app/#tarjeta-oficial](https://diamax-pro.vercel.app/#tarjeta-oficial)
* 📊 **Dashboard & Gráficos Visuales:** [https://diamax-pro.vercel.app/#dashboard](https://diamax-pro.vercel.app/#dashboard)
* 🎯 **Campo 2D & Spray Chart:** [https://diamax-pro.vercel.app/#campo](https://diamax-pro.vercel.app/#campo)
* 📋 **Lineup Builder:** [https://diamax-pro.vercel.app/#lineup](https://diamax-pro.vercel.app/#lineup)
* 📖 **Manual de Uso Integrado:** [https://diamax-pro.vercel.app/#manual](https://diamax-pro.vercel.app/#manual)

---
*Manual Oficial de Operación Certificado por 3Tree Digital Sport IA para los Guerreros de Venezuela +55.* 🇻🇪⚾
