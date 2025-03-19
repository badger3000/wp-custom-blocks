#!/bin/bash

echo "=== Custom Blocks Plugin Build Script ==="
echo "This script will clean, install dependencies, and build the plugin."
echo

# Set error handling
set -e  # Exit immediately if a command exits with a non-zero status

# Clean build directory if it exists
if [ -d "build" ]; then
  echo "Cleaning previous build..."
  rm -rf build
  echo "Done."
  echo
fi

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
  echo "Error installing dependencies. Please check the error messages above."
  exit 1
fi
echo "Done."
echo

# Build the plugin
echo "Building the plugin..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error building the plugin. Please check the error messages above."
  exit 1
fi
echo "Done."
echo

# Check that the build directory exists before listing files
if [ ! -d "build" ]; then
  echo "Build directory was not created. Build may have failed."
  exit 1
fi

# Check for the correct file structure
echo "Checking build structure..."
echo "Files in build root:"
ls -la build | grep -v 'blocks\|total\|^\.$\|^\.\.$'
echo

# Check if the sample-block directory exists
if [ -d "build/blocks/sample-block" ]; then
  echo "Files in sample-block directory:"
  ls -la build/blocks/sample-block
else
  echo "Sample block directory not found in build/blocks/"
  echo "Available directories in build/blocks/:"
  ls -la build/blocks/ 2>/dev/null || echo "No blocks directory found."
fi
echo
echo "=== Build Complete ==="
