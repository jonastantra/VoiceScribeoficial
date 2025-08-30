# 🎤 Transcripción de Voz + Resumen IA

Una extensión de Chrome que convierte voz a texto en tiempo real y genera resúmenes inteligentes usando IA.

## ✨ Características

- **Transcripción en tiempo real**: Convierte tu voz a texto instantáneamente
- **Resumen con IA**: Genera resúmenes inteligentes del texto transcrito
- **Múltiples estilos de resumen**: General, puntos clave y detallado
- **Diferentes longitudes**: Corto, medio y largo
- **Exportación**: Guarda como archivo TXT o copia al portapapeles
- **Estadísticas**: Contador de palabras y caracteres
- **Interfaz moderna**: Diseño atractivo y fácil de usar

## 🚀 Instalación

1. **Descarga los archivos** de la extensión
2. **Abre Chrome** y ve a `chrome://extensions/`
3. **Activa el "Modo desarrollador"** (esquina superior derecha)
4. **Haz clic en "Cargar descomprimida"**
5. **Selecciona la carpeta** con los archivos de la extensión
6. **¡Listo!** La extensión aparecerá en tu barra de herramientas

## 📖 Cómo usar

### Transcripción de Voz
1. **Haz clic** en el ícono de la extensión
2. **Permite acceso al micrófono** cuando el navegador lo solicite
3. **Haz clic en "Iniciar Grabación"**
4. **Habla** y verás el texto aparecer en tiempo real
5. **Haz clic en "Detener Grabación"** cuando termines

### Generar Resumen
1. **Selecciona la longitud** del resumen (Corto/Medio/Largo)
2. **Elige el estilo** (General/Puntos clave/Detallado)
3. **Haz clic en "Generar Resumen"**
4. **Espera** a que se genere el resumen

### Exportar Contenido
- **Guardar como TXT**: Descarga un archivo con el texto y resumen
- **Copiar al Portapapeles**: Copia todo el contenido para pegarlo en otro lugar

## ⚙️ Configuración

### Para usar resúmenes con IA real (OpenAI):
1. **Obtén una clave API** de OpenAI en [platform.openai.com](https://platform.openai.com)
2. **Abre el archivo `popup.js`**
3. **Reemplaza** `'tu-api-key-aqui'` con tu clave API real
4. **Recarga la extensión**

### Sin API (resumen local):
La extensión funciona perfectamente sin API, generando resúmenes básicos localmente.

## 🔧 Funciones

### Transcripción
- ✅ Reconocimiento de voz en tiempo real
- ✅ Soporte para español
- ✅ Indicador visual de grabación
- ✅ Estadísticas de texto (palabras/caracteres)

### Resumen
- ✅ **Con API**: Resúmenes inteligentes usando GPT-3.5
- ✅ **Sin API**: Resúmenes básicos generados localmente
- ✅ 3 longitudes diferentes
- ✅ 3 estilos de resumen

### Exportación
- ✅ Guardar como archivo TXT
- ✅ Copiar al portapapeles
- ✅ Formato organizado con fecha

## 🛠️ Archivos de la extensión

- `manifest.json` - Configuración de la extensión
- `popup.html` - Interfaz de usuario
- `popup.js` - Lógica principal
- `background.js` - Manejo de permisos
- `styles.css` - Estilos y diseño
- `icons/` - Iconos de la extensión

## 🔒 Privacidad

- **Sin almacenamiento en la nube**: Todo se procesa localmente
- **Permisos mínimos**: Solo acceso al micrófono y almacenamiento local
- **Sin tracking**: No se recopilan datos personales

## 🐛 Solución de problemas

### Error de permisos del micrófono:
1. Ve a `chrome://settings/content/microphone`
2. Asegúrate de que no haya sitios bloqueados
3. Recarga la extensión

### No funciona el reconocimiento de voz:
1. Verifica que uses Chrome o Edge
2. Asegúrate de tener un micrófono conectado
3. Revisa que no haya otras aplicaciones usando el micrófono

### Error al generar resumen:
- Si usas API: Verifica tu clave de OpenAI
- Si no usas API: El resumen local debería funcionar siempre

## 📝 Notas técnicas

- **Reconocimiento de voz**: Usa la API Web Speech Recognition
- **Idioma**: Configurado para español (es-ES)
- **Almacenamiento**: Usa Chrome Storage API para persistencia
- **Compatibilidad**: Chrome, Edge, otros navegadores basados en Chromium

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una sugerencia, no dudes en reportarlo.

## 📄 Licencia

Esta extensión es de código abierto y está disponible bajo la licencia MIT.

---

**¡Disfruta transcribiendo y resumiendo con IA!** 🎉