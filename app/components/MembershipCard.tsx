"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Props = {
    /** Member's display name, printed large on the card. */
    name: string;
    /** Year the membership started, e.g. "2025". */
    since?: string;
    /** Small org/label at the top-left. */
    label?: string;
};

// Physical-ish card aspect (ISO 7810 ID-1 is ~1.586). We draw the face onto a
// 2D canvas at high resolution, wrap it as a texture on a plane, and tilt the
// plane toward the cursor with a light + environment reflection so the brushed
// metal catches the light as it moves — echoing the Dia Pro reference card.
const CARD_ASPECT = 1.586;
const TEX_W = 1400;
const TEX_H = Math.round(TEX_W / CARD_ASPECT);
// World-space card dimensions (height = 1) and physical depth.
const CARD_H = 1;
const CARD_W = CARD_ASPECT;
const CARD_R = 0.05; // matches the printed face's corner radius (h * 0.05)
const CARD_DEPTH = 0.026;

const HOLO_VERTEX_SHADER = `
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HOLO_FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;

uniform vec2 uTilt;
uniform float uTime;
uniform float uSuppressSignatureStrip;

float roundedCardAlpha(vec2 uv) {
    vec2 size = vec2(${CARD_ASPECT.toFixed(3)}, 1.0);
    vec2 p = (uv - 0.5) * size;
    vec2 halfSize = size * 0.5;
    float radius = ${CARD_R.toFixed(3)};
    vec2 q = abs(p) - (halfSize - vec2(radius));
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    return 1.0 - smoothstep(-0.006, 0.006, d);
}

vec3 spectral(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (vec3(0.0, 0.33, 0.67) + t));
}

float rectMask(vec2 uv, vec2 minUv, vec2 maxUv) {
    vec2 feather = vec2(0.006, 0.01);
    vec2 inMin = smoothstep(minUv, minUv + feather, uv);
    vec2 inMax = 1.0 - smoothstep(maxUv - feather, maxUv, uv);
    return inMin.x * inMin.y * inMax.x * inMax.y;
}

void main() {
    float mask = roundedCardAlpha(vUv);
    if (mask <= 0.001) discard;

    vec2 tilt = uTilt;
    vec2 shiftedUv = vUv + tilt * vec2(0.32, -0.22);
    float band = shiftedUv.x * 1.8 + shiftedUv.y * 1.2;
    vec3 rainbow = spectral(fract(band));

    float fineLines = pow(0.5 + 0.5 * sin((vUv.x - vUv.y) * 95.0 + tilt.x * 18.0), 10.0);
    float glint = smoothstep(0.94, 1.0, 1.0 - abs(fract(band * 2.2 + tilt.y * 0.8) - 0.5) * 2.0);
    float falloff = smoothstep(0.0, 0.22, vUv.x) * smoothstep(1.0, 0.78, vUv.x);
    float alpha = (0.025 + fineLines * 0.018 + glint * 0.035) * falloff * mask;
    float signatureStrip = rectMask(vUv, vec2(0.055, 0.16), vec2(0.945, 0.30));
    alpha *= mix(1.0, 1.0 - signatureStrip, uSuppressSignatureStrip);

    gl_FragColor = vec4(rainbow, alpha);
}
`;

