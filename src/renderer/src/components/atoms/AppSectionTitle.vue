<template>
  <div class="flex justify-between text-zinc-50 font-bold text-xl">
    <div class="truncate">
      <slot />
    </div>
    <div>
      <slot name="actions" />
    </div>
  </div>
</template>
