## Renaming files

* MacOS:

  `rename -n 's/^(\d){2}/00\1' *.jpg`

## Converting .mov to mp4

* Use Handbrake to convert video, and exiftool to copy metadata
* exiftool command:

    `exiftool -all= -tagsfromfile ./src/%f.mov -ext mp4 -all:all --matrixstructure --rotation ./dest`
