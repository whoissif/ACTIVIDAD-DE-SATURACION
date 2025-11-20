let myChart = null;
let backgroundValue = 50.0;
let backgroundError = Math.sqrt(50.0);

// Inicializar la tabla con el tamaño predeterminado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar elementos esenciales antes de inicializar
    const essentialElements = [
        'dataTableBody', 'rowCount', 'startTime', 'timeStep',
        'irradiationTime', 'backgroundMethod', 'manualBackgroundValue',
        'backgroundPoints', 'backgroundValueDisplay', 'backgroundErrorDisplay',
        'useBackground', 'fileInput'
    ];
    
    let allElementsFound = true;
    for (const elementId of essentialElements) {
        if (!document.getElementById(elementId)) {
            console.error(`Elemento '${elementId}' no encontrado en el DOM`);
            allElementsFound = false;
        }
    }
    
    if (allElementsFound) {
        resizeTable(); // Crea la tabla con 30 filas por defecto
        document.getElementById('backgroundMethod').addEventListener('change', updateBackgroundUI);
        updateBackgroundUI();
        updateBackgroundDisplay();
        console.log("Aplicación inicializada correctamente");
    } else {
        showMessage("Error de inicialización: algunos elementos no se encontraron en la página", "error");
    }
});

function resizeTable() {
    try {
        const rowCount = parseInt(document.getElementById('rowCount').value) || 30;
        const tbody = document.getElementById('dataTableBody');
        if (!tbody) {
            console.error("Elemento 'dataTableBody' no encontrado.");
            return;
        }
        tbody.innerHTML = ''; // Limpiar la tabla existente
        const startTime = parseFloat(document.getElementById('startTime').value) || 0;
        const timeStep = parseFloat(document.getElementById('timeStep').value) || 1;
        
        for (let i = 0; i < rowCount; i++) {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            const timeInput = document.createElement('input');
            timeInput.type = 'number';
            timeInput.step = '0.1';
            timeInput.value = (startTime + i * timeStep).toFixed(1);
            timeInput.className = 'time-input';
            timeInput.dataset.index = i;
            timeCell.appendChild(timeInput);
            
            const activityCell = document.createElement('td');
            const activityInput = document.createElement('input');
            activityInput.type = 'number';
            activityInput.step = '0.01';
            activityInput.min = '0';
            const activityValue = backgroundValue;
            activityInput.value = activityValue.toFixed(2);
            activityInput.className = 'activity-input';
            activityInput.addEventListener('change', function() {
                updateNetActivity(this);
            });
            activityCell.appendChild(activityInput);
            
            const netActivityCell = document.createElement('td');
            const netValue = Math.max(0, activityValue - backgroundValue);
            netActivityCell.textContent = netValue.toFixed(2);
            netActivityCell.className = 'net-activity';
            netActivityCell.dataset.index = i;
            
            row.appendChild(timeCell);
            row.appendChild(activityCell);
            row.appendChild(netActivityCell);
            tbody.appendChild(row);
        }
        
        showMessage("Tabla actualizada a " + rowCount + " filas.", "success");
    } catch (error) {
        console.error("Error en resizeTable:", error);
        showMessage("Error al actualizar la tabla: " + error.message, "error");
    }
}

function updateBackgroundUI() {
    try {
        const method = document.getElementById('backgroundMethod').value;
        const autoContainer = document.getElementById('autoBackgroundContainer');
        const manualContainer = document.getElementById('manualBackgroundContainer');
        if (!autoContainer || !manualContainer) {
            console.error("Elementos de UI para fondo no encontrados.");
            return;
        }
        if (method === 'auto') {
            autoContainer.style.display = 'block';
            manualContainer.style.display = 'none';
        } else if (method === 'manual') {
            autoContainer.style.display = 'none';
            manualContainer.style.display = 'block';
        }
    } catch (error) {
        console.error("Error en updateBackgroundUI:", error);
    }
}

