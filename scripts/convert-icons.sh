#!/bin/bash

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is required but not installed. Please install it with:"
    echo "  brew install imagemagick (on Mac)"
    echo "  apt-get install imagemagick (on Ubuntu/Debian)"
    exit 1
fi

# Convert SVG icons to PNG
convert icons/icon16.svg icons/icon16.png
convert icons/icon48.svg icons/icon48.png
convert icons/icon128.svg icons/icon128.png

echo "Icons converted successfully!" 