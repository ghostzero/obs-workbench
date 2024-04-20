<template>
  <AppPopup>
    <div class="text-xl font-bold">
      <i class="fas fa-sparkles fa-fw"/>
      What's New
    </div>

    <div class="h-96 overflow-y-auto mt-4">
      <div class="grid gap-4">
        <div>
          <div class="text-amber-500 text-sm border border-amber-500 rounded px-3 py-2">
            <strong>Known Issues:</strong>
            <ul class="list-disc list-inside text-sm grid gap-0.5 ml-4">
              <li class="list-item">
                The Program Output is currently not "immutable" and changes when the user changes the scene. We're
                waiting for [obs-websocket#1189].
              </li>
              <li class="list-item">
                We're currently experiencing issues with the Input Level Meter not updating after a certain amount of
                time. We're investigating the issue.
              </li>
            </ul>
          </div>
        </div>
        <div>
          <strong>origin/cloud-servers - Pending</strong>
          <ul class="list-disc list-inside text-sm grid gap-0.5 ml-4">
            <li class="list-item">
              We're currently working on a new feature that will allow you to create and manage cloud servers directly
              from the app. Stay tuned!
            </li>
          </ul>
        </div>
        <div>
          <strong>origin/main - April 2024</strong>
          <ul class="list-disc list-inside text-sm grid gap-0.5 ml-4">
            <li class="list-item">Added new plugin system for our desktop app</li>
            <li class="list-item">Added new popup to create scenes and sources</li>
            <li class="list-item">Improved bandwidth usage from 4.8MB/s to 1.4MB/s (in 30 seconds)</li>
            <li class="list-item">Improved detection if the app is running inside OWN3D Pro</li>
            <li class="list-item">Improved popup system to be more flexible and easier to use</li>
          </ul>
        </div>
        <div>
          <strong>origin/main - December 2023</strong>
          <ul class="list-disc list-inside text-sm grid gap-0.5 ml-4">
            <li class="list-item">Initial release</li>
          </ul>
        </div>
      </div>
    </div>
  </AppPopup>
</template>

<script setup lang="ts">
import AppPopup from '../molecules/AppPopup.vue'
</script>

<style scoped>
.list-disc {
  list-style-type: disc;
}
</style>
