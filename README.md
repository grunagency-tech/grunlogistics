# 🚚 GRUNLOGISTICS — TRIP PROFITABILITY & OPERATIONS INTELLIGENCE

> **"Conoce cuánto realmente te deja cada viaje."**  
> Plataforma SaaS B2B de control financiero, visibilidad operacional y recuperación de dinero para pequeñas y medianas empresas de autotransporte de carga en México.

---

## 💡 ¿QUÉ ES GRUNLOGISTICS?

**GRUNLOGISTICS** es una plataforma operativa y financiera diseñada exclusivamente para empresas de autotransporte de carga que necesitan saber la rentabilidad real de cada viaje y detener la fuga de dinero en su operación.

### ❌ LO QUE NO ES GRUNLOGISTICS
* **NO es un CRM** de ventas o prospección.
* **NO es un Chatbot** ni un asistente de chat ficticio.
* **NO es otro TMS genérico** lleno de menús complejos e inútiles.
* **NO es un GPS Tracker genérico** enfocado únicamente en ver puntitos en un mapa.
* **NO es un dashboard lleno de KPIs vacíos** sin impacto en el flujo de caja.
* **NO es una "IA de Fantasía Logística"** que sugiere acciones físicamente imposibles (*ejemplo: "cambia la mercancía a otro tráiler a mitad de carretera"*).

### ✅ LO QUE SÍ ES GRUNLOGISTICS
* Un motor financiero de **TRIP PROFITABILITY** (Margen Esperado vs. Margen Real).
* Un **COST ENGINE** riguroso (Diésel, Casetas, Pago a Chófer, Gastos/Viáticos).
* Un detector de **MONEY RECOVERY** (Identificación de estadías en rampa, desvíos y tiempos de espera cobrables al cliente).
* Un monitor de **KILÓMETROS VACÍOS** y su costo directo a la utilidad.
* Una **APP OPERADOR (MÓVIL)** ultra sencilla para capturar tickets de combustible, peajes, fotos de rampa y evidencias POD en tiempo real.

---

## 🎯 PROPUESTA DE VALOR COMERCIAL (B2B VALUE PROPOSITION)

Para un transportista en México, saber cuánto cobró y dónde está el camión **no es suficiente**. Las empresas de transporte quiebran o sufren de liquidez porque **su margen esperado termina siendo menor al margen real** sin que sepan exactamente dónde se perdió el dinero.

### El Problema Real del Transportista:
1. **Cobró $28,000 MXN por un viaje**, pero al final del mes no tiene flujo. ¿Por qué?
2. **Fuga en Diésel:** El camión rinde 2.35 km/L cuando la línea base era 2.80 km/L. ($840 MXN perdidos).
3. **Estadías en Rampa:** El camión esperó 2 horas y 14 minutos en el CEDIS del cliente sin cobrar nada ($1,500 MXN sin recuperar).
4. **Kilómetros Vacíos:** El retorno de 280 km se hizo sin carga ($3,520 MXN de diésel y casetas a la basura).
5. **Casetas y Desvíos:** Libramientos no presupuestados por obras o tráfico (+ $360 MXN).

### La Solución GRUNLOGISTICS:
> **"Observamos la operación REAL y cuantificamos sus consecuencias económicas."**

Al conectar el **Plan inicial** $\rightarrow$ **Operación Real** $\rightarrow$ **Costo Real** $\rightarrow$ **Margen Real** $\rightarrow$ **Dinero Recuperable**, el transportista recupera el control absoluto de su utilidad por viaje.

---

## 🛠️ EXPLICACIÓN SECCIÓN POR SECCIÓN (PRODUCT WALKTHROUGH)

---

### 1. 🏠 OVERVIEW (PANEL PRINCIPAL & "OPERACIÓN DE HOY")
El panel principal responde de inmediato a la pregunta más importante del director o gerente de operaciones:  
👉 **"¿Qué me está costando dinero hoy?"**

* **Métricas Principales:**
  * **Viajes Activos:** Cantidad de unidades en tránsito en este momento.
  * **Excepciones Activas:** Alertas de desviaciones financieras o de ruta.
  * **Viajes en Riesgo:** Envíos con riesgo de perder la cita de entrega y generar multas.
  * **Potential Recovery:** Dinero acumulado por estadías y demoras detectadas cobrables al cliente.
* **Top Issues Accionables:** Tarjetas directas con botón `[Revisar]` para atender de inmediato retratos en cita, estadías en rampa o sobreconsumos de combustible.

---

### 2. 🗺️ TRIPS (GESTIÓN DE VIAJES & DETALLE INDIVIDUAL)

#### A. Creación de Viaje (New Trip)
* Permite ingresar Cliente, Origen, Destino, Carga, Peso, Unidad, Remolque, Operador, Cita de Entrega y Revenue pactado.
* **Integración de `RoutingProvider`:** Calcula la distancia real en km, casetas estimadas y rendimiento de combustible esperado.
* Soporta proveedor oficial **Google Routes API** o modo seguro **ROUTING DEMO MODE**.

