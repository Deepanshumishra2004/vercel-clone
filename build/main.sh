#!/bin/bash
set -e

echo "starting the job"
echo "Project ID : $PROJECT_ID"
echo "Git repo : $GIT_REPO"

if [ -z "$GIT_REPO" ]; then
    echo "GIT_REPO is not set"
    exit 1
fi

ls
cd /home/app
mkdir output
cd output
git clone "$GIT_REPO" .
ls
cd ..
ls
npm install
ls
node index.js