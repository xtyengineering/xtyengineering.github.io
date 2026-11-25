import { copyFileSync } from "node:fs";

copyFileSync(new URL("./index.js", import.meta.url), new URL("./dashboard.js", import.meta.url));
