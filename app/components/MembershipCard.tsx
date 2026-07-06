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
const CARD_DEPTH = 0.04;

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

  // Dark brushed steel base gradient (diagonal).
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#3a3a40");
  g.addColorStop(0.35, "#2a2a30");
  g.addColorStop(0.6, "#222228");
  g.addColorStop(0.85, "#323238");
  g.addColorStop(1, "#28282e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Soft diagonal sheen band for a subtle metallic reflection.
  const sheen = ctx.createLinearGradient(w * 0.1, 0, w * 0.7, h);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0.08)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  const padX = w * 0.055;
  const padY = h * 0.13;
  ctx.textBaseline = "alphabetic";

  // Top-left label.
  ctx.font = `600 ${h * 0.052}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.letterSpacing = `${h * 0.012}px`;
  ctx.textAlign = "left";
  ctx.fillStyle = "#a8aab0";
  ctx.fillText(label.toUpperCase(), padX, padY);

  // Top-right "SINCE YYYY".
  ctx.textAlign = "right";
  ctx.fillStyle = "#a8aab0";
  ctx.fillText(`SINCE ${since}`, w - padX, padY);

  // Member name, large.
  ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
  ctx.font = `500 ${h * 0.14}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.fillStyle = "#e8e8ec";
  ctx.fillText(name, padX, padY + h * 0.2);

  // Bottom-left wordmark: a filled dot + AIYARA.
  const markY = h - padY * 0.7;
  ctx.beginPath();
  ctx.arc(padX + h * 0.045, markY - h * 0.02, h * 0.045, 0, Math.PI * 2);
  ctx.fillStyle = "#e8e8ec";
  ctx.fill();
  ctx.font = `700 ${h * 0.07}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.letterSpacing = `${h * 0.004}px`;
  ctx.fillStyle = "#e8e8ec";
  ctx.fillText("AIYARA", padX + h * 0.12, markY + h * 0.005);
  ctx.letterSpacing = "0px";

  ctx.restore();
}

function drawCardBack(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
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

  // Same dark brushed steel base.
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#3a3a40");
  g.addColorStop(0.35, "#2a2a30");
  g.addColorStop(0.6, "#222228");
  g.addColorStop(0.85, "#323238");
  g.addColorStop(1, "#28282e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const padX = w * 0.055;
  const sigY = h * 0.38;
  const sigH = h * 0.12;
  const sigW = w - padX * 2;

  // Signature panel label.
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = `500 ${h * 0.038}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.letterSpacing = `${h * 0.008}px`;
  ctx.fillStyle = "#888a90";
  ctx.fillText("AUTHORIZED SIGNATURE", padX, sigY - h * 0.02);

  // Signature strip.
  ctx.fillStyle = "#d8d8dc";
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
  ctx.strokeStyle = "#b0b0b6";
  ctx.lineWidth = h * 0.002;
  ctx.stroke();

  // Bottom fine print.
  const fpY = h - padX * 0.8;
  ctx.font = `${h * 0.03}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.letterSpacing = `${h * 0.003}px`;
  ctx.textAlign = "center";
  ctx.fillStyle = "#707278";
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
    drawCardFace(faceCtx, TEX_W, TEX_H, { name: name || "Member", since, label });

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    envGrad.addColorStop(0, "#c8c8d0");
    envGrad.addColorStop(0.5, "#7a7a84");
    envGrad.addColorStop(1, "#2a2a30");
    envCtx.fillStyle = envGrad;
    envCtx.fillRect(0, 0, 16, 256);
    const envTex = new THREE.CanvasTexture(envCanvas);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromEquirectangular(envTex);
    scene.environment = envRT.texture;
    envTex.dispose();

    // --- Lights ------------------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
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
      roughness: 0.25,
      envMapIntensity: 1.3,
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
      roughness: 0.25,
      envMapIntensity: 1.3,
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
      color: 0x28282e,
      metalness: 0.7,
      roughness: 0.28,
      envMapIntensity: 1.3,
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

    // --- Pointer-driven tilt ----------------------------------------------
    let targetX = 0;
    let targetY = 0;
    function onMove(e: PointerEvent) {
      if (prefersReduced) return;
      const rect = mount!.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const py = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetY = px * 0.4;
      targetX = -py * 0.28;
    }
    function onLeave() {
      targetX = 0;
      targetY = 0;
    }
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerleave", onLeave);

    // --- Flip on click -----------------------------------------------------
    let flipTarget = 0;
    function onClick() {
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

      const hovering = targetX !== 0 || targetY !== 0;
      targetScale = hovering ? 1.03 : 1;
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
