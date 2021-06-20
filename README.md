# slideshow

## Requirements

ImageMagick

`brew install imagemagick`

EXIFTool

`brew install exiftool`
## Processing source images &  videos

1. Copy selected files manually to a folder on HDD

2. ImageMagick (convert.bash)
    a. Convert all Images to JPG (retain filenames), and resize them
    b. Convert all videos to MP4 (retain filenames)

3. EXIFTool (2_exif.bash)
    a. Edit each file's location, title, description


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
