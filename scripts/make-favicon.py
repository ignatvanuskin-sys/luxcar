"""One-off helper: draw the Lux Car favicon (app/favicon.ico).

Run from the project root:  python scripts/make-favicon.py
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "app" / "favicon.ico"

BG_TOP = (22, 24, 28)
BG_BOTTOM = (7, 8, 10)
ACCENT = (255, 122, 26)
SIZE = 256


def load_font(size: int) -> ImageFont.FreeTypeFont:
    for candidate in ("arialbd.ttf", "seguisb.ttf", "segoeuib.ttf", "ariblk.ttf"):
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            continue
    return ImageFont.load_default()


def build() -> Image.Image:
    canvas = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))

    # Vertical gradient background inside a rounded square.
    gradient = Image.new("RGB", (1, SIZE))
    for y in range(SIZE):
        ratio = y / (SIZE - 1)
        gradient.putpixel(
            (0, y),
            tuple(
                round(BG_TOP[i] + (BG_BOTTOM[i] - BG_TOP[i]) * ratio) for i in range(3)
            ),
        )
    gradient = gradient.resize((SIZE, SIZE))

    mask = Image.new("L", (SIZE, SIZE), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, SIZE - 1, SIZE - 1), radius=56, fill=255)
    canvas.paste(gradient, (0, 0), mask)

    draw = ImageDraw.Draw(canvas)
    font = load_font(120)

    left = "L"
    right = "C"
    left_width = draw.textlength(left, font=font)
    right_width = draw.textlength(right, font=font)
    total = left_width + right_width
    start_x = (SIZE - total) / 2
    baseline = SIZE / 2 - 46

    draw.text((start_x, baseline), left, font=font, fill=(255, 255, 255, 255))
    draw.text(
        (start_x + left_width, baseline), right, font=font, fill=(*ACCENT, 255)
    )

    draw.rounded_rectangle((76, 186, 180, 196), radius=5, fill=(*ACCENT, 255))
    return canvas


def main() -> None:
    icon = build()
    icon.save(
        OUT,
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )
    print(f"{OUT.name}: {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
