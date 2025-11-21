# NuclearLab Interactive

**Plataforma avanzada para análisis de decaimiento de isótopos radiactivos y experimentos de tecnología nuclear**

NuclearLab Interactive es una aplicación web completa diseñada para estudiantes e investigadores en física nuclear para analizar datos de decaimiento radiactivo. La aplicación proporciona herramientas para procesar mediciones experimentales, calcular constantes de decaimiento, semividas y actividades de saturación, con capacidades de visualización profesional.

## 🔬 Características Principales

- **Gestión de Datos Experimentales**
  - Tabla interactiva para mediciones tiempo-actividad
  - Corrección de radiación de fondo (automática o manual)
  - Importación de datos desde archivos de texto
  - Cálculo automático de valores de actividad neta

- **Herramientas de Análisis Integral**
  - Ajuste de curva de decaimiento exponencial
  - Cálculo de constante de decaimiento (λ), semivida y vida media
  - Determinación de actividades inicial y de saturación
  - Métricas de calidad incluyendo coeficiente R-squared

- **Visualización Profesional**
  - Visualizaciones interactivas con Chart.js
  - Comparación de actividad experimental vs. teórica
  - Resaltado de puntos de medición larga
  - Exportación de gráficos y resultados

- **Interfaz Amigable**
  - Sistema de navegación por pestañas
  - Diseño responsivo para todos los tamaños de pantalla
  - Retroalimentación en tiempo real y notificaciones
  - Ayuda contextual e instrucciones



## ⚙️ Instalación y Uso

Esta aplicación funciona completamente en el navegador sin necesidad de servidor. Para usar NuclearLab Interactive:

1. **Descargar los archivos de la aplicación**:
   ```
   git clone 
   cd NuclearLab-Interactive
   ```

2. **Abrir la aplicación**:
   - Haz doble clic en el archivo `index.html` para abrirlo en tu navegador web
   - O sirve la aplicación usando un servidor web local:
     ```
     python3 -m http.server 8000
     ```
     Luego navega a `http://localhost:8000`

3. **Usar la aplicación**:
   - **Pestaña 1 (Datos Experimentales)**: Ingresa tus datos experimentales
     - Configura parámetros de la tabla y tiempos de medición
     - Ingresa datos de conteo y duraciones de conteo
     - Configura la corrección de radiación de fondo
   
   - **Pestaña 2 (Parámetros del Experimento)**: Configura los parámetros del experimento
     - Establece tiempo de irradiación, tiempo de enfriamiento y duraciones de conteo
     - Sigue las instrucciones paso a paso proporcionadas
   
   - **Pestaña 3 (Análisis y Resultados)**: Ejecuta el análisis
     - Haz clic en "Ejecutar Análisis Completo" para procesar tus datos
     - Visualiza parámetros calculados y visualizaciones
     - Exporta resultados como archivos CSV o PNG

## 🔧 Especificaciones Técnicas

NuclearLab Interactive está construido con tecnologías web modernas:

- **Tecnologías Principales**:
  - HTML5, CSS3, JavaScript (ES6+)
  - Chart.js para visualización de datos
  - Font Awesome para iconos

- **Características Clave**:
  - Diseño responsivo con CSS Grid y Flexbox
  - Interfaz basada en pestañas con animaciones fluidas
  - Procesamiento de datos en el lado del cliente (sin servidor requerido)
  - Capacidades de exportación para resultados y visualizaciones

- **Compatibilidad con Navegadores**:
  - Chrome 80+
  - Firefox 75+
  - Safari 14+
  - Edge 85+

## 🤝 Contribuciones

¡Las contribuciones a NuclearLab Interactive son bienvenidas! Por favor sigue estos pasos:

1. Haz un fork del repositorio
2. Crea tu rama de características (`git checkout -b caracteristica/mi-caracteristica`)
3. Confirma tus cambios (`git commit -m 'Añadir mi característica'`)
4. Sube a la rama (`git push origin caracteristica/mi-caracteristica`)
5. Abre una solicitud de extracción (pull request)

Asegúrate de que tu código siga las pautas de estilo existentes e incluya documentación apropiada.

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Al equipo de Chart.js por su excelente librería de visualización
- A Font Awesome por proporcionar conjuntos completos de iconos
- A la comunidad educativa de física nuclear por la orientación en protocolos experimentales

---

**Desarrollado con ❤️ para la educación y la investigación en física nuclear**  
*Para preguntas o soporte, por favor abre un issue en el repositorio de GitHub*
