import { Ref } from 'vue'

export async function useWaitForRef<T>(ref: Ref): Promise<T> {
  return new Promise<T>((resolve) => {
    const interval = setInterval(() => {
      if (ref.value) {
        clearInterval(interval)
        resolve(ref.value)
      }
    }, 100)
  })
}
