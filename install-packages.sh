#!/bin/bash

set -euo pipefail

cd /

DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get -y upgrade
apt-get -y install --no-install-recommends libreoffice

apt-get clean
rm -rf /var/lib/apt/lists/*

UNOCONV_REPOSITORY=https://github.com/unoconv/unoconv.git
VERSION_TAG=0.9.0

git clone --depth 1 --branch $VERSION_TAG $UNOCONV_REPOSITORY
cd unoconv
make install

sed -i '1c\#!/usr/bin/python3' /usr/bin/unoconv
