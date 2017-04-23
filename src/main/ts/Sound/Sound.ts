﻿module Sound {
    export interface Sound {
        () : void;
    }

    export function linearRampGain(gain: GainNode, now: number, attackVolume: number, sustainVolume: number, attackSeconds: number, decaySeconds: number, sustainSeconds: number, durationSeconds: number) {
        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(attackVolume, now + attackSeconds);
        gain.gain.linearRampToValueAtTime(sustainVolume, now + decaySeconds);
        if (sustainSeconds) {
            gain.gain.linearRampToValueAtTime(sustainVolume, now + sustainSeconds);
        }
        gain.gain.linearRampToValueAtTime(0, now + durationSeconds);

    }

}