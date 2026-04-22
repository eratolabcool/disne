globalThis.process ??= {}; globalThis.process.env ??= {};
import { renderers } from './renderers.mjs';
import { createExports } from './_@astrojs-ssr-adapter.mjs';
import { manifest } from './manifest_XQI86Fd8.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/achievements/sync.astro.mjs');
const _page2 = () => import('./pages/api/daily/_date_.astro.mjs');
const _page3 = () => import('./pages/api/leaderboard/_id_.astro.mjs');
const _page4 = () => import('./pages/api/rooms/create.astro.mjs');
const _page5 = () => import('./pages/api/rooms/join.astro.mjs');
const _page6 = () => import('./pages/api/rooms/poll.astro.mjs');
const _page7 = () => import('./pages/api/rooms/report.astro.mjs');
const _page8 = () => import('./pages/api/rooms/start.astro.mjs');
const _page9 = () => import('./pages/api/scores.astro.mjs');
const _page10 = () => import('./pages/campaign.astro.mjs');
const _page11 = () => import('./pages/leaderboard.astro.mjs');
const _page12 = () => import('./pages/play/_game_.astro.mjs');
const _page13 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/api/achievements/sync.ts", _page1],
    ["src/pages/api/daily/[date].ts", _page2],
    ["src/pages/api/leaderboard/[id].ts", _page3],
    ["src/pages/api/rooms/create.ts", _page4],
    ["src/pages/api/rooms/join.ts", _page5],
    ["src/pages/api/rooms/poll.ts", _page6],
    ["src/pages/api/rooms/report.ts", _page7],
    ["src/pages/api/rooms/start.ts", _page8],
    ["src/pages/api/scores.ts", _page9],
    ["src/pages/campaign.astro", _page10],
    ["src/pages/leaderboard.astro", _page11],
    ["src/pages/play/[game].astro", _page12],
    ["src/pages/index.astro", _page13]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
