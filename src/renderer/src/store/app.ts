import {defineStore} from 'pinia'
import {EventSubscription, OBSEventTypes} from 'obs-websocket-js'
import {useObs} from '../composables/useObs'

const {obs: websocket} = useObs()
const unsupportedAudioInputs: string[] = [
  'text_ft2_source_v2', 'image_source', 'monitor_capture'
]

export interface SceneItem {
  inputKind: string,
  isGroup: null | boolean,
  sceneItemBlendMode: 'OBS_BLEND_NORMAL',
  sceneItemEnabled: boolean,
  sceneItemId: number,
  sceneItemIndex: number,
  sceneItemLocked: boolean
  sceneItemTransform: any,
  sourceName: string,
  sourceType: 'OBS_SOURCE_TYPE_INPUT' | 'OBS_SOURCE_TYPE_SCENE',
}

export interface InputVolumeMeter {
  inputLevelsMul: number[][],
  inputName: string,
}

export interface Connection {
  tls: boolean,
  ip: string,
  port: string,
  password: string
}

export interface State {
  connection: Connection,
  connected: boolean,
  currentPreviewSceneName: string | null,
  currentProgramSceneName: string,
  scenes: {
    sceneIndex: number,
    sceneName: string
  }[],
  inputs: {
    inputKind: string,
    inputName: string,
    unversionedInputKind: string
  }[],
  profileList: {
    currentProfileName: string
    profiles: string[]
    changing: boolean
  },
  sceneCollectionList: {
    currentSceneCollectionName: string
    sceneCollections: string[]
    changing: boolean
  }
  inputVolumeMeters: InputVolumeMeter[],
  inputVolumes: {
    [key: string]: {
      inputVolumeDb: number,
      inputVolumeMul: number,
      inputMuted: boolean,
    }
  }
  sceneItems: SceneItem[],
  hello: {
    rpcVersion: number,
    obsWebsocketVersion: string,
    negotiatedRpcVersion: number,
  }
  version: {
    availableRequests: string[]
    obsVersion: string
    obsWebSocketVersion: string
    platform: string
    platformDescription: string
    rpcVersion: number
    supportedImageFormats: string[]
  },
  stats: {
    cpuUsage: number,
    memoryUsage: number,
    availableDiskSpace: number,
    activeFps: number,
    renderSkippedFrames: number,
    outputSkippedFrames: number,
  }
  videoSettings: {
    fpsNumerator: number,
    fpsDenominator: number,
    baseWidth: number,
    baseHeight: number,
    outputWidth: number,
    outputHeight: number,
  }
  recordStatus: {
    outputActive: boolean,
    outputPaused: boolean,
    outputTimecode: string,
    outputDuration: number,
    outputBytes: number
  }
  streamStatus: {
    outputActive: boolean,
    outputReconnecting: boolean,
    outputTimecode: string,
    outputDuration: number,
    outputBytes: number,
    outputCongestion: number,
    outputSkippedFrames: number,
    outputTotalFrames: number,
  },
  screenshot: {
    imageWidth: number,
    imageCompressionQuality: number,
  },
  bandwidth: {
    bytesTransferred: number,
    bytesTransferredPrevious: number,
    requestsCount: number,
    requestsCountPrevious: number,
    bandwidth: number,
  },
  intervals: {
    [key: string]: NodeJS.Timeout
  }
}

