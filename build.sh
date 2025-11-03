#!/bin/bash

echo "🔨 Building GPA Genie..."

# Clean previous build
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the extension
echo "🏗️  Building extension..."
npm run build

# Copy additional files
echo "📋 Copying assets..."
cp -r public/icons dist/icons

echo "✅ Build complete! Extension is ready in dist/ folder"
echo "📦 To create a zip file for distribution:"
echo "   cd dist && zip -r ../gpa-genie.zip * && cd .."