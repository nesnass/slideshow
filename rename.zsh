#!/bin/zsh

let i=2
let name=i

while [[ i -le 10 ]];
do
  let j=${#name}
  if [[ j -eq 1 ]]
  then
      print 'yes'
      name=${name}ab
      print $name
  fi
#for file in `ls -- *.jpg | sort -V`
#do mv -- "$file" "$i"'s.jpg'
let i=i+1
done
