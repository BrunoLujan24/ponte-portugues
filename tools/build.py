#!/usr/bin/env python3
"""Construye Ponte Português desde src/.

Salidas:
  index.html      versión instalable (GitHub Pages / pantalla de inicio)
  sw.js           service worker con versión según el contenido
  ponte.html      versión para el artefacto de Claude (fragmento sin <head>), no se sube al repo
  bundle.js       script concatenado para pruebas, no se sube al repo
"""
import hashlib, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / 'src'

css = (SRC / 'style.css').read_text()
files = ['content.js'] + [f'units/{p.name}' for p in sorted((SRC / 'units').glob('*.js'))] + ['units_end.js', 'core.js', 'ui.js']
js = '\n'.join((SRC / f).read_text() for f in files)

FONTS = '''<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..600&display=swap">'''

# ---------- artefacto de Claude ----------
artifact = f'''<title>Ponte Português</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="theme-color" content="#0A6870">
{FONTS}
<style>
{css}
</style>
<div id="app"></div>
<script>
'use strict';
{js}
</script>
'''
(ROOT / 'ponte.html').write_text(artifact)
(ROOT / 'bundle.js').write_text("'use strict';\n" + js)

# ---------- versión instalable ----------
STANDALONE_CSS = '''
:root { color-scheme: light; padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); --statusbar: #0A6870; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --statusbar: #0B1514; } }
:root[data-theme="dark"] { --statusbar: #0B1514; }
body { margin: 0; -webkit-font-smoothing: antialiased; }
img { max-width: 100%; }
[hidden] { display: none !important; }
@media (display-mode: standalone) { body::before { background: var(--statusbar); } }
'''
index = f'''<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Ponte Português</title>
<meta name="description" content="Portugués de Brasil de cero a B2 para hispanohablantes: repetición espaciada, escucha, shadowing y sesiones de 15 a 20 minutos.">
<meta name="theme-color" content="#0A6870" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0B1514" media="(prefers-color-scheme: dark)">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Ponte">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
{FONTS}
<style>
{STANDALONE_CSS}
{css}
</style>
</head>
<body>
<div id="app"></div>
<script>
'use strict';
{js}
</script>
</body>
</html>
'''
(ROOT / 'index.html').write_text(index)

version = hashlib.sha256(index.encode()).hexdigest()[:10]
sw = (ROOT / 'tools' / 'sw.template.js').read_text().replace('__VERSION__', version)
(ROOT / 'sw.js').write_text(sw)
print(f'index.html {len(index) // 1024} KB · ponte.html {len(artifact) // 1024} KB · versión {version}')
