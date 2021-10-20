#!/bin/zsh

let i=1
for file in `ls -- *.jpg | sort -V`
do mv -- "$file" "$i"'s.jpg'
let i=i+1
done
