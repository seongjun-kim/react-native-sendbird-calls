import * as React from 'react';

import { StyleSheet, View, Button } from 'react-native';
import {
  initSendbirdCalls,
  authenticateUser,
  // registerPushToken,
  addListener,
  dial,
  acceptCall,
  declineCall,
} from 'react-native-sendbird-calls';

const SENDBIRD_APP_ID = 'F76714E9-2638-44BE-B893-9276E94AD221';
const USER_ID = 'only4sample1';
const CALLEE_ID = 'only4sample2';
const ACCESS_TOKEN = '3127cacf061012736f8feb8f6eed19fba5c6d8f5';

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

// const AddListenerButton = () => {
//   const onPress = () => {
//     console.log('wow addListener!');
//     addListener();
//   };

//   return <Button title="LISTEN" color="#0f2" onPress={onPress} />;
// };
const AcceptButton = () => {
  const onPress = () => {
    console.log('wow acceptCall!');
    acceptCall();
  };

  return <Button title="Accept the Call" color="#03e0a4" onPress={onPress} />;
};
const DeclineButton = () => {
  const onPress = () => {
    console.log('wow acceptCall!');
    declineCall();
  };

  return <Button title="Decline the Call" color="#ff1584" onPress={onPress} />;
};

export default function App() {
  React.useEffect(() => {
    initSendbirdCalls(SENDBIRD_APP_ID).then((res: Boolean) => {
      if (res) {
        // authenticateUser(USER_ID, ACCESS_TOKEN, dummyFunction); // if ACCESS_TOKEN is assigned
        authenticateUser(USER_ID, ACCESS_TOKEN);

        // [TODO] Check each listners' action
        // addListener(dummyListener('onEstablished'), dummyListener('onConnected'), dummyListener('onEnded'), dummyListener('onRemoteAudioSettingsChanged'));
        addListener();
      }
    });
  }, []);
  return (
    <View style={styles.container}>
      <DialButton />
      {/* <AddListenerButton /> */}
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
