#!/usr/bin/env python3
"""Extract unaltered endpoint frames and a sampled contact sheet for review."""
import argparse
import json
import math
import subprocess
from pathlib import Path


def run(*args):
    return subprocess.run(args, check=True, capture_output=True, text=True).stdout


parser = argparse.ArgumentParser()
parser.add_argument("video", type=Path)
parser.add_argument("--clip", required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
out = root / "analysis/kling4"
out.mkdir(parents=True, exist_ok=True)
metadata = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(args.video)))
video = next(s for s in metadata["streams"] if s["codec_type"] == "video")
duration = float(video.get("duration", metadata["format"]["duration"]))
frames = int(video["nb_frames"])
prefix = out / args.clip
for label, index in (("first", 0), ("last", frames - 1)):
    run("ffmpeg", "-v", "error", "-i", str(args.video), "-vf", f"select=eq(n\\,{index})", "-frames:v", "1", "-y", f"{prefix}-{label}.png")
rows = math.ceil(math.floor(duration * 3) / 5)
run("ffmpeg", "-v", "error", "-i", str(args.video), "-vf", f"fps=3,scale=426:-1,tile=5x{rows}", "-frames:v", "1", "-y", f"{prefix}-contact.jpg")
summary = {"source": str(args.video), "duration": duration, "frames": frames,
           "width": video["width"], "height": video["height"], "frameRate": video["r_frame_rate"],
           "firstFrame": f"{prefix}-first.png", "lastFrame": f"{prefix}-last.png",
           "contactSheet": f"{prefix}-contact.jpg", "visualReviewRequired": True}
Path(f"{prefix}-metadata.json").write_text(json.dumps(summary, indent=2) + "\n")
print(json.dumps(summary))
