import * as THREE from 'three';
import { GarmentType } from '../data/products';

interface Point {
  x: number;
  y: number;
}

export interface GarmentTextures {
  colorTexture: THREE.CanvasTexture;
  silhouetteTexture: THREE.CanvasTexture;
  heightTexture: THREE.CanvasTexture;
  dispose: () => void;
}

// Cache textures to avoid recreating them constantly
const textureCache = new Map<string, GarmentTextures>();

/**
 * Get silhouette path points for a garment type and fit
 */
function getGarmentPath(type: GarmentType, fit?: string): {
  topCenter: Point;
  rightPoints: Point[];
  bottomCenter: Point;
  isCurvedNeck?: boolean;
  neckDip?: Point;
  hoodBump?: Point[];
} {
  if (type === 'jeans') {
    let hemOuter = 0.60;
    let hemInner = 0.14;
    let hip = 0.68;

    if (fit === 'Slim') {
      hemOuter = 0.50;
      hemInner = 0.12;
    } else if (fit === 'Baggy') {
      hip = 0.74;
      hemOuter = 0.80;
      hemInner = 0.20;
    } else if (fit === 'Skinny') {
      hemOuter = 0.46;
      hemInner = 0.10;
    }

    return {
      topCenter: { x: 0, y: 1.20 }, // waist-center
      rightPoints: [
        { x: 0.62, y: 1.20 }, // waist-right
        { x: hip, y: 0.60 }, // hip
        { x: hemOuter, y: -1.20 }, // hem-outer
        { x: hemInner, y: -1.20 }, // hem-inner
        { x: 0.07, y: -0.05 }, // inseam-top
      ],
      bottomCenter: { x: 0, y: -0.05 }, // crotch-center
    };
  }

  if (type === 'tshirt') {
    return {
      topCenter: { x: 0, y: 0.82 },
      isCurvedNeck: true,
      neckDip: { x: 0, y: 0.82 },
      rightPoints: [
        { x: 0.35, y: 1.10 }, // neck-right
        { x: 0.95, y: 0.98 }, // shoulder
        { x: 1.55, y: 0.55 }, // sleeve-top-outer
        { x: 1.30, y: 0.12 }, // cuff-bottom-outer
        { x: 0.98, y: 0.32 }, // cuff-inner
        { x: 0.85, y: 0.20 }, // armpit
        { x: 0.85, y: -1.10 }, // hem-right
      ],
      bottomCenter: { x: 0, y: -1.10 },
    };
  }

  if (type === 'shirt') {
    return {
      topCenter: { x: 0, y: 0.70 }, // V-cut collar notch
      rightPoints: [
        { x: 0.35, y: 1.10 }, // neck-right
        { x: 0.95, y: 0.98 }, // shoulder
        { x: 1.45, y: -0.55 }, // lengthened sleeve cuff outer
        { x: 1.12, y: -0.52 }, // lengthened sleeve cuff inner
        { x: 0.85, y: 0.20 }, // armpit
        { x: 0.85, y: -1.15 }, // hem-right
      ],
      bottomCenter: { x: 0, y: -1.15 },
    };
  }

  if (type === 'hoodie') {
    return {
      topCenter: { x: 0, y: 1.34 }, // top of hood
      hoodBump: [
        { x: 0.46, y: 1.28 },
        { x: 0.40, y: 1.10 },
      ],
      rightPoints: [
        { x: 0.95, y: 0.98 }, // shoulder
        { x: 1.45, y: -0.55 }, // lengthened sleeve cuff outer
        { x: 1.12, y: -0.52 }, // lengthened sleeve cuff inner
        { x: 0.92, y: 0.20 }, // armpit
        { x: 0.92, y: -1.05 }, // hem-right
      ],
      bottomCenter: { x: 0, y: -1.05 },
    };
  }

  // Jacket
  return {
    topCenter: { x: 0, y: 0.75 }, // collar notch
    rightPoints: [
      { x: 0.35, y: 1.10 }, // neck-right
      { x: 0.95, y: 0.98 }, // shoulder
      { x: 1.45, y: -0.55 }, // lengthened cuff outer
      { x: 1.12, y: -0.52 }, // lengthened cuff inner
      { x: 0.95, y: 0.20 }, // armpit
      { x: 0.95, y: -0.95 }, // hem-right
    ],
    bottomCenter: { x: 0, y: -0.95 },
  };
}

/**
 * Draw silhouette onto 1024x1024 canvas
 */
