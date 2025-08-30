document.addEventListener('DOMContentLoaded', () => {
  const askBtn = document.getElementById('askBtn');
  const status = document.getElementById('status');

  async function request() {
    status.textContent = 'Solicitando permiso...';
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        status.textContent = 'Este navegador no soporta acceso al micrófono.';
        chrome.runtime.sendMessage({ action: 'microphonePermissionResult', success: false });
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });

      // detener
      stream.getTracks().forEach(t => t.stop());
      status.textContent = 'Permiso concedido.';
      chrome.runtime.sendMessage({ action: 'microphonePermissionResult', success: true });
      window.close();
    } catch (err) {
      console.error('Permiso de micrófono rechazado:', err);
      status.textContent = `Error: ${err?.name || ''} ${err?.message || ''}`.trim();
      chrome.runtime.sendMessage({ action: 'microphonePermissionResult', success: false, error: err?.name, message: err?.message });
    }
  }

  askBtn.addEventListener('click', request);

  // Intentar automáticamente al abrir la ventana
  setTimeout(request, 200);
});


