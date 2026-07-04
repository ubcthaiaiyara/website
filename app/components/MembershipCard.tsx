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

  // Brushed-silver base gradient (diagonal).
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#f4f4f6");
  g.addColorStop(0.35, "#dcdce0");
  g.addColorStop(0.6, "#c9c9cf");
  g.addColorStop(0.85, "#e6e6ea");
  g.addColorStop(1, "#d2d2d8");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Soft diagonal sheen band.
  const sheen = ctx.createLinearGradient(w * 0.1, 0, w * 0.7, h);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0.35)");
  sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, w, h);

  // Film grain over the brushed metal. Drawn here — before the ripples and
  // text — so the decorative pattern and printed letters stay clean/smooth.
  const grain = document.createElement("canvas");
  grain.width = w;
  grain.height = h;
  const gctx = grain.getContext("2d")!;
  const noise = gctx.createImageData(w, h);
  const data = noise.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255;
    data[i] = data[i + 1] = data[i + 2] = v;
    data[i + 3] = 255;
  }
  gctx.putImageData(noise, 0, 0);
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.globalCompositeOperation = "overlay";
  ctx.drawImage(grain, 0, 0);
  ctx.restore();

  // Emboss helpers: a light copy shifted up-left + a dark copy shifted
  // down-right, with the base drawn on top, so prints and pattern read as
  // raised/pressed into the metal. They respect the current font/align.
  const o = h * 0.004; // emboss offset
  const HL = "rgba(255,255,255,0.6)";
  const SH = "rgba(40,40,46,0.45)";
  const embossText = (text: string, x: number, y: number, base: string) => {
    ctx.fillStyle = HL;
    ctx.fillText(text, x - o, y - o);
    ctx.fillStyle = SH;
    ctx.fillText(text, x + o, y + o);
    ctx.fillStyle = base;
    ctx.fillText(text, x, y);
  };
  const embossArc = (x: number, y: number, radius: number, base: string) => {
    ctx.beginPath();
    ctx.arc(x - o, y - o, radius, 0, Math.PI * 2);
    ctx.fillStyle = HL;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + o, y + o, radius, 0, Math.PI * 2);
    ctx.fillStyle = SH;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = base;
    ctx.fill();
  };

  // Concentric ripples in the lower-right (like the reference fingerprint),
  // embossed so they look tooled into the surface.
  const cx = w * 1.02;
  const cy = h * 0.98;
  ctx.lineWidth = h * 0.006;
  const strokeRipples = (dx: number, dy: number, color: string) => {
    ctx.strokeStyle = color;
    for (let i = 1; i <= 14; i++) {
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, i * (h * 0.085), Math.PI, Math.PI * 1.5);
      ctx.stroke();
    }
  };
  strokeRipples(-o, -o, HL);
  strokeRipples(o, o, SH);
  strokeRipples(0, 0, "rgba(120,120,128,0.26)");

  const padX = w * 0.055;
  const padY = h * 0.13;
  ctx.textBaseline = "alphabetic";

  // Top-left label.
  ctx.font = `600 ${h * 0.052}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.letterSpacing = `${h * 0.012}px`;
  ctx.textAlign = "left";
  embossText(label.toUpperCase(), padX, padY, "#6c6c74");

  // Top-right "SINCE YYYY".
  ctx.textAlign = "right";
  embossText(`SINCE ${since}`, w - padX, padY, "#6c6c74");

  // Member name, large.
  ctx.letterSpacing = "0px";
  ctx.textAlign = "left";
  ctx.font = `500 ${h * 0.14}px system-ui, -apple-system, Segoe UI, sans-serif`;
  embossText(name, padX, padY + h * 0.2, "#3a3a40");

  // Bottom-left wordmark: a filled dot + AIYARA.
  const markY = h - padY * 0.7;
  embossArc(padX + h * 0.045, markY - h * 0.02, h * 0.045, "#3a3a40");
  ctx.font = `700 ${h * 0.07}px system-ui, -apple-system, Segoe UI, sans-serif`;
  ctx.letterSpacing = `${h * 0.004}px`;
  embossText("AIYARA", padX + h * 0.12, markY + h * 0.005, "#3a3a40");
  ctx.letterSpacing = "0px";

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

    // --- Scene / camera / renderer ----------------------------------------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(28, CARD_ASPECT, 0.1, 100);
    camera.position.set(0, 0, 3.1);

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
    envGrad.addColorStop(0, "#ffffff");
    envGrad.addColorStop(0.5, "#c4c8d0");
    envGrad.addColorStop(1, "#6b7080");
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
      metalness: 0.55,
      roughness: 0.32,
      envMapIntensity: 1.1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = CARD_DEPTH / 2 + 0.001;
    card.add(mesh);

    // Body: a rounded, extruded slab that gives the card real thickness so its
    // metallic edge catches light when tilted.
    const bodyGeometry = new THREE.ExtrudeGeometry(
      roundedRectShape(CARD_W, CARD_H, CARD_R),
      { depth: CARD_DEPTH, bevelEnabled: false, curveSegments: 16 },
    );
    bodyGeometry.center(); // center the extrusion depth on z = 0
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xd7d7dc,
      metalness: 0.6,
      roughness: 0.34,
      envMapIntensity: 1.1,
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
      targetY = px * 0.4; // yaw follows horizontal
      targetX = -py * 0.28; // pitch follows vertical (inverted)
    }
    function onLeave() {
      targetX = 0;
      targetY = 0;
    }
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerleave", onLeave);

    // --- Render loop -------------------------------------------------------
    let raf = 0;
    let targetScale = 1;
    function tick() {
      raf = requestAnimationFrame(tick);
      card.rotation.x += (targetX - card.rotation.x) * 0.09;
      card.rotation.y += (targetY - card.rotation.y) * 0.09;
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
      geometry.dispose();
      material.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      texture.dispose();
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
