/**
 * @name ElevatorMusic
 * @description Plays elevator music while Discord is offline or reconnecting. 🛗
 * @version 1.1.0
 * @author efelleto
 * @source https://github.com/efelleto/Discord-Waiting-Room
 */

module.exports = class ElevatorMusic {
    constructor() {
        this.audio = null;
        this.fadeInterval = null;
        this.blobUrl = null;
        this.dingBlobUrl = null;
        this.overlay = null;
        this.floorInterval = null;
        this.floor = 0;

        this.AUDIO_URL = "https://raw.githubusercontent.com/efelleto/Discord-Waiting-Room/main/elevator.mp3";
        this.DING_URL = "https://raw.githubusercontent.com/efelleto/Discord-Waiting-Room/main/ding.mp3";
        this.FADE_DURATION = 3000;
        this.TARGET_VOLUME = 0.5;

        this.onConnecting = this.handleOffline.bind(this);
        this.onConnected = this.handleOnline.bind(this);
    }

    async start() {
        try {
            const [elevRes, dingRes] = await Promise.all([
                fetch(this.AUDIO_URL),
                fetch(this.DING_URL),
            ]);
            this.blobUrl = URL.createObjectURL(await elevRes.blob());
            this.dingBlobUrl = URL.createObjectURL(await dingRes.blob());
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
        if (this.blobUrl) { URL.revokeObjectURL(this.blobUrl); this.blobUrl = null; }
        if (this.dingBlobUrl) { URL.revokeObjectURL(this.dingBlobUrl); this.dingBlobUrl = null; }
        this.stopFloorCounter();
        this.stopElevatorMusic();
    }

    handleOffline() {
        this.playElevatorMusic();
        this.startFloorCounter();
    }

    handleOnline() {
        this.stopElevatorMusic();
        this.stopFloorCounter();
        this.playDing();
    }

    // ─── Floor Counter ────────────────────────────────────────────────────────

    startFloorCounter() {
        if (this.overlay) return;
        this.floor = 1;
        this.overlay = document.createElement("div");
        this.overlay.id = "elevator-music-overlay";
        Object.assign(this.overlay.style, {
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#111",
            color: "#ffd700",
            fontFamily: "monospace",
            fontSize: "22px",
            fontWeight: "bold",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "2px solid #ffd700",
            zIndex: "99999",
            letterSpacing: "2px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.7)",
            userSelect: "none",
        });
        this.overlay.textContent = `🛗  Floor: ${this.floor}`;
        document.body.appendChild(this.overlay);

        this.floorInterval = setInterval(() => {
            this.floor++;
            if (this.overlay) this.overlay.textContent = `🛗  Floor: ${this.floor}`;
        }, 1000);
    }

    stopFloorCounter() {
        if (this.floorInterval) { clearInterval(this.floorInterval); this.floorInterval = null; }
        if (this.overlay) { this.overlay.remove(); this.overlay = null; }
        this.floor = 0;
    }

    // ─── Audio ────────────────────────────────────────────────────────────────

    clearFade() {
        if (this.fadeInterval) { clearInterval(this.fadeInterval); this.fadeInterval = null; }
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
            if (step >= steps) { this.clearFade(); onDone(); }
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
        this.fadeOut(() => { target.pause(); target.currentTime = 0; });
    }

    playDing() {
        if (!this.dingBlobUrl) return;
        const ding = new Audio(this.dingBlobUrl);
        ding.volume = 0.8;
        ding.play().catch(() => {});
    }
};
