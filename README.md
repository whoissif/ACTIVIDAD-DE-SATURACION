# Determinación de la Actividad de Saturación de un Isótopo Radiactivo

Aplicación web para el análisis de datos de desintegración radiactiva, con cálculo avanzado de parámetros nucleares como la constante de desintegración (λ), semivida, vida media y actividad de saturación.

## Características Principales

- **Entrada flexible de datos**:
  - Tabla editable con tiempos y actividades
  - Carga de datos desde archivos .txt
  - Relleno automático de tiempos con paso configurable
  - Vista previa de datos cargados
  
- **Corrección avanzada por fondo radiactivo**:
  - Cálculo automático del fondo usando los primeros puntos de medición
  - Opción de introducir valor manual del fondo
  - Aplicación instantánea de la corrección a toda la tabla
  - Visualización del error estadístico del fondo (±√N)
  
- **Análisis estadístico completo**:
  - Ajuste exponencial por mínimos cuadrados en escala logarítmica
  - Cálculo de coeficiente de determinación (R²)
  - Determinación precisa de parámetros radiactivos fundamentales
  
- **Visualización interactiva**:
  - Gráficos dinámicos con Chart.js
  - Superposición de datos experimentales y curva de ajuste
  - Visualización clara de la tendencia exponencial
  
- **Resultados detallados**:
  - Constante de desintegración (λ) en min⁻¹
  - Actividad inicial A(0)
  - Semivida (T½) y vida media (τ)
  - Actividad de saturación (Aₛ)
  - Factor de saturación A(0)/Aₛ
  
- **Exportación profesional**:
  - Descarga de resultados en formato CSV
  - Exportación de gráficas como imágenes PNG
  - Formato listo para informes científicos

## Tecnologías Utilizadas

- HTML5, CSS3 y JavaScript puro
- Chart.js para visualizaciones interactivas
- Algoritmos estadísticos implementados manualmente
- Interfaz responsiva para uso en diferentes dispositivos

## Modo de Uso

1. Configure los parámetros iniciales:
   - Establezca el número de filas de datos
   - Defina el tiempo inicial y el paso temporal
   - Ingrese el tiempo de irradiación del isótopo
   
2. Ingrese los datos experimentales:
   - Manualmente en la tabla interactiva
   - Cargando un archivo de texto con los valores de actividad
   
3. Configure la corrección de fondo:
   - Elija entre cálculo automático o valor manual
   - Si es automático, especifique cuántos puntos iniciales usar
   
4. Haga clic en "Calcular Lambda" para realizar el análisis completo
   
5. Revise los resultados y gráficos generados
   - Exporte los resultados o gráficas si es necesario

## Instalación

Simplemente descargue el archivo HTML y ábralo en cualquier navegador web moderno. No requiere instalación de dependencias adicionales ni conexión a internet para funcionar (excepto para la carga inicial de Chart.js).

## Contribución

Las contribuciones son bienvenidas. Por favor abra un issue para discutir cambios importantes antes de enviar un pull request.

## Licencia



---

Esta aplicación es especialmente útil para laboratorios de física nuclear, estudiantes de radioquímica y técnicos en medicina nuclear que necesitan analizar datos de desintegración radiactiva de manera precisa y eficiente, obteniendo parámetros fundamentales para la caracterización de isótopos radiactivos.
