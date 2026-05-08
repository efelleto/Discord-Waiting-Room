/**
 * @name ElevatorMusic
 * @description Plays elevator music while Discord is offline or reconnecting. 🛗
 * @version 1.0.0
 * @author efelleto
 * @source https://github.com/efelleto/Discord-Waiting-Room
 */

module.exports = class ElevatorMusic {
    constructor() {
        this.audio = null;
        this.fadeInterval = null;
        this.AUDIO_URL = "https://raw.githubusercontent.com/efelleto/Discord-Waiting-Room/main/elevator.mp3";
        this.FADE_DURATION = 1500;
        this.TARGET_VOLUME = 0.5;

        this.onConnecting = this.playElevatorMusic.bind(this);
        this.onConnected = this.stopElevatorMusic.bind(this);
    }

    async start() {
        try {
            const res = await fetch(this.AUDIO_URL);
            const blob = await res.blob();
            this.blobUrl = URL.createObjectURL(blob);
            console.log("[ElevatorMusic] Audio pre-loaded, ready");
        } catch (e) {
            console.error("[ElevatorMusic] Failed to pre-load audio:", e);
        }

        window.addEventListener("offline", this.onConnecting);
        window.addEventListener("online", this.onConnected);
    }

    stop() {
        window.removeEventListener("offline", this.onConnecting);
        window.removeEventListener("online", this.onConnected);
        if (this.blobUrl) {
            URL.revokeObjectURL(this.blobUrl);
            this.blobUrl = null;
        }
        this.stopElevatorMusic();
    }

    clearFade() {
        if (this.fadeInterval) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
        }
    }

    fadeIn() {
        this.clearFade();
        this.audio.volume = 0;
        const steps = 30;
        const stepTime = this.FADE_DURATION / steps;
        const stepVolume = this.TARGET_VOLUME / steps;
        let step = 0;

        this.fadeInterval = setInterval(() => {
            if (!this.audio) return this.clearFade();
            step++;
            this.audio.volume = Math.min(stepVolume * step, this.TARGET_VOLUME);
            if (step >= steps) this.clearFade();
        }, stepTime);
    }

    fadeOut(onDone) {
        if (!this.audio) return onDone();
        this.clearFade();
        const startVolume = this.audio.volume;
        const steps = 30;
        const stepTime = this.FADE_DURATION / steps;
        const stepVolume = startVolume / steps;
        let step = 0;

        this.fadeInterval = setInterval(() => {
            if (!this.audio) { this.clearFade(); return onDone(); }
            step++;
            this.audio.volume = Math.max(startVolume - stepVolume * step, 0);
            if (step >= steps) {
                this.clearFade();
                onDone();
            }
        }, stepTime);
    }

    playElevatorMusic() {
        if (this.audio || !this.blobUrl) return;
        this.audio = new Audio(this.blobUrl);
        this.audio.loop = true;
        this.audio.volume = 0;
        this.audio.play()
            .then(() => this.fadeIn())
            .catch(e => console.error("[ElevatorMusic] play failed:", e));
    }

    stopElevatorMusic() {
        if (!this.audio) return;
        const target = this.audio;
        this.audio = null;
        this.fadeOut(() => {
            target.pause();
            target.currentTime = 0;
        });
    }
};
