import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { QrcodeOutlined } from "@ant-design/icons";
import { Input } from "antd";
import {
  ArrowRight,
  ShieldCheck,
  Settings,
  Zap,
  User,
  Lock,
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
} from "lucide-react";
import backgroundImage from "../assets/Background.png";
import logoImage from "../assets/hawkai_login_logo.svg";

const MODEL_URL = "/auth-background/securitycamera-v1.glb";
const DRACO_PATH = "/draco/";
const DESIGN = {
  width: 714,
  height: 406,
  lens: { x: 150, y: 126 },
};

function AuthCameraBackground() {
  const containerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let disposed = false;
    let frameId = 0;
    let resizeTimer = 0;
    let loaderFallbackTimer = 0;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.01, 50);
    camera.position.set(0, 0, 8);
    camera.lookAt(0, 0, 0);

    const ambient = new THREE.AmbientLight(0x3f6c98, 0.86);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xdbeeff, 2.15);
    keyLight.position.set(3.2, 4.2, 5.2);
    scene.add(keyLight);

    const coolFill = new THREE.DirectionalLight(0x2e6fc8, 0.74);
    coolFill.position.set(-3, 0.5, 2.6);
    scene.add(coolFill);

    const rimLight = new THREE.DirectionalLight(0x84c7ff, 1.05);
    rimLight.position.set(-4.2, 2.2, -3);
    scene.add(rimLight);

    const lensLight = new THREE.PointLight(0x55b7ff, 1.65, 4.6);
    scene.add(lensLight);

    const modelGroup = new THREE.Group();
    const streamGroup = new THREE.Group();
    const dustGroup = new THREE.Group();
    scene.add(streamGroup, dustGroup, modelGroup);

    let modelReady = false;
    let ribbonUniforms = [];
    let streamNodes = [];
    let dustPoints = null;
    let dustVelocities = [];
    const lensTarget = new THREE.Vector3();
    const lensLocal = new THREE.Vector3(0, 0.12, 0.43);

    const viewport = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const visibleHeight = 4;
      const visibleWidth = visibleHeight * (w / h);
      return { w, h, visibleWidth, visibleHeight, aspect: w / h };
    };

    const designToWorld = (px, py) => {
      const vp = viewport();
      return new THREE.Vector3(
        (px / DESIGN.width - 0.5) * vp.visibleWidth,
        (0.5 - py / DESIGN.height) * vp.visibleHeight,
        0,
      );
    };

    const layout = () => {
      const vp = viewport();
      const mobile = vp.w < 768;
      const compactHeight = vp.h < 430 && vp.w > 650;
      return {
        mobile,
        compactHeight,
        lens: mobile ? designToWorld(166, 105) : designToWorld(DESIGN.lens.x, DESIGN.lens.y),
        modelScale: mobile ? 1.18 : compactHeight ? 1.88 : 2.05,
        modelRotation: mobile
          ? new THREE.Euler(-0.1, Math.PI / 2 - 0.04, 0.03)
          : new THREE.Euler(-0.13, Math.PI / 2 - 0.08, 0.035),
        streamCount: mobile ? 22 : 46,
        dustCount: mobile ? 260 : 620,
      };
    };

    const makeGlowTexture = (size, colorStops) => {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      colorStops.forEach((stop) => grad.addColorStop(stop[0], stop[1]));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    };

    const lensGlowTex = makeGlowTexture(256, [
      [0, "rgba(120, 210, 255, 0.95)"],
      [0.18, "rgba(80, 170, 255, 0.56)"],
      [0.58, "rgba(45, 120, 235, 0.15)"],
      [1, "rgba(45, 120, 235, 0)"],
    ]);

    const lensGlowMat = new THREE.SpriteMaterial({
      map: lensGlowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.82,
      depthWrite: false,
    });

    const lensGlowSprite = new THREE.Sprite(lensGlowMat);
    lensGlowSprite.scale.set(0.55, 0.55, 1);
    scene.add(lensGlowSprite);

    const haloMat = new THREE.SpriteMaterial({
      map: lensGlowTex,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.26,
      depthWrite: false,
    });

    const haloSprite = new THREE.Sprite(haloMat);
    haloSprite.scale.set(1.5, 1.5, 1);
    scene.add(haloSprite);

    const ribbonVS = [
      "varying vec2 vUv;",
      "void main() {",
      "  vUv = uv;",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}",
    ].join("\n");

    const ribbonFS = [
      "uniform float time;",
      "uniform float idx;",
      "uniform float opacityMult;",
      "varying vec2 vUv;",
      "void main() {",
      "  float cross = 1.0 - abs(vUv.y * 2.0 - 1.0);",
      "  cross = pow(max(cross, 0.0), 1.45);",
      "  float tail = pow(1.0 - vUv.x, 0.38);",
      "  float pulse = 0.0;",
      "  for (int p = 0; p < 5; p++) {",
      "    float speed = 0.12 + float(p) * 0.018;",
      "    float dotPos = fract(time * speed + idx * 0.071 + float(p) * 0.23);",
      "    float d = abs(vUv.x - dotPos);",
      "    pulse += smoothstep(0.044, 0.0, d) * (1.1 + float(p) * 0.08);",
      "  }",
      "  float originGlow = smoothstep(0.18, 0.0, vUv.x) * 1.15;",
      "  vec3 edgeColor = vec3(0.05, 0.23, 0.50);",
      "  vec3 midColor = vec3(0.22, 0.58, 1.0);",
      "  vec3 coreColor = vec3(0.78, 0.94, 1.0);",
      "  vec3 color = mix(edgeColor, midColor, tail);",
      "  color = mix(color, coreColor, clamp(pulse * 0.46 + originGlow * 0.48, 0.0, 1.0));",
      "  float alpha = (tail * 0.18 + pulse * 0.33 + originGlow * 0.38) * cross * opacityMult;",
      "  gl_FragColor = vec4(color, clamp(alpha, 0.0, 0.95));",
      "}",
    ].join("\n");

    const seeded = (index) => {
      const x = Math.sin(index * 127.1 + 311.7) * 43758.5453;
      return x - Math.floor(x);
    };

    const disposeMaterial = (material, disposeTextures = false) => {
      if (disposeTextures) {
        Object.keys(material).forEach((key) => {
          const value = material[key];
          if (value && typeof value === "object" && value.isTexture) {
            value.dispose();
          }
        });
      }
      material.dispose();
    };

    const disposeGroup = (group, disposeTextures = false) => {
      group.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => disposeMaterial(material, disposeTextures));
          } else {
            disposeMaterial(child.material, disposeTextures);
          }
        }
      });
      group.clear();
    };

    const pinModelToLens = (rotation, scale) => {
      const lensOffset = new THREE.Vector3(
        -lensLocal.x * scale,
        lensLocal.y * scale,
        lensLocal.z * scale,
      ).applyEuler(rotation);
      modelGroup.position.copy(lensTarget).sub(lensOffset);
    };

    const placeModel = () => {
      const config = layout();
      lensTarget.copy(config.lens);
      lensLight.position.copy(lensTarget);
      lensGlowSprite.position.copy(lensTarget);
      haloSprite.position.copy(lensTarget);

      lensGlowSprite.scale.set(config.mobile ? 0.46 : 0.58, config.mobile ? 0.46 : 0.58, 1);
      haloSprite.scale.set(config.mobile ? 1.05 : 1.62, config.mobile ? 1.05 : 1.62, 1);

      modelGroup.rotation.copy(config.modelRotation);
      modelGroup.scale.set(-config.modelScale, config.modelScale, config.modelScale);
      pinModelToLens(config.modelRotation, config.modelScale);
    };

    const rebuildStreams = () => {
      disposeGroup(streamGroup);
      ribbonUniforms = [];
      streamNodes = [];

      const config = layout();
      const vp = viewport();
      const origin = lensTarget.clone();
      const count = config.streamCount;
      const rightEdge = vp.visibleWidth / 2 + 0.52;
      const lowerSpread = config.mobile ? 1.28 : 2.05;
      const upperSpread = config.mobile ? 1.18 : 1.82;

      for (let i = 0; i < count; i += 1) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const centered = t * 2 - 1;
        const sign = centered < 0 ? -1 : 1;
        const fan = sign * Math.pow(Math.abs(centered), 0.82);
        const centerStrength = 1 - Math.abs(centered);
        const wave = (seeded(i) - 0.5) * (config.mobile ? 0.34 : 0.54);
        const lateWave = (seeded(i + 13) - 0.5) * (config.mobile ? 0.44 : 0.76);
        const zDrift = (seeded(i + 21) - 0.5) * 0.42;
        const throatLift = (seeded(i + 5) - 0.5) * 0.08;
        const midCurl = Math.sin((t * 2.8 + seeded(i + 31) * 0.7) * Math.PI) * (0.16 + centerStrength * 0.22);
        const spread = fan < 0 ? fan * lowerSpread : fan * upperSpread;

        const p0 = origin.clone();
        const p1 = origin.clone().add(new THREE.Vector3(0.48, spread * 0.035 + throatLift, zDrift * 0.18));
        const p2 = origin.clone().add(new THREE.Vector3(1.36, spread * 0.3 + wave * 0.4 + midCurl, zDrift * 0.75));
        const p3 = origin.clone().add(new THREE.Vector3(2.72, spread * 0.73 + wave + midCurl * 0.45, zDrift * 1.35));
        const p4 = new THREE.Vector3(rightEdge, origin.y + spread * 1.12 + lateWave, zDrift * 1.9);
        const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3, p4]);
        const radius = (config.mobile ? 0.004 : 0.0048) + centerStrength * (config.mobile ? 0.0038 : 0.0052);
        const tubeGeo = new THREE.TubeGeometry(curve, 136, radius, 6, false);
        const uniforms = {
          time: { value: 0 },
          idx: { value: i },
          opacityMult: { value: 0.42 + centerStrength * 0.68 },
        };

        const tubeMat = new THREE.ShaderMaterial({
          vertexShader: ribbonVS,
          fragmentShader: ribbonFS,
          uniforms,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        });

        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        streamGroup.add(tube);
        ribbonUniforms.push(uniforms);

        if (i % (config.mobile ? 3 : 2) === 0 || centerStrength > 0.82) {
          const nodeCount = centerStrength > 0.72 ? 4 : 2;
          for (let n = 0; n < nodeCount; n += 1) {
            const pointT = Math.min(0.96, 0.26 + seeded(i * 5 + n) * 0.68);
            const point = curve.getPoint(pointT);
            const size = (0.034 + centerStrength * 0.034) * (0.75 + seeded(i + n + 8) * 0.72);
            const mat = new THREE.SpriteMaterial({
              map: lensGlowTex,
              color: 0x8bd4ff,
              transparent: true,
              opacity: 0.26 + centerStrength * 0.4,
              blending: THREE.AdditiveBlending,
              depthWrite: false,
            });
            const node = new THREE.Sprite(mat);
            node.position.copy(point);
            node.scale.set(size, size, 1);
            node.userData = {
              baseOpacity: mat.opacity,
              phase: seeded(i * 17 + n) * Math.PI * 2,
            };
            streamGroup.add(node);
            streamNodes.push(node);
          }
        }
      }
    };

    const rebuildDust = () => {
      disposeGroup(dustGroup);
      const config = layout();
      const vp = viewport();
      const count = config.dustCount;
      const positions = new Float32Array(count * 3);
      dustVelocities = [];

      for (let i = 0; i < count; i += 1) {
        positions[i * 3] = (seeded(i + 400) - 0.5) * (vp.visibleWidth + 2.8);
        positions[i * 3 + 1] = (seeded(i + 700) - 0.5) * (vp.visibleHeight + 2.3);
        positions[i * 3 + 2] = -1.8 + seeded(i + 1000) * 1.8;
        dustVelocities.push(
          new THREE.Vector3(
            (seeded(i + 29) - 0.5) * 0.00055,
            (seeded(i + 31) - 0.5) * 0.00035,
            (seeded(i + 37) - 0.5) * 0.00012,
          ),
        );
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0x3b8bdb,
        size: config.mobile ? 0.017 : 0.021,
        transparent: true,
        opacity: 0.28,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      dustPoints = new THREE.Points(geometry, material);
      dustGroup.add(dustPoints);
    };

    const applySizing = () => {
      const vp = viewport();
      renderer.setSize(vp.w, vp.h);
      camera.left = -vp.visibleWidth / 2;
      camera.right = vp.visibleWidth / 2;
      camera.top = vp.visibleHeight / 2;
      camera.bottom = -vp.visibleHeight / 2;
      camera.updateProjectionMatrix();
      placeModel();
      rebuildStreams();
      rebuildDust();
    };

    const hideLoader = () => {
      if (!disposed) setIsLoaded(true);
    };

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(DRACO_PATH);
    dracoLoader.setDecoderConfig({ type: "wasm" });
    gltfLoader.setDRACOLoader(dracoLoader);

    gltfLoader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) {
          disposeGroup(gltf.scene, true);
          return;
        }

        const loadedModel = gltf.scene;
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;

        loadedModel.position.sub(center);
        loadedModel.scale.setScalar(1 / maxDim);
        loadedModel.traverse((child) => {
          if (!child.isMesh) return;
          child.frustumCulled = false;
          if (child.material) {
            const materials = Array.isArray(child.material) ? child.material : [child.material];
            materials.forEach((mat) => {
              mat.roughness = Math.min(mat.roughness === undefined ? 0.58 : mat.roughness, 0.66);
              mat.metalness = Math.max(mat.metalness === undefined ? 0.34 : mat.metalness, 0.18);
              mat.side = THREE.DoubleSide;
              mat.needsUpdate = true;
            });
          }
        });

        modelGroup.add(loadedModel);
        modelReady = true;
        placeModel();
        hideLoader();
      },
      undefined,
      (error) => {
        console.error("Unable to load security camera model:", error);
        hideLoader();
      },
    );

    let mouseX = 0;
    let mouseY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let currentRotZ = 0;
    const startedAt = performance.now();

    const onMouseMove = (event) => {
      if (window.matchMedia("(max-width: 768px)").matches) return;
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const animate = () => {
      frameId = window.requestAnimationFrame(animate);
      const elapsed = (performance.now() - startedAt) / 1000;
      const config = layout();

      if (modelReady) {
        currentRotY += (mouseX * 0.135 - currentRotY) * 0.055;
        currentRotX += (mouseY * -0.082 - currentRotX) * 0.055;
        currentRotZ += (mouseX * 0.018 + mouseY * 0.01 - currentRotZ) * 0.045;
        modelGroup.rotation.x = config.modelRotation.x + currentRotX;
        modelGroup.rotation.y = config.modelRotation.y + currentRotY;
        modelGroup.rotation.z = config.modelRotation.z + currentRotZ;
        pinModelToLens(modelGroup.rotation, config.modelScale);
      }

      const pulse = 0.72 + Math.sin(elapsed * 1.55) * 0.1;
      lensGlowMat.opacity = pulse;
      haloMat.opacity = 0.24 + Math.sin(elapsed * 0.85 + 0.9) * 0.055;
      lensLight.intensity = 1.45 + Math.sin(elapsed * 1.8) * 0.28;

      for (let i = 0; i < ribbonUniforms.length; i += 1) {
        ribbonUniforms[i].time.value = elapsed;
      }

      for (let i = 0; i < streamNodes.length; i += 1) {
        const node = streamNodes[i];
        node.material.opacity = node.userData.baseOpacity * (0.72 + Math.sin(elapsed * 1.4 + node.userData.phase) * 0.28);
      }

      if (dustPoints) {
        const vp = viewport();
        const pos = dustPoints.geometry.attributes.position.array;
        for (let i = 0; i < dustVelocities.length; i += 1) {
          pos[i * 3] += dustVelocities[i].x;
          pos[i * 3 + 1] += dustVelocities[i].y;
          pos[i * 3 + 2] += dustVelocities[i].z;
          if (pos[i * 3] > vp.visibleWidth / 2 + 1) pos[i * 3] = -vp.visibleWidth / 2 - 1;
          if (pos[i * 3] < -vp.visibleWidth / 2 - 1) pos[i * 3] = vp.visibleWidth / 2 + 1;
          if (pos[i * 3 + 1] > vp.visibleHeight / 2 + 1) pos[i * 3 + 1] = -vp.visibleHeight / 2 - 1;
          if (pos[i * 3 + 1] < -vp.visibleHeight / 2 - 1) pos[i * 3 + 1] = vp.visibleHeight / 2 + 1;
        }
        dustPoints.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applySizing, 120);
    };

    document.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);
    applySizing();
    animate();
    loaderFallbackTimer = window.setTimeout(hideLoader, 3500);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(loaderFallbackTimer);
      document.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      disposeGroup(streamGroup);
      disposeGroup(dustGroup);
      disposeGroup(modelGroup, true);
      lensGlowMat.dispose();
      haloMat.dispose();
      lensGlowTex.dispose();
      dracoLoader.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="auth-camera-bg" aria-hidden="true">
      <div className="auth-camera-canvas" ref={containerRef} />
      <div className="auth-camera-vignette" />
      <div className="auth-camera-scan-lines" />
      <div className="auth-camera-frame" />
      <div className={`auth-camera-loader${isLoaded ? " is-hidden" : ""}`}>
        <div className="auth-camera-loader-ring" />
      </div>
    </div>
  );
}