function updateNetActivity(inputElement) {
    try {
        if (!document.getElementById('useBackground').checked) return;
        const rowIndex = parseInt(inputElement.dataset.index);
        if (isNaN(rowIndex)) {
            console.error("Índice no encontrado en input de actividad.");
            return;
        }
        const netActivityCells = document.querySelectorAll('.net-activity');
        if (rowIndex >= netActivityCells.length) {
            console.error("Índice de fila fuera de rango para actualizar actividad neta.");
            return;
        }
        const netActivityCell = netActivityCells[rowIndex];
        const rawValue = parseFloat(inputElement.value);
        if (!isNaN(rawValue)) {
            const netValue = Math.max(0, rawValue - backgroundValue);
            netActivityCell.textContent = netValue.toFixed(2);
        }
    } catch (error) {
        console.error("Error en updateNetActivity:", error);
    }
}

function calculateBackground() {
    try {
        if (!document.getElementById('useBackground').checked) {
            showMessage('La corrección de fondo está desactivada. Active la opción para calcular.', "warning");
            return;
        }
        const method = document.getElementById('backgroundMethod').value;
        if (method === 'manual') {
            const manualValue = parseFloat(document.getElementById('manualBackgroundValue').value);
            if (isNaN(manualValue) || manualValue < 0) {
                showMessage('El valor del fondo debe ser un número positivo', "error");
                return;
            }
            backgroundValue = manualValue;
            backgroundError = Math.sqrt(manualValue);
            updateBackgroundDisplay();
            showMessage(`Fondo establecido manualmente: ${backgroundValue.toFixed(2)} ± ${backgroundError.toFixed(2)} cuentas/min`, "success");
            return;
        }
        const pointsCount = parseInt(document.getElementById('backgroundPoints').value) || 5;
        const activityInputs = document.querySelectorAll('.activity-input');
        if (activityInputs.length < pointsCount) {
            showMessage(`No hay suficientes puntos en la tabla. Se necesitan al menos ${pointsCount} puntos para calcular el fondo.`, "error");
            return;
        }
        let backgroundSum = 0;
        let validPoints = 0;
        for (let i = 0; i < pointsCount; i++) {
            if (!activityInputs[i]) {
                console.error(`Input en índice ${i} no encontrado.`);
                continue;
            }
            const value = parseFloat(activityInputs[i].value);
            if (!isNaN(value) && value >= 0) {
                backgroundSum += value;
                validPoints++;
            }
        }
        if (validPoints === 0) {
            showMessage('No se encontraron valores válidos para calcular el fondo.', "error");
            return;
        }
        backgroundValue = backgroundSum / validPoints;
        backgroundError = backgroundValue > 0 ? Math.sqrt(backgroundValue) : 0;
        updateBackgroundDisplay();
        showMessage(`Fondo calculado de ${validPoints} puntos: ${backgroundValue.toFixed(2)} ± ${backgroundError.toFixed(2)} cuentas/min`, "success");
    } catch (error) {
        console.error("Error en calculateBackground:", error);
        showMessage("Error al calcular el fondo: " + error.message, "error");
    }
}

function updateBackgroundDisplay() {
    try {
        const displayValue = document.getElementById('backgroundValueDisplay');
        const displayError = document.getElementById('backgroundErrorDisplay');
        if (displayValue && displayError) {
            displayValue.textContent = backgroundValue.toFixed(2);
            displayError.textContent = backgroundError.toFixed(2);
        } else {
            console.error("Elementos de display de fondo no encontrados.");
        }
    } catch (error) {
        console.error("Error en updateBackgroundDisplay:", error);
    }
}

function applyBackgroundToTable() {
    try {
        if (!document.getElementById('useBackground').checked) {
            showMessage('La corrección de fondo está desactivada. Active la opción primero.', "warning");
            return;
        }
        const activityInputs = document.querySelectorAll('.activity-input');
        const netActivityCells = document.querySelectorAll('.net-activity');
        for (let i = 0; i < activityInputs.length; i++) {
            if (!activityInputs[i] || !netActivityCells[i]) {
                console.warn(`Input o celda de actividad neta en índice ${i} no encontrado, saltando.`);
                continue;
            }
            const rawValue = parseFloat(activityInputs[i].value);
            if (!isNaN(rawValue)) {
                const netValue = Math.max(0, rawValue - backgroundValue);
                netActivityCells[i].textContent = netValue.toFixed(2);
            }
        }
        showMessage(`Corrección de fondo aplicada a la tabla. Valor usado: ${backgroundValue.toFixed(2)} cuentas/min`, "success");
    } catch (error) {
        console.error("Error en applyBackgroundToTable:", error);
        showMessage("Error al aplicar el fondo a la tabla: " + error.message, "error");
    }
}

