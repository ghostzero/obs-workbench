import { LayoutConfig } from 'golden-layout'

export const defaultLayoutConfig: LayoutConfig = {
  root: {
    type: 'row',
    content: [
      {
        type: 'column',
        content: [
          {
            type: 'stack',
            content: [
              {
                type: 'component',
                content: [],
                size: 1,
                sizeUnit: 'fr',
                minSizeUnit: 'px',
                id: '',
                maximised: false,
                isClosable: true,
                reorderEnabled: true,
                title: 'Scenes',
                componentType: 'Scenes',
                componentState: {
                  refId: 0
                }
              }
            ],
            size: 50,
            sizeUnit: '%',
            minSizeUnit: 'px',
            id: '',
            isClosable: true,
            maximised: false,
            activeItemIndex: 0
          },
          {
            type: 'stack',
            content: [
              {
                type: 'component',
                content: [],
                size: 1,
                sizeUnit: 'fr',
                minSizeUnit: 'px',
                id: '',
                maximised: false,
                isClosable: true,
                reorderEnabled: true,
                title: 'Sources',
                componentType: 'Sources',
                componentState: {
                  refId: 1
                }
              }
            ],
            size: 50,
            sizeUnit: '%',
            minSizeUnit: 'px',
            id: '',
            isClosable: true,
            maximised: false,
            activeItemIndex: 0
          }
        ],
        size: 25.252525252525253,
        sizeUnit: '%',
        minSizeUnit: 'px',
        id: '',
        isClosable: true
      },
      {
        type: 'column',
        content: [
          {
            type: 'stack',
            content: [
              {
                type: 'component',
                content: [],
                size: 1,
                sizeUnit: 'fr',
                minSizeUnit: 'px',
                id: '',
                maximised: false,
                isClosable: true,
                reorderEnabled: true,
                title: 'Main',
                componentType: 'Main',
                componentState: {
                  refId: 2
                }
              }
            ],
            size: 58.58585858585859,
            sizeUnit: '%',
            minSizeUnit: 'px',
            id: '',
            isClosable: true,
            maximised: false,
            activeItemIndex: 0
          },
          {
            type: 'stack',
            content: [
              {
                type: 'component',
                content: [],
                size: 1,
                sizeUnit: 'fr',
                minSizeUnit: 'px',
                id: '',
                maximised: false,
                isClosable: true,
                reorderEnabled: true,
                title: 'Audio Mixer',
                componentType: 'AudioMixer',
                componentState: {
                  refId: 3
                }
              }
            ],
            size: 41.41414141414141,
            sizeUnit: '%',
            minSizeUnit: 'px',
            id: '',
            isClosable: true,
            maximised: false,
            activeItemIndex: 0
          }
        ],
        size: 74.74747474747475,
        sizeUnit: '%',
        minSizeUnit: 'px',
        id: '',
        isClosable: true
      }
    ],
    size: 1,
    sizeUnit: 'fr',
    minSizeUnit: 'px',
    id: '',
    isClosable: true
  },
  openPopouts: [],
  settings: {
    constrainDragToContainer: true,
    reorderEnabled: true,
    popoutWholeStack: false,
    blockedPopoutsThrowError: true,
    closePopoutsOnUnload: true,
    responsiveMode: 'none',
    tabOverlapAllowance: 0,
    reorderOnTabMenuClick: true,
    tabControlOffset: 10,
    popInOnClose: false
  },
  dimensions: {
    borderWidth: 5,
    borderGrabWidth: 5,
    defaultMinItemHeight: 0,
    defaultMinItemHeightUnit: 'px',
    defaultMinItemWidth: 10,
    defaultMinItemWidthUnit: 'px',
    headerHeight: 20,
    dragProxyWidth: 300,
    dragProxyHeight: 200
  },
  header: {
    show: 'top',
    popout: false,
    dock: 'dock',
    close: 'close',
    maximise: false,
    minimise: 'minimise',
    tabDropdown: 'additional tabs'
  },
  resolved: true
} as unknown as LayoutConfig
