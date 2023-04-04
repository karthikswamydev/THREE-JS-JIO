import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap"
// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// CAMERA
const cameraSettings = { fov: 45, near: 0.1, far: 500 };
const cameraPos = new THREE.Vector3(0, 50, 16);
const primaryCamera = new THREE.PerspectiveCamera(
  cameraSettings.fov,
  window.innerWidth / window.innerHeight,
  cameraSettings.near,
  cameraSettings.far
);
primaryCamera.position.x = cameraPos.x;
primaryCamera.position.y = cameraPos.y;
primaryCamera.position.z = cameraPos.z;
primaryCamera.lookAt(0, 10, -16.6);


// ORBIT CAMERA CONTROLS
const orbitControls = new OrbitControls(primaryCamera, renderer.domElement);
// orbitControls.mouseButtons = {
//   MIDDLE: THREE.MOUSE.ROTATE,
//   RIGHT: THREE.MOUSE.PAN,
// };
orbitControls.enableDamping = true;
orbitControls.enablePan = true;
orbitControls.enableZoom = true;
orbitControls.enableRotate = true;
orbitControls.minDistance = 5;
orbitControls.maxDistance = 60;
orbitControls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent camera below ground
orbitControls.minPolarAngle = Math.PI / 4; // prevent top down view
orbitControls.update();

// RENDER TARGET SECTION
const targetPlaneSize = { width: 8.5, height: 4.56 };
const targetPlanePosition = { x: -5, y: targetPlaneSize.height / 2, z: 5 };
const renderTargetWidth = targetPlaneSize.width * 512;
const renderTargetHeight = targetPlaneSize.height * 512;
const renderTarget = new THREE.WebGLRenderTarget(
  renderTargetWidth,
  renderTargetHeight
);

// SECONDARY CAMERA
const secondaryAspect = renderTargetWidth / renderTargetHeight;
const secondaryCamera = new THREE.PerspectiveCamera(
  cameraSettings.fov,
  secondaryAspect,
  cameraSettings.near,
  cameraSettings.far
);
secondaryCamera.position.x = targetPlanePosition.x;
secondaryCamera.position.y = targetPlanePosition.y + 4;
secondaryCamera.position.z = targetPlanePosition.z;
secondaryCamera.lookAt(new THREE.Vector3(10, 5, -10));

// // SECONDARY SCENE
// const secondaryScene = new THREE.Scene();
// secondaryScene.background = new THREE.Color(0xcccccc);
const secondaryDirectionalLight = new THREE.DirectionalLight(0xffffff, 1);
// {
//   secondaryDirectionalLight.position.set(-10, 10, 10);
//   secondaryDirectionalLight.castShadow = true;
//   secondaryDirectionalLight.shadow.mapSize.width = 4096;
//   secondaryDirectionalLight.shadow.mapSize.height = 4096;
//   const d = 35;
//   secondaryDirectionalLight.shadow.camera.left = -d;
//   secondaryDirectionalLight.shadow.camera.right = d;
//   secondaryDirectionalLight.shadow.camera.top = d;
//   secondaryDirectionalLight.shadow.camera.bottom = -d;
//   secondaryScene.add(secondaryDirectionalLight);

//   new GLTFLoader().load("/glb/dark-ground.glb", function (gltf: GLTF) {
//     gltf.scene.traverse(function (object: THREE.Object3D) {
//       object.receiveShadow = true;
//     });
//     secondaryScene.add(gltf.scene);
//   });
//   new GLTFLoader().load("/glb/dark-objects.glb", function (gltf: GLTF) {
//     gltf.scene.traverse(function (object: THREE.Object3D) {
//       object.castShadow = true;
//     });
//     secondaryScene.add(gltf.scene);
//   });
// }

// Scene
const secondaryScene = new THREE.Scene();
secondaryScene.background = new THREE.Color(0xffffff);

const secOrbitControls = new OrbitControls(
  secondaryCamera,
  renderer.domElement
);
secOrbitControls.enableDamping = true;
/**
 * Object
 */
const geometry = new THREE.BufferGeometry();
const count = 50;
const positionsArray = new Float32Array(count * 3 * 3);
for (let i = 0; i < count * 3 * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 4;
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);

const secondaryMaterial = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});

const secondaryMesh = new THREE.Mesh(geometry, secondaryMaterial);

