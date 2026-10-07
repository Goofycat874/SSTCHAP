"""Original piano score + sound effects for the 'Inside the Vidhan Sabha' motion video.

Everything is synthesized here (no samples, no existing music). Timings match the
scene starts in src/Video.jsx: 0, 6, 14, 23, 32, 42, 50, 60, 68, 75, 85, 94 (end 102).
Writes music.wav (44.1 kHz stereo).
"""
import sys
import numpy as np
from scipy.signal import fftconvolve, butter, sosfilt

SR = 44100
DUR = 102.2
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)

def midi_hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def piano(m, vel, length):
    """One synthesized piano note: inharmonic partials, two-stage decay, slight detune, hammer noise."""
    f = midi_hz(m)
    n = int(SR * length)
    t = np.arange(n) / SR
    out = np.zeros(n)
    B = 0.00035
    base = 0.45 + f / 700.0
    for k in range(1, 11):
        fk = k * f * np.sqrt(1 + B * k * k)
        if fk > 12000:
            break
        amp = (1.0 / k ** 1.15) * np.exp(-(k - 1) * (0.42 - 0.22 * vel))
        d = base * (1 + 0.55 * (k - 1))
        env = 0.62 * np.exp(-t * d * 2.6) + 0.38 * np.exp(-t * d * 0.55)
        ph = rng.uniform(0, 2 * np.pi)
        out += amp * env * (np.sin(2 * np.pi * fk * t + ph) + 0.6 * np.sin(2 * np.pi * fk * 1.0011 * t + ph * 0.7))
    out *= 1 - np.exp(-t / 0.0025)
    hn = min(n, int(0.025 * SR))
    hammer = rng.standard_normal(hn) * np.exp(-np.arange(hn) / (0.004 * SR)) * 0.05 * vel
    out[:hn] += hammer
    return out * vel

def add(sig, start, pan=0.0, gain=1.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    lg = np.cos((pan + 1) * np.pi / 4) * gain
    rg = np.sin((pan + 1) * np.pi / 4) * gain
    L[i:i + len(sig)] += sig * lg
    R[i:i + len(sig)] += sig * rg

def note(start, m, vel, off, pan):
    """Play note m at start, damped at time off (like lifting the pedal)."""
    ring = max(0.3, off - start) + 0.6
    s = piano(m, vel, ring)
    t = np.arange(len(s)) / SR
    rel = np.where(t > off - start, np.exp(-(t - (off - start)) / 0.18), 1.0)
    add(s * rel, start, pan)

# ---------------- harmony ----------------
ROOT = {"Am": 45, "F": 41, "C": 48, "G": 43, "Dm": 38, "E": 40, "Em": 40}
QUAL = {"Am": [0, 3, 7], "F": [0, 4, 7], "C": [0, 4, 7], "G": [0, 4, 7], "Dm": [0, 3, 7], "E": [0, 4, 7], "Em": [0, 3, 7]}
# (absolute time, chord, intensity 0..1)
CHORDS = [
    (0.0, "Am", 0.30), (3.0, "F", 0.32),
    (6.0, "C", 0.40), (10.0, "G", 0.42),
    (14.0, "Am", 0.45), (18.5, "F", 0.45),
    (23.0, "Dm", 0.50), (26.2, "E", 0.62), (29.0, "Am", 0.50),
    (32.0, "F", 0.50), (34.5, "C", 0.50), (37.0, "G", 0.52), (39.5, "Am", 0.50),
    (42.0, "Dm", 0.52), (44.2, "E", 0.64), (46.0, "Am", 0.52),
    (50.0, "F", 0.48), (52.5, "C", 0.48), (55.0, "G", 0.50), (57.5, "C", 0.48),
    (60.0, "Am", 0.50), (63.2, "F", 0.58), (65.5, "G", 0.52),
    (68.0, "C", 0.46), (71.5, "F", 0.46),
    (75.0, "Dm", 0.52), (77.5, "Am", 0.55), (80.0, "E", 0.60), (82.5, "E", 0.64),
    (85.0, "F", 0.55), (87.5, "G", 0.56), (90.0, "Am", 0.60), (92.0, "E", 0.62),
    (94.0, "F", 0.50), (96.5, "G", 0.50), (99.0, "C", 0.48),
]
END = 102.0
STEP = 0.375  # arpeggio eighth notes (80 bpm)
PATTERN = [0, 2, 12, 1 + 12, 2 + 12, 1 + 12, 12, 2]  # indices: 0 root, 1 third, 2 fifth (+12 = octave)
SCALE = [57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81]  # A minor / C major, A3..A5

def chord_tones(name):
    r, q = ROOT[name], QUAL[name]
    return r, [r + q[0], r + q[1], r + q[2]]

def lh_note(name, idx):
    r, tones = chord_tones(name)
    base, octv = idx % 12, idx // 12
    return tones[base] + 12 * octv if base < 3 else r

melody_pos = 9  # index into SCALE (E5)
for ci, (t0, name, inten) in enumerate(CHORDS):
    t1 = CHORDS[ci + 1][0] if ci + 1 < len(CHORDS) else END
    last = ci == len(CHORDS) - 1
    r, tones = chord_tones(name)
    # left hand: broken-chord arpeggio
    if last:
        for k, m in enumerate([r - 12, r - 5, r, r + 4, r + 7, r + 14]):
            note(t0 + k * 0.09, m, 0.45 - k * 0.03, END, -0.25)
    else:
        k = 0
        t = t0
        while t < t1 - 0.05:
            idx = PATTERN[k % len(PATTERN)]
            m = lh_note(name, idx)
            v = inten * (1.0 if k % 8 == 0 else 0.72 if k % 4 == 0 else 0.55)
            note(t, m, v, t1, -0.3)
            k += 1
            t += STEP
    # right hand: slow stepwise melody that lands on chord tones at each change
    pcs = {(x % 12) for x in tones}
    if name == "E":
        pcs = {4, 8, 11}  # E G# B
    cands = [i for i, m in enumerate(SCALE) if m % 12 in pcs] or list(range(len(SCALE)))
    if name == "E":
        cands = [i for i in range(len(SCALE)) if SCALE[i] % 12 in (4, 11)]
    melody_pos = min(cands, key=lambda i: abs(i - melody_pos))
    tm = t0
    first = True
    while tm < t1 - 0.4:
        m = SCALE[melody_pos]
        if name == "E" and m % 12 == 7:
            m += 1  # G -> G# leading tone
        dur = 1.5 if not last else END - tm
        v = inten * (1.05 if first else 0.85)
        note(tm, m, min(v, 0.75), min(tm + dur + 0.4, t1 + 0.2 if not last else END), 0.28)
        if first and inten > 0.55:
            note(tm, m - 12, v * 0.55, min(tm + dur, t1), 0.2)  # octave doubling on dramatic changes
        first = False
        tm += 1.5 if not last else 99
        step = rng.choice([-1, 1, 1, -2, 2, 0], p=[0.28, 0.28, 0.12, 0.12, 0.1, 0.1])
        melody_pos = int(np.clip(melody_pos + step, 4, len(SCALE) - 2))

# final ring: high C-E-G sparkle on the end card
for k, m in enumerate([72, 76, 79, 84]):
    note(99.6 + k * 0.22, m, 0.32, END, 0.3)

# ---------------- sound effects ----------------
def lowpass(x, fc):
    sos = butter(2, fc / (SR / 2), output="sos")
    return sosfilt(sos, x)

def thud(start, gain=1.0, f0=110, f1=42):
    n = int(0.7 * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.06)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t / 0.18)
    noise = lowpass(rng.standard_normal(n), 900) * np.exp(-t / 0.035) * 0.6
    add((body + noise) * 0.55 * gain, start, 0.0)

