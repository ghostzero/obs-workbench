<template>
  <div class="flex flex-col justify-between h-full">
    <div class="flex-1 overflow-x-hidden px-3 py-2 overflow-y-auto">
      <slot />
    </div>
    <div class="flex-none">
      <slot name="footer" />
    </div>
  </div>
</template>