function drawSilhouetteCanvas(type: GarmentType, fit?: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Black background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 1024);

  const path = getGarmentPath(type, fit);
  
  // Find bounds to scale with 80px margin
  let minX = 0;
  let maxX = 0;
  let minY = Math.min(path.topCenter.y, path.bottomCenter.y);
  let maxY = Math.max(path.topCenter.y, path.bottomCenter.y);

  const allPoints = [...path.rightPoints];
  if (path.hoodBump) allPoints.push(...path.hoodBump);

  for (const pt of allPoints) {
    if (pt.x > maxX) maxX = pt.x;
    if (-pt.x < minX) minX = -pt.x;
    if (pt.y < minY) minY = pt.y;
    if (pt.y > maxY) maxY = pt.y;
  }

  const modelWidth = maxX - minX;
  const modelHeight = maxY - minY;
  const targetDimension = 1024 - 160; // 864px drawable area (80px margin on all sides)
  const scale = targetDimension / Math.max(modelWidth, modelHeight);
  const midY = (minY + maxY) / 2;

  const toPx = (pt: Point): [number, number] => {
    return [512 + pt.x * scale, 512 - (pt.y - midY) * scale];
  };

  // Draw white silhouette
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();

  const [tcX, tcY] = toPx(path.topCenter);
  ctx.moveTo(tcX, tcY);

  if (path.hoodBump) {
    for (const pt of path.hoodBump) {
      const [px, py] = toPx(pt);
      ctx.lineTo(px, py);
    }
  } else if (path.isCurvedNeck && path.neckDip) {
    const [nrX, nrY] = toPx(path.rightPoints[0]);
    const [ctrlX, ctrlY] = toPx({ x: 0.15, y: path.neckDip.y });
    ctx.quadraticCurveTo(ctrlX, ctrlY, nrX, nrY);
  }

  const startIdx = path.isCurvedNeck ? 1 : 0;
  for (let i = startIdx; i < path.rightPoints.length; i++) {
    const [px, py] = toPx(path.rightPoints[i]);
    ctx.lineTo(px, py);
  }

  const [bcX, bcY] = toPx(path.bottomCenter);
  ctx.lineTo(bcX, bcY);

  // Left half mirrored
  for (let i = path.rightPoints.length - 1; i >= startIdx; i--) {
    const [px, py] = toPx({ x: -path.rightPoints[i].x, y: path.rightPoints[i].y });
    ctx.lineTo(px, py);
  }

  if (path.isCurvedNeck && path.neckDip) {
    const [nlX, nlY] = toPx({ x: -path.rightPoints[0].x, y: path.rightPoints[0].y });
    ctx.lineTo(nlX, nlY);
    const [ctrlX, ctrlY] = toPx({ x: -0.15, y: path.neckDip.y });
    ctx.quadraticCurveTo(ctrlX, ctrlY, tcX, tcY);
  } else if (path.hoodBump) {
    for (let i = path.hoodBump.length - 1; i >= 0; i--) {
      const [px, py] = toPx({ x: -path.hoodBump[i].x, y: path.hoodBump[i].y });
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();

  return canvas;
}

/**
 * Draw height map (blurred silhouette) onto 1024x1024 canvas
 */
function drawHeightCanvas(silCanvas: HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 1024, 1024);

  try {
    ctx.filter = 'blur(36px)';
    ctx.drawImage(silCanvas, 0, 0);
    ctx.filter = 'none';
  } catch {
    // Fallback if filter isn't supported
    ctx.drawImage(silCanvas, 0, 0);
  }

  return canvas;
}

/**
 * Draw color canvas with fabric details
 */
