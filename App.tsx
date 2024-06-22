import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useEngine, EngineView } from '@babylonjs/react-native';
import { ArcRotateCamera, Camera, Scene, SceneLoader, Color4, Color3 } from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

function App(): React.JSX.Element {

  // const gltfURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf';
  const horseGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Horse.gltf';

  const engine = useEngine();
  const [scene, setScene] = useState<Scene>();
  const [camera, setCamera] = useState<Camera>();

  useEffect(() => {
    if (engine) {
      SceneLoader.LoadAsync(horseGLTFURL, undefined, engine).then((loadScene) => {
        if (loadScene) {
          setScene(loadScene);
          loadScene.createDefaultCameraOrLight(true, undefined, true);
          (loadScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
          (loadScene.activeCamera as ArcRotateCamera).radius = 10;
          (loadScene.activeCamera as ArcRotateCamera).pinchPrecision = 200;
          setCamera(loadScene.activeCamera!);

          var idleAnimation = loadScene.getAnimationGroupByName("Idle");
          if (idleAnimation) {
            // Adding true will loop the animation
            idleAnimation.play(true);
          } else {
            console.warn("Animation not found:", idleAnimation);
          }

          // Some notes on animations
          // const idleAnimationName = "Idle_2"
          // const animationGroup = loadScene.animationGroups.find((group) => group.name === idleAnimationName);
          // if (animationGroup) {
          //   animationGroup.play();
          // } else {
          //   console.warn("Animation not found:", idleAnimationName);
          // }
          // loadScene.animationGroups.forEach((animationGroup) => {
          //   console.log("Animation Name:", animationGroup.name);
          //   /**
          //    * LOG  Animation Name: Attack_Headbutt
          //    * LOG  Animation Name: Attack_Kick
          //    * LOG  Animation Name: Death
          //    * LOG  Animation Name: Eating
          //    * LOG  Animation Name: Gallop
          //    * LOG  Animation Name: Gallop_Jump
          //    * LOG  Animation Name: Idle
          //    * LOG  Animation Name: Idle_2
          //    * LOG  Animation Name: Idle_Headlow
          //    * LOG  Animation Name: Idle_HitReact1
          //    * LOG  Animation Name: Idle_HitReact2
          //    * LOG  Animation Name: Jump_toIdle
          //    * LOG  Animation Name: Walk
          //    */
          // });
        } else {
          console.error("Error loading loadScene.");
        }
      }).catch((error) => {
        console.error("Error loading scene: ", error);
      });
    }
  }, [engine]);

  const doWalkAnimation = () => {
    if (scene) {
      var walkAnimation = scene.getAnimationGroupByName("Walk");
      if (walkAnimation) {
        walkAnimation.play();
      } else {
        console.warn("Animation not found:", walkAnimation);
      }
    }
  };

  const doJumpAnimation = () => {
    if (scene) {
      var walkAnimation = scene.getAnimationGroupByName("Jump_toIdle");
      if (walkAnimation) {
        walkAnimation.play();
      } else {
        console.warn("Animation not found:", walkAnimation);
      }
    }
  };

  const randomizeBGColor = () => {
    if (scene) {
      // Generate random color values (0-255)
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);
      const randomColor = new Color4(red / 255, green / 255, blue / 255, 1.0);

      scene.clearColor = randomColor;
    }
  };

  return (
    <View style={styles.container}>
      <EngineView camera={camera} displayFrameRate={true} />
      <View style={styles.absoluteView}>
        <TouchableOpacity style={styles.buttonContainer} onPress={doWalkAnimation}>
          <Text>Walk</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={doJumpAnimation}>
          <Text>Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={randomizeBGColor}>
          <Text>Random BG Color</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  absoluteView: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: '#61dafb',
    borderWidth: 1,
    padding: 4,
  }
});

export default App;
