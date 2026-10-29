"""Transcode accepted film frames for scroll playback. Preserve all sources."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess
import json
import shutil
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/assets/studio'
SOURCE = ROOT / 'exports/kling4/pagani-red-continuous-orbit-exploded-720p.mp4'
for size in ['desktop', 'mobile']:
    (OUT / size).mkdir(parents=True, exist_ok=True)

def save(args):
    i, data = args
    image = Image.frombytes('RGB', (1280, 720), data)
    image.save(OUT / 'desktop' / f'{i:04d}.webp', quality=80, method=4)
    image.resize((768, 432), Image.Resampling.LANCZOS).save(OUT / 'mobile' / f'{i:04d}.webp', quality=78, method=4)

process = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', str(SOURCE), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
with ThreadPoolExecutor(max_workers=4) as pool:
    pending = []
    count = 0
    while True:
        data = process.stdout.read(1280 * 720 * 3)
        if not data:
            break
        assert len(data) == 1280 * 720 * 3
        pending.append(pool.submit(save, (count, data)))
        count += 1
        if len(pending) >= 12:
            pending.pop(0).result()
    for future in pending:
        future.result()
assert process.wait() == 0 and count == 913
shutil.copy2(OUT / 'desktop/0000.webp', OUT / 'poster.webp')
manifest = {'source': str(SOURCE.relative_to(ROOT)), 'frames': count, 'fps': 24,
            'firstStage': {'forward': [0, 792], 'reverse': True},
            'secondStage': {'forward': [[0, 120], [673, 912]], 'reverse': True},
            'background': '#fbfbfb', 'variants': {}}
for size in ['desktop', 'mobile']:
    manifest['variants'][size] = {'bytes': sum(p.stat().st_size for p in (OUT / size).glob('*.webp'))}
(OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps(manifest), flush=True)
