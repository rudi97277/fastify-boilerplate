import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  outDir: "dist",
  bundle: false, // bundle each entry
  splitting: false, // one file per entry (simple)
  target: "node20",
  format: ["cjs"], // you use require(entry)
  sourcemap: true,
  clean: true,
  dts: false,
  skipNodeModulesBundle: true,
  onSuccess: "tsc-alias -p tsconfig.json",
  esbuildOptions(o) {
    o.outbase = "src"; // preserve src/ tree under dist/
  },
});
