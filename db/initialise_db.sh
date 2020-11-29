#!/bin/bash

ENV_FILE="$(pwd)/.env"

if [ -r "${ENV_FILE}" ]; then
    echo "Found local config (${ENV_FILE}), sourcing..."
    source "${ENV_FILE}"
else
    echo "No .env file found, aborting..."
    exit 1
fi

PGPASSWORD=$DB_PASSWORD psql postgres -c "CREATE DATABASE ${DB}"
PGPASSWORD=$DB_PASSWORD psql -h "${DB_HOST}" -d "${DB}" -U "${DB_USER}" -p "${DB_PORT}" -a -w -f db/__init__.sql

echo "All done".
