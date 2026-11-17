"use client";

import { useEffect } from "react";
import { useGame } from "@/components/profile";

type SoundKind = "select" | "reveal" | "success";

let audioContext: AudioContext | null = null;

function contextFromGesture(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  audioContext ??= new AudioContextClass();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

function tone(context: AudioContext, frequency: number, startsAt: number, duration: number, volume: number, type: OscillatorType) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startsAt);
  oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.06, startsAt + duration);
  gain.gain.setValueAtTime(0.0001, startsAt);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), startsAt + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, startsAt + duration);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(startsAt);
  oscillator.stop(startsAt + duration + 0.02);
}

function playSound(kind: SoundKind, volume: number) {
  const context = contextFromGesture();
  if (!context || volume <= 0) return;
  const now = context.currentTime + 0.005;
  const level = Math.min(0.08, 0.065 * volume);
  if (kind === "success") {
    tone(context, 392, now, 0.13, level, "triangle");
    tone(context, 523.25, now + 0.09, 0.16, level, "triangle");
    tone(context, 659.25, now + 0.18, 0.22, level, "triangle");
    return;
  }
  if (kind === "reveal") {
    tone(context, 164.81, now, 0.11, level * 0.8, "sawtooth");
    tone(context, 440, now + 0.055, 0.18, level, "triangle");
    return;
  }
  tone(context, 330, now, 0.065, level * 0.72, "sine");
}

export function SoundEffects() {
  const { profile } = useGame();
  const enabled = profile.settings.soundEnabled ?? true;
  const volume = profile.settings.soundVolume ?? 0.45;

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-sound], button, a") : null;
      if (!target || target.dataset.sound === "none" || target.matches(":disabled") || target.getAttribute("aria-disabled") === "true") return;
      if (!enabled) return;
      const requested = target.dataset.sound;
      const kind: SoundKind = requested === "success" || requested === "reveal" ? requested : "select";
      playSound(kind, volume);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled, volume]);

  return null;
}