function ShowcaseStyles() {
  return (
    <style>{`
      @font-face {
        font-family: "SpaceGrotesk";
        src: url("/fonts/SpaceGrotesk-Regular.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: "SpaceGrotesk";
        src: url("/fonts/SpaceGrotesk-SemiBold.ttf") format("truetype");
        font-weight: 600;
        font-style: normal;
      }

      @font-face {
        font-family: "SpaceGrotesk";
        src: url("/fonts/SpaceGrotesk-Bold.ttf") format("truetype");
        font-weight: 700;
        font-style: normal;
      }

      @font-face {
        font-family: "Manrope";
        src: url("/fonts/Manrope-Regular.ttf") format("truetype");
        font-weight: 400;
        font-style: normal;
      }

      @font-face {
        font-family: "Manrope";
        src: url("/fonts/Manrope-Medium.ttf") format("truetype");
        font-weight: 500;
        font-style: normal;
      }

      @font-face {
        font-family: "Manrope";
        src: url("/fonts/Manrope-SemiBold.ttf") format("truetype");
        font-weight: 600;
        font-style: normal;
      }

      @font-face {
        font-family: "Manrope";
        src: url("/fonts/Manrope-Bold.ttf") format("truetype");
        font-weight: 700;
        font-style: normal;
      }

      html, body, #root {
        width: 100%;
        min-height: 100%;
        margin: 0;
      }

      body {
        background: #080d1a;
        overflow-x: hidden;
      }

      .hawkai-login-showcase {
        min-height: 100vh;
      }

      .login-page {
        min-height: 100vh;
        position: relative;
        isolation: isolate;
        overflow: hidden;
        background: url(${backgroundImage}) center/cover no-repeat;
        background-color: #080d1a;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 100px;
      }

      .auth-camera-bg {
        position: fixed;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .auth-camera-canvas {
        position: absolute;
        inset: 0;
        z-index: 0;
      }

      .auth-camera-canvas canvas {
        display: block;
        width: 100% !important;
        height: 100% !important;
      }

      .auth-camera-vignette,
      .auth-camera-frame,
      .auth-camera-scan-lines {
        position: absolute;
        inset: 0;
        pointer-events: none;
      }

      .auth-camera-vignette {
        z-index: 1;
        background:
          radial-gradient(ellipse at 34% 36%, rgba(43, 117, 210, 0.12), transparent 24%),
          radial-gradient(ellipse at 45% 45%, transparent 25%, rgba(2, 5, 12, 0.50) 62%, rgba(1, 3, 8, 0.94) 100%);
      }

      .auth-camera-scan-lines {
        z-index: 2;
        opacity: 0.18;
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.026) 1px, transparent 1px);
        background-size: 54px 54px, 54px 54px;
        mask-image: radial-gradient(ellipse at 60% 42%, #000 0%, transparent 72%);
      }

      .auth-camera-frame {
        z-index: 12;
        inset: 6px;
        border: 1px solid rgba(175, 210, 255, 0.14);
        border-radius: 7px;
        box-shadow:
          inset 0 0 18px rgba(85, 154, 255, 0.08),
          0 0 0 1px rgba(0, 0, 0, 0.35);
      }

      .auth-camera-loader {
        position: absolute;
        inset: 0;
        z-index: 100;
        background: #050a14;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.7s ease;
      }

      .auth-camera-loader.is-hidden {
        opacity: 0;
      }

      .auth-camera-loader-ring {
        width: 38px;
        height: 38px;
        border: 2px solid rgba(74, 158, 255, 0.15);
        border-top-color: rgba(74, 158, 255, 0.72);
        border-radius: 50%;
        animation: auth-camera-spin 0.9s linear infinite;
      }

      @keyframes auth-camera-spin {
        to { transform: rotate(360deg); }
      }

      .login-container {
        position: relative;
        z-index: 5;
        width: 100%;
        max-width: 1280px;
        display: flex;
        gap: 60px;
        padding: 40px 60px;
        align-items: center;
        justify-content: space-between;
      }

      .login-left {
        flex: 1;
        max-width: 580px;
        align-self: flex-start;
        padding-top: 0px;
        margin-top: -60px;
        margin-left: -50px;
      }

      .left-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 20px;
      }

      .left-logo-img {
        height: 28px;
      }

      .live-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(34, 197, 94, 0.12);
        border: 1px solid rgba(34, 197, 94, 0.35);
        border-radius: 999px;
        padding: 5px 14px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.8px;
        color: #4ade80;
        font-family: "Manrope", sans-serif;
        margin-bottom: 28px;
      }

      .live-dot {
        width: 7px;
        height: 7px;
        background: #4ade80;
        border-radius: 50%;
        box-shadow: 0 0 6px #4ade80;
        animation: pulse-dot 1.8s ease-in-out infinite;
      }

      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(0.8); }
      }

      .camera-spacer {
        height: 240px;
      }

      @media (max-height: 780px) {
        .camera-spacer { height: 150px; }
      }

      @media (max-height: 680px) {
        .camera-spacer { height: 120px; }
      }

      @media (max-width: 960px) {
        .camera-spacer { height: 140px; }
      }

      @media (max-width: 480px) {
        .camera-spacer { height: 100px; }
      }

      .login-subtitle {
        font-size: 13px;
        font-weight: 800;
        color: #8b5cf6;
        letter-spacing: 2px;
        font-family: "SpaceGrotesk", sans-serif;
        margin-bottom: 8px;
        text-transform: uppercase;
      }

      .login-title {
        font-size: 52px;
        font-weight: 800;
        line-height: 1.15;
        color: #fff;
        font-family: "SpaceGrotesk", sans-serif;
        margin: 0 0 16px 0;
      }

      .login-title-blue {
        background: linear-gradient(90deg, #4f73ff, #aa66ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .login-desc {
        color: rgba(180, 200, 240, 0.7);
        font-size: 15px;
        line-height: 1.7;
        font-family: "Manrope", sans-serif;
        margin: 0 0 36px 0;
      }

      .stats {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
      }

      .auth-stat-card {
        display: flex;
        align-items: center;
        gap: 12px;
        background: rgba(10, 20, 42, 0.65) !important;
        border: 1px solid rgba(59, 130, 246, 0.25) !important;
        border-radius: 14px !important;
        padding: 14px 18px !important;
        flex: 1;
        min-width: 110px;
        transition: border-color 0.25s, box-shadow 0.25s;
      }

      .auth-stat-card:hover {
        border-color: rgba(59, 130, 246, 0.5) !important;
        box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1) !important;
      }

      .auth-stat-card h3 {
        font-size: 20px;
        font-weight: 700;
        color: #fff !important;
        font-family: "SpaceGrotesk", sans-serif;
        margin: 0;
        line-height: 1;
      }

      .auth-stat-card p {
        font-size: 11px;
        color: rgba(160, 185, 230, 0.7) !important;
        font-family: "Manrope", sans-serif;
        margin: 3px 0 0 0;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }

      .auth-stat-icon {
        width: 38px;
        height: 38px;
        border-radius: 50% !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.2);
      }

      .auth-stat-icon--shield {
        background: rgba(59, 130, 246, 0.15) !important;
        color: #60a5fa !important;
        border: 1px solid rgba(59, 130, 246, 0.35) !important;
      }

      .auth-stat-icon--settings {
        background: rgba(139, 92, 246, 0.15) !important;
        color: #a78bfa !important;
        border: 1px solid rgba(139, 92, 246, 0.35) !important;
      }

      .auth-stat-icon--zap {
        background: rgba(34, 197, 94, 0.15) !important;
        color: #4ade80 !important;
        border: 1px solid rgba(34, 197, 94, 0.35) !important;
      }

      .login-right {
        width: 100%;
        max-width: 460px;
        flex-shrink: 0;
      }

      .login-card {
        background: rgba(8, 14, 30, 0.88);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        padding: 48px 48px;
        border-radius: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06);
        min-height: 620px;
        display: flex;
        flex-direction: column;
      }

      .card-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        margin-bottom: 20px;
      }

      .card-logo-img {
        height: 26px;
      }

      .card-heading {
        text-align: center;
        margin-bottom: 28px;
      }

      .card-heading h2 {
        font-size: 24px;
        font-weight: 700;
        color: #fff;
        font-family: "SpaceGrotesk", sans-serif;
        margin: 0 0 6px 0;
      }

      .card-heading p {
        font-size: 13px;
        color: rgba(160, 185, 230, 0.65);
        font-family: "Manrope", sans-serif;
        margin: 0;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin: 0;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .login-card .ant-input,
      .login-card .ant-input-affix-wrapper {
        background: rgba(255, 255, 255, 0.06) !important;
        border: 1px solid rgba(255, 255, 255, 0.14) !important;
        border-radius: 10px !important;
        color: #fff !important;
        font-family: "Manrope", sans-serif !important;
        font-size: 14px !important;
        height: 46px !important;
        transition: border-color 0.25s, box-shadow 0.25s;
      }

      .login-card .ant-input-affix-wrapper .ant-input {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        color: #fff !important;
        height: auto !important;
      }

      .login-card .ant-input:focus,
      .login-card .ant-input-affix-wrapper:focus-within {
        border-color: rgba(59, 130, 246, 0.6) !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12) !important;
      }

      .login-card .ant-input::placeholder,
      .login-card .ant-input-affix-wrapper input::placeholder {
        color: rgba(160, 180, 220, 0.4) !important;
      }

      .login-card .ant-input-prefix {
        margin-right: 8px !important;
      }

      .login-card .ant-input-password-icon,
      .login-card .ant-input-suffix svg {
        color: rgba(160, 185, 230, 0.5) !important;
      }

      .forgot-row {
        display: flex;
        justify-content: flex-end;
        margin-top: -4px;
      }

      .forget-text {
        background: none;
        border: none;
        color: #60a5fa;
        cursor: pointer;
        padding: 0;
        font-family: "Manrope", sans-serif;
        font-weight: 600;
        font-size: 13px;
        transition: color 0.2s;
      }

      .forget-text:hover {
        color: #93c5fd;
      }

      .login-button {
        width: 100%;
        margin-top: 4px;
        padding: 13px;
        border-radius: 12px;
        border: none;
        background: linear-gradient(90deg, #2563eb, #7c3aed);
        color: #fff;
        font-weight: 700;
        font-family: "Manrope", sans-serif;
        font-size: 15px;
        letter-spacing: 0.3px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: opacity 0.2s, transform 0.15s;
      }

      .login-button::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg, transparent 30%, rgba(255, 255, 255, 0.15) 50%, transparent 70%);
        transform: translateX(-100%);
        transition: transform 0.55s ease;
      }

      .login-button:hover::after { transform: translateX(100%); }
      .login-button:hover { opacity: 0.92; transform: translateY(-1px); }

      .divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 20px 0 16px;
      }

      .divider-line {
        flex: 1;
        height: 1px;
        background: rgba(255, 255, 255, 0.1);
      }

      .divider span {
        font-size: 11px;
        color: rgba(160, 185, 230, 0.45);
        font-family: "Manrope", sans-serif;
        letter-spacing: 0.6px;
        white-space: nowrap;
      }

      .qr-button {
        width: 100%;
        border-radius: 12px;
        padding: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(255, 255, 255, 0.05);
        color: rgba(200, 215, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-family: "Manrope", sans-serif;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition: background 0.25s, border-color 0.25s;
      }

      .qr-button:hover {
        background: rgba(99, 130, 255, 0.12);
        border-color: rgba(154, 165, 255, 0.4);
      }

      .security-note {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: auto;
        padding-top: 24px;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        color: rgba(160, 185, 230, 0.7);
      }

      .security-note svg {
        color: #4ade80;
        flex-shrink: 0;
      }

      .security-note-content strong {
        display: block;
        font-size: 13px;
        font-family: "SpaceGrotesk", sans-serif;
        color: #fff;
        margin-bottom: 2px;
      }

      .security-note-content p {
        margin: 0;
        font-size: 11px;
        font-family: "Manrope", sans-serif;
      }

      .bottom-feature-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 20px 60px;
        background: rgba(5, 10, 20, 0.5);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        z-index: 10;
      }

      .feature-item {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .feature-icon {
        color: #8b5cf6;
      }

      .feature-text {
        display: flex;
        flex-direction: column;
      }

      .feature-text strong {
        font-size: 14px;
        color: #fff;
        font-family: "SpaceGrotesk", sans-serif;
      }

      .feature-text span {
        font-size: 12px;
        color: rgba(160, 185, 230, 0.7);
        font-family: "Manrope", sans-serif;
      }

      .error-text {
        font-size: 12px;
        color: #f87171;
        font-family: "Manrope", sans-serif;
        margin: 2px 0 0;
      }

      .password-rule {
        font-size: 12px;
        color: #4ade80;
        font-family: "Manrope", sans-serif;
        margin: 4px 0 0;
        line-height: 1.5;
      }

      @media (max-width: 960px) {
        .login-container {
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 40px;
          padding: 60px 24px;
        }

        .login-left {
          max-width: 100%;
          align-self: center;
          padding-top: 0;
          margin-left: 0;
          margin-top: 0;
        }

        .left-logo,
        .live-badge,
        .stats {
          justify-content: center;
        }

        .forgot-row {
          justify-content: center;
        }

        .login-right {
          max-width: 100%;
          width: 100%;
        }
      }

      @media (max-width: 480px) {
        .login-title { font-size: 34px; }
        .login-desc { font-size: 14px; }
        .stats { flex-direction: column; gap: 10px; }
        .auth-stat-card { justify-content: center; }
        .login-card { padding: 28px 22px; }
      }
    `}</style>
  );
}

