// Background script para manejar permisos del micrófono
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extensión Transcripción de Voz + IA instalada');
});

// Manejar mensajes del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'requestMicrophonePermission') {
    console.log('Solicitando permisos del micrófono desde background script...');
    
    // Verificar si el navegador soporta getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error('getUserMedia no está soportado en este navegador');
      sendResponse({ 
        success: false, 
        error: 'NotSupportedError',
        message: 'getUserMedia no está soportado en este navegador'
      });
      return true;
    }
    
    // Intentar obtener permisos del micrófono
    navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      } 
    })
      .then(stream => {
        console.log('Stream de audio obtenido correctamente');
        // Detener el stream inmediatamente
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Track de audio detenido:', track.kind);
        });
        sendResponse({ success: true });
      })
      .catch(error => {
        console.error('Error al solicitar permisos:', error);
        console.error('Nombre del error:', error.name);
        console.error('Mensaje del error:', error.message);
        
        sendResponse({ 
          success: false, 
          error: error.name,
          message: error.message 
        });
      });
    return true; // Indica que la respuesta será asíncrona
  }
}); 