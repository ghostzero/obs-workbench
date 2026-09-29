import { Connection } from '@renderer/store/app'

/**
 * A connection handed to Workbench in its own URL, so another page can open
 * Workbench already connected to an OBS instance:
 *
 *   https://open.obs-workbench.com/#connect=wss%3A%2F%2Fobs.example.com%2Fabc&password=secret
 *
 * `connect` is a full ws:// or wss:// URL, path included. Read from the
 * fragment rather than the query string: browsers never send the fragment to
 * the server or in a Referer header, so the password stays out of logs.
 */
export function readQuickConnect(hash: string): Connection | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  const target = params.get('connect')

  if (!target) {
    return null
  }

  let url: URL
  try {
    url = new URL(target)
  } catch {
    return null
  }

  if (url.protocol !== 'ws:' && url.protocol !== 'wss:') {
    return null
  }

  const tls = url.protocol === 'wss:'

  return {
    tls,
    ip: url.hostname,
    port: url.port || (tls ? '443' : '80'),
    password: params.get('password') ?? '',
    path: url.pathname === '/' && !url.search ? '' : `${url.pathname}${url.search}`
  }
}

/**
 * Take a quick-connect request out of the page URL, so the password is not
 * left in the address bar, the history or a bookmark.
 */
export function consumeQuickConnect(): Connection | null {
  const connection = readQuickConnect(window.location.hash)

  if (connection) {
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }

  return connection
}
