
#!/bin/bash
set -Eeuo pipefail

# ==========================================
# ELVOVE - FULL ARM64 BUILD & DEPLOY
# ==========================================

STB_HOST="root@192.168.1.2"
STB_DIR="/opt/compose/web-photography"

BACKEND_IMAGE="elvove-backend:arm64"
FRONTEND_IMAGE="elvove-frontend:arm64"

BACKEND_TAR="elvove-backend-arm64.tar"
FRONTEND_TAR="elvove-frontend-arm64.tar"

BUILDER="elvove-builder"

echo "======================================"
echo " ELVOVE FULL ARM64 BUILD & DEPLOY"
echo "======================================"

# Pastikan berada di root project
if [[ ! -f compose.yml ]]; then
    echo "ERROR: compose.yml tidak ditemukan."
    exit 1
fi

# Periksa koneksi STB
echo "[1/7] Checking STB connection..."
ssh "$STB_HOST" "docker info >/dev/null"

# Build backend
echo "[2/7] Building backend ARM64..."
docker buildx build \
    --builder "$BUILDER" \
    --no-cache \
    --platform linux/arm64 \
    -t "$BACKEND_IMAGE" \
    --load \
    ./backend

# Build frontend
echo "[3/7] Building frontend ARM64..."
docker buildx build \
    --builder "$BUILDER" \
    --no-cache \
    --platform linux/arm64 \
    -t "$FRONTEND_IMAGE" \
    --load \
    ./frontend

# Simpan image
echo "[4/7] Saving images..."
docker save "$BACKEND_IMAGE" -o "$BACKEND_TAR"
docker save "$FRONTEND_IMAGE" -o "$FRONTEND_TAR"

# Transfer image
echo "[5/7] Transferring images to STB..."
scp "$BACKEND_TAR" "$FRONTEND_TAR" "$STB_HOST:$STB_DIR/"

# Load image dan deploy
echo "[6/7] Deploying on STB..."
ssh "$STB_HOST" "
    set -e
    cd '$STB_DIR'

    docker load -i '$BACKEND_TAR'
    docker load -i '$FRONTEND_TAR'

    docker compose config -q

    docker compose up -d --no-deps --force-recreate backend frontend

    docker compose restart nginx

    rm -f '$BACKEND_TAR' '$FRONTEND_TAR'

    docker compose ps
"

# Bersihkan file lokal
echo "[7/7] Cleaning temporary files..."
rm -f "$BACKEND_TAR" "$FRONTEND_TAR"

echo "======================================"
echo " BUILD & DEPLOY SELESAI"
echo "======================================"