secondaryScene.add(secondaryMesh);
// REGULAR SCENE
const primaryScene = new THREE.Scene();
primaryScene.background = new THREE.Color(0xa8def0);
{
  const color = 0xffffff;
  const intensity = 1;
  const direcitonalLight = new THREE.DirectionalLight(color, intensity);
  direcitonalLight.position.set(3, 10, -4);
  direcitonalLight.castShadow = true;
  direcitonalLight.shadow.mapSize.width = 4096;
  direcitonalLight.shadow.mapSize.height = 4096;
  const d = 35;
  direcitonalLight.shadow.camera.left = -d;
  direcitonalLight.shadow.camera.right = d;
  direcitonalLight.shadow.camera.top = d;
  direcitonalLight.shadow.camera.bottom = -d;
  primaryScene.add(direcitonalLight);

  const ambientLight = new THREE.AmbientLight(color, 1);
  primaryScene.add(ambientLight);

  new GLTFLoader().load("/glb/booth.glb", function (gltf: GLTF) {
    gltf.scene.traverse(function (object: THREE.Object3D) {
      object.receiveShadow = true;
    });
    gltf.scene.position.z = 15
    gltf.scene.position.y = -5
    primaryScene.add(gltf.scene);
    
  });
  //   new GLTFLoader().load("/glb/forest-trees.glb", function (gltf: GLTF) {
  //     gltf.scene.traverse(function (object: THREE.Object3D) {
  //       object.castShadow = true;
  //     });
  //     primaryScene.add(gltf.scene);
  //   });
  //   new GLTFLoader().load(
  //     "/glb/arcade.gltf",
  //     function (gltf: GLTF) {
  //       gltf.scene.traverse(function (object: THREE.Object3D) {
  //         object.castShadow = true;
  //       });
  //       gltf.scene.position.y = 5;
  //       primaryScene.add(gltf.scene);
  //     },
  //     function (xhr) {
  //       console.log(xhr, "errerr");
  //     },
  //     function (err) {
  //       console.log(err, "errerr");
  //     }
  //   );
}

const material = new THREE.MeshPhongMaterial({
  map: renderTarget.texture,
});

const targetPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(targetPlaneSize.width, targetPlaneSize.height, 32),
  
  // new THREE.PlaneGeometry(5,5),
  material
);
targetPlane.name = "secondary";
targetPlane.rotation.y = -Math.PI / 4;

targetPlane.position.y =-0.2;
targetPlane.position.x = 0;
targetPlane.position.z = -1.5;
targetPlane.rotation.y = 0;

targetPlane.castShadow = true;
primaryScene.add(targetPlane);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};


// RESIZE HANDLER
function onWindowResize() {
  primaryCamera.aspect = window.innerWidth / window.innerHeight;
  primaryCamera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  secondaryCamera.aspect = sizes.width / sizes.height;
  secondaryCamera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener("resize", onWindowResize);

renderer.domElement.addEventListener("mousedown", onMouseClick);

function onMouseClick(event) {
  
  // calculate mouse position in normalized device coordinates
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // create a raycaster from the camera through the mouse position
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, primaryCamera);

  // get intersecting objects
  const intersects = raycaster.intersectObjects(primaryScene.children, true);

  // do something with the intersected objects
  if (intersects.length > 0) {
    // console.log("Intersected:", intersects[0].object);
    if (intersects[0].object?.name === "secondary") {
      orbitControls.enabled = false;
      secOrbitControls.enabled = true;
      gsap.to(primaryCamera.position,{
        z:0.5,
        y:-9.9,
        // x:0,
        duration:1,
        // onUpdate: function(){
        //   primaryCamera.lookAt(201,4,2)
        // }
      })

      // gsap.to()
      orbitControls.enabled = false;
      secOrbitControls.enabled = true ;
      console.log(primaryCamera.position.x,primaryCamera.position.y,primaryCamera.position.z)
      
    } else {
      // orbitControls.enabled = true;
      // secOrbitControls.enabled = false;
    }
  }
}
console.log(primaryCamera.position)
// const axesHelper = new THREE.AxesHelper(6);
// primaryScene.add(axesHelper);


function gameLoop() {
  const time = new Date().getTime();
  secondaryDirectionalLight.position.x = Math.cos(time * 0.002) * 10;
  secondaryDirectionalLight.position.z = Math.sin(time * 0.002) * 10;
  // draw render target scene to render target
  //   secondaryCamera.rotation.x = primaryCamera.rotation.x;
  //   secondaryCamera.rotation.y = primaryCamera.rotation.y;
  //   secondaryCamera.rotation.z = primaryCamera.rotation.z;
  renderer.setRenderTarget(renderTarget);
  renderer.render(secondaryScene, secondaryCamera);
  renderer.setRenderTarget(null);

  orbitControls.update();
  secOrbitControls.update();

  // render the scene to the canvas
  renderer.render(primaryScene, primaryCamera);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);