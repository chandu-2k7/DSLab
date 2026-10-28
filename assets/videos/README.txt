Sample demonstration clips
==========================
One short, silent clip per sub-experiment: exp-1a.webm ... exp-7c.webm

Each clip shows the real source code typing itself out and then the recorded
program output. For Experiment 5 the clip shows the actual matplotlib /
seaborn chart, because that is the real output of those programs.

They are generated (not screen recordings) by:

    python tools/generate-sample-media.py

The files are WebM / VP9, which plays natively in Chrome, Edge and Firefox.
They are linked from js/data.js (each sub-experiment's "video" field) and
js/config.js (videos.available = "auto").

Replace any file with a genuine ~15 second screen recording of the same name
to use your own footage - the site needs no other change.
