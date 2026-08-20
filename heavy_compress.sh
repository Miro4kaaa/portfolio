#!/bin/bash
VIDEO_DIR="images/Видео-креативы"
COMP_DIR="$VIDEO_DIR/compressed"
mkdir -p "$COMP_DIR"

compress_video() {
    local input="$1"
    local basename=$(basename "$input")
    local name="${basename%.*}"
    local output="$COMP_DIR/${name}.mp4"

    echo "→ Compressing: $basename"
    ffmpeg -y -i "$input" \
        -c:v libx264 \
        -crf 32 \
        -preset fast \
        -vf "scale='min(720,iw)':-2" \
        -c:a aac -b:a 64k \
        -movflags +faststart \
        "$output" 2>/dev/null
}

for f in "$VIDEO_DIR"/*.mov "$VIDEO_DIR"/*.mp4; do
    [ -f "$f" ] || continue
    compress_video "$f"
done

# Replace the uncompressed ones with compressed ones
for f in "$COMP_DIR"/*.mp4; do
    mv "$f" "$VIDEO_DIR/"
done
rm -rf "$COMP_DIR"

# Clean up any leftover original .mov files if they were converted to .mp4
for f in "$VIDEO_DIR"/*.mov; do
    [ -f "$f" ] && rm "$f"
done

echo "=== DONE ==="
