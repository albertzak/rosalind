import EventEmitter from 'eventemitter3'
import Alert from 'react-s-alert'
import { attemptRegistration } from './attemptRegistration'
import { handleAndroidEvents } from './android'
import { handleFakeEvents } from './fakeInterface'
import { handleElectronEvents } from './electron'
import { updateSettings, subscribeSettings } from '../../../api/clients/methods/getSettings'

const events = new EventEmitter()
let bridge = null

// This is set when the native interface is ready
const clientKey = new ReactiveVar(null)

export default () => {
  bridge = getBridge()
  if (!bridge) {
    console.log('[Native] No bridge available')
    return
  }

  // Attempt to contact the native platform
  toNative('hello')

  // If we get a welcome event back, we know we're running on a native platform
  onNativeEvent('welcome', async payload => {
    console.log(`[Native] Got client key ${payload.clientKey.slice(0, 6)}`)

    try {
      const registration = await attemptRegistration({
        systemInfo: payload.systemInfo,
        clientKey: payload.clientKey
      })

      if (registration.isOk) {
        console.log('[Native] Registration succeeded', payload.systemInfo)

        // Make bindings public only after successful registration
        clientKey.set(payload.clientKey)

        updateSettings(registration.settings)
        subscribeSettings()
      } else {
        console.error('[Native] Registration failed', payload.systemInfo)
        Alert.error('Es liegt ein internes Problem mit der Registrierung vor. Bitte per Support-Chat melden. Danke!')
      }
    } catch (e) {
      console.error('[Native] Registration call failed', e)
      Alert.error('Es liegt ein internes Problem mit der Installation vor. Bitte per Support-Chat melden. Danke!')
    }
  })

  window.toNative = toNative
  window.onNativeEvent = onNativeEvent
  window.nativeEvents = events
  window.isNative = () => !!getClientKey()
}

export const onNativeEvent = (event, callback) => {
  events.on(event, callback)
}

export const toNative = (name, payload = {}) => {
  if (!bridge) {
    throw new Error('Cannot post to native without a bridge')
  }

  console.log(`[Native] Posting message to native ${name}`)
  bridge.postToNative(name, payload)
}

export const getClientKey = () => clientKey.get()

const getBridge = () => (
  handleAndroidEvents({ events }) ||
  handleFakeEvents({ events }) ||
  // Check electron last because it always succeeds
  handleElectronEvents({ events })
)
