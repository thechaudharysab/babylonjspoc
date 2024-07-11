import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useEngine, EngineView } from '@babylonjs/react-native';
import { ArcRotateCamera, Camera, Scene, SceneLoader, Color4, AnimationGroup, Nullable } from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

// import { elevenlabs_API_KEY } from './src/constants';

function App(): React.JSX.Element {

  // const gltfURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf';
  const horseGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Horse.gltf';
  const walkingManGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/walking_man/animated_man.gltf';
  const dancingManGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/dancing_man/dancing_man.gltf';
  const droneGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/drone/buster_drone.gltf';
  const glbTest = 'https://github.com/thechaudharysab/babylonjspoc/raw/main/src/assets/Client.glb';

  const Client = "https://github.com/ibjects/Pailo/raw/main/src/assets/glb3D/Client.glb";
  const DwarfIdle = "https://github.com/ibjects/Pailo/raw/main/src/assets/glb3D/DwarfIdle.glb";

  const ClientGLTF = "https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Client.gltf";

  const engine = useEngine();
  const [scene, setScene] = useState<Scene>();
  const [camera, setCamera] = useState<Camera>();
  const [currentAnimation, setCurrentAnimation] = useState<Nullable<AnimationGroup>>(null);

  // const renderWalkingMan = () => {
  //   SceneLoader.LoadAsync(dancingManGLTFURL, undefined, engine).then((loadScene) => {
  //     if (loadScene) {
  //       setScene(loadScene);
  //       loadScene.createDefaultCameraOrLight(true, undefined, true);
  //       (loadScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
  //       (loadScene.activeCamera as ArcRotateCamera).radius = 10;
  //       (loadScene.activeCamera as ArcRotateCamera).pinchPrecision = 200;
  //       setCamera(loadScene.activeCamera!);

  //       loadScene.animationGroups.forEach((animationGroup) => {
  //         console.log("Animation Name:", animationGroup.name);
  //       });
  //     } else {
  //       console.error("Error loading loadScene.");
  //     }
  //   }).catch((error) => {
  //     console.error("Error loading scene: ", error);
  //   });
  // };

  // const renderClient = () => {
  //   SceneLoader.LoadAsync(ClientGLTF, undefined, engine).then((loadScene) => {
  //     if (loadScene) {
  //       setScene(loadScene);
  //       // Light
  //       const light = new HemisphericLight("light", new Vector3(0, 1, 0), loadScene);
  //       light.intensity = 0.7;

  //       // Camera
  //       const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2, -6, new Vector3(0, 2, 0), loadScene, true);
  //       setCamera(camera);
  //     } else {
  //       console.error("Error loading loadScene.");
  //     }
  //   }).catch((error) => {
  //     console.error("Error loading scene: ", error);
  //   });
  // };

  // const clyinderTest = () => {
  //   // if (engine) {
  //   const scene = new Scene(engine!);

  //   const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 5, new Vector3(0, 0, 0), scene);
  //   camera.attachControl(true);
  //   setCamera(camera);

  //   const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
  //   light.intensity = 0.7;

  //   const cylinder = MeshBuilder.CreateCylinder('cylinder', { height: 1, diameter: 1 }, scene);

  //   const shinyMaterial = new StandardMaterial('shiny', scene);
  //   shinyMaterial.diffuseColor = new Color3(1, 0, 0); // Red color
  //   shinyMaterial.specularColor = new Color3(1, 1, 1); // White color for shiny effect
  //   shinyMaterial.specularPower = 64; // Increase the shine effect

  //   cylinder.material = shinyMaterial;

  //   setScene(scene);
  //   // }
  // };

  //#region Tween

  // const [idleAnimation, setIdleAnimation] = useState<Nullable<AnimationGroup>>(null);
  // const [walkAnimation, setWalkAnimation] = useState<Nullable<AnimationGroup>>(null);
  // const [jumpAnimation, setJumpAnimation] = useState<Nullable<AnimationGroup>>(null);

  const renderHorseExperiments = () => {
    SceneLoader.LoadAsync(horseGLTFURL, undefined, engine).then((loadScene: Scene) => {
      if (loadScene) {
        setScene(loadScene);
        loadScene.createDefaultCameraOrLight(true, undefined, true);
        const arcCamera = loadScene.activeCamera as ArcRotateCamera;
        arcCamera.alpha += Math.PI;
        arcCamera.radius = 10;
        arcCamera.pinchPrecision = 200;
        setCamera(arcCamera);

        const idleAnim = loadScene.getAnimationGroupByName('Idle');

        if (idleAnim) {
          idleAnim.start(true, 1.0, idleAnim.from, idleAnim.to, true);
        }
      } else {
        console.error("Error loading loadScene.");
      }
    }).catch((error) => {
      console.error("Error loading scene: ", error);
    });
  }

  // const blendAnimations = (from: AnimationGroup, to: AnimationGroup, duration: number) => {
  //   let startTime = Date.now();
  //   const frame = () => {
  //     let elapsed = (Date.now() - startTime) / 1000;
  //     let blend = elapsed / duration;
  //     if (blend > 1) blend = 1;

  //     from.setWeightForAllAnimatables(1 - blend);
  //     to.setWeightForAllAnimatables(blend);

  //     if (blend < 1) {
  //       requestAnimationFrame(frame);
  //     } else {
  //       from.stop();
  //       to.start(true);
  //     }
  //   };
  //   requestAnimationFrame(frame);
  // };

  // const handleButtonPress = () => {
  //   if (idleAnimation && walkAnimation && jumpAnimation) {
  //     // Start blending from Idle to Walk
  //     blendAnimations(idleAnimation, walkAnimation, 1);

  //     // After blending to Walk, blend to Jump
  //     setTimeout(() => {
  //       blendAnimations(walkAnimation, jumpAnimation, 1);
  //     }, 3000); // Adjust the timing for walk to jump transition

  //     // After blending to Jump, blend back to Idle
  //     setTimeout(() => {
  //       blendAnimations(jumpAnimation, idleAnimation, 1);
  //     }, 6000); // Adjust the timing for jump to idle transition
  //   }
  // };

  const renderTestCharacter = () => {

    SceneLoader.LoadAsync(dancingManGLTFURL, undefined, engine).then((loadedScene) => {
      if (loadedScene) {
        setScene(loadedScene);

        // Create a camera
        loadedScene.createDefaultCameraOrLight(true, undefined, true);
        (loadedScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
        setCamera(loadedScene.activeCamera!);

        // Light blue background color
        const lighBlueColor = new Color4(208 / 255, 236 / 255, 255 / 255, 1.0);
        loadedScene.clearColor = lighBlueColor;

      } else {
        console.error("Error loading loadedScene.");
      }
    }).catch((error) => {
      console.error("Error loading scene: ", error);
    });

  };

  //#endregion

  useEffect(() => {
    if (engine) {
      renderTestCharacter();
      // renderClient();
      // renderHorseExperiments();
      // renderWalkingMan();
      // clyinderTest();
    }
  }, [engine]);

  const startWalkAnimation = () => {
    if (scene) {
      const walkAnimation = scene.getAnimationGroupByName("Walk");
      if (walkAnimation) {
        if (currentAnimation) {
          currentAnimation.stop();
        }
        walkAnimation.play(true);
        setCurrentAnimation(walkAnimation);
      } else {
        console.warn("Animation not found:", walkAnimation);
      }
    }
  };

  const stopWalkAnimation = () => {
    if (scene) {
      const idleAnimation = scene.getAnimationGroupByName("Idle");
      if (idleAnimation) {
        if (currentAnimation) {
          currentAnimation.stop();
        }
        idleAnimation.play(true);
        setCurrentAnimation(idleAnimation);
      } else {
        console.warn("Animation not found:", idleAnimation);
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
      {/* <View style={styles.absoluteView}>
        <TouchableOpacity style={styles.buttonContainer} onPress={startWalkAnimation}>
          <Text>Start Walking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={stopWalkAnimation}>
          <Text>Stop Walking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={doJumpAnimation}>
          <Text>Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={randomizeBGColor}>
          <Text>Random BG Color</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#282c34',
  },
  absoluteView: {
    position: 'absolute',
    width: '100%',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    backgroundColor: '#61dafb',
    borderWidth: 1,
    padding: 4,
  }
});

export default App;
