#!/bin/bash

# recursively deletes files ingnoring hidden files (eg. .svn directories)
deleteFiles() {
	for file in `ls -a ./$1`
	do
		if [ ! ${file:0:1} = . ] # file name does not begin with .
		then
			if [ -d $1/"$file" ] # file is a directory
			then
				#echo directory - $1/"$file"
				deleteFiles $1/"$file" # recurse into directory
			else
				rm $1/"$file" # delete file
			fi
		fi
	done
}

echo 1 of 4 - Removing old UML
deleteFiles "uml"

echo 2 of 4 - Generating UML
./bin/jsdoc/jsdoc.pl -r --format xmi -d ./uml/ ../../dist/behaviour

echo 3 of 4 - Removing old HTML
deleteFiles "html"

echo 4 of 4 - Generating HTML
./bin/jsdoc/jsdoc.pl -r --format html -d ./html/ ../../dist/behaviour
