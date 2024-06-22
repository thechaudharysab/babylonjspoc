import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useEngine, EngineView } from '@babylonjs/react-native';
import { ArcRotateCamera, Camera, Scene, SceneLoader, Color4, Color3 } from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

function App(): React.JSX.Element {

  const gltfURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf';
  const horseGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Horse.gltf';

  const engine = useEngine();
  const [scene, setScene] = useState<Scene>();
  const [camera, setCamera] = useState<Camera>();

  useEffect(() => {
    if (engine) {
      SceneLoader.LoadAsync(horseGLTFURL, undefined, engine).then((loadScene) => {
        if (loadScene) {
          setScene(loadScene);
          // console.log("loadScene: ", loadScene)
          loadScene.createDefaultCameraOrLight(true, undefined, true);
          (loadScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
          (loadScene.activeCamera as ArcRotateCamera).radius = 10;
          (loadScene.activeCamera as ArcRotateCamera).pinchPrecision = 200;
          setCamera(loadScene.activeCamera!);
          loadScene.clearColor = new Color4(1, 1, 1, 1)
          loadScene.ambientColor = new Color3(1, 1, 1)
        } else {
          console.error("Error loading loadScene.");
        }
      }).catch((error) => {
        console.error("Error loading scene: ", error);
      });
    }
  }, [engine]);

  return (
    // <SafeAreaView>
    //   <Text>Open up App.tsx to start working on your app!</Text>
    <View style={styles.container}>
      <EngineView camera={camera} displayFrameRate={true} />
    </View>
    // </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  }
});

export default App;