def tick(start, gain=1.0, freq=2400):
    n = int(0.03 * SR)
    t = np.arange(n) / SR
    s = np.sin(2 * np.pi * freq * t) * np.exp(-t / 0.004) + rng.standard_normal(n) * np.exp(-t / 0.002) * 0.3
    add(s * 0.08 * gain, start, rng.uniform(-0.2, 0.2))

def shimmer(start, gain=1.0):
    n = int(0.9 * SR)
    t = np.arange(n) / SR
    s = rng.standard_normal(n)
    sos = butter(2, [3000 / (SR / 2), 9000 / (SR / 2)], btype="band", output="sos")
    s = sosfilt(sos, s) * np.exp(-t / 0.25) * 0.12 * gain
    add(s, start, 0.0)

thud(23 + 3.2, 1.0)                 # MUST RESIGN stamp
thud(42 + 2.2, 0.8, 140, 50)        # laws collide
shimmer(42 + 2.2, 1.0)
thud(42 + 2.9, 0.45, 180, 70)       # PREVAILS stamp
thud(60 + 3.2, 0.6, 90, 38)         # the big "6"
for i in range(8):                  # each challenge pill bites the day bar
    tick(75 + 1 + i * 0.85, 0.9, 1800)

# counter 121 -> 68 ticks (matches eased counter in scene 11, lt 5..7)
def eo(x):
    return 1 - (1 - x) ** 3
prev = 121
for j in range(0, 2001):
    lt = 5 + j * 0.001
    val = round(121 + (68 - 121) * eo(min(1, max(0, (lt - 5) / 2))))
    if val != prev:
        tick(85 + lt, 0.5, 2600)
        prev = val
for k in range(12):                 # end-card seats lighting
    tick(94 + 5 + k * 0.05, 0.25, 3200)

# ---------------- room + master ----------------
ir_len = int(2.4 * SR)
tt = np.arange(ir_len) / SR
irL = lowpass(rng.standard_normal(ir_len), 5000) * np.exp(-tt / 0.42)
irR = lowpass(rng.standard_normal(ir_len), 5000) * np.exp(-tt / 0.42)
irL /= np.sqrt(np.sum(irL ** 2)); irR /= np.sqrt(np.sum(irR ** 2))
wetL = fftconvolve(L, irL)[:N]
wetR = fftconvolve(R, irR)[:N]
outL = L * 0.82 + wetL * 0.32
outR = R * 0.82 + wetR * 0.32

env = np.ones(N)
fi = int(0.25 * SR); env[:fi] = np.linspace(0, 1, fi)
fo0, fo1 = int(100.4 * SR), int(102.0 * SR)
env[fo0:fo1] = np.linspace(1, 0, fo1 - fo0) ** 1.5
env[fo1:] = 0
outL *= env; outR *= env
peak = max(np.abs(outL).max(), np.abs(outR).max())
outL *= 0.85 / peak; outR *= 0.85 / peak

from scipy.io import wavfile
out = np.stack([outL, outR], axis=1)
wavfile.write(sys.argv[1] if len(sys.argv) > 1 else "music.wav", SR, (out * 32767).astype(np.int16))
print("wrote", round(N / SR, 2), "s")
