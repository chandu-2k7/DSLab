#!/usr/bin/env python
# ==========================================================================
# generate-sample-media.py
# --------------------------------------------------------------------------
# Generates the "sample" media that the website links from assets/:
#
#   1. assets/videos/exp-<id>.webm  - a short silent demo clip for EVERY
#      sub-experiment. Each clip shows the real source code typing itself out
#      and then the recorded program output (for Experiment 5 the actual
#      matplotlib / seaborn chart, since that is the real output there).
#      WebM/VP9 plays natively in Chrome, Edge and Firefox.
#
#   2. assets/outputs/exp-<id>.png  - a "result" image for EVERY
#      sub-experiment: the real chart for Experiment 5, otherwise a clean
#      console snapshot of the output recorded during the lab. The website
#      shows this next to the code so the Run action always produces a
#      visible result (see js/editor.js).
#
# It reads the experiment content from js/data.js (via tools/export-data.mjs)
# so there is ONE source of truth and nothing is duplicated by hand.
#
# Requirements (all already present in this environment):
#   python  >= 3.9, node >= 18, numpy, pillow, opencv-python, matplotlib, pandas
#
# Usage:
#   python tools/generate-sample-media.py
# ==========================================================================
from __future__ import annotations

import json
import os
import subprocess
import sys
import textwrap
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[1]
VIDEOS_DIR = ROOT / "assets" / "videos"
OUTPUTS_DIR = ROOT / "assets" / "outputs"

import cv2  # noqa: E402
from PIL import Image, ImageDraw, ImageFont  # noqa: E402

import matplotlib  # noqa: E402

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

# --------------------------------------------------------------------------
# Theme (matches the site's dark editor/console colours)
# --------------------------------------------------------------------------
BG = (14, 21, 38)
BAR = (27, 39, 64)
CODE_BG = (30, 30, 30)
OUT_BG = (17, 24, 42)
WHITE = (234, 240, 255)
MUTED = (159, 176, 207)
GREEN = (142, 227, 184)
ACCENT = (143, 208, 255)
COMMENT = (106, 153, 133)
LINE_NO = (94, 108, 138)

W, H = 640, 360
FPS = 12
F_TYPE = 56          # frames spent "typing" the code
F_OUT = 40           # frames spent showing the output
F_TOTAL = F_TYPE + F_OUT


