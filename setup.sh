#!/bin/bash

set -e

# 1. Database: PostgreSQL via Podman
CONTAINER_NAME="friends-pg"
VOLUME_NAME="friends_data"
POSTGRES_IMAGE="docker.io/library/postgres:16"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="secret"
POSTGRES_DB="friends"
PG_PORT=5432

echo "==> Checking for existing Postgres container..."

if ! podman container exists $CONTAINER_NAME; then
  echo "Container not found. Creating volume and container..."
  podman volume create $VOLUME_NAME
  podman run -d \
    --name $CONTAINER_NAME \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_DB=$POSTGRES_DB \
    -p $PG_PORT:5432 \
    -v $VOLUME_NAME:/var/lib/postgresql/data \
    $POSTGRES_IMAGE
else
  echo "Container exists."
  if ! podman ps --format "{{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
    echo "Starting existing container..."
    podman start $CONTAINER_NAME
  else
    echo "Container already running."
  fi
fi

echo "==> Waiting for Postgres to be ready..."
sleep 3
podman exec -it $CONTAINER_NAME pg_isready -U $POSTGRES_USER -d $POSTGRES_DB

# 2. Backend Setup
cd backend

echo "==> Checking connection strings in appsettings.json and appsettings.Development.json..."

CONN_STR="Host=127.0.0.1;Port=5432;Database=friends;Username=postgres;Password=secret"

for f in appsettings.json appsettings.Development.json; do
  if [ -f "$f" ]; then
    if ! grep -q "$CONN_STR" "$f"; then
      echo "Updating connection string in $f"
      sed -i "s|\"Default\": \".*\"|\"Default\": \"$CONN_STR\"|g" "$f"
    else
      echo "Connection string already correct in $f"
    fi
  fi
done

echo "==> Ensuring required NuGet packages..."
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL

echo "==> Running EF Core migrations..."
dotnet ef database update

echo "==> Running backend API..."
dotnet run