export default function HawkaiLoginShowcase() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [touched] = useState({ username: false, password: false });
  const [isLoading] = useState(false);
  const [isForgotPassword] = useState(true);

  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{15,}$/;

  const validate = () => ({
    username: !form.username,
    passwordRequired: !form.password,
    passwordPattern: form.password && !passwordPattern.test(form.password),
  });

  const errors = validate();
  const passwordHasValidationError =
    touched.password && (errors.passwordRequired || errors.passwordPattern);
  const shouldShowRbiPolicyMessage = touched.password && errors.passwordPattern;
  const showErrorMessageForPassword = "Password must meet required complexity";

  const onLogin = async (e) => {
    e.preventDefault();
  };

  const resetPassword = () => {};
  const openQRDialog = () => {};

  return (
    <div className="hawkai-login-showcase">
      <ShowcaseStyles />

      <div className="login-page">
        <AuthCameraBackground />

        <div className="login-container">
          <section className="login-left">
            <div className="left-logo">
              <img src={logoImage} alt="HAWKAI" className="left-logo-img" />
            </div>

            <div className="live-badge">
              <span className="live-dot" />
              LIVE ON 50,000+ SITES
            </div>

            <div className="camera-spacer" />

            <div className="login-subtitle">AI-POWERED</div>
            <h1 className="login-title">
              Security<br />
              <span className="login-title-blue">Intelligence</span>
            </h1>

            <p className="login-desc">
              Real-time surveillance optimization powered by<br />
              deep learning and predictive analytics.
            </p>

            <div className="stats">
              <div className="auth-stat-card">
                <div className="auth-stat-icon auth-stat-icon--shield">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3>50,000+</h3>
                  <p>Active Sites</p>
                </div>
              </div>
              <div className="auth-stat-card">
                <div className="auth-stat-icon auth-stat-icon--settings">
                  <Settings size={20} />
                </div>
                <div>
                  <h3>40+</h3>
                  <p>AI Models</p>
                </div>
              </div>
              <div className="auth-stat-card">
                <div className="auth-stat-icon auth-stat-icon--zap">
                  <Zap size={20} />
                </div>
                <div>
                  <h3>25%</h3>
                  <p>Energy Saved</p>
                </div>
              </div>
            </div>
          </section>

          <section className="login-right">
            <div className="login-card">
              <div className="card-logo">
                <img src={logoImage} alt="HAWKAI Logo" className="card-logo-img" />
              </div>

              <div className="card-heading">
                <h2>Welcome Back</h2>
                <p>Sign in to continue to HAWKAI</p>
              </div>

              <form onSubmit={onLogin} className="login-form">
                <div className="form-group">
                  <Input
                    size="large"
                    prefix={<User size={15} style={{ color: "rgba(160,180,220,0.6)" }} />}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    placeholder="Username"
                  />
                  {touched.username && errors.username && (
                    <p className="error-text">Username is required</p>
                  )}
                </div>

                <div className="form-group">
                  <Input.Password
                    size="large"
                    prefix={<Lock size={15} style={{ color: "rgba(160,180,220,0.6)" }} />}
                    onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder="Password"
                  />
                  <div>
                    {passwordHasValidationError && errors.passwordRequired && (
                      <p className="error-text">Password is required</p>
                    )}
                    {passwordHasValidationError && errors.passwordPattern && (
                      <p className="error-text">{showErrorMessageForPassword}</p>
                    )}
                    {shouldShowRbiPolicyMessage && (
                      <p className="password-rule">
                        Password must contain at least 15 characters, one UPPERCASE
                        letter, one lowercase letter, one Number, and one Special character.
                      </p>
                    )}
                  </div>
                </div>

                {isForgotPassword && (
                  <div className="forgot-row">
                    <button type="button" onClick={resetPassword} className="forget-text">
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button type="submit" className="login-button" disabled={isLoading}>
                  {!isLoading ? "Login" : "Signing in..."}
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              <div className="divider">
                <div className="divider-line" />
                <span>OR CONTINUE WITH</span>
                <div className="divider-line" />
              </div>

              <button type="button" className="qr-button" onClick={openQRDialog}>
                Log In with QR
                <QrcodeOutlined />
              </button>

              <div className="security-note">
                <ShieldCheck size={20} />
                <div className="security-note-content">
                  <strong>Enterprise Grade Security</strong>
                  <p>Your data is protected with end-to-end encryption</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bottom-feature-bar">
          <div className="feature-item">
            <Activity size={24} className="feature-icon" />
            <div className="feature-text">
              <strong>Real-time Monitoring</strong>
              <span>24/7 intelligent surveillance</span>
            </div>
          </div>
          <div className="feature-item">
            <AlertTriangle size={24} className="feature-icon" />
            <div className="feature-text">
              <strong>Threat Detection</strong>
              <span>AI-driven anomaly detection</span>
            </div>
          </div>
          <div className="feature-item">
            <BarChart3 size={24} className="feature-icon" />
            <div className="feature-text">
              <strong>Predictive Analytics</strong>
              <span>Prevent incidents before they happen</span>
            </div>
          </div>
          <div className="feature-item">
            <Bell size={24} className="feature-icon" />
            <div className="feature-text">
              <strong>Automated Alerts</strong>
              <span>Instant notifications &amp; escalations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
