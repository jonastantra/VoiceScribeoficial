# Solución para el Error del Micrófono

## Problema
El error "No se pudo solicitar permisos del micrófono" puede ocurrir por varias razones. Aquí tienes las soluciones paso a paso:

## Soluciones

### 1. Verificar Permisos del Navegador

**En Chrome/Edge:**
1. Haz clic en el icono del candado 🔒 en la barra de direcciones
2. Busca "Micrófono" en la lista de permisos
3. Cambia de "Bloquear" a "Permitir"
4. Recarga la página

**En Firefox:**
1. Haz clic en el icono del micrófono 🎤 en la barra de direcciones
2. Selecciona "Permitir"
3. Recarga la página

### 2. Verificar Configuración del Sistema

**Windows:**
1. Ve a Configuración > Privacidad y seguridad > Micrófono
2. Asegúrate de que "Acceso al micrófono" esté activado
3. Verifica que Chrome/Edge tenga permiso para acceder al micrófono

**macOS:**
1. Ve a Preferencias del Sistema > Seguridad y Privacidad > Micrófono
2. Asegúrate de que Chrome/Edge esté en la lista y tenga permisos

### 3. Verificar Dispositivos de Audio

1. Asegúrate de que tienes un micrófono conectado y funcionando
2. Verifica que el micrófono no esté siendo usado por otra aplicación
3. Prueba el micrófono en otras aplicaciones (como Grabadora de voz)

### 4. Problemas Comunes y Soluciones

**Error: "NotAllowedError"**
- El usuario denegó los permisos
- Solución: Permitir acceso al micrófono en la configuración del navegador

**Error: "NotFoundError"**
- No se encontró ningún dispositivo de micrófono
- Solución: Conectar un micrófono o verificar que esté funcionando

**Error: "NotReadableError"**
- El micrófono está siendo usado por otra aplicación
- Solución: Cerrar otras aplicaciones que usen el micrófono

**Error: "SecurityError"**
- El contexto no es seguro (HTTPS requerido)
- Solución: Usar la extensión en un sitio web seguro (HTTPS)

### 5. Pasos de Depuración

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Intenta grabar y revisa los mensajes de error
4. Los mensajes te dirán exactamente qué está causando el problema

### 6. Verificar la Extensión

1. Ve a `chrome://extensions/`
2. Busca tu extensión "Transcripción de Voz + IA"
3. Asegúrate de que esté habilitada
4. Haz clic en "Detalles" y verifica que tenga permisos de micrófono

### 7. Reiniciar el Navegador

A veces, simplemente reiniciar el navegador puede solucionar problemas de permisos.

## Si el Problema Persiste

1. Desinstala y vuelve a instalar la extensión
2. Prueba en un navegador diferente (Chrome, Edge, Firefox)
3. Verifica que tu sistema operativo esté actualizado
4. Contacta al desarrollador con los mensajes de error específicos

## Mensajes de Error Mejorados

La extensión ahora muestra mensajes de error más específicos que te ayudarán a identificar exactamente qué está causando el problema. Revisa el mensaje de error en la interfaz para obtener instrucciones específicas.
