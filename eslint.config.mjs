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
      // Vendored third-party build inputs. vis-network-9.1.6.min.js is minified
      // upstream and is only ever inlined verbatim into the Graphify viewer by
      // scripts/inline-graph-lib.mjs — linting it produces ~1,500 findings that
      // describe someone else's code, and drowning the signal is how a real
      // finding gets missed.
      "scripts/vendor/**",
    ],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
