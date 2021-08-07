#!/bin/bash

#openssl req -x509 -out ./tls/cardbox.crt -keyout ./tls/cardbox.key \
#  -newkey rsa:2048 -nodes -sha256 \
#  -subj '/CN=localhost:3005' -extensions EXT -config <( \
#   printf "[dn]\nCN=localhost:3005\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost:3005\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")


mkcert -key-file tls/cardbox.key -cert-file tls/cardbox.crt localhost
