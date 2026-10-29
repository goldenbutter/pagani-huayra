"""Prepare the README animation from the accepted local edit, without generation."""
from pathlib import Path
import shutil
import subprocess
root = Path(__file__).resolve().parents[1]
out = root / 'public/media'
out.mkdir(parents=True, exist_ok=True)
source = root / 'exports/kling4/v3-two-stage/02-short-orbit-explode-return-720p.mp4'
video = out / 'pagani-anatomy-19s.mp4'
if source.exists():
    shutil.copy2(source, video)
if not video.exists():
    raise SystemExit('Supply the accepted MP4 in public/media or the local exports directory.')
shutil.copy2(root / 'public/assets/studio/desktop/0912.webp', out / 'pagani-anatomy-poster.webp')
subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(video),
    '-filter_complex', '[0:v]fps=8,scale=480:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4',
    '-loop', '0', str(out / 'pagani-anatomy-preview.gif')], check=True)
