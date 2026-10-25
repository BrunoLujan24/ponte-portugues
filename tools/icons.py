#!/usr/bin/env python3
"""Genera los íconos de la app (PNG) en icons/."""
import math, pathlib
from PIL import Image, ImageDraw, ImageFont
ROOT = pathlib.Path(__file__).resolve().parent.parent
TEAL, INK, WHITE = (10, 104, 112), (16, 33, 31), (241, 245, 244)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSerif-BoldItalic.ttf'

def draw(size, safe):
    S = 1024
    im = Image.new('RGB', (S, S), TEAL)
    d = ImageDraw.Draw(im)
    band_top = int(S * (0.64 if not safe else 0.66))
    d.rectangle([0, band_top, S, S], fill=WHITE)
    # ondas del calçadão: franjas rellenas (bordes limpios)
    amp, period, thick, gap = 26, 260, 34, 92
    for y0 in range(band_top + 40, S + 80, gap):
        top = [(x, y0 - thick / 2 + amp * math.sin(2 * math.pi * x / period)) for x in range(-20, S + 21, 2)]
        bottom = [(x, y0 + thick / 2 + amp * math.sin(2 * math.pi * x / period)) for x in range(S + 20, -21, -2)]
        d.polygon(top + bottom, fill=INK)
    # letra
    scale = 0.62 if not safe else 0.5
    font = ImageFont.truetype(FONT, int(S * scale))
    text = 'P'
    bb = d.textbbox((0, 0), text, font=font)
    w, h = bb[2] - bb[0], bb[3] - bb[1]
    cx = S * 0.5 - w / 2 - bb[0]
    cy = band_top / 2 - h / 2 - bb[1] + (S * 0.02)
    d.text((cx, cy), text, font=font, fill=WHITE)
    return im.resize((size, size), Image.LANCZOS)

out = ROOT / 'icons'; out.mkdir(exist_ok=True)
draw(180, False).save(out / 'apple-touch-icon.png')
draw(192, False).save(out / 'icon-192.png')
draw(512, False).save(out / 'icon-512.png')
draw(512, True).save(out / 'icon-maskable-512.png')
print('ok')
