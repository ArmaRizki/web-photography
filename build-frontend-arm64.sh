#!/bin/bash
set -e

# Konfigurasi
IMAGE="elvove-frontend:arm64"
TAR_FILE="elvove-frontend-arm64.tar"
STB_HOST="root@192.168.1.2"
STB_DIR="/opt/compose/web-photography"

echo "===================================="
echo " BUILD FRONTEND ARM64 - ELVOVE"
echo "===================================="

# Build fresh tanpa cache
echo "[1/4] Building frontend ARM64..."

docker buildx build \
  --builder elvove-builder \
  --no-cache \
  --platform linux/arm64 \
  -t "$IMAGE" \
  --load \
  ./frontend

# Simpan image
echo "[2/4] Saving Docker image..."

docker save "$IMAGE" -o "$TAR_FILE"

# Transfer ke STB
echo "[3/4] Transferring image to STB..."

scp "$TAR_FILE" "$STB_HOST:$STB_DIR/"

# Load dan restart frontend di STB
echo "[4/4] Loading image and restarting frontend..."

ssh "$STB_HOST" "
  cd '$STB_DIR' &&
  docker load -i '$TAR_FILE' &&
  docker compose up -d --no-deps --force-recreate frontend &&
  docker compose restart nginx &&
  rm -f '$TAR_FILE'
"

# Hapus tar lokal
rm -f "$TAR_FILE"

echo "===================================="
echo " FRONTEND DEPLOYMENT SELESAI"
echo "===================================="
