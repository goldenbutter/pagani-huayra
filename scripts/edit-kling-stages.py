#!/usr/bin/env python3
"""Create the two approved red film edits, preserving earlier exports."""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "exports/kling4/v3-two-stage"
OUT.mkdir(parents=True, exist_ok=True)
ledger = json.loads((ROOT / "docs/prompts/kling4/red/render-ledger.json").read_text())
jobs = {j["clip"]: j for j in ledger["jobs"]}
stages = [
    ("01-explore-open-return", ["01", "02", "03", "04", "05", "06", "07"]),
    ("02-short-orbit-explode-return", ["01", "07", "08"]),
]
receipt = {"speed": 1.6, "fps": 30, "generationCredits": 0, "stages": []}
encoding = ["-an", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
for name, ids in stages:
    command = ["ffmpeg", "-v", "error", "-n"]
    filters = []
    for index, clip in enumerate(ids):
        command += ["-i", str(ROOT / jobs[clip]["localFile"])]
        trim = "trim=start_frame=1," if index else ""
        filters.append(f"[{index}:v:0]{trim}setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=decrease:force_divisible_by=2,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=white,setsar=1,fps=24[v{index}]")
    filters.append("".join(f"[v{i}]" for i in range(len(ids))) + f"concat=n={len(ids)}:v=1:a=0,setpts=(PTS-STARTPTS)/1.6,fps=30,split=3[forwardout][forward][backward]")
    filters.append("[backward]reverse,trim=start_frame=1,setpts=PTS-STARTPTS[return]")
    filters.append("[forward][return]concat=n=2:v=1:a=0[combined]")
    forward = OUT / f"{name}-forward-720p.mp4"
    combined = OUT / f"{name}-720p.mp4"
    command += ["-filter_complex", ";".join(filters), "-map", "[forwardout]", *encoding, str(forward), "-map", "[combined]", *encoding, str(combined)]
    subprocess.run(command, check=True)
    outputs = []
    for path in (forward, combined):
        info = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", str(path)]))
        stream = info["streams"][0]
        assert len(info["streams"]) == 1 and stream["codec_type"] == "video"
        assert (stream["width"], stream["height"], stream["r_frame_rate"]) == (1280, 720, "30/1")
        subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "null", "-"], check=True)
        outputs.append({"file": str(path.relative_to(ROOT)), "frames": int(stream["nb_frames"]), "seconds": float(info["format"]["duration"]), "bytes": path.stat().st_size, "sha256": hashlib.sha256(path.read_bytes()).hexdigest()})
    assert outputs[1]["frames"] == outputs[0]["frames"] * 2 - 1
    result = {"stage": name, "clips": ids, "return": "Full reverse with duplicated turnaround frame omitted", "outputs": outputs}
    receipt["stages"].append(result)
    print(json.dumps(result), flush=True)
(OUT / "edit-receipt.json").write_text(json.dumps(receipt, indent=2) + "\n")