#### B. Detalle del Viaje (Trip Detail & Trip Economics)
Esta es la pantalla central de la plataforma. Ofrece:
* **Tabla Comparativa EXPECTED vs ACTUAL:**
  | Concepto | Expected (Presupuestado) | Actual (Real) | Variación | Origen de Datos |
  | :--- | :--- | :--- | :--- | :--- |
  | **Revenue** | $28,000 | $28,000 | $0 | Contrato |
  | **Diésel** | $7,800 | $8,140 | **+$340** | Ticket #9921 / App Chofer |
  | **Casetas** | $3,200 | $3,240 | **+$40** | IAVE Tag / App Chofer |
  | **Pago Chófer** | $2,100 | $2,100 | $0 | Pago Fijo por Viaje |
  | **Otros Gastos** | $800 | $760 | **-$40** | Viáticos Alimentos |
  | **COSTO TOTAL** | **$13,900** | **$14,240** | **+$340** | **Exceso de costo real** |
  | **MARGEN NETO**| **$14,100 (50.4%)** | **$13,760 (49.1%)**| **-$340** | **Buffer: $13,760 MXN** |

* **Timeline de Eventos Operativos:** Registro en tiempo real de salidas, arribos, horas en rampa y descargas.
* **Módulo de Kilómetros Vacíos:** Cuantifica km cargados vs. vacíos y el costo directo del retorno.
* **Visor de Documentos POD & Evidencias:** Permite abrir las fotos de remolque, sellos de seguridad y boletas firmadas.

---

### 3. 🚛 FLEET (VISTA DE FLOTA & VEHICLE ECONOMICS)
* **Estatus Operativo:** Muestra unidades Disponibles (*Available*), En Viaje (*On trip*), En Espera (*Waiting*) o En Mantenimiento (*Maintenance*).
* **Vehicle Economics por Unidad:**
  * Revenue generado acumulado.
  * Costo operativo total.
  * Costo por kilómetro (**Cost/km**) y Revenue por kilómetro (**Revenue/km**).
  * Porcentaje de utilización de la unidad.
  * **Línea Base de Diésel:** Comparativa de rendimiento esperado vs. real (*ej: 2.35 km/L real vs 2.80 km/L esperado = -16% sobreconsumo*).
* **Mapa Operativo (Secundario):** Visualización cartográfica limpia de unidades y rutas en curso.

---

### 4. 📈 PROFITABILITY ANALYTICS & ECONOMIC SIMULATOR

#### A. Explicación de Fugas de Dinero (Where are we losing money?)
Desglosa el impacto monetario exacto de:
1. **Kilómetros Vacíos:** Costo acumulado de viajes de regreso sin carga.
2. **Tiempos de Espera No Cobrados:** Horas perdidas en rampas de clientes sin facturar estadía.
3. **Variación de Combustible:** Dinero perdido por fallas mecánicas o sobreconsumo de chófer.
4. **Rutas de Bajo Margen:** Identificación de carriles poco rentables.

#### B. Simulador de Sensibilidad Financiera
Permite al director ajustar controles deslizantes (sliders) para proyectar escenarios reales:
* Cambios en precio de diésel (+/- %)
* Incremento de kilómetros vacíos (+/- %)
* Horas adicionales de espera en rampa (+ min)
* Ajuste de tarifas de flete (+/- %)
* Incremento de costo de casetas (+/- %)
👉 **Recalcula de inmediato el Revenue Simulado, Costo Total, Margen Simulado ($ y %) y Punto de Equilibrio (Break-even).**

#### C. Análisis de Punto de Equilibrio (Break-even Revenue)
Muestra el ingreso mínimo necesario por viaje para cubrir costos fijos asignados y costos variables.

---

### 5. 💰 MONEY RECOVERY (RECUPERACIÓN DE DINERO & ESTADÍAS)
Detecta y gestiona dinero que la empresa tiene derecho a cobrar al cliente pero que normalmente se pierde por falta de evidencia:
* **Motivos de Reclamación:** *Detention* (Estadías en rampa), *Additional Mileage* (Desvíos), *Extra Stop* (Paradas extras), *Customer-caused delay*.
* **Workflow de Recuperación:**
  $$\text{Detected} \rightarrow \text{Needs Review} \rightarrow \text{Approved} \rightarrow \text{Submitted} \rightarrow \text{Recovered} \rightarrow \text{Closed}$$
* **Generación de Caso:** Adjunta registros de GPS, fotos de rampa y marcas de tiempo como evidencia probatoria para cobranza.

---

