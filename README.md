# Ponte Português

App personal para aprender **portugués de Brasil** desde cero hasta B2, pensada para hispanohablantes. Funciona en el navegador, se instala en la pantalla de inicio y trabaja sin conexión.

**Abrir la app:** https://brunolujan24.github.io/ponte-portugues/

## Instalar en iPhone

1. Abre el enlace en **Safari**.
2. Toca el botón **Compartir** (el cuadro con la flecha hacia arriba).
3. Elige **Agregar a pantalla de inicio** y luego **Agregar**.

Desde ahí se abre a pantalla completa, como cualquier app, y funciona sin internet después de la primera vez.

## Tu progreso

- Se guarda **en tu teléfono**, dentro de la app. No se sube a ningún servidor ni a este repositorio.
- Si borras los datos de Safari o eliminas la app de la pantalla de inicio, el progreso se pierde. Exporta un respaldo de vez en cuando en **Más › Respaldo**.
- Para pasar tu progreso desde la versión de Claude: allá ve a **Más › Respaldo › Copiar** (o descárgalo), y aquí ve a **Más › Respaldo**, pégalo, toca **Validar** y luego **Restaurar**. El respaldo incluye todos los perfiles.

## Qué incluye

- Temario completo A1–B2 (32 unidades). Contenido incluido: **A1 completo**. Los demás niveles se agregan con actualizaciones.
- Repetición espaciada con FSRS-5, recuperación activa, intercalado y dificultad progresiva.
- Audio con la voz pt-BR del dispositivo (normal y lento), diálogos, shadowing y producción.
- Perfiles con progreso separado, estadísticas, prueba de nivel, mini evaluaciones y exámenes por nivel.

## Desarrollo

El código fuente está en `src/` (`content.js`, `core.js`, `ui.js`, `style.css` y las unidades en `src/units/`). Para generar la app:

```
python3 tools/build.py
```

Eso produce `index.html` y `sw.js`. Los borradores que todavía no se publican están en `src/drafts/`.
