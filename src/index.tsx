import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-sendbird-calls' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

const SendbirdCalls = NativeModules.SendbirdCalls
  ? NativeModules.SendbirdCalls
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function initSendbirdCalls(appId: String) {
  SendbirdCalls.setAppId(appId);
  return SendbirdCalls.init();
}

export function authenticateUser(
  userId: String,
  accessToken?: String,
  onResult?: Function
) {
  SendbirdCalls.authenticateUser(userId, accessToken, onResult);
}

export function registerPushToken(pushToken: String, onResult?: Function) {
  SendbirdCalls.registerPushToken(pushToken, onResult);
}

export function acceptCall() {
  return SendbirdCalls.acceptCall();
}
export function declineCall() {
  return SendbirdCalls.declineCall();
}
export function dial(calleeId: String) {
  return SendbirdCalls.dial(calleeId);
}

export function addListener(
  onEstablished?: Function,
  onConnected?: Function,
  onEnded?: Function,
  onRemoteAudioSettingsChanged?: Function
) {
  SendbirdCalls.addListener(
    onEstablished,
    onConnected,
    onEnded,
    onRemoteAudioSettingsChanged
  );
}
