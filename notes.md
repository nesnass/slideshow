## Renaming files

* MacOS:

  `rename -n 's/^(\d){2}/00\1' *.jpeg`

## Converting .mov to mp4

* Use Handbrake to convert video, and exiftool to copy metadata
* exiftool command:

    `exiftool -all= -tagsfromfile ./src/%f.mov -ext mp4 -all:all --matrixstructure --rotation ./dest`

* Or use `ffmpeg` (**PREFERRED**):

    `for i in *.mov; do ffmpeg -noautorotate -i "$i" -map_metadata 0 -movflags use_metadata_tags "${i%.*}.mp4"; done`

* Image thumbnails with ffmpeg: (?? Not woking ??)
    `for i in *.jpeg; do ffmpeg -i "$i" -vf scale=128:-1 "${i%.*}_tn.jpeg"; done`

* Video Thumbnails with ffmpeg:
    `for i in *.mp4; do ffmpeg -i "$i" -ss 00:00:01.000 -vf scale=128:-1 -vframes 1 "${i%.*}_tn.jpeg"; done`

* Renaming files (bulk):
    `rename -v 's/\.jpeg$/_o.jpeg/' *.jpeg`

* Resize images (bulk) retaining aspect ratio
    `sips --resampleWidth 1280 *.jpeg`

---------
On Camera
---------
 * Ensure timezone is set
 * Ensure clock is set
 * GPS - Use a tracker app?


-----------
On Computer
-----------

 * Copy photos to HDD

Add EXIF data
 * 1. GPS
 * 2. Title
 * 3. Description

 -> Preferably a Google map
 -> Ability to search map

 -> OR Enter Lat / Long coords

 * 4. Adjust image size
 * 5. Convert HEIC image to JPG image
 * 6. Convert HEVC video to MP4 video

---------
SOLUTIONS
---------

Apple Photos
 Images: 1, 2, 3, 4, 5
 Videos: -none-

 - does not save to original file
 - does not export videos with exif data
 - bugs


GeoTag
 Images: 1
 Videos: -none-

 - does not include Tile or Description
 - Does not export as smaller size

ImageMagick
 Images: 1, 2, 3, 4
 Videos: -none-

 * Adjust size
 *


-------
PROCESS
-------

Copy files manually to HDD

1. ImageMagick
  a. Convert all Images to JPG (retain filenames)
    - Resize them
  b. Convert all videos to MP4 (retain filenames)

2. EXIFTool
  a. Edit location, title, description

