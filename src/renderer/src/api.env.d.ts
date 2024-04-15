export {} // Make this a module

declare global {
  // This allows TypeScript to pick our custom API
  namespace api {
    function minimizeWindow(): void
    function maximizeWindow(): void
    function closeWindow(): void

  }
}
