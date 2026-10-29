#!/usr/bin/env python3
"""Stitch visually accepted Kling clips without transitions or audio."""
import argparse
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument("--orbit-only", action="store_true")
args = parser.parse_args()
ledger_path = root / "docs/prompts/kling4/red/render-ledger.json"
ledger = json.loads(ledger_path.read_text())
plan = ledger["plan"]
if args.orbit_only:
    plan = plan[:4]
if any(item["status"] != "accepted" for item in plan):
    raise SystemExit("Every planned clip must pass visual review before final stitching.")
clips = []
for item in plan:
    job = next(j for j in reversed(ledger["jobs"]) if j["clip"] == item["id"] and j["status"] == "completed" and j.get("review"))
    video = root / job["localFile"]
    if not video.is_file():
        raise SystemExit(f"Missing source: {video}")
    clips.append(video)
out = root / "exports/kling4"
out.mkdir(parents=True, exist_ok=True)
target = out / ("pagani-red-orbit-preview-720p.mp4" if args.orbit_only else "pagani-red-continuous-orbit-exploded-720p.mp4")
command = ["ffmpeg", "-v", "warning", "-y"]
for path in clips:
    command += ["-i", str(path)]
filters = []
for index in range(len(clips)):
    # Remove only the duplicate boundary frame; retain the natural camera holds.
    trim = "trim=start_frame=1," if index else ""
    filters.append(f"[{index}:v:0]{trim}setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1,fps=24[v{index}]")
filters.append("".join(f"[v{i}]" for i in range(len(clips))) + f"concat=n={len(clips)}:v=1:a=0[out]")
command += ["-filter_complex", ";".join(filters), "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(target)]
subprocess.run(command, check=True)
report = {"output": str(target.relative_to(root)), "sources": [str(p.relative_to(root)) for p in clips],
          "transitions": "none", "audio": "removed", "boundaryHandling": "skip first frame of each following clip",
          "normalization": "contain inside 1280x720 white canvas at 24fps; no vehicle cropping"}
target.with_suffix(".receipt.json").write_text(json.dumps(report, indent=2) + "\n")
print(target)
