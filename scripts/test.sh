#!/bin/sh
for dir in ./packages/*; do (cd "$dir" && npm run test); done