export const useAppStore = defineStore('obs', {
  state: (): State => {
    return {
      connection: {
        tls: false,
        ip: 'localhost',
        port: '4444',
        password: ''
      },
      connected: false,
      currentPreviewSceneName: '',
      currentProgramSceneName: '',
      scenes: [],
      inputs: [],
      profileList: {
        changing: false,
        currentProfileName: '',
        profiles: []
      },
      sceneCollectionList: {
        changing: false,
        currentSceneCollectionName: '',
        sceneCollections: []
      },
      sceneItems: [],
      inputVolumeMeters: [],
      inputVolumes: {},
      hello: {
        rpcVersion: 0,
        obsWebsocketVersion: '',
        negotiatedRpcVersion: 0
      },
      version: {
        obsVersion: '',
        obsWebSocketVersion: '',
        platform: '',
        platformDescription: '',
        rpcVersion: 0,
        availableRequests: [],
        supportedImageFormats: []
      },
      stats: {
        cpuUsage: 0,
        memoryUsage: 0,
        availableDiskSpace: 0,
        activeFps: 0,
        renderSkippedFrames: 0,
        outputSkippedFrames: 0
      },
      videoSettings: {
        fpsNumerator: 0,
        fpsDenominator: 0,
        baseWidth: 0,
        baseHeight: 0,
        outputWidth: 0,
        outputHeight: 0
      },
      recordStatus: {
        outputActive: false,
        outputPaused: false,
        outputTimecode: '0:00:00',
        outputDuration: 0,
        outputBytes: 0
      },
      streamStatus: {
        outputActive: false,
        outputReconnecting: false,
        outputTimecode: '0:00:00',
        outputDuration: 0,
        outputBytes: 0,
        outputCongestion: 0,
        outputSkippedFrames: 0,
        outputTotalFrames: 0
      },
      screenshot: {
        imageWidth: 640,
        imageCompressionQuality: 10,
      },
      bandwidth: {
        bytesTransferred: 0,
        bytesTransferredPrevious: 0,
        requestsCount: 0,
        requestsCountPrevious: 0,
        bandwidth: 0,
      },
      intervals: {}
    }
  },
  getters: {
    currentSceneName(): string {
      return this.currentPreviewSceneName || this.currentProgramSceneName
    },
    studioMode(): boolean {
      return !!this.currentPreviewSceneName;
    },
  },
  actions: {
    async connect(connection: Connection): Promise<void> {
      await this.disconnect()

      this.connection = connection
      const protocol = connection.tls ? 'wss' : 'ws'
      const url = `${protocol}://${connection.ip}:${connection.port}`
      this.hello = await websocket.connect(url, connection.password, {
        eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
        rpcVersion: 1
      }) as unknown as State['hello']
      this.version = await websocket.call('GetVersion') as unknown as State['version']
      const outputs = await websocket.call('GetOutputList') as unknown

      console.log('hello', this.hello)
      console.log('version', this.version)
      console.log('outputs', outputs)

      await this.fetchEntireState()

      this.inputs.forEach((input) => {
        if (unsupportedAudioInputs.includes(input.inputKind)) {
          // we don't support these inputs
          return
        }

        websocket.call('GetInputVolume', {inputName: input.inputName})
          .then((response) => {
            this.inputVolumes[input.inputName] = {
              inputVolumeDb: response.inputVolumeDb,
              inputVolumeMul: response.inputVolumeMul,
              inputMuted: this.inputVolumes[input.inputName]?.inputMuted ?? false
            }
          })
          .catch((e) => {
            console.error(e, input)
          })
        websocket.call('GetInputMute', {inputName: input.inputName})
          .then((response) => {
            this.inputVolumes[input.inputName] = {
              inputVolumeDb: this.inputVolumes[input.inputName]?.inputVolumeDb ?? 0,
              inputVolumeMul: this.inputVolumes[input.inputName]?.inputVolumeMul ?? 0,
              inputMuted: response.inputMuted
            }
          })
          .catch((e) => {
            console.error(e, input)
          })
      })

      websocket.on('CurrentProgramSceneChanged', async (e: OBSEventTypes['CurrentProgramSceneChanged']) => {
        this.currentProgramSceneName = e.sceneName
        if (!this.studioMode) {
          await this.updateSceneItems()
        }
      })
      websocket.on('CurrentPreviewSceneChanged', async (e: OBSEventTypes['CurrentPreviewSceneChanged']) => {
        this.currentPreviewSceneName = e.sceneName
        if (this.studioMode) {
          await this.updateSceneItems()
        }
      })
      websocket.on('SceneItemListReindexed', (e: OBSEventTypes['SceneItemListReindexed']) => {
        if (this.currentPreviewSceneName === e.sceneName) {
          console.log(e.sceneItems) // {sceneItemId: 13, sceneItemIndex: 1}[]
          console.log(this.sceneItems) // {sceneItemId: 13, sceneItemIndex: 1}[]
        }
      })
      websocket.on('SceneItemEnableStateChanged', (e: OBSEventTypes['SceneItemEnableStateChanged']) => {
        if (this.currentPreviewSceneName === e.sceneName) {
          // update sceneItem in sceneItems
          const sceneItem = this.sceneItems
            .find((sceneItem) => sceneItem.sceneItemId === e.sceneItemId)
          if (sceneItem) {
            sceneItem.sceneItemEnabled = e.sceneItemEnabled
          }
        }
      })
      websocket.on('SceneItemLockStateChanged', (e: OBSEventTypes['SceneItemLockStateChanged']) => {
        if (this.currentPreviewSceneName === e.sceneName) {
          // update sceneItem in sceneItems
          const sceneItem = this.sceneItems
            .find((sceneItem) => sceneItem.sceneItemId === e.sceneItemId)
          if (sceneItem) {
            sceneItem.sceneItemLocked = e.sceneItemLocked
          }
        }
      })
      // Audio API

      websocket.on('InputVolumeMeters', (e: OBSEventTypes['InputVolumeMeters']) => {
        // update inputVolumeMeters
        this.inputVolumeMeters = e.inputs as unknown as InputVolumeMeter[]
      })

      websocket.on('StreamStateChanged', (e: OBSEventTypes['StreamStateChanged']) => {
        this.streamStatus.outputActive = e.outputActive
      })

      websocket.on('InputVolumeChanged', (e: OBSEventTypes['InputVolumeChanged']) => {
        this.inputVolumes[e.inputName] = {
          inputVolumeDb: e.inputVolumeDb,
          inputVolumeMul: e.inputVolumeMul,
          inputMuted: this.inputVolumes[e.inputName]?.inputMuted ?? false
        }
      })

      websocket.on('InputMuteStateChanged', (e: OBSEventTypes['InputMuteStateChanged']) => {
        this.inputVolumes[e.inputName] = {
          inputVolumeDb: this.inputVolumes[e.inputName]?.inputVolumeDb ?? 0,
          inputVolumeMul: this.inputVolumes[e.inputName]?.inputVolumeMul ?? 0,
          inputMuted: e.inputMuted
        }
      })

      // Recording API

      websocket.on('RecordStateChanged', (e: OBSEventTypes['RecordStateChanged']) => {
        this.recordStatus.outputActive = e.outputActive
      })

      websocket.on('SceneListChanged', (e: OBSEventTypes['SceneListChanged']) => {
        this.scenes = e.scenes as unknown as State['scenes']
      })

      // Scene & Profile API

      websocket.on('SceneCollectionListChanged', (e: OBSEventTypes['SceneCollectionListChanged']) => {
        this.sceneCollectionList.sceneCollections = e.sceneCollections
      })

      websocket.on('CurrentSceneCollectionChanging', () => {
        this.sceneCollectionList.changing = true
      })

      websocket.on('CurrentSceneCollectionChanged', async () => {
        await this.fetchEntireState()
      })

      websocket.on('ProfileListChanged', (e: OBSEventTypes['ProfileListChanged']) => {
        this.profileList.profiles = e.profiles
      })

      websocket.on('CurrentProfileChanging', () => {
        this.profileList.changing = false
      })

      websocket.on('CurrentProfileChanged', async () => {
        await this.fetchEntireState()
      })

      websocket.on('StudioModeStateChanged', async (e: OBSEventTypes['StudioModeStateChanged']) => {
        if (e.studioModeEnabled) {
          const {currentPreviewSceneName} = await websocket.call('GetCurrentPreviewScene')
          this.currentPreviewSceneName = currentPreviewSceneName
        } else {
          this.currentPreviewSceneName = null
          await this.updateSceneItems()
        }
      })

      const list = ['SceneItemCreated', 'SceneItemRemoved', 'SceneItemListReindexed']
      list.forEach((event: any) => websocket.on(event, () => this.updateSceneItems()))

      this.connected = true
    },
    async disconnect(): Promise<void> {
      await websocket.disconnect()
      this.connected = false
    },
    async registerInterval(name: string, callback: () => Promise<void>, interval: number) {
      if (this.intervals[name]) {
        clearInterval(this.intervals[name])
      }
      await callback()
      this.intervals[name] = setInterval(callback, interval)
    },
    async fetchEntireState() {
      const response = await websocket.call('GetSceneList')

      this.currentPreviewSceneName = response.currentPreviewSceneName
      this.currentProgramSceneName = response.currentProgramSceneName
      this.scenes = response.scenes as unknown as State['scenes']
      this.inputs = (await websocket.call('GetInputList')).inputs as unknown as State['inputs']
      this.videoSettings = await websocket.call('GetVideoSettings')
      this.videoSettings = await websocket.call('GetVideoSettings')
      this.profileList = {
        ...await websocket.call('GetProfileList'),
        changing: false
      }
      this.sceneCollectionList = {
        ...await websocket.call('GetSceneCollectionList'),
        changing: false
      }
      await this.updateSceneItems()

      await this.registerInterval('status', async () => {
        this.recordStatus = await websocket.call('GetRecordStatus')
        this.streamStatus = await websocket.call('GetStreamStatus')
      }, 1000)

      await this.registerInterval('stats', async () => {
        this.stats = await websocket.call('GetStats')
      }, 3000)

      await this.registerInterval('bandwidth', async () => {
        // Calculate bandwidth in the last second
        const bytesTransferredLastSecond = this.bandwidth.bytesTransferred - this.bandwidth.bytesTransferredPrevious;
        const requestsCountLastSecond = this.bandwidth.requestsCount - this.bandwidth.requestsCountPrevious;

        if (requestsCountLastSecond > 0) {
          this.bandwidth.bandwidth = bytesTransferredLastSecond / requestsCountLastSecond; // Update bandwidth value
        } else {
          this.bandwidth.bandwidth = 0; // No requests in the last second, set bandwidth to 0
        }

        // Update previous values for next calculation
        this.bandwidth.bytesTransferredPrevious = this.bandwidth.bytesTransferred;
        this.bandwidth.requestsCountPrevious = this.bandwidth.requestsCount;
      }, 1000)

      console.log('inputs', this.inputs)
    },
    async updateSceneItems() {
      this.sceneItems = (await websocket.call('GetSceneItemList', {
        sceneName: this.currentSceneName,
      })).sceneItems as unknown as State['sceneItems']
    },
    setInputVolume(inputName: string, inputVolumeDb: number) {
      // noinspection JSIgnoredPromiseFromCall
      websocket.call('SetInputVolume', {
        inputName,
        inputVolumeDb
      })
    },
    async toggleStudioMode() {
      await websocket.call('SetStudioModeEnabled', {
        studioModeEnabled: !this.studioMode,
      })
    },
    async updatePreviewScene(sceneName: string) {
      if (this.studioMode) {
        await websocket.call('SetCurrentPreviewScene', {
          sceneName: sceneName,
        })
      } else {
        await websocket.call('SetCurrentProgramScene', {
          sceneName: sceneName,
        })
      }
    },
    setImageCompressionQuality(imageCompressionQuality: number) {
      this.screenshot.imageCompressionQuality = imageCompressionQuality
    },
    updateBandwidth(bytesTransferred: number) {
      // log in kb
      // console.log('bytesTransferred', bytesTransferred / 1024)
      this.bandwidth.bytesTransferred += bytesTransferred;
      this.bandwidth.requestsCount++;
    },

  }
})
