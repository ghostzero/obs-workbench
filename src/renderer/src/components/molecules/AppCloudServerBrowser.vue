<template>
  <AppSection class="text-white/80">
    <div class="text-white text-2xl">
      Get your own Broadcasting Server in Minutes!
    </div>
    <div class="max-h-64 grid gap-2 overflow-y-auto my-2">
      <template v-if="loading">
        <div class="w-full h-20 bg-zinc-700 rounded animate-pulse" />
        <div class="w-full h-20 bg-zinc-700 rounded animate-pulse" />
        <div class="w-full h-20 bg-zinc-700 rounded animate-pulse" />
      </template>
      <template v-else-if="!offers.length">
        <div class="flex justify-center h-64">
          <div class="self-center text-center text-white/50">
            <i class="fas fa-exclamation-triangle text-4xl" />
            <div class="text-2xl">
              No offers available
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <template
          v-for="offer in offers"
          :key="offer.id"
        >
          <div class="bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded flex gap-8 py-2 px-4">
            <div class="flex-none w-[190px]">
              <div class="text-3xl">
                {{ offer.features.num_gpus }}x {{ offer.features.gpu_name }}
              </div>
              <div class="font-semibold">
                {{ offer.geolocation }}
              </div>
              <div class="text-xs text-white/50">
                Reliability: {{ (offer.reliability * 100).toFixed(3) }}%
              </div>
              <div class="text-xs text-white/50">
                Max Duration: {{ offer.duration }}d
              </div>
            </div>
            <div class="flex-none w-[230px]">
              <div class="flex justify-between">
                <div class="font-semibold">
                  <i class="fas fa-arrow-down" />
                  {{ offer.features.inet_down }} Mbit/s
                </div>
                <div class="font-semibold">
                  <i class="fas fa-arrow-up" />
                  {{ offer.features.inet_up }} Mbit/s
                </div>
              </div>
              <div class="text-xl truncate">
                {{ offer.features.cpu_name }}
              </div>
              <div class="flex justify-between text-xs text-white/50">
                <div>{{ offer.features.disk_space.toFixed(0) }} GB SSD</div>
                <div>{{ offer.features.cpu_ram.toFixed(0) }} GB RAM</div>
              </div>
              <div class="pt-1">
                <span
                  :class="['rounded text-xs px-2 pb-0.5', {
                    'bg-green-500/20 text-green-500': offer.verification === 'verified',
                    'bg-zinc-500/20 text-zinc-300': offer.verification === 'unverified',
                  }]"
                >
                  {{ offer.verification }}
                </span>
              </div>
            </div>
            <div class="flex-none text-sm text-white/50 w-[180px] text-right">
              <div>GPU On-Demand: {{ offer.costs.dph_total }} $/hr</div>
              <div>16 GB Disk: {{ offer.costs.storage_total_cost }} $/hr</div>
              <div>
                Upload: {{ offer.costs.inet_up_cost }} $/GB
                <i class="fas fa-arrow-up" />
              </div>
              <div>
                Download: {{ offer.costs.inet_down_cost }} $/GB
                <i class="fas fa-arrow-down" />
              </div>
            </div>
            <div class="flex-1 flex flex-col justify-between">
              <div class="text-center text-xl mt-3 font-bold">
                ${{ offer.costs.dph_total }}/hr
              </div>
              <div class="w-full">
                <AppButton
                  variant="solid"
                  class="w-full"
                  :loading="renting[offer.id]"
                  @click="rent(offer)"
                >
                  Rent
                </AppButton>
              </div>
            </div>
          </div>
        </template>
      </template>
    </div>
  </AppSection>
</template>

<script setup lang="ts">
// http://localhost:8000/api/cloud-servers/offers
import { onMounted, ref } from 'vue'
import AppSection from './AppSection.vue'
import AppButton from '../atoms/AppButton.vue'
import axios from 'axios'
import { useUserStore } from '../../store/user'

class Offer {
  id: number
  name: string
  geolocation: string
  reliability: number
  duration: number
  features: {
    cpu_arch: string
    cpu_ghz: number
    cpu_cores: number
    cpu_cores_effective: number
    cpu_ram: number
    disk_space: number
    num_gpus: number
    gpu_name: string
    gpu_ram: number
    gpu_total_ram: number
    gpu_arch: string
    cpu_name: string
    inet_up: number
    inet_down: number
  }
  costs: {
    dph_total: number
    storage_total_cost: number
    inet_down_cost: number
    inet_up_cost: number
  }
}

const offers = ref<Offer[]>([])
const loading = ref(true)
const renting = ref<{ [key: number]: boolean }>({})

onMounted(async () => {
  const response = await fetch('http://localhost:8000/api/cloud-servers/offers')
  offers.value = (await response.json()).data
  loading.value = false
})
const userStore = useUserStore()

function rent(offer: Offer) {
  renting.value[offer.id] = true
  axios.post<{id: number}>('http://localhost:8000/api/cloud-servers/ask', {
    offer_id: offer.id,
    name: offer.name
  }).then(async (cloudServer) => {
    renting.value[offer.id] = false
    offers.value = offers.value.filter((o) => o.id !== offer.id)
    await userStore.sync()
    await userStore.waitForCloudServer(cloudServer.data.id)
  }).catch(() => {
    renting.value[offer.id] = false
  })
}
</script>
