#!/bin/bash

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Load configuration variables
source local.env

function usage() {
  echo -e "${YELLOW}Usage: $0 [--install,--uninstall,--env]${NC}"
}

function install() {
  echo -e "${GREEN}Installing OpenWhisk actions, triggers, and rules for demo..."
  
  echo "Creating actions"
  wsk action create mongo/new-doc actions/new-doc.js \
    --param MONGO_CA "$MONGO_CA" \
    --param MONGO_URI "$MONGO_URI" \
    --param MONGO_DATABASE "$MONGO_DATABASE" \
    --param MONGO_COLLECTION "$MONGO_COLLECTION"

  wsk action create mongo/update-doc actions/update-doc.js \
    --param MONGO_CA "$MONGO_CA" \
    --param MONGO_URI "$MONGO_URI" \
    --param MONGO_DATABASE "$MONGO_DATABASE" \
    --param MONGO_COLLECTION "$MONGO_COLLECTION"


  wsk action create mongo/get-doc actions/get-doc.js \
    --param MONGO_COLLECTION "$MONGO_COLLECTION" \
    --param MONGO_DATABASE "$MONGO_DATABASE" \
    --param MONGO_CA "$MONGO_CA" \
    --param MONGO_URI "$MONGO_URI" 

  echo -e "${NC}"
}

function uninstall() {
  echo -e "${RED}Uninstalling..."
  wsk action delete mongo/new-doc
  wsk action delete mongo/update-doc
  wsk action delete mongo/get-doc
  echo -e "${NC}"
}

function showenv() {
  echo -e "${YELLOW}"
  echo MONGO_CA=$MONGO_CA
  echo MONGO_URI=$MONGO_URI
  echo MONGO_DATABASE=$MONGO_DATABASE
  echo MONGO_COLLECTION=$MONGO_COLLECTION
  echo -e "${NC}"
}
case "$1" in
"--install" )
install
;;
"--uninstall" )
uninstall
;;
"--env" )
showenv
;;
* )
usage
;;
esac
