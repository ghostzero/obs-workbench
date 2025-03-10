import { Ref, ref } from 'vue'
import { Connection } from '@renderer/store/app'

export function useConnectionHistory() {
  const connections: Ref<Connection[]> = ref([])

  if (localStorage.getItem('connection_history')) {
    connections.value = JSON.parse(localStorage.getItem('connection_history'))
  }

  const saveConnection = (connection: Connection) => {
    const index = connections.value.findIndex(x => {
      return connection.ip === x.ip && connection.port === x.port
    })

    if (index >= 0) {
      connections.value[index] = connection
    } else {
      connections.value.unshift(connection)
    }

    localStorage.setItem('connection_history', JSON.stringify(connections.value))
  }

  const deleteConnection = (connection: Connection) => {
    const index = connections.value.findIndex(x => {
      return connection.ip === x.ip && connection.port === x.port
    })

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
