import {defineConfig,devices} from "@playwright/test";

// Separate from the local E2E matrix. Only run after Pages returns a real deployment URL.
const deployed=process.env.PLAYWRIGHT_LIVE_URL;
if(!deployed)throw new Error("PLAYWRIGHT_LIVE_URL is required for live release testing");
const url=new URL(deployed);
if(url.protocol!=="https:"||!url.pathname.startsWith("/JAPAN-AUTO-TYCOON/"))throw new Error("Invalid live Pages deployment URL");
export default defineConfig({
  testDir:"./tests-live",
  timeout:45000,
  expect:{timeout:15000},
  use:{baseURL:url.href,trace:"retain-on-failure"},
  projects:[
    {name:"pages-chromium-desktop",use:{...devices["Desktop Chrome"]}},
    {name:"pages-chromium-mobile",use:{...devices["Pixel 7"]}}
  ],
  retries:1,
  workers:1
});
