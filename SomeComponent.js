// SomeComponent.js

import React, { useEffect } from 'react';
import { Button, View } from 'react-native';
import { requestCameraPermission } from './permissions'; // Import from the utility file

const SomeComponent = () => {
  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View>
      <Button title="Request Camera Permission" onPress={requestCameraPermission} />
    </View>
  );
};

export default SomeComponent;
