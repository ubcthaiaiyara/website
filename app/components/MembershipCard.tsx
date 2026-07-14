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
    /** Page theme the card sits on: "dark" → light-purple card, "light" →
     *  black card. */
    theme?: "light" | "dark";
};

// Card face colors keyed off the surrounding page theme. On the dark page the
// card is light purple with dark ink; on the light page it's black with light
// ink. `body` is the extruded metallic edge; `sheen` the diagonal highlight.
type CardPalette = {
    base: string;
    baseEnd: string;
    ink: string;
    inkStrong: string;
    body: number;
    sheen: string;
};

function paletteFor(theme: "light" | "dark"): CardPalette {
    if (theme === "light") {
        // Black card for the light page.
        return {
            base: "#18181e",
            baseEnd: "#050507",
            ink: "#e9e7f2",
            inkStrong: "#ffffff",
            body: 0x2b2b32,
            sheen: "rgba(255,255,255,0.20)",
        };
    }
    // Light-purple card for the dark page.
    return {
        base: "#e6e1fb",
        baseEnd: "#cec5f1",
        ink: "#3f4650",
        inkStrong: "#2f3540",
        body: 0xd7d1ef,
        sheen: "rgba(255,255,255,0.42)",
    };
}

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

/** Brushed-metal texture: fine horizontal hairline streaks with a faint
 *  anisotropic sheen, giving the card face a grained metallic finish. */
function drawBrushedMetal(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
) {
    ctx.save();

    // Fine horizontal streaks. Alternating faint light/dark lines at
    // pseudo-random opacities read as a directional brushed grain.
    const lines = 320;
    ctx.lineWidth = Math.max(1, h * 0.0018);
    for (let i = 0; i < lines; i++) {
        const y = (i / lines) * h;
        const seed = Math.sin(i * 12.9898) * 43758.5453;
        const rnd = seed - Math.floor(seed); // 0..1
        const a = 0.01 + rnd * 0.035;
        ctx.strokeStyle =
            rnd > 0.5
                ? `rgba(255,255,255,${a})`
                : `rgba(0,0,0,${a * 0.6})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
    }

    // Broad horizontal sheen sweep to sell the anisotropic reflection.
    const sweep = ctx.createLinearGradient(0, 0, w, 0);
    sweep.addColorStop(0, "rgba(255,255,255,0)");
    sweep.addColorStop(0.4, "rgba(255,255,255,0.05)");
    sweep.addColorStop(0.55, "rgba(255,255,255,0.09)");
    sweep.addColorStop(0.7, "rgba(255,255,255,0.05)");
    sweep.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sweep;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
}

/** Draw the metallic card face (with rounded-corner alpha) onto a 2D canvas. */
function drawCardFace(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    { name, since, label }: { name: string; since: string; label: string },
    palette: CardPalette,
    wordmark?: HTMLImageElement | null,
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

    // Card base with a subtle print-like sheen.
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, palette.base);
    g.addColorStop(0.55, palette.base);
    g.addColorStop(0.8, palette.baseEnd);
    g.addColorStop(1, palette.baseEnd);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    // Soft diagonal sheen band for a subtle metallic reflection.
    const sheen = ctx.createLinearGradient(w * 0.1, 0, w * 0.7, h);
    sheen.addColorStop(0, "rgba(255,255,255,0)");
    sheen.addColorStop(0.5, palette.sheen);
    sheen.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sheen;
    ctx.fillRect(0, 0, w, h);

    drawBrushedMetal(ctx, w, h);

    const padX = w * 0.055;
    const padY = h * 0.13;
    ctx.textBaseline = "alphabetic";

    // Top-left label.
    ctx.font = `600 ${h * 0.052}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.012}px`;
    ctx.textAlign = "left";
    ctx.fillStyle = palette.ink;
    ctx.fillText(label.toUpperCase(), padX, padY);

    // Top-right "SINCE YYYY".
    ctx.textAlign = "right";
    ctx.fillStyle = palette.ink;
    ctx.fillText(`SINCE ${since}`, w - padX, padY);

    // Member name, large.
    ctx.letterSpacing = "0px";
    ctx.textAlign = "left";
    ctx.font = `500 ${h * 0.14}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.fillStyle = palette.ink;
    ctx.fillText(name, padX, padY + h * 0.2);

    // Bottom-left brand wordmark. Uses the wordmark artwork tinted to the card
    // ink; falls back to a dot + AIYARA text until the image loads.
    const markY = h - padY * 0.7;
    if (wordmark && wordmark.width > 0) {
        const wmH = h * 0.1;
        const wmW = wmH * (wordmark.width / wordmark.height);
        // The wordmark PNG is white artwork — tint it to the card ink via an
        // offscreen source-in fill before drawing it onto the face.
        const tint = document.createElement("canvas");
        tint.width = wordmark.width;
        tint.height = wordmark.height;
        const tctx = tint.getContext("2d")!;
        tctx.drawImage(wordmark, 0, 0);
        tctx.globalCompositeOperation = "source-in";
        tctx.fillStyle = palette.inkStrong;
        tctx.fillRect(0, 0, tint.width, tint.height);
        ctx.drawImage(tint, padX, markY - wmH * 0.78, wmW, wmH);
    } else {
        ctx.beginPath();
        ctx.arc(padX + h * 0.045, markY - h * 0.02, h * 0.045, 0, Math.PI * 2);
        ctx.fillStyle = palette.ink;
        ctx.fill();
        ctx.font = `700 ${h * 0.07}px system-ui, -apple-system, Segoe UI, sans-serif`;
        ctx.letterSpacing = `${h * 0.004}px`;
        ctx.fillStyle = palette.inkStrong;
        ctx.fillText("AIYARA", padX + h * 0.12, markY + h * 0.005);
        ctx.letterSpacing = "0px";
    }

    ctx.restore();
}

