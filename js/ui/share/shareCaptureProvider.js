/**
 * ShareCaptureProvider
 *
 * Stage 1 of the share image pipeline.
 * Draws a top-down grid representation onto an HTMLCanvasElement using Canvas 2D.
 *
 * APPROACH CHOICE — Canvas 2D instead of RTT:
 * The share panel is displayed in WorldLoaderScene, at which point the BaseGameScene
 * is no longer the active render target. Forcing a scene.render() would cause a visible
 * flash; cross-scene RTT is unsupported in Babylon.js. Canvas 2D drawing from the
 * stored completion data is instant, reliable, and produces a clean stylized output
 * suitable for sharing. The captured canvas + gridMapping returned here are reused
 * by Stage 2 (path drawing) and Stage 3 (overlay).
 *
 * Exposed as window.ShareCaptureProvider.
 */

class ShareCaptureProvider {

    static config = {
        resolution: 1080,              // px on the long edge
        paddingTiles: 0.75,            // tiles of padding around the grid
        backgroundColor: "#0a0520",    // deep cosmic background
        tileColorA: "#12082a",         // even tile color
        tileColorB: "#160c32",         // odd tile color (subtle checker)
        tileStrokeColor: "#1e1040",    // subtle grid line
        tileStrokeWidth: 0.5,          // px
        cornerRadius: 0,               // px per tile corner
        obstacleColors: {
            mountain: "#2a1f4a",
            spike:    "#6b1a1a",
            lock:     "#7a4a10",
            default:  "#222244"
        },
        obstacleStroke: "#000000",
        collectibleColor:  "#ffd700",  // gold lotus
        collectibleRadius: 0.3,        // fraction of tile size
        startMarkerColor:  "#ffffff",
        startMarkerRadius: 0.22,
        includeGridFloor: true,
    };

