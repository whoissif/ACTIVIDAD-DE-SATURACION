let myChart = null;
let backgroundValue = 50.0;
let backgroundError = Math.sqrt(50.0);

// Inicializar la tabla con el tamaño predeterminado
window.onload = function() {
    resizeTable(); // Crea la tabla con 30 filas por defecto
    document.getElementById('backgroundMethod').addEventListener('change', updateBackgroundUI);
    updateBackgroundUI();
    updateBackgroundDisplay();
};

function resizeTable() {
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
}

function updateBackgroundUI() {
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
}

function updateNetActivity(inputElement) {
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
}

function calculateBackground() {
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
}

function updateBackgroundDisplay() {
    const displayValue = document.getElementById('backgroundValueDisplay');
    const displayError = document.getElementById('backgroundErrorDisplay');
    if (displayValue && displayError) {
        displayValue.textContent = backgroundValue.toFixed(2);
        displayError.textContent = backgroundError.toFixed(2);
    } else {
        console.error("Elementos de display de fondo no encontrados.");
    }
}

function applyBackgroundToTable() {
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
}

function autoFillTimes() {
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
}

function loadActivityFromFile() {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput) {
        console.error("Elemento 'fileInput' no encontrado.");
        return;
    }
    const file = fileInput.files[0];
    if (!file) {
        showMessage('Por favor, seleccione un archivo .txt', "error");
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            const lines = text.split('\n').map(line => line.trim()).filter(line => line !== '');
            if (lines.length === 0) {
                showMessage('El archivo está vacío o no contiene datos válidos.', "error");
                return;
            }
            // Redimensionar la tabla para acomodar los datos del archivo
            document.getElementById('rowCount').value = lines.length;
            resizeTable();
            const activityInputs = document.querySelectorAll('.activity-input');
            const itemsToProcess = Math.min(lines.length, activityInputs.length);
            for (let i = 0; i < itemsToProcess; i++) {
                if (!activityInputs[i]) {
                    console.warn(`Input de actividad en índice ${i} no encontrado después de redimensionar, deteniendo carga.`);
                    break;
                }
                const value = parseFloat(lines[i]);
                if (isNaN(value)) {
                    showMessage(`El valor en la línea ${i + 1} no es un número válido: "${lines[i]}"`, "error");
                    continue;
                }
                if (value < 0) {
                    showMessage(`El valor en la línea ${i + 1} no debe ser negativo: ${value}`, "error");
                    continue;
                }
                activityInputs[i].value = value.toFixed(2);
                updateNetActivity(activityInputs[i]);
            }
            if (itemsToProcess < lines.length) {
                showMessage(`Cargados ${itemsToProcess} valores. El archivo tenía ${lines.length} líneas, se ajustó la tabla.`, "success");
            } else {
                showMessage(`Cargados ${itemsToProcess} valores del archivo.`, "success");
            }
            // Recalcular fondo si es automático
            if (document.getElementById('backgroundMethod').value === 'auto') {
                calculateBackground();
            }
        } catch (error) {
            showMessage('Error al leer el archivo: ' + error.message, "error");
            console.error(error);
        }
    };
    reader.onerror = function() {
        showMessage('Error al leer el archivo', "error");
    };
    reader.readAsText(file);
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
        const slope = numerator / denominator; // Pendiente = -lambda
        const intercept = meanY - slope * meanX; // Intercepto = ln(A0)
        const lambda = -slope;
        const A0 = Math.exp(intercept);
        const halfLife = Math.log(2) / lambda;
        const meanLife = 1 / lambda;
        const irradiationTime = parseFloat(document.getElementById('irradiationTime').value);
        if (isNaN(irradiationTime) || irradiationTime <= 0) {
            showMessage('Por favor, introduzca un valor válido para el tiempo de irradiación (mayor que 0)', "error");
            return;
        }
        // Evitar división por cero si lambda * irradiationTime es muy grande
        const exp_factor = Math.exp(-lambda * irradiationTime);
        if (exp_factor > 0.999999) {
            showMessage('El tiempo de irradiación es insuficiente para calcular la actividad de saturación con la lambda obtenida.', "warning");
            var saturationActivity = A0 / (1 - exp_factor);
            var saturationFactor = A0 / saturationActivity;
            console.warn("Cálculo de saturación problemático. Lambda * t_irr =", lambda * irradiationTime, "exp_factor =", exp_factor);
        } else {
            var saturationActivity = A0 / (1 - exp_factor);
            var saturationFactor = A0 / saturationActivity;
        }
        // Cálculo de R²
        let ssTot = 0;
        let ssRes = 0;
        for (let i = 0; i < times.length; i++) {
            const yPred = slope * times[i] + intercept;
            ssTot += Math.pow(logActivities[i] - meanY, 2);
            ssRes += Math.pow(logActivities[i] - yPred, 2);
        }
        const rSquared = ssTot !== 0 ? 1 - (ssRes / ssTot) : 0;
        
        // Mostrar resultados
        document.getElementById('lambdaValue').textContent = lambda.toFixed(6);
        document.getElementById('a0Value').textContent = A0.toFixed(2);
        document.getElementById('halfLifeValue').textContent = halfLife.toFixed(4);
        document.getElementById('meanLifeValue').textContent = meanLife.toFixed(4);
        document.getElementById('saturationActivityValue').textContent = isFinite(saturationActivity) ? saturationActivity.toFixed(2) : 'N/A (λ*t_irr ~ 0)';
        document.getElementById('saturationFactorValue').textContent = isFinite(saturationFactor) ? saturationFactor.toFixed(4) : 'N/A';
        document.getElementById('backgroundValue').textContent = backgroundValue.toFixed(2);
        document.getElementById('rSquared').textContent = rSquared.toFixed(4);
        document.getElementById('equation').textContent = 
            `A(t) = ${A0.toFixed(2)} * e^(-${lambda.toFixed(6)} * t)`;
        
        // Preparar datos para el gráfico
        const originalData = times.map((t, i) => ({x: t, y: activities[i]}));
        const fittedData = times.map(t => ({x: t, y: A0 * Math.exp(-lambda * t)}));
        
        // Crear gráfico
        createChart(originalData, fittedData);
        
        // Mostrar mensaje de éxito con detalles
        showMessage(`Análisis completado. λ = ${lambda.toFixed(6)} min⁻¹, T½ = ${halfLife.toFixed(4)} min, R² = ${rSquared.toFixed(4)}. ${times.length} puntos usados.`, "success");
    } catch (error) {
        showMessage('Error en el cálculo: ' + error.message, "error");
        console.error(error);
    }
}

