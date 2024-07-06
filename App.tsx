import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useEngine, EngineView } from '@babylonjs/react-native';
import { ArcRotateCamera, Camera, Scene, SceneLoader, Color4, Color3, HemisphericLight, Vector3, MeshBuilder, StandardMaterial, AnimationGroup, Nullable, AnimationPropertiesOverride, DirectionalLight, ShadowGenerator, Mesh } from "@babylonjs/core";
import '@babylonjs/loaders/glTF';

// import { elevenlabs_API_KEY } from './src/constants';

function App(): React.JSX.Element {

  // const gltfURL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoxAnimated/glTF/BoxAnimated.gltf';
  const horseGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Horse.gltf';
  const walkingManGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/walking_man/animated_man.gltf';
  const dancingManGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/dancing_man/dancing_man.gltf';
  const droneGLTFURL = 'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/drone/buster_drone.gltf';
  const glbTest = 'https://github.com/thechaudharysab/babylonjspoc/raw/main/src/assets/Client.glb';

  const engine = useEngine();
  const [scene, setScene] = useState<Scene>();
  const [camera, setCamera] = useState<Camera>();
  const [currentAnimation, setCurrentAnimation] = useState<Nullable<AnimationGroup>>(null);


  const renderWalkingMan = () => {
    SceneLoader.LoadAsync(dancingManGLTFURL, undefined, engine).then((loadScene) => {
      if (loadScene) {
        setScene(loadScene);
        loadScene.createDefaultCameraOrLight(true, undefined, true);
        (loadScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
        (loadScene.activeCamera as ArcRotateCamera).radius = 10;
        (loadScene.activeCamera as ArcRotateCamera).pinchPrecision = 200;
        setCamera(loadScene.activeCamera!);

        loadScene.animationGroups.forEach((animationGroup) => {
          console.log("Animation Name:", animationGroup.name);
        });
      } else {
        console.error("Error loading loadScene.");
      }
    }).catch((error) => {
      console.error("Error loading scene: ", error);
    });
  };

  const renderHorse = () => {
    SceneLoader.LoadAsync(horseGLTFURL, undefined, engine).then((loadScene) => {
      if (loadScene) {
        setScene(loadScene);
        loadScene.createDefaultCameraOrLight(true, undefined, true);
        (loadScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
        (loadScene.activeCamera as ArcRotateCamera).radius = 10;
        (loadScene.activeCamera as ArcRotateCamera).pinchPrecision = 200;
        setCamera(loadScene.activeCamera!);

        var idleAnimation = loadScene.getAnimationGroupByName('Idle');

        if (idleAnimation) {
          // Adding true will loop the animation
          idleAnimation.play(true);
        } else {
          console.warn("Animation not found:", idleAnimation);
        }

        // loadScene.animationGroups.forEach((animationGroup) =>
        //   console.log("Animation Name:", animationGroup.name));

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
  };

  const clyinderTest = () => {
    // if (engine) {
    const scene = new Scene(engine!);

    const camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 5, new Vector3(0, 0, 0), scene);
    camera.attachControl(true);
    setCamera(camera);

    const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    const cylinder = MeshBuilder.CreateCylinder('cylinder', { height: 1, diameter: 1 }, scene);

    const shinyMaterial = new StandardMaterial('shiny', scene);
    shinyMaterial.diffuseColor = new Color3(1, 0, 0); // Red color
    shinyMaterial.specularColor = new Color3(1, 1, 1); // White color for shiny effect
    shinyMaterial.specularPower = 64; // Increase the shine effect

    cylinder.material = shinyMaterial;

    setScene(scene);
    // }
  };

  //#region Tween

  const [idleAnimation, setIdleAnimation] = useState<Nullable<AnimationGroup>>(null);
  const [walkAnimation, setWalkAnimation] = useState<Nullable<AnimationGroup>>(null);
  const [jumpAnimation, setJumpAnimation] = useState<Nullable<AnimationGroup>>(null);

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

        const light1 = new HemisphericLight("light1", new Vector3(0, 1, 0), loadScene);
        light1.intensity = 0.6;
        light1.specular = Color3.Black();

        const light2 = new DirectionalLight("dir01", new Vector3(0, -0.5, -1.0), loadScene);
        light2.position = new Vector3(0, 5, 5);

        const shadowGenerator = new ShadowGenerator(1024, light2);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;

        const idleAnim = loadScene.getAnimationGroupByName('Idle');
        const walkAnim = loadScene.getAnimationGroupByName('Eating');
        const jumpAnim = loadScene.getAnimationGroupByName('Walk');

        if (idleAnim) setIdleAnimation(idleAnim);
        if (walkAnim) setWalkAnimation(walkAnim);
        if (jumpAnim) setJumpAnimation(jumpAnim);

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

  const blendAnimations = (from: AnimationGroup, to: AnimationGroup, duration: number) => {
    let startTime = Date.now();
    const frame = () => {
      let elapsed = (Date.now() - startTime) / 1000;
      let blend = elapsed / duration;
      if (blend > 1) blend = 1;

      from.setWeightForAllAnimatables(1 - blend);
      to.setWeightForAllAnimatables(blend);

      if (blend < 1) {
        requestAnimationFrame(frame);
      } else {
        from.stop();
        to.start(true);
      }
    };
    requestAnimationFrame(frame);
  };

  const handleButtonPress = () => {
    if (idleAnimation && walkAnimation && jumpAnimation) {
      // Start blending from Idle to Walk
      blendAnimations(idleAnimation, walkAnimation, 1);

      // After blending to Walk, blend to Jump
      setTimeout(() => {
        blendAnimations(walkAnimation, jumpAnimation, 1);
      }, 3000); // Adjust the timing for walk to jump transition

      // After blending to Jump, blend back to Idle
      setTimeout(() => {
        blendAnimations(jumpAnimation, idleAnimation, 1);
      }, 6000); // Adjust the timing for jump to idle transition
    }
  };

  const renderTestCharacter = () => {

    SceneLoader.LoadAsync(glbTest, undefined, engine).then((loadedScene) => {
      if (loadedScene) {
        setScene(loadedScene);

        // Create a camera
        loadedScene.createDefaultCameraOrLight(true, undefined, true);
        (loadedScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
        // (loadedScene.activeCamera as ArcRotateCamera).radius = 10;
        // (loadedScene.activeCamera as ArcRotateCamera).pinchPrecision = 200;
        setCamera(loadedScene.activeCamera!);

        // Create a hemispheric light
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(0, 1, 0), loadedScene);
        hemiLight.intensity = 0.6;

        // Create a directional light for shadows
        const directionalLight = new DirectionalLight("dirLight", new Vector3(-1, -2, -1), loadedScene);
        directionalLight.position = new Vector3(20, 40, 20);

        // Create a shadow generator
        const shadowGenerator = new ShadowGenerator(1024, directionalLight);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;

        // Primary blud background color
        const primaryBlueColor = new Color4(208 / 255, 236 / 255, 255 / 255, 1.0);
        loadedScene.clearColor = primaryBlueColor;

        // Configure shadows for the character mesh
        loadedScene.meshes.forEach(mesh => {
          mesh.receiveShadows = true;
          shadowGenerator.addShadowCaster(mesh);

          // // Adjust camera to fit the character in view
          // let min = new Vector3(Infinity, Infinity, Infinity);
          // let max = new Vector3(-Infinity, -Infinity, -Infinity);

          // loadedScene.meshes.forEach(mesh => {
          //   if (mesh instanceof Mesh) {
          //     const boundingInfo = mesh.getBoundingInfo();
          //     min = Vector3.Minimize(min, boundingInfo.minimum);
          //     max = Vector3.Maximize(max, boundingInfo.maximum);
          //   }
          // });

          // const center = Vector3.Center(min, max);
          // const radius = Vector3.Distance(min, max) * 1.5;

          // camera.target = center;
          // camera.radius = radius;

        });

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
      // renderHorse();
      // renderHorseExperiments();
      // renderWalkingMan();
      // clyinderTest();
    }
  }, [engine]);

  // const startWalkAnimation = () => {
  //   if (scene) {
  //     const walkAnimation = scene.getAnimationGroupByName("Walk");
  //     if (walkAnimation) {
  //       if (currentAnimation) {
  //         currentAnimation.stop();
  //       }
  //       walkAnimation.play(true);
  //       setCurrentAnimation(walkAnimation);
  //     } else {
  //       console.warn("Animation not found:", walkAnimation);
  //     }
  //   }
  // };

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
      <View style={styles.absoluteView}>
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={() => {
          mode === "Idle" ? startWalkAnimation() : stopWalkAnimation();
        }}>
          <Text>{mode === "Idle" ? "Start" : "Stop"} Walk</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={startWalkAnimation}>
          <Text>Start Walking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={stopWalkAnimation}>
          <Text>Stop Walking</Text>
        </TouchableOpacity> */}
        {/* <TouchableOpacity style={styles.buttonContainer} onPress={doJumpAnimation}>
          <Text>Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={randomizeBGColor}>
          <Text>Random BG Color</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleButtonPress}>
          <Text>Start Animation</Text>
        </TouchableOpacity> */}
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
