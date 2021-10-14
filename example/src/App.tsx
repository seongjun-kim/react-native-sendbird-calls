import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import {
  initSendbirdCalls,
  authenticateUser,
  // registerPushToken,
  addListener,
  dial,
} from 'react-native-sendbird-calls';

const SENDBIRD_APP_ID = 'F76714E9-2638-44BE-B893-9276E94AD221';
const USER_ID = 'tester1';
const CALLEE_ID = 'tester2';
// const ACCESS_TOKEN = '';

// const dummyListener = (name: String) => {
//   console.log('wow dummyListener! call:', name);
// };
const dummyFunction = () => {
  console.log('wow dummy!');
};

const DialButton = () => {
  const onPress = () => {
    dial(CALLEE_ID).then((res: Boolean) => console.log(res));
  };

  return <Button title="Make a Call" color="#333" onPress={onPress} />;
};

const AcceptButton = () => {
  const onPress = () => {
    // dial(CALLEE_ID).then((res: Boolean) => console.log(res));
  };

  return <Button title="Accept the Call" color="#03e0a4" onPress={onPress} />;
};
const DeclineButton = () => {
  const onPress = () => {
    // dial(CALLEE_ID).then((res: Boolean) => console.log(res));
  };

  return <Button title="Decline the Call" color="#ff1584" onPress={onPress} />;
};

export default function App() {
  React.useEffect(() => {
    initSendbirdCalls(SENDBIRD_APP_ID).then((res: Boolean) => {
      if (res) {
        // authenticateUser(USER_ID, ACCESS_TOKEN, dummyFunction); // if ACCESS_TOKEN is assigned
        authenticateUser(USER_ID, undefined, dummyFunction);

        // [TODO] Check each listners' action
        // addListener(dummyListener('onEstablished'), dummyListener('onConnected'), dummyListener('onEnded'), dummyListener('onRemoteAudioSettingsChanged'));
        addListener();
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <DialButton />
      <AcceptButton />
      <DeclineButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
