"""Build 240 scroll frames per color from the supplied 24fps films.

Requires ffmpeg/ffprobe and Pillow. Source files are never modified.
Motion-compensated 30fps interpolation adds temporal samples; it cannot
recover geometry missing from, or remove artifacts already in, the sources.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
import subprocess
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

def prepare(color):
    source = ROOT / f"assets/source/videos/Pagani_Huayra_BC_studio_shot_{color}.mp4"
    desktop = ROOT / f"public/assets/sequences/{color}/desktop"
    mobile = desktop.parent / "mobile"
    desktop.mkdir(parents=True, exist_ok=True)
    mobile.mkdir(parents=True, exist_ok=True)
    print(f"Interpolating {color}: 24 → 30 fps", flush=True)
    subprocess.run([
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(source),
        "-vf", "tpad=stop_mode=clone:stop_duration=0.2,minterpolate=fps=30:mi_mode=mci:mc_mode=obmc:me_mode=bidir:search_param=16,setsar=1",
        "-frames:v", "240", "-q:v", "3", str(desktop / "%d.jpg"),
    ], check=True)
    assert len(list(desktop.glob("*.jpg"))) == 240
    for i in range(1, 241):
        with Image.open(desktop / f"{i}.jpg") as image:
            assert image.size == (1280, 720)
            image.resize((768, 432), Image.Resampling.LANCZOS).save(mobile / f"{i}.jpg", quality=86, optimize=True)
    result = {"color": color, "frames": 240, "fps": 30, "duration": 8,
              "sourceFrames": 192, "sourceFps": 24,
              "method": "FFmpeg motion-compensated interpolation",
              "source": str(source.relative_to(ROOT)),
              "sourceSha256": hashlib.sha256(source.read_bytes()).hexdigest(),
              "desktop": {"width": 1280, "height": 720, "bytes": sum(f.stat().st_size for f in desktop.glob('*.jpg'))},
              "mobile": {"width": 768, "height": 432, "bytes": sum(f.stat().st_size for f in mobile.glob('*.jpg'))}}
    print(f"Ready: {color}, 240 desktop + 240 mobile frames", flush=True)
    return result

if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=2) as pool:
        sequences = list(pool.map(prepare, ["red", "white", "green"]))
    (ROOT / "public/assets/sequences/manifest.json").write_text(json.dumps(sequences, indent=2) + "\n")
