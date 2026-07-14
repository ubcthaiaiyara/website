"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const COVER_W = 1.32;
const COVER_H = 1.82;
const PAGE_D = 0.2;

function createCoverTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 1240;
    const ctx = canvas.getContext("2d")!;
    const drawCover = (wordmark?: HTMLImageElement) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const background = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        background.addColorStop(0, "#090b27");
        background.addColorStop(0.48, "#262d62");
        background.addColorStop(1, "#595e99");
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const glow = ctx.createRadialGradient(
            canvas.width * 0.5,
            canvas.height * 0.28,
            0,
            canvas.width * 0.5,
            canvas.height * 0.28,
            canvas.width * 0.62,
        );
        glow.addColorStop(0, "rgba(196, 208, 255, 0.27)");
        glow.addColorStop(1, "rgba(196, 208, 255, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "rgba(255, 251, 236, 0.52)";
        ctx.lineWidth = 3;
        ctx.strokeRect(62, 62, canvas.width - 124, canvas.height - 124);
        ctx.strokeStyle = "rgba(255, 251, 236, 0.18)";
        ctx.lineWidth = 1;
        ctx.strokeRect(84, 84, canvas.width - 168, canvas.height - 168);

        ctx.textAlign = "center";
        if (wordmark) {
            ctx.drawImage(wordmark, 112, 116, 130, 54);
        } else {
            ctx.fillStyle = "rgba(255, 251, 236, 0.72)";
            ctx.textAlign = "left";
            ctx.font = "600 27px system-ui, sans-serif";
            ctx.fillText("UBC THAI AIYARA", 116, 170);
        }

        ctx.fillStyle = "#fffbec";
        ctx.font = "400 80px Georgia, serif";
        ctx.fillText("Sponsorship", canvas.width / 2, 604);
        ctx.fillText("Package", canvas.width / 2, 696);

        ctx.fillStyle = "rgba(255, 251, 236, 0.68)";
        ctx.font = "500 27px system-ui, sans-serif";
        ctx.fillText("2025 / 2026", canvas.width / 2, 1084);
    };

    drawCover();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    let active = true;
    let wordmark: HTMLImageElement | undefined;
    const redraw = () => {
        if (!active) return;
        drawCover(wordmark);
        texture.needsUpdate = true;
    };
    const wordmarkImage = new Image();
    wordmarkImage.onload = () => {
        wordmark = wordmarkImage;
        redraw();
    };
    wordmarkImage.src = "/thai-aiyara-wordmark.png";
    return {
        texture,
        dispose: () => {
            active = false;
            wordmarkImage.onload = null;
            texture.dispose();
        },
    };
}

export default function SponsorshipBook() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
        camera.position.set(0, 0, 4.7);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        mount.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(0xf8f5ff, 0x1a1d45, 2.2));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
        keyLight.position.set(-3, 4, 5);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0x9aa7ff, 2.1);
        rimLight.position.set(4, -1, -3);
        scene.add(rimLight);

        const book = new THREE.Group();
        book.rotation.set(0.24, -0.78, 0);
        // The outer book tilt is grounded on the lower-left corner. Inside it,
        // the tilt group rotates around the mirrored diagonal to the upper-left.
        const outerW = COVER_W + 0.08;
        const outerH = COVER_H + 0.08;
        // Compensate for the corner pivot so the book's diagonal centre stays
        // framed even when its pitch and yaw become more pronounced.
        const basePosition = new THREE.Vector3(outerW / 2, outerH / 2, 0)
            .applyEuler(book.rotation)
            .multiplyScalar(-1);
        basePosition.y += 0.12;
        book.position.copy(basePosition);
        const diagonalTilt = new THREE.Group();
        diagonalTilt.position.x = outerW;
        book.add(diagonalTilt);
        const bookBody = new THREE.Group();
        bookBody.position.set(-outerW / 2, outerH / 2, 0);
        diagonalTilt.add(bookBody);
        const diagonalAxis = new THREE.Vector3(-outerW, outerH, 0).normalize();

        const pagesGeometry = new THREE.BoxGeometry(COVER_W, COVER_H, PAGE_D);
        const pagesMaterial = new THREE.MeshStandardMaterial({
            color: 0xfffbec,
            roughness: 0.78,
            metalness: 0.03,
        });
        bookBody.add(new THREE.Mesh(pagesGeometry, pagesMaterial));

        const cover = createCoverTexture();
        const coverGeometry = new THREE.BoxGeometry(COVER_W + 0.08, COVER_H + 0.08, 0.055);
        const coverMaterial = new THREE.MeshStandardMaterial({
            map: cover.texture,
            roughness: 0.38,
            metalness: 0.08,
        });
        const frontCover = new THREE.Mesh(coverGeometry, coverMaterial);
        frontCover.position.z = PAGE_D / 2 + 0.032;
        bookBody.add(frontCover);

        const backCover = new THREE.Mesh(
            coverGeometry,
            new THREE.MeshStandardMaterial({
                color: 0x171b42,
                roughness: 0.42,
                metalness: 0.08,
            }),
        );
        backCover.position.z = -PAGE_D / 2 - 0.032;
        bookBody.add(backCover);

        const spineGeometry = new THREE.BoxGeometry(0.075, COVER_H + 0.08, PAGE_D + 0.13);
        const spineMaterial = new THREE.MeshStandardMaterial({
            color: 0x111534,
            roughness: 0.45,
            metalness: 0.12,
        });
        const spine = new THREE.Mesh(spineGeometry, spineMaterial);
        spine.position.x = -outerW / 2;
        bookBody.add(spine);

        scene.add(book);

        const resize = () => {
            const { width, height } = mount.getBoundingClientRect();
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(mount);

        let pointerX = 0;
        let pointerY = 0;
        const onMove = (event: PointerEvent) => {
            const rect = mount.getBoundingClientRect();
            pointerX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            pointerY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        };
        const onLeave = () => {
            pointerX = 0;
            pointerY = 0;
        };
        mount.addEventListener("pointermove", onMove);
        mount.addEventListener("pointerleave", onLeave);

        let frame = 0;
        const render = (time = 0) => {
            if (!reducedMotion) frame = requestAnimationFrame(render);
            const float = reducedMotion ? 0 : Math.sin(time * 0.0012) * 0.075;
            book.position.y = basePosition.y + float;
            const idleTilt = reducedMotion ? 0.42 : 0.42 + Math.sin(time * 0.001) * 0.035;
            diagonalTilt.quaternion.setFromAxisAngle(
                diagonalAxis,
                idleTilt + pointerY * 0.12 + pointerX * 0.05,
            );
            renderer.render(scene, camera);
        };
        render();

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            mount.removeEventListener("pointermove", onMove);
            mount.removeEventListener("pointerleave", onLeave);
            pagesGeometry.dispose();
            pagesMaterial.dispose();
            coverGeometry.dispose();
            coverMaterial.dispose();
            backCover.material.dispose();
            spineGeometry.dispose();
            spineMaterial.dispose();
            cover.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return <div ref={mountRef} className="sponsorship-book-3d" aria-hidden="true" />;
}
