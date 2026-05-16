#!/bin/bash

# Build script for all lectures and projects

echo "🚀 Building all lectures and projects for GitHub Pages..."

REPO_NAME="letuin_lecture_project"

# Function to update vite.config.ts and build
build_app() {
    local dir=$1
    local app_name=$2

    echo "📦 Building $app_name..."
    cd "$dir"

    # Update vite.config.ts with correct base path
    cat > vite.config.ts << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/${REPO_NAME}/${app_name}/',
})
EOF

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "  Installing dependencies..."
        npm install
    fi

    # Build
    npm run build

    echo "  ✅ $app_name built successfully"
    cd ..
}

# Build all lectures
build_app "lecture_11" "lecture_11"
build_app "lecture_12" "lecture_12"
build_app "lecture_13" "lecture_13"
build_app "lecture_14" "lecture_14"
build_app "lecture_15" "lecture_15"
build_app "lecture_16" "lecture_16"
build_app "lecture_17" "lecture_17"

# Build all projects
build_app "project_01" "project_01"
build_app "project_02" "project_02"
build_app "project_03" "project_03"

echo ""
echo "✅ All apps built successfully!"
echo "📂 Built files are in each app's dist/ directory"
