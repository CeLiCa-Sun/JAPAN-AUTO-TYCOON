import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Explicit Pages mode builds for a project subpath; dev/CI builds still use '/'.
export default defineConfig(({mode})=>({
  base:mode==="pages"?"/JAPAN-AUTO-TYCOON/":"/",
  plugins:[react()],
  test:{environment:"node",include:["tests/**/*.test.ts"]}
}));