/** A centered rounded-rectangle THREE.Shape for extruding the card body. */
function roundedRectShape(w: number, h: number, r: number): THREE.Shape {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function drawHolographicFoil(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
) {
    ctx.save();

    const rainbow = ctx.createLinearGradient(w * -0.08, h * 0.18, w, h * 0.82);
    rainbow.addColorStop(0, "rgba(255, 96, 170, 0)");
    rainbow.addColorStop(0.18, "rgba(255, 96, 170, 0.035)");
    rainbow.addColorStop(0.34, "rgba(255, 214, 92, 0.032)");
    rainbow.addColorStop(0.5, "rgba(82, 220, 255, 0.035)");
    rainbow.addColorStop(0.66, "rgba(154, 116, 255, 0.032)");
    rainbow.addColorStop(0.84, "rgba(103, 255, 184, 0.03)");
    rainbow.addColorStop(1, "rgba(103, 255, 184, 0)");
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = rainbow;
    ctx.fillRect(0, 0, w, h);

    const flare = ctx.createRadialGradient(
        w * 0.72,
        h * 0.18,
        0,
        w * 0.72,
        h * 0.18,
        w * 0.48,
    );
    flare.addColorStop(0, "rgba(255,255,255,0.18)");
    flare.addColorStop(0.38, "rgba(170,220,255,0.07)");
    flare.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = flare;
    ctx.fillRect(0, 0, w, h);

    const stripe = ctx.createLinearGradient(0, h * 0.08, w, h * 0.58);
    stripe.addColorStop(0, "rgba(255,255,255,0)");
    stripe.addColorStop(0.46, "rgba(255,255,255,0)");
    stripe.addColorStop(0.5, "rgba(255,255,255,0.18)");
    stripe.addColorStop(0.54, "rgba(255,255,255,0)");
    stripe.addColorStop(1, "rgba(255,255,255,0)");
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = stripe;
    ctx.fillRect(0, 0, w, h);

    ctx.globalCompositeOperation = "soft-light";
    ctx.strokeStyle = "rgba(120, 128, 140, 0.06)";
    ctx.lineWidth = h * 0.002;
    const step = h * 0.085;
    for (let x = -w; x < w * 1.4; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, h);
        ctx.lineTo(x + w * 0.42, 0);
        ctx.stroke();
    }

    ctx.restore();
}

