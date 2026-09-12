import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

// Next 16 removed `next lint`, so ESLint runs directly against a flat config.
// eslint-config-next v16 already *is* a flat config (it exports an array), so it
// must be spread directly — wrapping it in FlatCompat.extends() treats it as an
// eslintrc shareable config and dies with "Converting circular structure to JSON".
// `core-web-vitals` also enforces the rules the build alone cannot see
// (no <img>, no sync scripts, no missing font-display).
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "_reference/**",
      "qa-screenshots/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
