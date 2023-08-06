# tsmi

Better Misskey API Client for TypeScript/JavaScript

## Thanks

- [MiPA](https://github.com/yupix/MiPA) and
  [MiPAC](https://github.com/yupix/MiPAC) have been helpful in many of the tsmi
  implementations.
  - Thanks also to [Discord.py](https://github.com/Rapptz/discord.py), the
    source of MiPA(C) implementation.
- [misskey-js](https://github.com/misskey-dev/misskey/blob/develop/packages/misskey-js)

## Usage

```js
import Client from "tsmi";

const client = new Client({
  host: "https://<your-misskey-server-url>",
  token: "<YOUR_TOKEN_HERE>",
  channels: ["main", "localTimeline"],
});

client.once("ready", async (me) => {
  console.log("Client ready!");
  const user = await me.user.getMe();
  console.log("Logged in with @", user.name);
});

client.on("noteCreate", (note) => {
  console.log(note);
});
```
