#!/usr/bin/env sh
# Thin wrapper around `agent-browser` that removes the two environment variables
# that break it in this sandbox.
#
# WHY THIS EXISTS
#   1. NODE_OPTIONS — the sandbox injects
#        --require=.../cli/vendor/shim/node-language-shim.cjs
#      into every Node process. agent-browser spawns its own Node child, which
#      inherits it. The shim's unlink counter is turn-scoped with a threshold of
#      50, so after a long working session it saturates and the child hangs
#      forever with no output. Symptom: `agent-browser open <url>` never returns,
#      while `agent-browser --version` and `agent-browser close` still work
#      (they don't spawn the same child). Clearing NODE_OPTIONS fixes it.
#   2. HTTP(S)_PROXY — the daemon tries to tunnel 127.0.0.1 through the proxy and
#      hangs. Loopback must be excluded.
#
# Usage:  scripts/qa/ab.sh open http://127.0.0.1:3000/
#         scripts/qa/ab.sh eval "document.title"
#
# Every call is bounded by AB_TIMEOUT (default 90s). A wedged daemon — which does
# happen after a long QA session — otherwise hangs the whole run with no output,
# and a run that never finishes looks identical to one that is merely slow.
set -eu

unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy
NO_PROXY="127.0.0.1,localhost"
no_proxy="127.0.0.1,localhost"
export NO_PROXY no_proxy

NODE_OPTIONS=
export NODE_OPTIONS

AB_TIMEOUT="${AB_TIMEOUT:-90}"

exec timeout "$AB_TIMEOUT" agent-browser "$@"
