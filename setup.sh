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
dotnet add package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 8.0.7
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.7
dotnet add package Microsoft.IdentityModel.Tokens --version 8.14.0
dotnet add package Microsoft.IdentityModel.JsonWebTokens --version 8.14.0
dotnet add package System.IdentityModel.Tokens.Jwt --version 8.14.0


# Ensure Jwt key exists in appsettings.json and appsettings.Development.json
JWT_KEY_LINE='    "Key": "this_is_a_very_long_super_secret_key_123456"'
for f in appsettings.json appsettings.Development.json; do
  if [ -f "$f" ]; then
    if ! grep -q '"Jwt"' "$f"; then
      # Add Jwt section before last closing brace
      sed -i "/^}$/i \\n  ,\n  \"Jwt\": {\n$JWT_KEY_LINE\n  }\n" "$f"
      echo "Added Jwt key to $f"
    fi
  fi
done

echo "==> Ensuring dotnet-ef tool is installed..."
if ! command -v dotnet-ef &> /dev/null; then
  echo "dotnet-ef not found, installing globally..."
  dotnet tool install --global dotnet-ef
  export PATH="$PATH:~/.dotnet/tools"
else
  echo "dotnet-ef is already installed."
fi

echo "==> Restoring NuGet packages..."
dotnet restore

echo "==> Running EF Core migrations (including Identity)..."
dotnet ef database update

echo "==> Running backend API..."
dotnet run