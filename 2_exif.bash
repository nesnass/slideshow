#!/usr/bin/env bash

# determine current values
IMAGE_TITLE=$(exiftool -s3 -Title "$1")
IMAGE_DESCRIPTION=$(exiftool -s3 -Description "$1")
IMAGE_KEYWORDS=$(exiftool -s -s -s -iptc:Keywords "$1")

# Ask user for new values
read -e -p "Title [$IMAGE_TITLE]: " NEW_TITLE
read -e -p "Description [$IMAGE_DESCRIPTION]: " NEW_DESCRIPTION
read -e -p "Keywords [$IMAGE_KEYWORDS]: " NEW_KEYWORDS

# set to defaults if we got a blank result
NEW_TITLE="${NEW_TITLE:-${IMAGE_TITLE}}"
NEW_DESCRIPTION="${NEW_DESCRIPTION:-${IMAGE_DESCRIPTION}}"
NEW_KEYWORDS="${NEW_KEYWORDS:-${IMAGE_KEYWORDS}}"

# Update
exiftool \
    -overwrite_original \
    -iptc:ObjectName="$NEW_TITLE" \
    -iptc:Caption-Abstract="$NEW_DESCRIPTION" \
    -iptc:Keywords="$NEW_KEYWORDS" \
    "$1"


# display what we've set
exiftool -f \
    -iptc:ObjectName \
    -iptc:Caption-Abstract \
    -iptc:Keywords \
    "$1"
