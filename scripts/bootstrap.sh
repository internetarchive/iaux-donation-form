#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "Finding packages..."
PACKAGES_FOUND=`find $SCRIPT_DIR/.. -name 'package.json' -not -path "*node_modules*" -not -path "*@types*"`
BOOTSTRAP_COMMANDS=""
NEWLINE=$'\n'
PACKAGE_DIRS=""
for dir in $PACKAGES_FOUND
do
  PACKAGE_DIR=`dirname "$dir"`
  echo "Starting bootstrap", $dir
  cd $PACKAGE_DIR && npm install &
done
echo "Waiting for completion..."
wait
