#!/usr/bin/env bash
if [[ $# -ge 7 ]]; then
    npm install @types/node
    npm i
    cd portfolio-app-lambda
    npm i
    npm run build
    cd ..
    export ACCOUNT=$1
    export REGION=$2
    export TWITTER_ACCESS_TOKEN_KEY=$3
    export TWITTER_ACCESS_TOKEN_SECRET=$4
    export TWITTER_CONSUMER_KEY=$5
    export TWITTER_CONSUMER_SECRET=$6
    export TWITTER_BEARER_TOKEN=$7
    shift; shift
    npx cdk deploy "$@"
    exit $?
else
    echo 1>&2 "Not enough args."
    exit 1
fi