# --------------------------------------------------------------------------
# Fonts
# --------------------------------------------------------------------------
def load_font(size: int, bold: bool = False):
    candidates = []
    if bold:
        candidates += [r"C:\Windows\Fonts\consolab.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf"]
    candidates += [
        r"C:\Windows\Fonts\consola.ttf",
        r"C:\Windows\Fonts\cour.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()


FONT_TITLE = load_font(12, bold=True)
FONT_CODE = load_font(11)
FONT_OUT = load_font(11)
FONT_SMALL = load_font(10)


# --------------------------------------------------------------------------
# Experiment content
# --------------------------------------------------------------------------
def load_experiments() -> list:
    proc = subprocess.run(
        ["node", "tools/export-data.mjs"],
        cwd=str(ROOT),
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if proc.returncode != 0:
        sys.stderr.write(proc.stderr)
        raise SystemExit("Failed to read js/data.js via tools/export-data.mjs")
    return json.loads(proc.stdout)


# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------
def wrap(text: str, width: int) -> list[str]:
    lines: list[str] = []
    for raw in text.replace("\t", "    ").split("\n"):
        if raw.strip() == "":
            lines.append("")
            continue
        wrapped = textwrap.wrap(raw, width=width, drop_whitespace=False, replace_whitespace=False)
        lines.extend(wrapped or [""])
    return lines


def fit_image(im: Image.Image, box_w: int, box_h: int) -> Image.Image:
    scale = min(box_w / im.width, box_h / im.height)
    return im.resize((max(1, int(im.width * scale)), max(1, int(im.height * scale))), Image.LANCZOS)


# --------------------------------------------------------------------------
# Experiment 5 charts (this is the *real* output of that experiment)
# --------------------------------------------------------------------------
def make_chart(sub_id: str) -> Image.Image:
    plt.close("all")
    rng = np.random.default_rng(42)
    fig = plt.figure(figsize=(4.8, 3.4), dpi=120)

    if sub_id == "5a":
        plt.plot([1, 2, 3, 4], [10, 20, 25, 30], marker="o")
        plt.title("line plot")
        plt.xlabel("x-axis")
        plt.ylabel("y-axis")
        plt.grid(True)
    elif sub_id == "5b":
        import pandas as pd

        df = pd.DataFrame({"category": ["A", "B", "C"], "values": [10, 20, 15]})
        df.plot(kind="bar", x="category", y="values", legend=False, ax=plt.gca())
        plt.title("BarPlot")
    elif sub_id == "5c":
        import seaborn as sns

        sns.histplot(rng.standard_normal(1000), kde=True)
        plt.title("Histogram & Density")
    elif sub_id == "5d":
        plt.scatter(rng.random(50), rng.random(50))
        plt.title("Scatter plot")
        plt.xlabel("x")
        plt.ylabel("y")
    elif sub_id == "5e":
        import seaborn as sns

        sns.boxplot(data=rng.standard_normal(10014))
        plt.title("Box plot")

    fig.tight_layout()
    import io

    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=120)
    plt.close(fig)
    buf.seek(0)
    im = Image.open(buf).convert("RGB")
    im.load()
    return im


# --------------------------------------------------------------------------
# Output snapshot image (console view of recordedOutput)
# --------------------------------------------------------------------------
def make_console_image(sub: dict) -> Image.Image:
    exp_label = sub.get("experimentLabel", "")
    text = sub.get("recordedOutput") or "(no recorded output for this part)"
    lines = wrap(text, width=100)
    lines = lines[:40]

    margin = 22
    head_h = 42
    line_h = 18
    width = 900
    height = head_h + margin + len(lines) * line_h + margin

    img = Image.new("RGB", (width, height), BG)
    d = ImageDraw.Draw(img)

    # Header
    d.rectangle([0, 0, width, head_h], fill=BAR)
    d.text((margin, 13), "Console", font=FONT_TITLE, fill=WHITE)
    d.text((width - margin, 14), "Experiment " + str(sub.get("id", "")).upper(), font=FONT_SMALL, fill=MUTED, anchor="ra")

    # Body
    y = head_h + margin
    for ln in lines:
        color = GREEN if not ln.strip().startswith(("Traceback", "Error")) else (255, 157, 157)
        d.text((margin, y), ln, font=FONT_OUT, fill=color)
        y += line_h
    return img


# --------------------------------------------------------------------------
# Video frames
# --------------------------------------------------------------------------
def draw_title_bar(d: ImageDraw.ImageDraw, sub: dict, filename: str) -> None:
    d.rectangle([0, 0, W, 28], fill=BAR)
    left = "Experiment %s  ·  %s" % (sub.get("experimentLabel", ""), sub.get("label", ""))
    d.text((10, 8), left, font=FONT_TITLE, fill=WHITE)
    d.text((W - 10, 8), filename, font=FONT_SMALL, fill=MUTED, anchor="ra")


def draw_code(d: ImageDraw.ImageDraw, code_text: str, area: tuple[int, int, int, int], reveal_chars: int) -> None:
    x0, y0, x1, y1 = area
    d.rectangle([x0, y0, x1, y1], fill=CODE_BG)
    shown = code_text[:reveal_chars]
    lines = wrap(shown, width=74)
    line_h = 15
    max_lines = (y1 - y0 - 12) // line_h
    visible = lines[-max_lines:] if len(lines) > max_lines else lines
    ty = y0 + 8
    for ln in visible:
        color = COMMENT if ln.lstrip().startswith("#") else WHITE
        d.text((x0 + 12, ty), ln, font=FONT_CODE, fill=color)
        ty += line_h


def draw_output_text(d: ImageDraw.ImageDraw, text: str, area: tuple[int, int, int, int], reveal_chars: int) -> None:
    x0, y0, x1, y1 = area
    d.rectangle([x0, y0, x1, y1], fill=OUT_BG)
    d.text((x0 + 12, y0 + 7), "OUTPUT", font=FONT_SMALL, fill=ACCENT)
    shown = text[:reveal_chars]
    lines = wrap(shown, width=74)
    line_h = 15
    max_lines = (y1 - y0 - 30) // line_h
    visible = lines[-max_lines:] if len(lines) > max_lines else lines
    ty = y0 + 26
    for ln in visible:
        d.text((x0 + 12, ty), ln, font=FONT_OUT, fill=GREEN)
        ty += line_h


def render_video(sub: dict, code: str) -> None:
    out_path = VIDEOS_DIR / ("exp-%s.webm" % sub["id"])
    source_out = sub.get("recordedOutput") or "(no recorded output)"
    chart = make_chart(sub["id"]) if sub["id"].startswith("5") else None

    filename = (sub.get("source") or "script.py").split("/")[-1]
    code_area = (0, 28, W, 200)
    out_area = (0, 200, W, H)

    frames = []
    for i in range(F_TOTAL):
        img = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(img)
        draw_title_bar(d, sub, filename)

        if i < F_TYPE:
            frac = i / max(1, F_TYPE - 1)
            reveal = int(len(code) * frac)
            draw_code(d, code, code_area, reveal)
            # terminal sits idle while typing
            d.rectangle(out_area, fill=OUT_BG)
            d.text((12, out_area[1] + 7), "OUTPUT", font=FONT_SMALL, fill=ACCENT)
            cursor = "▋" if (i // 3) % 2 == 0 else ""
            d.text((12, out_area[1] + 26), cursor, font=FONT_OUT, fill=GREEN)
        else:
            draw_code(d, code, code_area, len(code))
            if chart is not None:
                # Experiment 5: the real figure is the output.
                d.rectangle(out_area, fill=OUT_BG)
                d.text((12, out_area[1] + 7), "Figure 1", font=FONT_SMALL, fill=ACCENT)
                box_w = (W - 40)
                box_h = (H - out_area[1] - 26)
                thumb = fit_image(chart, box_w, box_h)
                img.paste(thumb, ((W - thumb.width) // 2, out_area[1] + 22))
            else:
                frac = (i - F_TYPE) / max(1, F_OUT - 1)
                reveal = int(len(source_out) * frac)
                draw_output_text(d, source_out, out_area, reveal)

        frames.append(cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR))

    writer = cv2.VideoWriter(str(out_path), cv2.VideoWriter_fourcc(*"VP90"), FPS, (W, H))
    if not writer.isOpened():
        raise SystemExit("OpenCV could not open a VP9/WebM writer.")
    for frame in frames:
        writer.write(frame)
    writer.release()
    return out_path


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def main() -> None:
    VIDEOS_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)

    experiments = load_experiments()
    total = 0
    for exp in experiments:
        label = str(exp.get("number", exp.get("id")))
        for sub in exp["subExperiments"]:
            sub["experimentLabel"] = label
            src = ROOT / (sub.get("source") or "")
            code = src.read_text(encoding="utf-8", errors="replace") if src.exists() else "# source file not found\n"

            # 1. Result image
            out_png = OUTPUTS_DIR / ("exp-%s.png" % sub["id"])
            if sub["id"].startswith("5"):
                make_chart(sub["id"]).save(out_png)
            else:
                make_console_image(sub).save(out_png)

            # 2. Demo video
            render_video(sub, code)

            total += 1
            print("  exp-%-4s -> video + output image" % sub["id"])

    print("\nGenerated sample media for %d sub-experiments." % total)
    print("  videos : %s" % VIDEOS_DIR)
    print("  outputs: %s" % OUTPUTS_DIR)


if __name__ == "__main__":
    main()
