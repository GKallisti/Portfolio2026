"""
Generates public/og.png — the preview card shown when the site is shared on
LinkedIn, WhatsApp, Slack or Discord.

Run it again whenever the domain, title or photo changes:

    pip install pillow fonttools brotli
    python scripts/make-og.py

It reads the real site fonts out of node_modules (they ship as woff2, which
Pillow cannot open, so they are converted to TTF in a temp dir first) and the
real photo out of public/, so the card cannot drift from the site by accident.
"""

from __future__ import annotations

import os
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent

# --- edit these -------------------------------------------------------------
DOMAIN = "aidev-gg.ar"
NAME = "Gisella Gonzalez"
ROLE = "AI Integration Specialist"
TAGLINE = "Agentic systems  ·  RAG  ·  Oracle integrations"
HANDLE = "G.KALLISTI"
# ----------------------------------------------------------------------------

W, H = 1200, 630
MARGIN = 72

BG = (10, 12, 16)
TEXT = (232, 237, 242)
MUTED = (154, 167, 184)
ACCENT = (255, 146, 0)
GRID = (32, 40, 51)

FONT_SOURCES = {
    "display": "@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
    "mono": "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
}


def load_fonts() -> dict[str, Path]:
    """woff2 -> ttf, because Pillow/FreeType will not read woff2 directly."""
    out_dir = Path(tempfile.gettempdir()) / "portfolio-og-fonts"
    out_dir.mkdir(parents=True, exist_ok=True)

    paths = {}
    for key, rel in FONT_SOURCES.items():
        src = ROOT / "node_modules" / rel
        if not src.exists():
            raise SystemExit(f"Missing font: {src}\nRun `npm install` first.")
        dest = out_dir / f"{key}.ttf"
        TTFont(str(src)).save(str(dest))
        paths[key] = dest
    return paths


def sized(path: Path, size: int, weight: float | None = None) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    if weight is not None:
        # These are variable fonts; without setting the axis everything renders
        # at the default weight and the hierarchy flattens out.
        try:
            font.set_variation_by_axes([weight])
        except Exception:
            pass
    return font


def draw_tracked(draw, xy, text, font, fill, tracking: float):
    """Pillow has no letter-spacing, so tracked text is drawn per glyph."""
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking
    return x


def main() -> None:
    fonts = load_fonts()
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Same 64px grid as the hero, so the card reads as part of the site.
    for x in range(0, W, 64):
        draw.line([(x, 0), (x, H)], fill=GRID, width=1)
    for y in range(0, H, 64):
        draw.line([(0, y), (W, y)], fill=GRID, width=1)

    # --- photo, right side, circular ---
    photo_path = ROOT / "public" / "gisella.jpg"
    photo_d = 340
    photo_x = W - MARGIN - photo_d
    photo_y = (H - photo_d) // 2

    if photo_path.exists():
        photo = Image.open(photo_path).convert("RGB")
        # Cover-crop to a square before the circular mask, so a non-square
        # source is not squashed.
        side = min(photo.size)
        left = (photo.width - side) // 2
        top = (photo.height - side) // 2
        photo = photo.crop((left, top, left + side, top + side)).resize(
            (photo_d, photo_d), Image.LANCZOS
        )

        mask = Image.new("L", (photo_d * 4, photo_d * 4), 0)
        ImageDraw.Draw(mask).ellipse((0, 0, photo_d * 4, photo_d * 4), fill=255)
        mask = mask.resize((photo_d, photo_d), Image.LANCZOS)  # anti-aliased edge

        img.paste(photo, (photo_x, photo_y), mask)
        draw.ellipse(
            (photo_x - 3, photo_y - 3, photo_x + photo_d + 3, photo_y + photo_d + 3),
            outline=ACCENT,
            width=3,
        )
    else:
        print("No public/gisella.jpg found — rendering without the photo.")

    # --- text, left side ---
    # Sits slightly above centre so the block and the footer split the
    # remaining space evenly rather than leaving a hole in the middle.
    text_top = 152
    draw_tracked(
        draw, (MARGIN, text_top), HANDLE, sized(fonts["mono"], 22, 600), ACCENT, 4.5
    )

    draw.text((MARGIN, text_top + 52), NAME, font=sized(fonts["display"], 82, 600), fill=TEXT)
    draw.text((MARGIN, text_top + 156), ROLE, font=sized(fonts["display"], 40, 500), fill=ACCENT)
    draw.text((MARGIN, text_top + 222), TAGLINE, font=sized(fonts["mono"], 22, 400), fill=MUTED)

    footer_y = H - 148
    draw.line([(MARGIN, footer_y), (MARGIN + 64, footer_y)], fill=ACCENT, width=3)
    draw.text(
        (MARGIN, footer_y + 20), DOMAIN, font=sized(fonts["mono"], 24, 500), fill=MUTED
    )

    dest = ROOT / "public" / "og.png"
    img.save(dest, "PNG", optimize=True)
    print(f"Wrote {dest} ({os.path.getsize(dest) // 1024} KB, {W}x{H})")


if __name__ == "__main__":
    main()