function autoFillTimes() {
    try {
        const startTime = parseFloat(document.getElementById('startTime').value);
        const timeStep = parseFloat(document.getElementById('timeStep').value);
        if (isNaN(startTime) || isNaN(timeStep) || timeStep <= 0) {
            showMessage('Por favor, introduzca valores numéricos válidos para el tiempo inicial y el paso de tiempo (mayor que 0)', "error");
            return;
        }
        const timeInputs = document.querySelectorAll('.time-input');
        for (let i = 0; i < timeInputs.length; i++) {
            if (!timeInputs[i]) {
                console.warn(`Input de tiempo en índice ${i} no encontrado, saltando.`);
                continue;
            }
            timeInputs[i].value = (startTime + i * timeStep).toFixed(1);
        }
        showMessage(`Tiempos rellenados desde ${startTime} con paso ${timeStep}`, "success");
    } catch (error) {
        console.error("Error en autoFillTimes:", error);
        showMessage("Error al rellenar tiempos: " + error.message, "error");
    }
}

function loadActivityFromFile() {
    try {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput) {
            console.error("Elemento 'fileInput' no encontrado.");
            showMessage('Error: Elemento de entrada de archivo no encontrado en la página', 'error');
            return;
        }
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Por favor, seleccione un archivo .txt', "error");
            return;
        }
        
        // Verificar que el archivo sea de texto
        if (!file.type.match('text.*') && !file.name.toLowerCase().endsWith('.txt')) {
            showMessage('Por favor, seleccione un archivo de texto (.txt)', "error");
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const text = e.target.result;
                console.log("Contenido del archivo:", text);
                
                // Corrección principal: usar \n en lugar del carácter especial
                let lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
                
                // Alternativa si el primer split no funciona (para diferentes formatos de nueva línea)
                if (lines.length === 1 && text.includes('\r')) {
                    lines = text.split('\r').map(line => line.trim()).filter(line => line !== '');
                }
                
                if (lines.length === 0) {
                    showMessage('El archivo está vacío o no contiene datos válidos.', "error");
                    return;
                }
                
                // Redimensionar la tabla para acomodar los datos del archivo
                document.getElementById('rowCount').value = lines.length;
                resizeTable();
                
                const timeInputs = document.querySelectorAll('.time-input');
                const activityInputs = document.querySelectorAll('.activity-input');
                
                const itemsToProcess = Math.min(lines.length, activityInputs.length);
                let successfulLoads = 0;
                
                for (let i = 0; i < itemsToProcess; i++) {
                    if (!activityInputs[i]) {
                        console.warn(`Input de actividad en índice ${i} no encontrado después de redimensionar.`);
                        continue;
                    }
                    
                    // Manejar diferentes formatos de datos
                    let value;
                    if (lines[i].includes(',')) {
                        // Si el archivo tiene formato CSV: tiempo,actividad
                        const parts = lines[i].split(',');
                        if (parts.length >= 2) {
                            if (timeInputs[i]) {
                                const timeValue = parseFloat(parts[0].trim());
                                if (!isNaN(timeValue)) {
                                    timeInputs[i].value = timeValue.toFixed(1);
                                }
                            }
                            value = parseFloat(parts[1].trim());
                        } else {
                            value = parseFloat(lines[i]);
                        }
                    } else {
                        // Si solo tiene un valor por línea (actividad)
                        value = parseFloat(lines[i]);
                    }
                    
                    if (isNaN(value)) {
                        console.warn(`El valor en la línea ${i + 1} no es un número válido: "${lines[i]}"`);
                        continue;
                    }
                    
                    if (value < 0) {
                        console.warn(`El valor en la línea ${i + 1} es negativo: ${value}`);
                        continue;
                    }
                    
                    activityInputs[i].value = value.toFixed(2);
                    if (timeInputs[i] && i === 0) {
                        // Opcional: poner tiempo 0 para la primera medición
                        // timeInputs[i].value = '0.0';
                    }
                    updateNetActivity(activityInputs[i]);
                    successfulLoads++;
                }
                
                if (successfulLoads === 0) {
                    showMessage('No se pudieron cargar valores válidos del archivo.', 'error');
                } else if (successfulLoads < lines.length) {
                    showMessage(`Cargados ${successfulLoads} valores válidos. El archivo tenía ${lines.length} líneas.`, "success");
                } else {
                    showMessage(`Cargados ${successfulLoads} valores del archivo correctamente.`, "success");
                }
                
                // Recalcular fondo si es automático
                if (document.getElementById('backgroundMethod').value === 'auto') {
                    setTimeout(calculateBackground, 100); // Pequeño retraso para asegurar que el DOM esté actualizado
                }
                
            } catch (error) {
                console.error("Error detallado al leer el archivo:", error);
                showMessage('Error al leer el archivo: ' + error.message, "error");
            }
        };
        reader.onerror = function(e) {
            console.error("Error de lectura de archivo:", e);
            showMessage('Error al leer el archivo: ' + (e.message || 'Error desconocido'), "error");
        };
        reader.readAsText(file);
    } catch (error) {
        console.error("Error en loadActivityFromFile:", error);
        showMessage("Error al cargar actividad desde archivo: " + error.message, "error");
    }
}

