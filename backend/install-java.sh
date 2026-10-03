#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd "$(dirname "$0")/.." && pwd)"
java_target="$project_root/.tools/java/jdk-25.0.4.1+1"
archive_sha='61979887f7506a24a57439ff99adb8b3a7fc89977d9cfe3b8984f58a981b7b9d'
archive_url='https://github.com/adoptium/temurin25-binaries/releases/download/jdk-25.0.4.1%2B1/OpenJDK25U-jdk_aarch64_mac_hotspot_25.0.4.1_1.tar.gz'

if [[ -x "$java_target/Contents/Home/bin/java" ]]; then
  "$java_target/Contents/Home/bin/java" -version
  exit 0
fi
if [[ "$(uname -s)" != 'Darwin' || "$(uname -m)" != 'arm64' ]]; then
  echo 'This project-local installer supports macOS ARM64. Supply a verified Java 25 JAVA_HOME on other platforms.' >&2
  exit 1
fi

mkdir -p "$project_root/.tools/java"
staging="$(mktemp -d "$project_root/.tools/java/.install-XXXXXX")"
trap 'rm -rf "$staging"' EXIT
curl --fail --location --retry 2 --connect-timeout 15 --max-time 300 "$archive_url" -o "$staging/java.tar.gz"
printf '%s  %s\n' "$archive_sha" "$staging/java.tar.gz" | shasum -a 256 --check
tar -xzf "$staging/java.tar.gz" -C "$staging"
mv "$staging/jdk-25.0.4.1+1" "$java_target"
"$java_target/Contents/Home/bin/java" -version