### 6. ⚠️ EXCEPTIONS DASHBOARD
Monitorea excepciones clasificadas por su impacto financiero directo:
* Retraso de viaje con riesgo de multa contractual.
* Estadía excesiva sin facturar.
* Consumo anómalo de combustible.
* Retorno vacío con margen crítico (< 15%).
* Evidencia POD faltante (que bloquea el cobro de la factura).

---

### 7. 👥 CUSTOMERS & 🛣️ ROUTES PROFITABILITY

#### A. Rentabilidad por Cliente (Customer Profitability)
Resuelve el problema de atender clientes que generan "mucho volumen pero poca ganancia":
* Muestra Revenue, Costo, Margen Neto, Margen % y Horas de Espera Acumuladas.
* Permite identificar clientes que destruyen el margen por demoras excesivas en sus CEDIS.

#### B. Rentabilidad por Ruta (Route Profitability)
Clasifica carriles (*ejemplo: Monterrey $\rightarrow$ CDMX*) evaluando su margen promedio y % de retornos vacíos, etiquetándolas como **PROFITABLE** o **LOW MARGIN**.

---

### 8. 📂 DATA IMPORT ENGINE (CARGA DE DATOS)
* Mapeador dinámico de columnas para importar datos históricos o pruebas desde archivos **CSV, Excel (.xlsx) y JSON**.
* Permite importar viajes, unidades, operadores, comprobantes de diésel y casetas.

---

### 9. ⚙️ SETTINGS & ARCHITECTURAL ADAPTERS
* Configuración del **`RoutingProvider`** (Google Routes API vs. Demo Routing Mode).
* Interfaces desacopladas (*Adapters Pattern*) preparadas para conectar:
  * **GPSProvider Adapter:** Wialon, Samsara, GPS local.
  * **FuelProvider Adapter:** Monederos de combustible Edenred, SiVale.
  * **AccountingProvider Adapter:** SAP, CONTPAQi.
  * **DocumentProvider Adapter:** Almacenamiento seguro de evidencias POD.

---

### 10. 📱 APP OPERADOR (DRIVER MOBILE EXPERIENCE)
Diseñada específicamente para su uso desde un smartphone en cabina:
* **Navegación Fácil:** Botón superior y flotante inferior `← Volver al Dashboard Web Admin`.
* **Botones Gigantes de Acción:**
  * `ARRIVED` (Llegué a destino)
  * `START LOADING` (Iniciar Carga)
  * `START UNLOADING` (Iniciar Descarga)
  * `DELIVERED` (Entregado)
  * `REPORT ISSUE` (Reportar problema de tráfico, accidente o rampa con foto)
* **📸 Captura de Tickets, Viáticos y POD:**
  * Permite tomar foto de tickets de diésel, casetas, alimentos o POD firmado.
  * Al subir un ticket, **actualiza de inmediato los costos reales y el margen del viaje en el Dashboard Admin**.

---

## ⏱️ GUION DE VENTA EN 2 MINUTOS (PITCH DE VENTA B2B)

Si vas a presentar **GRUNLOGISTICS** a un cliente transportista en 2 minutos:

1. **Minuto 0:00 - 0:30 (El Problema):**
   > *"Hola [Nombre]. Como transportista sabes perfectamente dónde están tus camiones por el GPS y cuánto cobraste por la carga. Pero al final del mes, ¿sabes exactamente cuánto dinero neto te dejó cada viaje y dónde se fue tu margen? El diésel, las estadías no cobradas en rampas y los viajes de regreso vacíos se comen silenciosamente tu utilidad."*

2. **Minuto 0:30 - 1:15 (La Demostración en Vivo):**
   > *"Te presento **GRUNLOGISTICS**. En 5 segundos mira la pantalla de la Operación de Hoy. Aquí ves que el Viaje #5831 tenía un margen esperado de $14,100 pesos (50.4%), pero el margen real bajó a $13,760. La plataforma te dice exactamente por qué: el chofer gastó $340 pesos más de diésel por tráfico y el camión estuvo parado 2 horas y 14 minutos en el CEDIS del cliente. GRUNLOGISTICS detectó automáticamente que esas 2 horas son $1,500 pesos cobrables por estadía y generó el caso de Money Recovery con la evidencia de GPS lista para cobrarle al cliente."*

3. **Minuto 1:15 - 2:00 (El Valor Único & Cierre):**
   > *"Además, tus choferes no usan sistemas difíciles. Desde su celular en la **App Operador**, le toman foto al ticket de diésel o al POD firmado y en ese instante se actualiza tu estado financiero. No intentamos adivinar la operación con teorías raras; cuantificamos las consecuencias económicas de tu transporte real para que ganes más dinero en cada viaje. ¿Hacemos una prueba con tu flota?"*

---

## 🚀 CÓMO EJECUTAR EL PROYECTO LOCALMENTE

```bash
# 1. Clonar el repositorio
git clone https://github.com/grunagency-tech/grunlogistics.git
cd grunlogistics

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```