function drawCardBack(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    palette: CardPalette,
) {
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

    // Same card base as the face.
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, palette.base);
    g.addColorStop(0.55, palette.base);
    g.addColorStop(0.8, palette.baseEnd);
    g.addColorStop(1, palette.baseEnd);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    drawBrushedMetal(ctx, w, h);

    const padX = w * 0.055;
    const sigY = h * 0.72;
    const sigH = h * 0.12;
    const sigW = w - padX * 2;

    // Signature panel label.
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.font = `500 ${h * 0.038}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.008}px`;
    ctx.fillStyle = palette.ink;
    ctx.fillText("AUTHORIZED SIGNATURE", padX, sigY - h * 0.02);

    // Signature strip.
    ctx.fillStyle = palette.ink;
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
    ctx.strokeStyle = palette.ink;
    ctx.lineWidth = h * 0.002;
    ctx.stroke();

    // Bottom fine print.
    const fpY = h - padX * 0.8;
    ctx.font = `${h * 0.03}px system-ui, -apple-system, Segoe UI, sans-serif`;
    ctx.letterSpacing = `${h * 0.003}px`;
    ctx.textAlign = "center";
    ctx.fillStyle = palette.ink;
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
    theme = "dark",
}: Props) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const palette = paletteFor(theme);

        const prefersReduced = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        // --- Card face texture -------------------------------------------------
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = TEX_W;
        faceCanvas.height = TEX_H;
        const faceCtx = faceCanvas.getContext("2d")!;
        const faceContent = {
            name: name || "Member",
            since,
            label,
        };
        drawCardFace(faceCtx, TEX_W, TEX_H, faceContent, palette);

        const texture = new THREE.CanvasTexture(faceCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;

        // Load the brand wordmark, then repaint the face with it in place of the
        // AIYARA text fallback.
        const wordmarkImage = new Image();
        wordmarkImage.onload = () => {
            drawCardFace(
                faceCtx,
                TEX_W,
                TEX_H,
                faceContent,
                palette,
                wordmarkImage,
            );
            texture.needsUpdate = true;
        };
        wordmarkImage.src = "/thai-aiyara-wordmark.png";

        // --- Card back texture -------------------------------------------------
        const backCanvas = document.createElement("canvas");
        backCanvas.width = TEX_W;
        backCanvas.height = TEX_H;
        const backCtx = backCanvas.getContext("2d")!;
        drawCardBack(backCtx, TEX_W, TEX_H, palette);

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

        // Body: a rounded, extruded slab that gives the card real thickness so its
        // metallic edge catches light when tilted.
        const bodyGeometry = new THREE.ExtrudeGeometry(
            roundedRectShape(CARD_W, CARD_H, CARD_R),
            { depth: CARD_DEPTH, bevelEnabled: false, curveSegments: 16 },
        );
        bodyGeometry.center(); // center the extrusion depth on z = 0
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: palette.body,
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
            wordmarkImage.onload = null;
            ro.disconnect();
            mount.removeEventListener("pointermove", onMove);
            mount.removeEventListener("pointerleave", onLeave);
            mount.removeEventListener("click", onClick);
            window.removeEventListener("deviceorientation", onOrient);
            geometry.dispose();
            material.dispose();
            backGeometry.dispose();
            backMaterial.dispose();
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
    }, [name, since, label, theme]);

    return (
        <div
            ref={mountRef}
            className="membership-card-3d"
            role="img"
            aria-label={`${label} card for ${name}, member since ${since}`}
        />
    );
}
