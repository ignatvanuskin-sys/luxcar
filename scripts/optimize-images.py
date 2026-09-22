"""One-off helper: convert generated PNG art into web-optimized JPEGs.

Run from the project root:  python scripts/optimize-images.py
Not part of the app runtime; kept for reproducibility.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "media-output"
OUT = ROOT / "public" / "images"

# source file stem -> (output name, target width)
JOBS = {
    "img-mucpdaaq-73f11cc2": ("hero-service-bay", 1920),
    "img-mucpeh8y-408b6377": ("cta-service-hall", 1920),
    "img-mucpde08-cd756932": ("gallery-diagnostics", 1400),
    "img-mucpdg6h-da02cf8a": ("gallery-engine", 1400),
    "img-mucpdc78-978f6c6a": ("gallery-lift", 1400),
    "img-mucpepzy-bdc4823f": ("gallery-tools", 1400),
    "img-mucpephq-52e828ca": ("gallery-electric", 1400),
}


def save(img: Image.Image, path: Path, quality: int = 82) -> None:
    img.convert("RGB").save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    print(f"{path.name}: {path.stat().st_size // 1024} KB  {img.size[0]}x{img.size[1]}")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for stem, (name, width) in JOBS.items():
        source = SRC / f"{stem}.png"
        with Image.open(source) as img:
            if img.width > width:
                height = round(img.height * width / img.width)
                img = img.resize((width, height), Image.LANCZOS)
            save(img, OUT / f"{name}.jpg")

    # Open Graph cover: 1200x630 centre crop of the hero shot.
    with Image.open(SRC / "img-mucpdaaq-73f11cc2.png") as img:
        target = 1200 / 630
        w, h = img.size
        if w / h > target:
            new_w = round(h * target)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            new_h = round(w / target)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
        img = img.resize((1200, 630), Image.LANCZOS)
        save(img, OUT / "og-cover.jpg", quality=85)


if __name__ == "__main__":
    main()
