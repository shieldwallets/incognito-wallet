#!/usr/bin/env bash

echo "
PASSWORD_SECRET_KEY=$PASSWORD_SECRET_KEY
PASSPHRASE_WALLET_DEFAULT=$PASSPHRASE_WALLET_DEFAULT
API_MINER_URL=$API_MINER_URL
PASS_HOSPOT=$PASS_HOSPOT
NODE_PASSWORD=$NODE_PASSWORD
NODE_USER_NAME=$NODE_USER_NAME
" > .env

# Generate android keystore file
echo $KEYSTORE | base64 -di | tee android/app/wallet-app-release-key.keystore
echo $PLAY_STORE_JSON | base64 -di | tee play_store.json
echo $APPLE_STORE_DEVELOP_KEY | base64 -di | tee fastlane/develop.json

echo "
A=$MATCH_KEYCHAIN_PASSWORD
B=$MATCH_PASSWORD
C=$FASTLANE_PASSWORD
" > key.txt
