import { onUnmounted, ref } from 'vue'

type TimeoutableOptions = {
    timeout: number;
    state: boolean;
};

export function useTimeoutable<T extends (...args: any[]) => Promise<any>>(fn: T, options: TimeoutableOptions) {
    const isLoading = ref(false)
    let timeoutId: any

    const wrappedFunction = async (...args: Parameters<T>): Promise<ReturnType<T>> => {
        isLoading.value = true

        // Clear any existing timeout
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId)
        }

        // Call the passed function
        const result = await fn(...args)

        // Set a new timeout
        timeoutId = setTimeout(() => {
            isLoading.value = false
        }, options.timeout)

        return result as ReturnType<T>
    }

    // Function to manually stop the loading state
    const stopLoading = () => {
        isLoading.value = false
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId)
        }
    }

    const stateChanged = (newVal: boolean, oldVal: boolean) => {
        // console.log('state changed', newVal, oldVal)
        if (newVal !== oldVal) {
            isLoading.value = false

            if (timeoutId !== undefined) {
                clearTimeout(timeoutId)
            }
        }
    }

    // Clear the timeout when the component unmounts
    onUnmounted(() => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId)
        }
    })

    return {isLoading, wrappedFunction, stopLoading, stateChanged}
}