#!/usr/bin/env bash

# Converts HEIC image files to JPG and resizes
# Run this script from the same folder as image files

# create conversion folder
mkdir converted

# process HEIC files
magick mogrify -monitor -resize 50% -format jpg -path ./converted *.jpg

# convert H.265 to H.264
for i in *.mov; do ffmpeg -i "$i" -c:v libx264 -crf 18 -c:a "./converted/${i%.*}.mp4"; done
