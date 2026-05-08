# 🛗 discord-waiting-room

> *"You should add elevator music to the loading screen when the API is down"*
> — some guy on Twitter, probably a genius

A Vencord plugin that plays elevator music while Discord is offline or reconnecting.

Because if you're going to wait, you might as well wait **with class**.

---

## What it does

Discord goes down → 🎵 *ba da da da daaaa* 🎵

Discord comes back → silence. You pretend nothing happened.

That's it. That's the plugin.

---

## Why does this exist

On May 8, 2026, Discord's API went down. Millions of people stared at a spinning circle in silence like peasants.

This plugin fixes that.

---

## Installation

> Requires [Vencord](https://github.com/Vendicated/Vencord) installed in developer mode.

1. Clone this repo
2. Copy `index.ts` to `Vencord/src/plugins/elevatorMusic/`
3. Run `pnpm build` inside Vencord
4. Enable **ElevatorMusic** in Vencord settings
5. Wait for Discord to explode

---

## Testing (because you can't wait for Discord to die again)

Open Discord → `Ctrl+Shift+I` → Network tab → set to **Offline**

You're welcome.

---

## Audio

The plugin fetches an MP3 from a URL you configure in `index.ts`.

Recommended source: [this banger](https://www.youtube.com/watch?v=55TD9gnMt3Y)

Download with yt-dlp:
```bash
yt-dlp -x --audio-format mp3 "https://www.youtube.com/watch?v=55TD9gnMt3Y"
```

Then host it somewhere (GitHub Releases works fine) and paste the URL in `ELEVATOR_MUSIC_URL`.

---

## Does this violate Discord's ToS?

Technically yes. So does breathing near their servers apparently, given how often they go down.

---

## Contributing

If Discord goes down again and you have ideas, PRs are open.

Suggested features:
- [ ] Fade in/out
- [ ] Show estimated wait time (just make up a number)
- [ ] "Floor: ???" UI overlay
- [ ] Different music genres based on how long the outage lasts

---

## License

MIT. Go nuts.
