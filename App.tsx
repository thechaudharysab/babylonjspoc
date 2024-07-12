import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useEngine, EngineView } from '@babylonjs/react-native';
import {
  ArcRotateCamera,
  Camera,
  Scene,
  SceneLoader,
  Color4,
  AnimationGroup,
  Nullable,
  HemisphericLight,
  Vector3,
  AbstractMesh,
} from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

function App(): React.JSX.Element {
  const basicGLTFURL =
    'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Client.gltf';
  const horseGLTFURL =
    'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/Horse.gltf';
  const simsCharacterGLTF =
    'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/ibjects_test.gltf';

  const walkingManGLTFURL =
    'https://raw.githubusercontent.com/thechaudharysab/babylonjspoc/main/src/assets/walking_man/animated_man.gltf';

  const engine = useEngine();
  const [scene, setScene] = useState<Scene>();
  const [camera, setCamera] = useState<Camera>();
  const [currentAnimation, setCurrentAnimation] =
    useState<Nullable<AnimationGroup>>(null);

  useEffect(() => {
    if (engine) {
      // Uncomment to see the basic example model
      // renderbasicGLTF();

      // Uncomment to see the horse example model. For animation uncomment {renderHorseUI()} in main return
      // renderHorseGLTF();

      // Uncomment to see the sims example model. For animation uncomment {renderSimsUI()} in main return
      // renderSimsGLTF();

      // Comment this to hide the walking man animation
      renderWalkingMan();
    }
  }, [engine]);

  // Basic example

  const renderbasicGLTF = () => {
    SceneLoader.LoadAsync(basicGLTFURL, undefined, engine)
      .then(loadedScene => {
        if (loadedScene) {
          setScene(loadedScene);

          // Light
          const light = new HemisphericLight(
            'light',
            new Vector3(0, 1, 0),
            loadedScene,
          );
          light.intensity = 0.7;

          // logMeshesAndAnimationNames(loadedScene.meshes, loadedScene.animationGroups);

          // Camera
          const camera = new ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 2,
            -6,
            new Vector3(0, 2, 0),
            loadedScene,
            true,
          );
          camera.attachControl(true);

          setCamera(camera);

          setLoading(false);
        } else {
          console.error('Error loading loadedScene.');
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error loading scene: ', error);
        setLoading(false);
      });
  };

  // Horse example
  const renderHorseGLTF = () => {
    SceneLoader.LoadAsync(horseGLTFURL, undefined, engine)
      .then((loadedScene: Scene) => {
        if (loadedScene) {
          setScene(loadedScene);

          // logMeshesAndAnimationNames(loadedScene.meshes, loadedScene.animationGroups);

          // 1.1 Camera & Light
          loadedScene.createDefaultCameraOrLight(true, undefined, true);
          (loadedScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
          setCamera(loadedScene.activeCamera!);

          // 1.2 Getting an animation and starting it
          const idleAnim = loadedScene.getAnimationGroupByName('Idle');

          if (idleAnim) {
            idleAnim.start(true, 1.0);
          }
        } else {
          console.error('Error loading loadScene.');
        }
      })
      .catch(error => {
        console.error('Error loading scene: ', error);
      });
  };

  const renderHorseUI = () => {
    return (
      <View style={styles.absoluteView}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={startWalkAnimation}>
          <Text>Start Walking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={stopWalkAnimation}>
          <Text>Stop Walking</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={doJumpAnimation}>
          <Text>Jump</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={randomizeBGColor}>
          <Text>Random BG Color</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const startWalkAnimation = () => {
    if (scene) {
      const walkAnimation = scene.getAnimationGroupByName('Walk');
      if (walkAnimation) {
        if (currentAnimation) {
          currentAnimation.stop();
        }
        walkAnimation.play(true);
        setCurrentAnimation(walkAnimation);
      } else {
        console.warn('Animation not found:', walkAnimation);
      }
    }
  };

  const stopWalkAnimation = () => {
    if (scene) {
      const idleAnimation = scene.getAnimationGroupByName('Idle');
      if (idleAnimation) {
        if (currentAnimation) {
          currentAnimation.stop();
        }
        idleAnimation.play(true);
        setCurrentAnimation(idleAnimation);
      } else {
        console.warn('Animation not found:', idleAnimation);
      }
    }
  };

  const doJumpAnimation = () => {
    if (scene) {
      var jumpAnimation = scene.getAnimationGroupByName('Jump_toIdle');
      if (jumpAnimation) {
        jumpAnimation.play();
      } else {
        console.warn('Animation not found:', jumpAnimation);
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

  // Sims Example

  const renderSimsGLTF = () => {
    SceneLoader.LoadAsync(simsCharacterGLTF, undefined, engine)
      .then(loadedScene => {
        if (loadedScene) {
          setScene(loadedScene);

          // logMeshesAndAnimationNames(loadedScene.meshes, loadedScene.animationGroups);

          // Camera & Light
          loadedScene.createDefaultCameraOrLight(true, undefined, true);
          (loadedScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
          setCamera(loadedScene.activeCamera!);

          // Scene Bg Color
          const lightBlueColor = new Color4(
            208 / 255,
            236 / 255,
            255 / 255,
            1.0,
          );
          loadedScene.clearColor = lightBlueColor;

          loadedScene.meshes.forEach(mesh => {
            if (mesh.name === 'Shirt1' || mesh.name === 'Hair2') {
              mesh.isVisible = false; // Hide this mesh
            }
          });
        } else {
          console.error('Error loading loadedScene.');
        }
      })
      .catch(error => {
        console.error('Error loading scene: ', error);
      });
  };

  const onAvatarEditOptionSelect = (
    hair1: boolean,
    hair2: boolean,
    shirt1: boolean,
    shirt2: boolean,
  ) => {
    if (scene) {
      scene.meshes.forEach(mesh => {
        if (mesh.name === 'Shirt1') {
          mesh.isVisible = shirt1;
        } else if (mesh.name === 'Shirt2') {
          mesh.isVisible = shirt2;
        } else if (mesh.name === 'Hair1') {
          mesh.isVisible = hair1;
        } else if (mesh.name === 'Hair2') {
          mesh.isVisible = hair2;
        }
      });
    }
  };

  const renderSimsUI = () => {
    if (scene) {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            backgroundColor: 'white',
            padding: 20,
          }}>
          <Text style={{ fontWeight: 'bold' }}>Select Hair</Text>
          <TouchableOpacity
            onPress={() =>
              onAvatarEditOptionSelect(
                true,
                false,
                scene.getMeshByName('Shirt1')?.isVisible as boolean,
                scene.getMeshByName('Shirt2')?.isVisible as boolean,
              )
            }
            style={{ marginVertical: 4 }}>
            <Text>Hair 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              onAvatarEditOptionSelect(
                false,
                true,
                scene.getMeshByName('Shirt1')?.isVisible as boolean,
                scene.getMeshByName('Shirt2')?.isVisible as boolean,
              )
            }
            style={{ marginVertical: 4 }}>
            <Text>Hair 2</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              onAvatarEditOptionSelect(
                false,
                false,
                scene.getMeshByName('Shirt1')?.isVisible as boolean,
                scene.getMeshByName('Shirt2')?.isVisible as boolean,
              )
            }
            style={{ marginVertical: 4 }}>
            <Text>No Hair</Text>
          </TouchableOpacity>
          <Text style={{ fontWeight: 'bold' }}>Select Shirt</Text>
          <TouchableOpacity
            onPress={() =>
              onAvatarEditOptionSelect(
                scene.getMeshByName('Hair1')?.isVisible as boolean,
                scene.getMeshByName('Hair2')?.isVisible as boolean,
                true,
                false,
              )
            }
            style={{ marginVertical: 4 }}>
            <Text>Shirt 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              onAvatarEditOptionSelect(
                scene.getMeshByName('Hair1')?.isVisible as boolean,
                scene.getMeshByName('Hair2')?.isVisible as boolean,
                false,
                true,
              )
            }
            style={{ marginVertical: 4 }}>
            <Text>Shirt 2</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  // Extras
  const renderWalkingMan = () => {
    SceneLoader.LoadAsync(walkingManGLTFURL, undefined, engine)
      .then(loadedScene => {
        if (loadedScene) {
          setScene(loadedScene);

          // Create a camera
          loadedScene.createDefaultCameraOrLight(true, undefined, true);
          (loadedScene.activeCamera as ArcRotateCamera).alpha += Math.PI;
          setCamera(loadedScene.activeCamera!);

          // Light blue background color
          const lighBlueColor = new Color4(
            208 / 255,
            236 / 255,
            255 / 255,
            1.0,
          );
          loadedScene.clearColor = lighBlueColor;
        } else {
          console.error('Error loading loadedScene.');
        }
      })
      .catch(error => {
        console.error('Error loading scene: ', error);
      });
  };

  // Utility functions
  const logMeshesAndAnimationNames = (
    meshes: AbstractMesh[],
    animationGroups: AnimationGroup[],
  ) => {
    console.log('-------------------MESHES--------------------');
    meshes.forEach(mesh => {
      console.log(mesh.name);
    });

    console.log('---------------ANIMATIONS--------------------');
    animationGroups.forEach(animationGroup => {
      console.log(animationGroup.name);
    });
  };

  return (
    <View style={styles.container}>
      <EngineView camera={camera} displayFrameRate={false} />
      {/* {renderHorseUI()} */}
      {/* {renderSimsUI()} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  absoluteView: {
    position: 'absolute',
    bottom: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonContainer: {
    backgroundColor: '#61dafb',
    borderWidth: 1,
    padding: 4,
  },
});

export default App;