    /**
     * Draws the grid and returns { canvas, gridMapping }.
     *
     * @param {Object} completionData — stored by ShareImagePipeline at level complete:
     *   { gridWidth, gridDepth, playerStartPos, obstacles, collectibles, levelId }
     * @returns {{ canvas: HTMLCanvasElement, gridMapping: Object }}
     */
    static capture(completionData) {
        const cfg  = ShareCaptureProvider.config;
        const { gridWidth, gridDepth, playerStartPos, obstacles, collectibles } = completionData;

        const gw = gridWidth  || 11;
        const gd = gridDepth  || 21;
        const pad = cfg.paddingTiles;

        // World-space extents covered by the ortho view
        // Tiles occupy world x: 0..(gw-1), world z: 0..(gd-1)
        const worldWidth  = gw + pad * 2;
        const worldHeight = gd + pad * 2;

        // Image resolution: keep long edge at cfg.resolution
        let imgW, imgH;
        if (worldWidth >= worldHeight) {
            imgW = cfg.resolution;
            imgH = Math.round(cfg.resolution * worldHeight / worldWidth);
        } else {
            imgH = cfg.resolution;
            imgW = Math.round(cfg.resolution * worldWidth / worldHeight);
        }

        // Orthographic bounds (world space)
        const orthoLeft   = -pad;
        const orthoRight  = gw + pad - 1;   // tile centers 0..(gw-1)
        const orthoTop    = gd + pad - 1;    // high Z = top of image (camera up = +Z)
        const orthoBottom = -pad;

        // Pixels per world unit
        const pxPerX = imgW / (orthoRight  - orthoLeft);
        const pxPerZ = imgH / (orthoTop    - orthoBottom);
        const tileWidthPx  = pxPerX * 1;  // 1 world unit per tile
        const tileHeightPx = pxPerZ * 1;

        /** Convert world (x,z) to canvas (px, py) */
        function worldToPixel(wx, wz) {
            return {
                px: (wx - orthoLeft)  * pxPerX,
                py: (orthoTop  - wz)  * pxPerZ   // Z increases = moves UP on screen (lower py)
            };
        }

        const canvas = document.createElement("canvas");
        canvas.width  = imgW;
        canvas.height = imgH;
        const ctx = canvas.getContext("2d");

        // --- Background ---
        ctx.fillStyle = cfg.backgroundColor;
        ctx.fillRect(0, 0, imgW, imgH);

        // --- Grid tiles ---
        if (cfg.includeGridFloor) {
            for (let x = 0; x < gw; x++) {
                for (let z = 0; z < gd; z++) {
                    const topLeft = worldToPixel(x - 0.5, z + 0.5);
                    const w = tileWidthPx;
                    const h = tileHeightPx;
                    const isOdd = (x + z) % 2 === 1;
                    ctx.fillStyle = isOdd ? cfg.tileColorB : cfg.tileColorA;
                    ctx.fillRect(Math.round(topLeft.px), Math.round(topLeft.py), Math.ceil(w), Math.ceil(h));
                    if (cfg.tileStrokeWidth > 0) {
                        ctx.strokeStyle = cfg.tileStrokeColor;
                        ctx.lineWidth   = cfg.tileStrokeWidth;
                        ctx.strokeRect(Math.round(topLeft.px) + 0.5, Math.round(topLeft.py) + 0.5, Math.ceil(w) - 1, Math.ceil(h) - 1);
                    }
                }
            }
        }

        // --- Obstacles ---
        if (Array.isArray(obstacles)) {
            for (const obs of obstacles) {
                if (!obs.position) continue;
                const wx = obs.position.x;
                const wz = obs.position.z;
                const center = worldToPixel(wx, wz);
                const hw = tileWidthPx  * 0.48;
                const hh = tileHeightPx * 0.48;

                const archetype = obs.obstacleArchetype || "default";
                ctx.fillStyle   = cfg.obstacleColors[archetype] || cfg.obstacleColors.default;
                ctx.strokeStyle = cfg.obstacleStroke;
                ctx.lineWidth   = 1;

                if (archetype === "spike") {
                    // Draw a diamond
                    ctx.beginPath();
                    ctx.moveTo(center.px,      center.py - hh);
                    ctx.lineTo(center.px + hw, center.py);
                    ctx.lineTo(center.px,      center.py + hh);
                    ctx.lineTo(center.px - hw, center.py);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                } else {
                    // Draw a rounded rectangle for mountains / locks / default
                    const r = tileWidthPx * 0.1;
                    const x0 = center.px - hw, y0 = center.py - hh;
                    const w2 = hw * 2, h2 = hh * 2;
                    ctx.beginPath();
                    ctx.moveTo(x0 + r, y0);
                    ctx.lineTo(x0 + w2 - r, y0);
                    ctx.quadraticCurveTo(x0 + w2, y0, x0 + w2, y0 + r);
                    ctx.lineTo(x0 + w2, y0 + h2 - r);
                    ctx.quadraticCurveTo(x0 + w2, y0 + h2, x0 + w2 - r, y0 + h2);
                    ctx.lineTo(x0 + r, y0 + h2);
                    ctx.quadraticCurveTo(x0, y0 + h2, x0, y0 + h2 - r);
                    ctx.lineTo(x0, y0 + r);
                    ctx.quadraticCurveTo(x0, y0, x0 + r, y0);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Small keyhole icon for lock
                    if (archetype === "lock") {
                        ctx.fillStyle = "#f5c518";
                        ctx.beginPath();
                        ctx.arc(center.px, center.py - hh * 0.15, hw * 0.25, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.fillRect(center.px - hw * 0.12, center.py, hw * 0.24, hh * 0.3);
                    }
                }
            }
        }

        // --- Collectibles (lotuses — shown at starting state) ---
        const collectibleR = tileWidthPx * cfg.collectibleRadius;
        if (Array.isArray(collectibles)) {
            for (const col of collectibles) {
                if (!col.position) continue;
                const center = worldToPixel(col.position.x, col.position.z);
                // Outer glow
                const grad = ctx.createRadialGradient(center.px, center.py, 0, center.px, center.py, collectibleR * 1.6);
                grad.addColorStop(0,   "rgba(255, 215, 0, 0.9)");
                grad.addColorStop(0.5, "rgba(255, 215, 0, 0.4)");
                grad.addColorStop(1,   "rgba(255, 215, 0, 0)");
                ctx.beginPath();
                ctx.arc(center.px, center.py, collectibleR * 1.6, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();
                // Core circle
                ctx.beginPath();
                ctx.arc(center.px, center.py, collectibleR, 0, Math.PI * 2);
                ctx.fillStyle = cfg.collectibleColor;
                ctx.fill();
                // 4-petal star overlay
                ctx.fillStyle = "rgba(255,255,200,0.7)";
                for (let petal = 0; petal < 4; petal++) {
                    const angle = (petal / 4) * Math.PI * 2;
                    const ex = center.px + Math.cos(angle) * collectibleR * 0.55;
                    const ey = center.py + Math.sin(angle) * collectibleR * 0.55;
                    ctx.beginPath();
                    ctx.arc(ex, ey, collectibleR * 0.28, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        // --- Player start marker ---
        if (playerStartPos) {
            const center = worldToPixel(playerStartPos.x, playerStartPos.z);
            const r = tileWidthPx * cfg.startMarkerRadius;
            // Glow
            const glowGrad = ctx.createRadialGradient(center.px, center.py, 0, center.px, center.py, r * 2);
            glowGrad.addColorStop(0,   "rgba(255,255,255,0.4)");
            glowGrad.addColorStop(1,   "rgba(255,255,255,0)");
            ctx.beginPath();
            ctx.arc(center.px, center.py, r * 2, 0, Math.PI * 2);
            ctx.fillStyle = glowGrad;
            ctx.fill();
            // Core
            ctx.beginPath();
            ctx.arc(center.px, center.py, r, 0, Math.PI * 2);
            ctx.fillStyle = cfg.startMarkerColor;
            ctx.strokeStyle = "#aaaacc";
            ctx.lineWidth = 1.5;
            ctx.fill();
            ctx.stroke();
        }

        const gridMapping = {
            orthoLeft,
            orthoRight,
            orthoTop,
            orthoBottom,
            imageWidth:  imgW,
            imageHeight: imgH,
            tileWidthPx,
            tileHeightPx,
            gridWidth:   gw,    // exposed for grid coordinate labels in Stage 2
            gridDepth:   gd,
            worldToPixel,   // helper exposed for Stage 2
        };

        return { canvas, gridMapping };
    }
}

window.ShareCaptureProvider = ShareCaptureProvider;
