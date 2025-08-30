document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const summaryBtn = document.getElementById('summaryBtn');
    const saveBtn = document.getElementById('saveBtn');
    const copyBtn = document.getElementById('copyBtn');
    const transcribedText = document.getElementById('transcribedText');
    const summaryText = document.getElementById('summaryText');
    const summaryLength = document.getElementById('summaryLength');
    const summaryStyle = document.getElementById('summaryStyle');
    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');
    const summaryLoader = document.getElementById('summaryLoader');
    const realTimeIndicator = document.getElementById('realTimeIndicator');
    const wordCount = document.getElementById('wordCount');
    const charCount = document.getElementById('charCount');
    
    // Variables para el reconocimiento de voz
    let recognition;
    let isRecording = false;
    let finalTranscript = '';
    
    // Clave de API de OpenAI (¡IMPORTANTE: Reemplaza con tu propia clave!)
    const OPENAI_API_KEY = 'tu-api-key-aqui';
    
    // Función para solicitar permisos del micrófono directamente desde el popup (MV3 no permite getUserMedia en background)
    async function requestMicrophonePermission() {
        try {
            console.log('Solicitando permisos del micrófono (popup)...');

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                statusText.textContent = 'Error: Tu navegador no soporta acceso al micrófono';
                return false;
            }

            // Solicitar permiso directamente (tras gesto del usuario)
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            // Detener inmediatamente (solo necesitamos el permiso)
            stream.getTracks().forEach(track => track.stop());
            console.log('Permisos del micrófono concedidos');
            statusText.textContent = 'Permisos obtenidos correctamente';
            return true;
        } catch (error) {
            console.error('Error al solicitar permisos de micrófono:', error, 'name:', error?.name, 'message:', error?.message);

            // Si el popup no puede mostrar el prompt de permisos, abrir una ventana dedicada
            if (error && (error.name === 'NotAllowedError' || error.name === 'AbortError' || error.name === 'InvalidStateError')) {
                statusText.textContent = 'Necesitamos permisos. Se abrirá una ventana para conceder el micrófono...';
                const permitted = await openPermissionWindowAndWait();
                if (permitted) {
                    statusText.textContent = 'Permisos concedidos. Iniciando...';
                    return true;
                }
                statusText.textContent = 'Permisos no concedidos.';
                return false;
            }

            switch (error?.name) {
                case 'NotFoundError':
                    statusText.textContent = 'Error: No se encontró ningún dispositivo de micrófono.';
                    break;
                case 'NotReadableError':
                    statusText.textContent = 'Error: El micrófono está siendo usado por otra aplicación.';
                    break;
                case 'SecurityError':
                    statusText.textContent = 'Error: El contexto no es seguro (usa HTTPS).';
                    break;
                default:
                    statusText.textContent = `Error: ${error?.message || 'No se pudo solicitar permisos del micrófono'}`;
            }
            return false;
        }
    }

    // Abre una ventana de permisos y espera el resultado
    function openPermissionWindowAndWait() {
        return new Promise((resolve) => {
            let resolved = false;
            const width = 520;
            const height = 420;

            chrome.windows.create({
                url: 'permissions.html',
                type: 'popup',
                width,
                height
            }, (createdWindow) => {
                const windowId = createdWindow?.id;

                const timeoutId = setTimeout(() => {
                    if (!resolved) {
                        resolved = true;
                        resolve(false);
                        if (windowId) chrome.windows.remove(windowId);
                    }
                }, 60000);

                const listener = (message) => {
                    if (message && message.action === 'microphonePermissionResult') {
                        chrome.runtime.onMessage.removeListener(listener);
                        clearTimeout(timeoutId);
                        if (!resolved) {
                            resolved = true;
                            resolve(Boolean(message.success));
                            if (windowId) chrome.windows.remove(windowId);
                        }
                    }
                };

                chrome.runtime.onMessage.addListener(listener);
            });
        });
    }
    
    // Función para actualizar estadísticas del texto
    function updateTextStats() {
        const text = transcribedText.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        
        wordCount.textContent = `${words} palabras`;
        charCount.textContent = `${chars} caracteres`;
    }
    
    // Inicializar el reconocimiento de voz
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.lang = 'es-ES';
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onstart = () => {
            isRecording = true;
            startBtn.disabled = true;
            stopBtn.disabled = false;
            statusDot.classList.add('active');
            statusText.textContent = 'Grabando...';
            transcribedText.value = '';
            finalTranscript = '';
            realTimeIndicator.classList.add('show');
        };
        
        recognition.onresult = (event) => {
            let interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    // Agregar al texto final
                    finalTranscript += transcript;
                } else {
                    // Texto provisional (en tiempo real)
                    interimTranscript += transcript;
                }
            }
            
            // Mostrar texto final + texto provisional
            transcribedText.value = finalTranscript + interimTranscript;
            
            // Actualizar estadísticas
            updateTextStats();
            
            // Hacer scroll automático al final
            transcribedText.scrollTop = transcribedText.scrollHeight;
        };
        
        recognition.onerror = (event) => {
            console.error('Error en reconocimiento:', event.error);
            stopRecording();
            
            // Manejo específico de errores
            switch(event.error) {
                case 'not-allowed':
                    statusText.textContent = 'Error: Permisos de micrófono denegados. Por favor, permite el acceso al micrófono.';
                    alert('Por favor, permite el acceso al micrófono en la configuración del navegador.');
                    break;
                case 'no-speech':
                    statusText.textContent = 'Error: No se detectó voz. Intenta hablar más cerca del micrófono.';
                    break;
                case 'audio-capture':
                    statusText.textContent = 'Error: No se puede acceder al micrófono. Verifica que no esté siendo usado por otra aplicación.';
                    break;
                case 'network':
                    statusText.textContent = 'Error: Problema de red. Verifica tu conexión a internet.';
                    break;
                case 'aborted':
                    statusText.textContent = 'Grabación interrumpida.';
                    break;
                default:
                    statusText.textContent = `Error: ${event.error}`;
            }
        };
        
        recognition.onend = () => {
            if (isRecording) {
                // Si se detiene inesperadamente, reiniciar
                console.log('Reiniciando reconocimiento...');
                setTimeout(() => {
                    if (isRecording) {
                        recognition.start();
                    }
                }, 100);
            }
        };
    } else {
        alert('Tu navegador no soporta el reconocimiento de voz. Prueba con Chrome o Edge.');
    }
    
    // Eventos de los botones
    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    clearBtn.addEventListener('click', clearText);
    summaryBtn.addEventListener('click', generateSummary);
    saveBtn.addEventListener('click', saveToFile);
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Evento para actualizar estadísticas cuando cambia el texto
    transcribedText.addEventListener('input', updateTextStats);
    
    async function startRecording() {
        if (!recognition) {
            alert('El reconocimiento de voz no está disponible en tu navegador.');
            return;
        }
        
        // Cambiar el estado del botón inmediatamente para feedback visual
        startBtn.disabled = true;
        statusText.textContent = 'Solicitando permisos...';
        
        // Solicitar permisos del micrófono primero
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            startBtn.disabled = false;
            return;
        }
        
        try {
            statusText.textContent = 'Iniciando grabación...';
            recognition.start();
        } catch (error) {
            console.error('Error al iniciar grabación:', error);
            statusText.textContent = 'Error al iniciar la grabación';
            startBtn.disabled = false;
        }
    }
    
    function stopRecording() {
        if (recognition) {
            recognition.stop();
            isRecording = false;
            startBtn.disabled = false;
            stopBtn.disabled = true;
            statusDot.classList.remove('active');
            statusText.textContent = 'Grabación detenida';
            realTimeIndicator.classList.remove('show');
        }
    }
    
    function clearText() {
        transcribedText.value = '';
        summaryText.value = '';
        finalTranscript = '';
        statusText.textContent = 'Listo para grabar';
        updateTextStats();
    }
    
    async function generateSummary() {
        const text = transcribedText.value.trim();
        if (!text) {
            alert('No hay texto para resumir.');
            return;
        }
        
        // Mostrar loader
        summaryLoader.style.display = 'inline-block';
        summaryBtn.disabled = true;
        
        try {
            // Opción 1: Usar API de OpenAI (requiere clave API)
            if (OPENAI_API_KEY !== 'tu-api-key-aqui') {
                await generateOpenAISummary(text);
            } else {
                // Opción 2: Resumen local (sin API)
                const summary = generateLocalSummary(text, summaryLength.value, summaryStyle.value);
                summaryText.value = summary;
            }
            
        } catch (error) {
            console.error('Error al generar resumen:', error);
            alert('Ocurrió un error al generar el resumen.');
        } finally {
            summaryLoader.style.display = 'none';
            summaryBtn.disabled = false;
        }
    }
    
    // Función para generar resumen con OpenAI
    async function generateOpenAISummary(text) {
        const lengthMap = {
            'short': 'corto',
            'medium': 'medio',
            'long': 'largo'
        };
        
        const styleMap = {
            'general': 'general',
            'bullet': 'en puntos clave',
            'detailed': 'detallado'
        };
        
        console.log(`Generando resumen: ${summaryLength.value} (${lengthMap[summaryLength.value]}) - ${summaryStyle.value} (${styleMap[summaryStyle.value]})`);
        const prompt = `Genera un resumen ${lengthMap[summaryLength.value]} de estilo ${styleMap[summaryStyle.value]} del siguiente texto en español: ${text}`;
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: summaryLength.value === 'long' ? 300 : 150,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`Error de API: ${response.status}`);
        }
        
        const data = await response.json();
        const summary = data.choices[0].message.content.trim();
        summaryText.value = summary;
    }
    
    // Función para generar resumen local sin API
    function generateLocalSummary(text, length, style) {
        console.log(`Generando resumen local: ${length} - ${style}`);
        // Dividir el texto en oraciones
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        
        if (sentences.length === 0) {
            return 'No se pudo generar un resumen del texto proporcionado.';
        }
        
        // Seleccionar oraciones según la longitud deseada
        let selectedSentences;
        switch(length) {
            case 'short':
                selectedSentences = sentences.slice(0, 1);
                break;
            case 'medium':
                selectedSentences = sentences.slice(0, Math.min(3, sentences.length));
                break;
            case 'long':
                selectedSentences = sentences.slice(0, Math.min(5, sentences.length));
                break;
            default:
                selectedSentences = sentences.slice(0, Math.min(3, sentences.length));
        }
        
        // Generar resumen según el estilo
        let summary = '';
        switch(style) {
            case 'bullet':
                summary = 'Puntos clave:\n' + selectedSentences.map((sentence, index) => 
                    `• ${sentence.trim()}`).join('\n');
                break;
            case 'detailed':
                summary = 'Resumen detallado:\n' + selectedSentences.join('. ');
                break;
            default:
                summary = 'Resumen: ' + selectedSentences.join('. ');
        }
        
        // Agregar puntos finales si no los tienen
        if (!summary.endsWith('.') && !summary.endsWith('!') && !summary.endsWith('?')) {
            summary += '.';
        }
        
        return summary;
    }
    
    // Función para guardar como archivo
    function saveToFile() {
        const text = transcribedText.value.trim();
        const summary = summaryText.value.trim();
        
        if (!text && !summary) {
            alert('No hay contenido para guardar.');
            return;
        }
        
        let content = '';
        if (text) {
            content += '=== TEXTO TRANSCRITO ===\n\n';
            content += text + '\n\n';
        }
        
        if (summary) {
            content += '=== RESUMEN ===\n\n';
            content += summary + '\n\n';
        }
        
        content += `\nGenerado el: ${new Date().toLocaleString('es-ES')}`;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transcripcion_${new Date().toISOString().slice(0, 10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Función para copiar al portapapeles
    async function copyToClipboard() {
        const text = transcribedText.value.trim();
        const summary = summaryText.value.trim();
        
        if (!text && !summary) {
            alert('No hay contenido para copiar.');
            return;
        }
        
        let content = '';
        if (text) {
            content += '=== TEXTO TRANSCRITO ===\n\n';
            content += text + '\n\n';
        }
        
        if (summary) {
            content += '=== RESUMEN ===\n\n';
            content += summary;
        }
        
        try {
            await navigator.clipboard.writeText(content);
            alert('Contenido copiado al portapapeles.');
        } catch (error) {
            console.error('Error al copiar:', error);
            alert('Error al copiar al portapapeles.');
        }
    }
    
    // Cargar texto guardado al abrir el popup
    chrome.storage.local.get(['transcribedText', 'summaryText'], function(result) {
        if (result.transcribedText) {
            transcribedText.value = result.transcribedText;
            finalTranscript = result.transcribedText;
        }
        if (result.summaryText) {
            summaryText.value = result.summaryText;
        }
        updateTextStats();
    });
    
    // Guardar texto cuando cambia
    transcribedText.addEventListener('input', function() {
        chrome.storage.local.set({ 'transcribedText': transcribedText.value });
    });
    
    summaryText.addEventListener('input', function() {
        chrome.storage.local.set({ 'summaryText': summaryText.value });
    });
    
    // Inicializar estadísticas
    updateTextStats();
});