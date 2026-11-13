"""Build the small first-visit scrub sheet from the published film frames."""
from pathlib import Path
from PIL import Image

studio = Path(__file__).resolve().parents[1] / "public/assets/studio"
indices = range(0, 913, 8)
width, height, columns = 256, 144, 12
sheet = Image.new("RGB", (width * columns, height * ((len(indices) + columns - 1) // columns)), "#fbfbfb")
for tile, index in enumerate(indices):
    with Image.open(studio / "mobile" / f"{index:04d}.webp") as frame:
        sheet.paste(frame.resize((width, height), Image.Resampling.LANCZOS),
                    ((tile % columns) * width, (tile // columns) * height))
sheet.save(studio / "scrub-preview.webp", quality=66, method=6)