function calculateLambda() {
    // Limpiar mensajes anteriores
    showMessage("", ""); 
    
    const timeInputs = document.querySelectorAll('.time-input');
    const netActivityCells = document.querySelectorAll('.net-activity');
    
    // Verificar que existan elementos
    if (timeInputs.length === 0 || netActivityCells.length === 0) {
        showMessage("La tabla no contiene filas de datos.", "error");
        return;
    }
    
    const times = [];
    const activities = [];
    
    // Recopilar datos solo de filas donde ambos inputs/celdas existen y son válidos
    for (let i = 0; i < timeInputs.length && i < netActivityCells.length; i++) {
        if (!timeInputs[i] || !netActivityCells[i]) {
            console.warn(`Elementos en índice ${i} no encontrados, saltando.`);
            continue;
        }
        const timeValue = parseFloat(timeInputs[i].value);
        const activityValue = parseFloat(netActivityCells[i].textContent);
        if (isNaN(timeValue)) {
            showMessage(`El valor de tiempo en la fila ${i + 1} debe ser un número. Se omite esta fila.`, "warning");
            continue;
        }
        if (isNaN(activityValue) || activityValue <= 0) {
            showMessage(`El valor de actividad neta en la fila ${i + 1} debe ser un número positivo. Se omite esta fila.`, "warning");
            continue;
        }
        times.push(timeValue);
        activities.push(activityValue);
    }
    
    if (times.length < 3) {
        showMessage('Se necesitan al menos 3 pares de valores (tiempo, actividad neta positiva) para realizar el ajuste.', "error");
        return;
    }
    
    try {
        // Ajuste lineal en logaritmo de actividades
        const logActivities = activities.map(a => Math.log(a));
        const n = times.length;
        const sumX = times.reduce((sum, x) => sum + x, 0);
        const sumY = logActivities.reduce((sum, y) => sum + y, 0);
        const sumXY = times.reduce((sum, x, i) => sum + x * logActivities[i], 0);
        const sumX2 = times.reduce((sum, x) => sum + x * x, 0);
        
        const meanX = sumX / n;
        const meanY = sumY / n;
        
        const numerator = sumXY - n * meanX * meanY;
        const denominator = sumX2 - n * meanX * meanX;
        
        if (Math.abs(denominator) < 1e-10) {
            showMessage('Error: La variación en los tiempos es insuficiente para realizar el ajuste.', "error");
            return;
        }
        
        // CORRECCIÓN PRINCIPAL: Para un decaimiento radiactivo, la pendiente debe ser negativa
        // lambda = |pendiente| (siempre positiva)
        const slope = numerator / denominator;
        const lambda = Math.abs(slope); // lambda siempre positiva para decaimiento
        const intercept = meanY - slope * meanX;
        
        // Si la pendiente es positiva, los datos están invertidos (crecimiento en lugar de decaimiento)
        if (slope > 0) {
            showMessage('Advertencia: Los datos muestran un crecimiento exponencial, no un decaimiento. Verifique el orden de los tiempos.', "warning");
        }
        
        const A0 = Math.exp(intercept);
        const halfLife = Math.log(2) / lambda;
        const meanLife = 1 / lambda;
        
        const irradiationTime = parseFloat(document.getElementById('irradiationTime').value);
        if (i