import { Ref, ref } from 'vue'
import { Connection } from '@renderer/store/app'

/**
 * Two entries are the same server when host, port and path match. The path
 * matters for relays that serve many OBS instances on one host and port.
 */
const sameServer = (a: Connection, b: Connection): boolean => {
  return a.ip === b.ip && a.port === b.port && (a.path ?? '') === (b.path ?? '')
}

export function useConnectionHistory() {
  const connections: Ref<Connection[]> = ref([])

  if (localStorage.getItem('connection_history')) {
    connections.value = JSON.parse(localStorage.getItem('connection_history'))
  }

  const saveConnection = (connection: Connection) => {
    const index = connections.value.findIndex(x => sameServer(connection, x))

    if (index >= 0) {
      connections.value[index] = connection
    } else {
      connections.value.unshift(connection)
    }

    localStorage.setItem('connection_history', JSON.stringify(connections.value))
  }

  const deleteConnection = (connection: Connection) => {
    const index = connections.value.findIndex(x => sameServer(connection, x))

    if (index >= 0) {
      connections.value.splice(index, 1)
    }

    localStorage.setItem('connection_history', JSON.stringify(connections.value))
  }

  return {
    connections,
    saveConnection,
    deleteConnection
  }
}