function createChart(originalData, fittedData) {
    const ctx = document.getElementById('myChart').getContext('2d');
    if (!ctx) {
        console.error("Contexto del canvas no encontrado.");
        return;
    }
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Datos experimentales (corregidos)',
                    data: originalData,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                    pointRadius: 5
                },
                {
                    label: 'Ajuste exponencial',
                    data: fittedData,
                    backgroundColor: 'rgba(54, 162, 235, 0.0)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    showLine: true,
                    fill: false,
                    lineTension: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Tiempo (minutos)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Actividad Neta (cuentas/min)'
                    },
                    beginAtZero: false
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    });
}

function showDataPreview() {
    const timeInputs = document.querySelectorAll('.time-input');
    const activityInputs = document.querySelectorAll('.activity-input');
    const netActivityCells = document.querySelectorAll('.net-activity');
    let previewText = `Datos en la tabla (Mostrando primeros 15, Total: ${timeInputs.length} filas):\n`;
    previewText += 'Fila\tTiempo (min)\tBruta\tNeta\n';
    previewText += '---------------------------------------------------\n';
    let nonZeroCount = 0;
    const maxPoints = Math.min(15, timeInputs.length);
    for (let i = 0; i < maxPoints; i++) {
        if (!timeInputs[i] || !activityInputs[i] || !netActivityCells[i]) {
            console.warn(`Elementos en fila ${i+1} no encontrados para vista previa.`);
            continue;
        }
        const time = parseFloat(timeInputs[i].value);
        const rawActivity = parseFloat(activityInputs[i].value);
        const netActivity = parseFloat(netActivityCells[i].textContent);
        if (!isNaN(rawActivity) && rawActivity > 0) nonZeroCount++;
        previewText += `${i+1}\t${time.toFixed(1)}\t\t${rawActivity.toFixed(2)}\t${netActivity.toFixed(2)}\n`;
    }
    if (timeInputs.length > maxPoints) {
        previewText += '...\n';
        previewText += `(Mostrando primeros ${maxPoints} de ${timeInputs.length} registros)\n`;
    }
    previewText += `\nTotal de registros: ${timeInputs.length}\n`;
    previewText += `Registros con actividad bruta > 0: ${nonZeroCount}\n`;
    previewText += `Valor actual del fondo: ${backgroundValue.toFixed(2)} ± ${backgroundError.toFixed(2)} cuentas/min`;
    const previewDiv = document.getElementById('dataPreview');
    if (previewDiv) {
        previewDiv.textContent = previewText;
        previewDiv.style.display = 'block';
    } else {
        console.error("Elemento 'dataPreview' no encontrado.");
    }
}

