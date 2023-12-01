<template>
  <div
    class="min-h-full select-none"
    @contextmenu.prevent
  >
    <AppPopups />
    <AppNotifications />
    <template v-if="store.connected">
      <main class="grid gap-8 p-8">
        <AppHeader />

        <div
          class="grid auto-rows-fr grid-cols-1 items-start gap-4 lg:grid-cols-5 lg:gap-8"
        >
          <!-- Right column -->
          <div class="flex h-full flex-col gap-4">
            <AppSectionTitle>Scenes</AppSectionTitle>
            <AppSection>
              <SceneList />
            </AppSection>
          </div>

          <!-- Left column -->
          <div class="flex flex-col gap-4 lg:col-span-4">
            <StudioView />
          </div>

          <div class="flex flex-col gap-4">
            <AppSectionTitle>
              Sources
              <template #actions>
                <button
                  type="button"
                  @click="openPopup('add-source')"
                >
                  <i class="fal fa-fw fa-plus"></i>
                </button>
              </template>
            </AppSectionTitle>
            <AppSection>
              <SceneItemsList />
            </AppSection>
          </div>

          <div class="flex flex-col gap-4 lg:col-span-2">
            <AppSectionTitle>Audio Mixer</AppSectionTitle>
            <AppSection>
              <div class="flex hidden gap-2">
                <div class="badge" style="background: #73bd31">
                  Music / Gameplay
                </div>
                <div class="badge" style="background: #bd9009">Speech</div>
                <div class="badge" style="background: #bd2f49">Nothing</div>
              </div>
              <div v-if="store.inputVolumeMeters.length > 0" class="flex gap-4">
                <template
                  v-for="volumeMeter in store.inputVolumeMeters"
                  :key="volumeMeter.inputName"
                >
                  <InputAudio :volume-meter="volumeMeter" />
                </template>
              </div>
              <div
                v-else
                class="flex h-[280px] flex-col items-center justify-center gap-2 text-center"
              >
                <i class="fal fa-fw fa-sliders-up text-5xl text-zinc-500"></i>
                <h3 class="mt-2 text-sm font-semibold text-zinc-200">
                  No Audio Sources
                </h3>
                <p class="mt-1 text-sm text-zinc-500">
                  Your <b>Program</b> doesn't have any audio sources.
                </p>
              </div>
            </AppSection>
          </div>

          <div class="grid hidden grid-cols-1 gap-4 lg:col-span-2">
            <AppSectionTitle> Ingest</AppSectionTitle>
            <AppSection>
              <div class="grid grid-cols-7 text-center">
                <div class="grid gap-2">
                  <div>
                    <i
                      class="far fa-fw fa-satellite-dish text-3xl text-white/80"
                    ></i>
                  </div>
                  <div class="text-sm text-white/80">Sender</div>
                </div>
                <div class="flex items-center justify-center">
                  <i
                    class="fal fa-fw fa-arrow-right text-2xl text-white/20"
                  ></i>
                </div>
                <div class="grid gap-2">
                  <div>
                    <i class="far fa-fw fa-server text-3xl text-white/80"></i>
                  </div>
                  <div class="text-sm text-white/80">SRT</div>
                </div>
                <div class="flex items-center justify-center">
                  <i
                    class="fal fa-fw fa-arrow-right text-2xl text-white/20"
                  ></i>
                </div>
                <div class="grid gap-2">
                  <div>
                    <i class="far fa-fw fa-cloud text-3xl text-white/80"></i>
                  </div>
                  <div class="text-sm text-white/80">Cloud OBS</div>
                </div>
                <div class="flex items-center justify-center">
                  <i
                    class="fal fa-fw fa-arrow-right text-2xl text-white/20"
                  ></i>
                </div>
                <div class="grid gap-2">
                  <div>
                    <i class="fab fa-fw fa-twitch text-3xl text-white/80"></i>
                  </div>
                  <div class="text-sm text-white/80">Twitch</div>
                </div>
              </div>
            </AppSection>
            <AppSection>
              SRT Caller & Listener:
              <div class="mt-2 grid gap-4">
                <input
                  type="text"
                  class="w-full rounded-lg bg-transparent"
                  value="srt://fsn1.ingest.localhost:1337?streamid=publish/live_106415581_1/jUeec5QnspjXbTYz3zdJfhUCBKtC3J"
                />
                <input
                  type="text"
                  class="w-full rounded-lg bg-transparent"
                  value="srt://fsn1.ingest.localhost:1337?streamid=play/live_106415581_1"
                />
              </div>
            </AppSection>
          </div>
        </div>
      </main>
      <footer>
        <div class="mx-auto px-8">
          <div
            class="border-t border-zinc-800 py-8 text-center text-sm text-gray-500 sm:text-left"
          >
            <span class="block sm:inline">
              &copy; 2023 René Preuß. All rights reserved. Running OBS Websocket
              {{ store.version.obsWebSocketVersion }} on OBS Studio
              {{ store.version.obsVersion }} on
              {{ store.version.platformDescription }}.
            </span>
          </div>
        </div>
      </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import StudioView from './components/molecules/StudioView.vue'
import SceneList from './components/molecules/SceneList.vue'
import AppSection from './components/molecules/AppSection.vue'
import AppHeader from './components/organisms/AppHeader.vue'
import AppSectionTitle from './components/atoms/AppSectionTitle.vue'
import SceneItemsList from './components/molecules/SceneItemsList.vue'
import InputAudio from './components/molecules/VolumeMeter.vue'

import { useAppStore } from './store/app'
import AppPopups from './components/organisms/AppPopups.vue'
import AppNotifications from './components/organisms/AppNotifications.vue'
import { usePopupStore } from './store/popup'

const store = useAppStore()
const {openPopup} = usePopupStore()
</script>

<style scoped>
.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  color: #fff;
  font-size: 0.75rem;
  line-height: 1rem;
}
</style>
