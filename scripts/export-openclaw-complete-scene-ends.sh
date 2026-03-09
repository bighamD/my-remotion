#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="${1:-$ROOT_DIR/screenshots/openclaw-complete-scene-ends}"
SCALE="${SCALE:-4}"
COMPOSITION_ID="OpenClawComplete"
CLEAN="${CLEAN:-1}"

mkdir -p "$OUT_DIR"

if [[ "$CLEAN" == "1" ]]; then
  rm -f "$OUT_DIR"/*.png
fi

echo "Output directory: $OUT_DIR"
echo "Composition: $COMPOSITION_ID"
echo "Scale: $SCALE"

SCENE_NAMES=(
  "tutorial-01-intro-concept"
  "tutorial-02-core-features"
  "tutorial-03-node-env-check"
  "tutorial-04-install-openclaw"
  "tutorial-05-config-wizard"
  "tutorial-06-check-gateway"
  "tutorial-07-channel-hotline"
  "tutorial-08-ready-outro"
  "arch-00-intro-concept"
  "arch-01-overall-architecture"
  "arch-02-gateway-core"
  "arch-03-agent-brain"
  "arch-04-skills-execution"
  "arch-05-channels-hotline"
  "arch-06-nodes-deployment"
  "arch-07-memory-system"
  "arch-08-heartbeat-scheduler"
  "arch-09-cron-tasks"
  "arch-10-summary"
)

SCENE_END_FRAMES=(
  180
  360
  960
  1440
  1800
  2160
  2520
  2700
  3000
  3300
  3600
  3900
  4200
  4500
  4800
  5100
  5400
  5700
  6000
)

for i in "${!SCENE_NAMES[@]}"; do
  name="${SCENE_NAMES[$i]}"
  end_frame="${SCENE_END_FRAMES[$i]}"
  frame=$((end_frame - 1))
  printf -v index "%02d" "$((i + 1))"
  output="$OUT_DIR/${index}-${name}.png"

  echo "[$((i + 1))/${#SCENE_NAMES[@]}] frame=$frame -> $output"
  pnpm exec remotion still "$COMPOSITION_ID" "$output" \
    --frame="$frame" \
    --image-format=png \
    --scale="$SCALE"
done

echo "Done. Exported ${#SCENE_NAMES[@]} screenshots."