/** Draw the metallic card face (with rounded-corner alpha) onto a 2D canvas. */
function drawCardFace(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    { name, since, label }: Required<Props>,
) {
    const r = h * 0.05; // corner radius

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    // Clip to a rounded rectangle so the corners stay transparent.
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.clip();

    // White card base with a subtle print-like sheen.
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.55, "#ffffff");
    g.addColorStop(0.8, "#ffffff");
    g.addColorStop(1, "#ffffff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Soft diagonal sheen band for a subtle metallic reflection.
    const sheen = ctx.createLinearGradient(w * 0.1, 0, w * 0.7, h);
    sheen.addColorStop(0, "rgba(255,255,255,0)");
    sheen.addColorStop(0.5, "rgba(255,255,255,0.38)");
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    drawHolographicFoil(ctx, w, h);

    const padX = w * 0.055;
    const padY = h * 0.13;
    ctx.textBaseline = "alphabetic";

    // Top-left label.
    ctx.font = `600 ${h * 0.052}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.012}px`;
    ctx.textAlign = "left";
    ctx.fillStyle = "#3f4650";
    ctx.fillText(label.toUpperCase(), padX, padY);

    // Top-right "SINCE YYYY".
    ctx.textAlign = "right";
    ctx.fillStyle = "#3f4650";
    ctx.fillText(`SINCE ${since}`, w - padX, padY);

    // Member name, large.
    ctx.letterSpacing = "0px";
    ctx.textAlign = "left";
    ctx.font = `500 ${h * 0.14}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = "#3f4650";
    ctx.fillText(name, padX, padY + h * 0.2);

    // Bottom-left wordmark: a filled dot + AIYARA.
    const markY = h - padY * 0.7;
    ctx.beginPath();
    ctx.arc(padX + h * 0.045, markY - h * 0.02, h * 0.045, 0, Math.PI * 2);
    ctx.fillStyle = "#3f4650";
    ctx.fill();
    ctx.font = `700 ${h * 0.07}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.004}px`;
    ctx.fillStyle = "#2f3540";
    ctx.fillText("AIYARA", padX + h * 0.12, markY + h * 0.005);
    ctx.letterSpacing = "0px";

    ctx.restore();
}

function drawCardBack(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const r = h * 0.05;

    ctx.clearRect(0, 0, w, h);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.clip();

    // Same white card base.
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.55, "#ffffff");
    g.addColorStop(0.8, "#ffffff");
    g.addColorStop(1, "#ffffff");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    const padX = w * 0.055;
    const sigY = h * 0.72;
    const sigH = h * 0.12;
    const sigW = w - padX * 2;

    // Signature panel label.
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `500 ${h * 0.038}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.008}px`;
    ctx.fillStyle = "#3f4650";
    ctx.fillText("AUTHORIZED SIGNATURE", padX, sigY - h * 0.02);

    // Signature strip.
    ctx.fillStyle = "#3f4650";
    const stripR = h * 0.01;
    ctx.beginPath();
    ctx.moveTo(padX + stripR, sigY);
    ctx.arcTo(padX + sigW, sigY, padX + sigW, sigY + sigH, stripR);
    ctx.arcTo(padX + sigW, sigY + sigH, padX, sigY + sigH, stripR);
    ctx.arcTo(padX, sigY + sigH, padX, sigY, stripR);
    ctx.arcTo(padX, sigY, padX + sigW, sigY, stripR);
    ctx.closePath();
    ctx.fill();

    // Thin border around strip.
    ctx.strokeStyle = "#3f4650";
    ctx.lineWidth = h * 0.002;
    ctx.stroke();

    // Bottom fine print.
    const fpY = h - padX * 0.8;
    ctx.font = `${h * 0.03}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.003}px`;
    ctx.textAlign = "center";
    ctx.fillStyle = "#3f4650";
    ctx.fillText(
        "This card is the property of UBC Thai Aiyara. If found, please return.",
        w / 2,
        fpY,
    );

    ctx.restore();
}

export default function MembershipCard({
    name,
    since = "2025",
    label = "Aiyara Member",
}: Props) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        // --- Card face texture -------------------------------------------------
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = TEX_W;
        faceCanvas.height = TEX_H;
        const faceCtx = faceCanvas.getContext("2d")!;
        drawCardFace(faceCtx, TEX_W, TEX_H, {
            name: name || "Member",
            since,
            label,
        });

        const texture = new THREE.CanvasTexture(faceCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;

        // --- Card back texture -------------------------------------------------
        const backCanvas = document.createElement("canvas");
        backCanvas.width = TEX_W;
        backCanvas.height = TEX_H;
        const backCtx = backCanvas.getContext("2d")!;
        drawCardBack(backCtx, TEX_W, TEX_H);

        const backTexture = new THREE.CanvasTexture(backCanvas);
        backTexture.colorSpace = THREE.SRGBColorSpace;
        backTexture.anisotropy = 8;

        // --- Scene / camera / renderer ----------------------------------------
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(28, CARD_ASPECT, 0.1, 100);
        // Closer camera → the card fills more of the canvas, trimming the empty
        // inner padding. Kept back far enough that the tilt/hover-scale doesn't
        // push the near corners off the canvas edge.
        camera.position.set(0, 0, 2.9);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.appendChild(renderer.domElement);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";

        // --- Environment for metallic reflections ------------------------------
        // A small vertical gradient used as an equirect env map → PMREM. Gives the
        // brushed metal something to reflect as it tilts.
        const envCanvas = document.createElement("canvas");
        envCanvas.width = 16;
        envCanvas.height = 256;
        const envCtx = envCanvas.getContext("2d")!;
        const envGrad = envCtx.createLinearGradient(0, 0, 0, 256);
        envGrad.addColorStop(0, "#ffffff");
        envGrad.addColorStop(0.48, "#ffffff");
        envGrad.addColorStop(1, "#ffffff");
        envCtx.fillStyle = envGrad;
        envCtx.fillRect(0, 0, 16, 256);
        const envTex = new THREE.CanvasTexture(envCanvas);
        envTex.mapping = THREE.EquirectangularReflectionMapping;
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envRT = pmrem.fromEquirectangular(envTex);
        scene.environment = envRT.texture;
        envTex.dispose();

        // --- Lights ------------------------------------------------------------
        scene.add(new THREE.AmbientLight(0xffffff, 0.95));
        const key = new THREE.DirectionalLight(0xffffff, 2.05);
        key.position.set(-2, 2, 4);
        scene.add(key);

        // --- Card mesh ---------------------------------------------------------
        const card = new THREE.Group();

        // Printed face: the canvas texture on a flat plane, sitting just in front
        // of the extruded body so its transparent corners align with the body.
        const geometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            transparent: true,
            metalness: 0.7,
            roughness: 0.12,
            envMapIntensity: 1.9,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = CARD_DEPTH / 2 + 0.001;
        card.add(mesh);

        const holoGeometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
        const holoMaterial = new THREE.ShaderMaterial({
            vertexShader: HOLO_VERTEX_SHADER,
            fragmentShader: HOLO_FRAGMENT_SHADER,
            uniforms: {
                uTilt: { value: new THREE.Vector2(0, 0) },
                uTime: { value: 0 },
                uSuppressSignatureStrip: { value: 0 },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const holoMesh = new THREE.Mesh(holoGeometry, holoMaterial);
        holoMesh.position.z = CARD_DEPTH / 2 + 0.003;
        card.add(holoMesh);

        // Back face: same plane geometry, on the reverse side, flipped so the
        // texture reads correctly when the card is rotated 180° around Y.
        const backGeometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
        const backMaterial = new THREE.MeshStandardMaterial({
            map: backTexture,
            transparent: true,
            metalness: 0.7,
            roughness: 0.12,
            envMapIntensity: 1.9,
        });
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        backMesh.position.z = -CARD_DEPTH / 2 - 0.001;
        backMesh.rotation.y = Math.PI;
        card.add(backMesh);

        const backHoloGeometry = new THREE.PlaneGeometry(CARD_W, CARD_H, 1, 1);
        const backHoloMaterial = new THREE.ShaderMaterial({
            vertexShader: HOLO_VERTEX_SHADER,
            fragmentShader: HOLO_FRAGMENT_SHADER,
            uniforms: {
                uTilt: { value: new THREE.Vector2(0, 0) },
                uTime: { value: 0 },
                uSuppressSignatureStrip: { value: 1 },
            },
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const backHoloMesh = new THREE.Mesh(backHoloGeometry, backHoloMaterial);
        backHoloMesh.position.z = -CARD_DEPTH / 2 - 0.003;
        backHoloMesh.rotation.y = Math.PI;
        card.add(backHoloMesh);

        // Body: a rounded, extruded slab that gives the card real thickness so its
        // metallic edge catches light when tilted.
        const bodyGeometry = new THREE.ExtrudeGeometry(
            roundedRectShape(CARD_W, CARD_H, CARD_R),
            { depth: CARD_DEPTH, bevelEnabled: false, curveSegments: 16 },
        );
        bodyGeometry.center(); // center the extrusion depth on z = 0
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xf2f4f7,
            metalness: 1,
            roughness: 0.08,
            envMapIntensity: 2.6,
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        card.add(body);

        scene.add(card);

        // --- Sizing ------------------------------------------------------------
        function resize() {
            const w = mount!.clientWidth;
            const h = w / CARD_ASPECT;
            renderer.setSize(w, h, false);
            camera.aspect = CARD_ASPECT;
            camera.updateProjectionMatrix();
        }
        resize();
        const ro = new ResizeObserver(resize);
        ro.observe(mount);

        // --- Tilt: pointer (desktop) + device orientation (mobile) ------------
        let targetX = 0;
        let targetY = 0;
        let pointerHovering = false;

        function onMove(e: PointerEvent) {
            if (prefersReduced) return;
            const rect = mount!.getBoundingClientRect();
            const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
            pointerHovering = true;
            targetY = px * 0.4;
            targetX = -py * 0.28;
        }
        function onLeave() {
            pointerHovering = false;
            targetX = 0;
            targetY = 0;
        }
        mount.addEventListener("pointermove", onMove);
        mount.addEventListener("pointerleave", onLeave);

        // Device-orientation tilt: on a phone, tilt the card to match how the
        // handset is physically held. beta = front/back, gamma = left/right. The
        // first reading is captured as "neutral" so the card tilts relative to the
        // user's natural holding angle. ~30° of physical tilt maps to full range.
        let baseBeta: number | null = null;
        let baseGamma: number | null = null;
        function onOrient(e: DeviceOrientationEvent) {
            if (prefersReduced || e.beta === null || e.gamma === null) return;
            if (baseBeta === null) {
                baseBeta = e.beta;
                baseGamma = e.gamma;
            }
            const dBeta = e.beta - baseBeta;
            const dGamma = e.gamma - (baseGamma ?? 0);
            targetY = THREE.MathUtils.clamp(dGamma / 30, -1, 1) * 0.4;
            targetX = THREE.MathUtils.clamp(-dBeta / 30, -1, 1) * 0.28;
        }

        // iOS 13+ gates the motion sensor behind a permission prompt that must be
        // requested from a user gesture (the tap handler below). Other platforms
        // can start listening straight away.
        type OrientCtor = typeof DeviceOrientationEvent & {
            requestPermission?: () => Promise<"granted" | "denied">;
        };
        const hasOrientation = typeof DeviceOrientationEvent !== "undefined";
        const needsGesture =
            hasOrientation &&
            typeof (DeviceOrientationEvent as OrientCtor).requestPermission ===
                "function";
        let orientationOn = false;
        function enableOrientation() {
            if (orientationOn || !hasOrientation) return;
            if (needsGesture) {
                (DeviceOrientationEvent as OrientCtor).requestPermission!()
                    .then((state) => {
                        if (state === "granted") {
                            window.addEventListener(
                                "deviceorientation",
                                onOrient,
                            );
                            orientationOn = true;
                        }
                    })
                    .catch(() => {});
            } else {
                window.addEventListener("deviceorientation", onOrient);
                orientationOn = true;
            }
        }
        if (hasOrientation && !needsGesture) enableOrientation();

        // --- Flip on click (also the gesture that unlocks the iOS sensor) ------
        let flipTarget = 0;
        function onClick() {
            enableOrientation();
            flipTarget = flipTarget === 0 ? Math.PI : 0;
        }
        mount.addEventListener("click", onClick);

        // --- Render loop -------------------------------------------------------
        let raf = 0;
        let targetScale = 1;
        let flipCurrent = 0;
        function tick() {
            raf = requestAnimationFrame(tick);

            // Smooth tilt toward pointer.
            card.rotation.x += (targetX - card.rotation.x) * 0.09;

            // Smooth flip animation, with tilt layered on top.
            flipCurrent += (flipTarget - flipCurrent) * 0.09;
            card.rotation.y = flipCurrent + targetY;
            holoMaterial.uniforms.uTilt.value.set(
                THREE.MathUtils.clamp(card.rotation.y, -0.55, 0.55),
                THREE.MathUtils.clamp(card.rotation.x, -0.4, 0.4),
            );
            holoMaterial.uniforms.uTime.value = performance.now() / 1000;
            backHoloMaterial.uniforms.uTilt.value.set(
                THREE.MathUtils.clamp(-card.rotation.y, -0.55, 0.55),
                THREE.MathUtils.clamp(card.rotation.x, -0.4, 0.4),
            );
            backHoloMaterial.uniforms.uTime.value =
                holoMaterial.uniforms.uTime.value;

            // Only the pointer hover lifts the card — device-orientation tilt keeps
            // a continuous non-zero target, which would otherwise pin it scaled up.
            targetScale = pointerHovering ? 1.03 : 1;
            const s = card.scale.x + (targetScale - card.scale.x) * 0.09;
            card.scale.set(s, s, s);
            renderer.render(scene, camera);
        }
        tick();

        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
            mount.removeEventListener("pointermove", onMove);
            mount.removeEventListener("pointerleave", onLeave);
            mount.removeEventListener("click", onClick);
            window.removeEventListener("deviceorientation", onOrient);
            geometry.dispose();
            material.dispose();
            holoGeometry.dispose();
            holoMaterial.dispose();
            backGeometry.dispose();
            backMaterial.dispose();
            backHoloGeometry.dispose();
            backHoloMaterial.dispose();
            bodyGeometry.dispose();
            bodyMaterial.dispose();
            texture.dispose();
            backTexture.dispose();
            envRT.dispose();
            pmrem.dispose();
            renderer.dispose();
            if (renderer.domElement.parentNode === mount) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, [name, since, label]);

    return (
        <div
            ref={mountRef}
            className="membership-card-3d"
            role="img"
            aria-label={`${label} card for ${name}, member since ${since}`}
        />
    );
}
