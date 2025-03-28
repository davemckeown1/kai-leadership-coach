#!/bin/bash

# Build the extension
npm run build

# Create the dist directory if it doesn't exist
mkdir -p dist

# Copy manifest and icons
cp manifest.json dist/
cp -r icons dist/

# Create a zip file for distribution
cd dist
zip -r ../kai-leadership-coach.zip *
cd ..

echo "Build complete! Extension is ready in dist/ directory."
echo "You can load it in Chrome by going to chrome://extensions/"
echo "and selecting 'Load unpacked' with the dist/ directory." 