// Función para exportar resultados
function exportResults() {
    const lambdaValue = document.getElementById('lambdaValue').textContent;
    if (lambdaValue === '-' || lambdaValue === '') {
        showMessage('No hay resultados para exportar. Realice el cálculo primero.', 'error');
        return;
    }
    const lambda = lambdaValue;
    const a0 = document.getElementById('a0Value').textContent;
    const halfLife = document.getElementById('halfLifeValue').textContent;
    const meanLife = document.getElementById('meanLifeValue').textContent;
    const saturationActivity = document.getElementById('saturationActivityValue').textContent;
    const saturationFactor = document.getElementById('saturationFactorValue').textContent;
    const background = document.getElementById('backgroundValue').textContent;
    const rSquared = document.getElementById('rSquared').textContent;
    const timeInputs = document.querySelectorAll('.time-input');
    const activityInputs = document.querySelectorAll('.activity-input');
    const netActivityCells = document.querySelectorAll('.net-activity');
    let csvContent = "Resultados del análisis de desintegración radiactiva\n";
    csvContent += "Fecha de exportación: " + new Date().toLocaleString() + "\n";
    csvContent += "Parámetro,Valor,Unidades\n";
    csvContent += `Constante de desintegración (lambda),${lambda},min^-1\n`;
    csvContent += `Actividad inicial A(0),${a0},unidades\n`;
    csvContent += `Semivida T1/2,${halfLife},minutos\n`;
    csvContent += `Vida media tau,${meanLife},minutos\n`;
    csvContent += `Actividad de saturación As,${saturationActivity},unidades\n`;
    csvContent += `Factor de saturación A(0)/As,${saturationFactor},adimensional\n`;
    csvContent += `Valor del fondo,${background},cuentas/min\n`;
    csvContent += `Coeficiente de determinación (R^2),${rSquared},adimensional\n`;
    csvContent += `\nEcuación de ajuste\n`;
    csvContent += `${document.getElementById('equation').textContent}\n`;
    csvContent += "Datos experimentales\n";
    csvContent += "Tiempo (min),Actividad Bruta (cuentas/min),Actividad Neta (cuentas/min)\n";
    for (let i = 0; i < timeInputs.length; i++) {
        if (timeInputs[i] && activityInputs[i] && netActivityCells[i]) {
            const time = timeInputs[i].value;
            const rawActivity = activityInputs[i].value;
            const netActivity = netActivityCells[i].textContent;
            csvContent += `${time},${rawActivity},${netActivity}\n`;
        }
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "resultados_desintegracion_" + new Date().toISOString().replace(/[:.]/g, '-') + ".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showMessage("Resultados exportados correctamente como CSV", "success");
}

// Función para exportar la gráfica
function exportChart() {
    if (!myChart) {
        showMessage("No hay gráfica para exportar. Realice el cálculo primero.", "error");
        return;
    }
    try {
        const imageData = myChart.toBase64Image('image/png', 1);
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'grafica_desintegracion_' + new Date().toISOString().replace(/[:.]/g, '-') + '.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showMessage("Gráfica exportada correctamente como PNG", "success");
    } catch (error) {
        showMessage('Error al exportar la gráfica: ' + error.message, "error");
        console.error(error);
    }
}

function showMessage(message, type) {
    const messageArea = document.getElementById('messageArea');
    if (!messageArea) {
        console.error("Área de mensajes no encontrada.");
        return;
    }
    messageArea.innerHTML = '';
    if (!message) return;
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;
    messageArea.appendChild(messageDiv);
    if (type === "success" || type === "warning") {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 5000);
    }
}