function drawColorCanvas(
  type: GarmentType,
  colorHex: string,
  productId?: string
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // 1. Base color
  ctx.fillStyle = colorHex;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Fabric detail
  if (type === 'jeans' || type === 'jacket') {
    // Diagonal twill lines: 1px, rgba(255,255,255,0.06), 6px apart, 63° angle
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const spacing = 6;
    const tan63 = Math.tan((63 * Math.PI) / 180); // ~1.96

    for (let x = -1024; x < 1024 * 2; x += spacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 1024 / tan63, 1024);
      ctx.stroke();
    }

    // Subtle noise speckle (opacity 0.05)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * 1024;
      const ry = Math.random() * 1024;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Seam/stitch lines as dashed gold (#C8A96A) 2px lines
    ctx.strokeStyle = '#C8A96A';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    if (type === 'jeans') {
      // Waistband seam
      ctx.beginPath();
      ctx.moveTo(260, 140);
      ctx.lineTo(764, 140);
      ctx.stroke();

      // Fly seam
      ctx.beginPath();
      ctx.moveTo(512, 140);
      ctx.lineTo(512, 380);
      ctx.quadraticCurveTo(512, 430, 480, 440);
      ctx.stroke();

      // Front pockets curve
      ctx.beginPath();
      ctx.moveTo(340, 140);
      ctx.quadraticCurveTo(380, 260, 250, 310);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(684, 140);
      ctx.quadraticCurveTo(644, 260, 774, 310);
      ctx.stroke();

      // Leg inseams
      ctx.beginPath();
      ctx.moveTo(512, 500);
      ctx.lineTo(440, 960);
      ctx.moveTo(512, 500);
      ctx.lineTo(584, 960);
      ctx.stroke();

      // Hem lines
      ctx.beginPath();
      ctx.moveTo(250, 950);
      ctx.lineTo(450, 950);
      ctx.moveTo(574, 950);
      ctx.lineTo(774, 950);
      ctx.stroke();
    } else {
      // Jacket chest pockets
      ctx.strokeRect(340, 360, 110, 120);
      ctx.strokeRect(574, 360, 110, 120);
      // Center placket
      ctx.beginPath();
      ctx.moveTo(512, 180);
      ctx.lineTo(512, 920);
      ctx.stroke();
    }
    ctx.restore();
  } else {
    // Tee / shirt / hoodie
    // Subtle horizontal knit lines: 1px, rgba(0,0,0,0.04), 4px apart
    ctx.save();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.04)';
    ctx.lineWidth = 1;
    for (let y = 0; y < 1024; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Rib collar ring at neck
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(512, 180, 70, 0.2 * Math.PI, 0.8 * Math.PI);
    ctx.stroke();

    // Hem line
    ctx.beginPath();
    ctx.moveTo(240, 940);
    ctx.lineTo(784, 940);
    ctx.stroke();

    if (type === 'shirt') {
      // Center placket with 5 small circles as buttons
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.moveTo(512, 220);
      ctx.lineTo(512, 920);
      ctx.stroke();

      // 5 buttons
      for (let i = 0; i < 5; i++) {
        const by = 280 + i * 130;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(512, by, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    } else if (type === 'hoodie') {
      // Kangaroo pocket rectangle
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(360, 580, 304, 220, [16, 16, 8, 8]);
      ctx.stroke();

      // Drawstrings
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(480, 240);
      ctx.lineTo(475, 420);
      ctx.moveTo(544, 240);
      ctx.lineTo(549, 420);
      ctx.stroke();
    }

    // Graphic Street Tee (TJ-T03)
    if (productId === 'TJ-T03') {
      const isDark = isDarkColor(colorHex);
      const textColor = isDark ? '#FFFFFF' : '#111111';

      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.font = '700 130px "Playfair Display", serif';
      ctx.fillText('TRENDY', 512, 460);

      ctx.font = '600 48px Inter, sans-serif';
      ctx.letterSpacing = '12px';
      ctx.fillText('JEANS CO.', 512, 530);
    }

    ctx.restore();
  }

  return canvas;
}

function isDarkColor(hex: string): boolean {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
  const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
  const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
}

/**
 * Generate or retrieve procedural garment textures
 */
export function getGarmentTextures(
  type: GarmentType,
  colorHex: string,
  fit?: string,
  productId?: string
): GarmentTextures {
  const key = `${type}_${fit || 'def'}_${colorHex}_${productId || ''}`;
  const cached = textureCache.get(key);
  if (cached) return cached;

  const silCanvas = drawSilhouetteCanvas(type, fit);
  const heightCanvas = drawHeightCanvas(silCanvas);
  const colorCanvas = drawColorCanvas(type, colorHex, productId);

  const silhouetteTexture = new THREE.CanvasTexture(silCanvas);
  silhouetteTexture.anisotropy = 4;
  silhouetteTexture.wrapS = THREE.ClampToEdgeWrapping;
  silhouetteTexture.wrapT = THREE.ClampToEdgeWrapping;

  const heightTexture = new THREE.CanvasTexture(heightCanvas);
  heightTexture.anisotropy = 4;
  heightTexture.wrapS = THREE.ClampToEdgeWrapping;
  heightTexture.wrapT = THREE.ClampToEdgeWrapping;

  const colorTexture = new THREE.CanvasTexture(colorCanvas);
  colorTexture.colorSpace = THREE.SRGBColorSpace;
  colorTexture.anisotropy = 4;
  colorTexture.wrapS = THREE.ClampToEdgeWrapping;
  colorTexture.wrapT = THREE.ClampToEdgeWrapping;

  const result: GarmentTextures = {
    colorTexture,
    silhouetteTexture,
    heightTexture,
    dispose: () => {
      silhouetteTexture.dispose();
      heightTexture.dispose();
      colorTexture.dispose();
      textureCache.delete(key);
    },
  };

  textureCache.set(key, result);
  return result;
}
