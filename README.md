

# Archivo: `index.html`

## Propósito General
Este archivo es una página web que determina la **constante de desintegración** (λ) de un isótopo radiactivo a partir de datos experimentales. Permite el ingreso, manipulación y cálculo de valores radiológicos como la actividad inicial, vida media, actividad de saturación y otros parámetros relacionados.

## Funcionalidades principales
1. **Tabla dinámica de entrada de datos:**
   - Configurable por el usuario en cuanto a filas, tiempos iniciales y pasos de tiempo.
   - Admite valores de "actividad bruta" para calcular "actividad neta", considerando correcciones por **fondo radiactivo**.

2. **Corrección de fondo:**
   - **Automática:** Calcula el promedio de los primeros puntos experimentales.
   - **Manual:** El usuario puede definir el valor del fondo.

3. **Cálculo de parámetros:**
   - Determina constantes:
     - **Constante de desintegración (λ)**.
     - **Semivida (T1/2)**.
     - **Vida promedio (τ)**.
     - **Actividad de Saturación (As)** y otros factores derivados.
   - Utiliza ajustes exponenciales con gráficos de soporte.
   - Calcula el coeficiente de ajuste **R²**.

4. **Exportación y visualización:**
   - Permite exportar gráficos generados con Chart.js a formato PNG.
   - Descarga de resultados calculados en archivo **CSV**.

5. **Interfaz interactiva:**
   - Mensajes de errores, avisos, o confirmaciones directamente visibles.
   - Secciones de fondo, gráficos y resultados diseñadas para UX amigable.

## Estructura del archivo
- **HTML:**
  - Define la estructura de la página con secciones importantes:
    - Controles para ajustar experimentos (e.g., filas, tiempos).
    - Tablas para visualizar `Tiempo`, `Actividad Bruta`, `Actividad Neta`.
    - Submódulo para los resultados con parámetros y ecuaciones.
  - Soporta cargas de archivos `.txt` para mayor flexibilidad en datos.

- **CSS:**
  - Diseño moderno y organizado:
    - Uso limitado de colores (e.g., tonalidades verdes y azules).
    - Asegura la legibilidad y buenos contornos con sombras y márgenes.

- **JavaScript:**
  - **Eventos dinámicos:**
    - Funciones como `autoFillTimes`, `calculateLambda`, y `applyBackgroundToTable` controlan cálculos, ajustes y feedback en la UI.
  - **Integración con Chart.js:**
    - Hace ajustes gráficos para incluir datos experimentales y curvas modeladas.
  - **Exportación:**
    - Genera y permite la descarga de archivos PNG o **CSV** personalizados.

---

Esto resume la funcionalidad del archivo y su propósito dentro de tu proyecto. ¿Te gustaría que esto se transforme en un archivo `README.md`?# ACTIVIDAD-DE-SATURACION
