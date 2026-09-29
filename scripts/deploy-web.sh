#!/usr/bin/env bash
# Publishes the web edition (vite build output) to open.obs-workbench.com.
#
#   scripts/deploy-web.sh [dist-dir]
#
# open.obs-workbench.com is a Bunny pull zone in front of a storage zone. This
# uploads the build to the storage zone and then purges the pull zone, which
# caches everything, index.html included, for 30 days.
#
# Hashed assets are uploaded first and index.html last, so a visitor never
# gets an index.html that points at assets not uploaded yet. Assets from
# earlier builds are left in place: a browser still holding an older
# index.html can keep loading what it references.
#
# Needs:
#   BUNNY_STORAGE_ZONE       storage zone name
#   BUNNY_STORAGE_PASSWORD   that zone's password (FTP & API Access)
#   BUNNY_API_KEY            account API key, for the purge
#   BUNNY_PULL_ZONE_ID       the pull zone serving open.obs-workbench.com
#   BUNNY_STORAGE_HOST       optional, the zone's region endpoint
#                            (default storage.bunnycdn.com, Falkenstein)
#
# BUNNY_STORAGE_URL and BUNNY_API_URL override the endpoints, for testing.
set -euo pipefail

dist="${1:-dist}"

: "${BUNNY_STORAGE_ZONE:?set BUNNY_STORAGE_ZONE}"
: "${BUNNY_STORAGE_PASSWORD:?set BUNNY_STORAGE_PASSWORD}"
: "${BUNNY_API_KEY:?set BUNNY_API_KEY}"
: "${BUNNY_PULL_ZONE_ID:?set BUNNY_PULL_ZONE_ID}"

host="${BUNNY_STORAGE_HOST:-storage.bunnycdn.com}"
base="${BUNNY_STORAGE_URL:-https://${host}}/${BUNNY_STORAGE_ZONE}"
api="${BUNNY_API_URL:-https://api.bunny.net}"

[ -f "${dist}/index.html" ] || { echo "${dist}/index.html is missing; run the build first" >&2; exit 1; }

put() {
    local file="$1" path="$2" sum
    # Bunny rejects the upload if the body does not hash to this, so a
    # truncated transfer fails here instead of being served.
    sum="$(sha256sum "$file" | cut -d' ' -f1 | tr '[:lower:]' '[:upper:]')"
    curl -fsS --retry 3 -X PUT \
        -H "AccessKey: ${BUNNY_STORAGE_PASSWORD}" \
        -H "Checksum: ${sum}" \
        -H 'Content-Type: application/octet-stream' \
        --data-binary "@${file}" \
        "${base}/${path}" >/dev/null
    echo "  ${path}"
}

echo "Uploading ${dist} to ${BUNNY_STORAGE_ZONE}"

while IFS= read -r -d '' file; do
    put "$file" "${file#"${dist}"/}"
done < <(find "$dist" -type f ! -path "${dist}/index.html" -print0 | sort -z)

put "${dist}/index.html" index.html

echo "Purging pull zone ${BUNNY_PULL_ZONE_ID}"
curl -fsS --retry 3 -X POST \
    -H "AccessKey: ${BUNNY_API_KEY}" \
    "${api}/pullzone/${BUNNY_PULL_ZONE_ID}/purgeCache" >/dev/null

echo "Deployed"
