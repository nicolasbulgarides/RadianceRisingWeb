/**
 * SharePathRenderer
 *
 * Stage 2 of the share image pipeline.
 * Draws the player's solution path onto the grid canvas using Canvas 2D.
 *
 * Path data comes from MovementTracker.eventLog (type='move' entries), which each contain
 * startPosition and destinationPosition as BABYLON.Vector3-like objects with x, y, z.
 * These are in world space — directly usable with gridMapping.worldToPixel().
 *
 * Partial reveal: pass movesToShow < movePath.length to draw only those segments.
 * The last visible segment fades out and ends with ellipsis dots when partially revealed.
 *
 * Exposed as window.SharePathRenderer.
 */

class SharePathRenderer {

    static config = {
        // Path line
        lineWidthRatio:   0.38,        // * tileWidthPx (Refinement 3: was 0.5)
        startColor:       "#00E5FF",   // path gradient start (cyan)
        endColor:         "#FFD700",   // path gradient end (gold)
        opacity:          0.85,
        arrowSizeRatio:   0.28,        // * tileWidthPx (Refinement 3: was 0.35)

        // Partial reveal
        fadeOutRatio:     0.3,         // last 30% of final segment fades
        fadeOutDotsColor: "#b8a9d4",
        fadeOutDotsCount: 3,
        fadeOutDotsRadius: 0.07,       // * tileWidthPx

        // Start marker (Refinement 4)
        startMarkerOuterRadius: 0.25,  // * tileWidthPx
        startMarkerGlowRadius:  0.35,  // * tileWidthPx
        startMarkerGlowAlpha:   0.3,
        startMarkerInnerColor:  '#7b4fd4',

        // End marker (Refinement 4)
        endMarkerStarSize:   0.3,      // * tileWidthPx, center to point
        endMarkerGlowAlpha:  0.25,

        // Numbered stop circles (Refinement 1)
        stopMarkerRadius:      0.18,   // * tileWidthPx
        stopMarkerFill:        '#1a0a2e',
        stopMarkerBorder:      '#7b4fd4',
        stopMarkerBorderWidth: 2,
        stopMarkerTextColor:   '#FFFFFF',
        stopMarkerFontRatio:   0.6,    // font size as fraction of circle diameter
        showStopNumbers:       true,

        // Overlap offset (Refinement 2)
        overlapOffsetRatio:  0.15,     // perpendicular offset as fraction of tileWidthPx
        enableOverlapOffset: true,

        // Grid coordinates (Refinement 6)
        showGridCoordinates:        true,
        gridCoordinateColor:        '#2a1a3e',
        gridCoordinateFontRatio:    0.2,   // * tileWidthPx
        gridCoordinateColumnLabels: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        gridCoordinateRowStart:     1,
    };

    /**
     * Draws the solution path and returns the composited canvas.
     *
     * @param {HTMLCanvasElement} canvas      — output of ShareCaptureProvider.capture()
     * @param {Array}  movePath               — completionData.movePath (type='move' eventLog entries)
     * @param {Object} gridMapping            — from ShareCaptureProvider (contains worldToPixel helper)
     * @param {number} movesToShow            — how many moves to draw (1..movePath.length)
     * @returns {HTMLCanvasElement}
     */
    static drawPath(canvas, movePath, gridMapping, movesToShow) {
        const cfg = SharePathRenderer.config;
        const { worldToPixel, tileWidthPx } = gridMapping;
        const totalMoves = movePath.length;

        if (!movePath || totalMoves === 0) return canvas;

        const n = (movesToShow == null) ? totalMoves : Math.max(1, Math.min(movesToShow, totalMoves));
        const isPartial = n < totalMoves;

        const ctx = canvas.getContext("2d");

        // Build segment data (includes world coords for overlap detection)
        const segments = [];
        for (let i = 0; i < n; i++) {
            const move = movePath[i];
            const t    = n > 1 ? i / (n - 1) : 0;
            const sx   = move.startPosition.x,      sz = move.startPosition.z;
            const ex   = move.destinationPosition.x, ez = move.destinationPosition.z;
            const isHoriz = Math.abs(ex - sx) >= Math.abs(ez - sz);
            segments.push({
                start:   worldToPixel(sx, sz),
                end:     worldToPixel(ex, ez),
                color:   SharePathRenderer._interpolateColor(cfg.startColor, cfg.endColor, t),
                isHoriz,
                wx1: sx, wz1: sz, wx2: ex, wz2: ez,
            });
        }

        // --- Refinement 6: Faint grid coordinate labels (drawn first, behind everything) ---
        if (cfg.showGridCoordinates) {
            SharePathRenderer._drawGridCoordinates(ctx, gridMapping, cfg);
        }

        // --- Refinement 2: Compute per-segment perpendicular offsets for parallel overlaps ---
        const offsets = new Array(n).fill(0);
        if (cfg.enableOverlapOffset) {
            SharePathRenderer._computeOverlapOffsets(segments, offsets, cfg.overlapOffsetRatio);
        }

        // --- Draw path segments (Refinement 3: thinner lines) ---
        ctx.save();
        ctx.globalAlpha = cfg.opacity;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.lineWidth   = tileWidthPx * cfg.lineWidthRatio;

        for (let i = 0; i < segments.length; i++) {
            const seg    = segments[i];
            const isLast = i === segments.length - 1;
            const offStart = SharePathRenderer._applyOffset(seg.start, offsets[i], seg.isHoriz, tileWidthPx);
            const offEnd   = SharePathRenderer._applyOffset(seg.end,   offsets[i], seg.isHoriz, tileWidthPx);

            if (isLast && isPartial) {
                SharePathRenderer._drawFadeSegment(ctx, offStart, offEnd, seg.color, cfg, tileWidthPx);
            } else {
                ctx.strokeStyle = seg.color;
                ctx.beginPath();
                ctx.moveTo(offStart.px, offStart.py);
                ctx.lineTo(offEnd.px,   offEnd.py);
                ctx.stroke();
            }

            // Arrowhead: at direction changes, and at the final segment of a full solution
            const drawArrow = isLast
                ? !isPartial
                : !SharePathRenderer._sameDirection(seg, segments[i + 1]);
            if (drawArrow) {
                SharePathRenderer._drawArrowhead(ctx, offStart, offEnd, seg.color, tileWidthPx * cfg.arrowSizeRatio);
            }
        }
        ctx.restore();

        // --- Refinement 4: Strong start marker (double-ring + play triangle) ---
        if (segments.length > 0) {
            // segment[0] always has offset 0 (no predecessors), so startPt needs no adjustment
            const startPt = segments[0].start;
            SharePathRenderer._drawStartMarker(ctx, startPt.px, startPt.py, tileWidthPx, cfg);
        }

        // --- Refinement 4: End marker drawn BEFORE numbered circles so the number overlays it ---
        if (!isPartial && segments.length > 0) {
            const lastSeg = segments[segments.length - 1];
            const endPt   = SharePathRenderer._applyOffset(lastSeg.end, offsets[segments.length - 1], lastSeg.isHoriz, tileWidthPx);
            SharePathRenderer._drawEndMarker(ctx, endPt.px, endPt.py, tileWidthPx, cfg);
        }

        // --- Ellipsis dots (partial reveal) ---
        if (isPartial && segments.length > 0) {
            const lastSeg = segments[segments.length - 1];
            const endPt   = SharePathRenderer._applyOffset(lastSeg.end, offsets[segments.length - 1], lastSeg.isHoriz, tileWidthPx);
            const dotsRadius = tileWidthPx * cfg.fadeOutDotsRadius;
            const spacing    = dotsRadius * 3.2;
            // Direction along final segment
            const dx = lastSeg.end.px - lastSeg.start.px;
            const dy = lastSeg.end.py - lastSeg.start.py;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            ctx.save();
            ctx.globalAlpha = 0.9;
            ctx.fillStyle   = cfg.fadeOutDotsColor;
            for (let d = 0; d < cfg.fadeOutDotsCount; d++) {
                const dist = (d + 1) * spacing;
                ctx.beginPath();
                ctx.arc(
                    endPt.px + (dx / len) * dist,
                    endPt.py + (dy / len) * dist,
                    dotsRadius * (1 - d * 0.2), 0, Math.PI * 2
                );
                ctx.fill();
            }
            ctx.restore();
        }

        // --- Refinement 1: Numbered stop circles (drawn LAST — on top of everything) ---
        if (cfg.showStopNumbers && segments.length > 0) {
            for (let i = 0; i < segments.length; i++) {
                const seg   = segments[i];
                const endPt = SharePathRenderer._applyOffset(seg.end, offsets[i], seg.isHoriz, tileWidthPx);
                SharePathRenderer._drawStopNumber(ctx, endPt.px, endPt.py, i + 1, tileWidthPx, cfg);
            }
        }

        return canvas;
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    /**
     * Computes a perpendicular pixel offset for each segment to separate parallel overlapping paths.
     * Segments that travel in the same direction over the same tiles get staggered into lanes.
     */
    static _computeOverlapOffsets(segments, offsets, offsetRatio) {
        const tilePaths = new Map(); // "x:z" → [{ horiz: bool }]

        for (let i = 0; i < segments.length; i++) {
            const seg   = segments[i];
            const tiles = SharePathRenderer._segmentTiles(seg);

            // Count how many earlier parallel segments overlap ANY tile in this segment
            let maxParallelCount = 0;
            for (const key of tiles) {
                const occupants = tilePaths.get(key);
                if (occupants) {
                    const parallelCount = occupants.filter(o => o.horiz === seg.isHoriz).length;
                    if (parallelCount > maxParallelCount) maxParallelCount = parallelCount;
                }
            }

            // Assign alternating offset: 1st overlap → +ratio, 2nd → −ratio, 3rd → +ratio, …
            if (maxParallelCount > 0) {
                offsets[i] = (maxParallelCount % 2 === 1) ? offsetRatio : -offsetRatio;
            }

            // Register this segment's tiles
            for (const key of tiles) {
                if (!tilePaths.has(key)) tilePaths.set(key, []);
                tilePaths.get(key).push({ horiz: seg.isHoriz });
            }
        }
    }

    /** Returns the set of integer tile keys covered by an axis-aligned segment. */
    static _segmentTiles(seg) {
        const minX = Math.round(Math.min(seg.wx1, seg.wx2));
        const maxX = Math.round(Math.max(seg.wx1, seg.wx2));
        const minZ = Math.round(Math.min(seg.wz1, seg.wz2));
        const maxZ = Math.round(Math.max(seg.wz1, seg.wz2));
        const tiles = [];
        if (seg.isHoriz) {
            for (let x = minX; x <= maxX; x++) tiles.push(`${x}:${minZ}`);
        } else {
            for (let z = minZ; z <= maxZ; z++) tiles.push(`${minX}:${z}`);
        }
        return tiles;
    }

    /**
     * Shifts a pixel point perpendicular to the movement direction.
     * Horizontal segments offset vertically (py); vertical segments offset horizontally (px).
     */
    static _applyOffset(pt, offset, isHoriz, tileWidthPx) {
        if (offset === 0) return pt;
        const delta = offset * tileWidthPx;
        return isHoriz
            ? { px: pt.px,          py: pt.py + delta }
            : { px: pt.px + delta,  py: pt.py };
    }

    /** Double-ring start marker with a play-triangle glyph. */
    static _drawStartMarker(ctx, cx, cy, tileWidthPx, cfg) {
        const outerR = tileWidthPx * cfg.startMarkerOuterRadius;
        const glowR  = tileWidthPx * cfg.startMarkerGlowRadius;
        const innerR = outerR * 0.56;

        ctx.save();
        ctx.globalAlpha = 1;

        // Soft white halo
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
        glowGrad.addColorStop(0, `rgba(255,255,255,${cfg.startMarkerGlowAlpha})`);
        glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Outer white ring
        ctx.beginPath();
        ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Inner purple ring
        ctx.beginPath();
        ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
        ctx.fillStyle = cfg.startMarkerInnerColor;
        ctx.fill();

        // ▶ play triangle (white, centered in the inner ring)
        const triR = innerR * 0.52;
        ctx.beginPath();
        ctx.moveTo(cx + triR,       cy);
        ctx.lineTo(cx - triR * 0.6, cy - triR * 0.9);
        ctx.lineTo(cx - triR * 0.6, cy + triR * 0.9);
        ctx.closePath();
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
    }

    /** Gold 4-pointed star with glow. Drawn before the numbered circle for the final stop. */
    static _drawEndMarker(ctx, cx, cy, tileWidthPx, cfg) {
        const starR = tileWidthPx * cfg.endMarkerStarSize;

        ctx.save();
        ctx.globalAlpha = 1;

        // Gold glow halo
        const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, starR * 1.8);
        glowGrad.addColorStop(0, `rgba(255,215,0,${cfg.endMarkerGlowAlpha})`);
        glowGrad.addColorStop(1, 'rgba(255,215,0,0)');
        ctx.beginPath();
        ctx.arc(cx, cy, starR * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // 4-pointed gold star
        SharePathRenderer._drawStar(ctx, cx, cy, starR, 4, '#FFD700', '#FFF8DC');

        ctx.restore();
    }

    /** Dark circle with purple border and a white move number centered inside. */
    static _drawStopNumber(ctx, cx, cy, num, tileWidthPx, cfg) {
        const r        = tileWidthPx * cfg.stopMarkerRadius;
        const fontSize = Math.round(r * 2 * cfg.stopMarkerFontRatio);

        ctx.save();
        ctx.globalAlpha = 1;

        // Filled background circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = cfg.stopMarkerFill;
        ctx.fill();

        // Colored border
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = cfg.stopMarkerBorder;
        ctx.lineWidth   = cfg.stopMarkerBorderWidth;
        ctx.stroke();

        // Move number
        ctx.font         = `bold ${fontSize}px Arial, sans-serif`;
        ctx.fillStyle    = cfg.stopMarkerTextColor;
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(num), cx, cy);

        ctx.restore();
    }

    /**
     * Draws faint column (A, B, C…) and row (1, 2, 3…) labels in the padding area.
     * Color is extremely subtle so they don't compete with the path.
     */
    static _drawGridCoordinates(ctx, gridMapping, cfg) {
        const { orthoLeft, orthoRight, orthoTop, orthoBottom, tileWidthPx, worldToPixel } = gridMapping;

        // Derive grid dimensions from ortho bounds (orthoLeft = -pad, orthoTop = gd+pad-1)
        const gw = gridMapping.gridWidth  || Math.round(orthoRight + 1 + orthoLeft);
        const gd = gridMapping.gridDepth  || Math.round(orthoTop   + 1 + orthoBottom);

        const fontSize = Math.round(tileWidthPx * cfg.gridCoordinateFontRatio);
        if (fontSize < 1 || gw < 1 || gd < 1) return;

        const labels = cfg.gridCoordinateColumnLabels;

        ctx.save();
        ctx.fillStyle    = cfg.gridCoordinateColor;
        ctx.globalAlpha  = 1;
        ctx.font         = `${fontSize}px Arial, sans-serif`;

        // Column labels (A, B, C…) centered above each column
        // z = gd - 0.5 places the label 0.5 tiles above the top row center, inside the top padding
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        for (let x = 0; x < gw && x < labels.length; x++) {
            const pt = worldToPixel(x, gd - 0.5);
            ctx.fillText(labels[x], pt.px, pt.py);
        }

        // Row labels (1, 2, 3…) centered in the left padding beside each row
        // Row 1 = top of grid (z = gd-1), row 2 = z = gd-2, etc.
        // x = -0.5 places the label 0.5 tiles left of column A center, inside the left padding
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        for (let row = 0; row < gd; row++) {
            const worldZ = gd - 1 - row;
            const pt     = worldToPixel(-0.5, worldZ);
            ctx.fillText(String(cfg.gridCoordinateRowStart + row), pt.px, pt.py);
        }

        ctx.restore();
    }

    static _drawFadeSegment(ctx, start, end, color, cfg, tileWidthPx) {
        const fadeStart = 1 - cfg.fadeOutRatio;
        const midX = start.px + (end.px - start.px) * fadeStart;
        const midY = start.py + (end.py - start.py) * fadeStart;

        // Solid portion
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(start.px, start.py);
        ctx.lineTo(midX, midY);
        ctx.stroke();

        // Fading portion
        const grad = ctx.createLinearGradient(midX, midY, end.px, end.py);
        grad.addColorStop(0, color);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(midX, midY);
        ctx.lineTo(end.px, end.py);
        ctx.stroke();
    }

    static _drawArrowhead(ctx, start, end, color, size) {
        const dx = end.px - start.px;
        const dy = end.py - start.py;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.1) return;
        const ux = dx / len;
        const uy = dy / len;
        const tipX  = end.px;
        const tipY  = end.py;
        const baseX = tipX - ux * size;
        const baseY = tipY - uy * size;
        const perpX = -uy * size * 0.55;
        const perpY =  ux * size * 0.55;
        ctx.save();
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(baseX + perpX, baseY + perpY);
        ctx.lineTo(baseX - perpX, baseY - perpY);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    static _drawStar(ctx, cx, cy, radius, points, fillColor, glowColor) {
        const outerR = radius;
        const innerR = radius * 0.45;
        // Glow
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerR * 2);
        grd.addColorStop(0, "rgba(255,215,0,0.5)");
        grd.addColorStop(1, "rgba(255,215,0,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, outerR * 2, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        // Star shape
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    static _sameDirection(segA, segB) {
        if (!segA || !segB) return false;
        const dxA = segA.end.px - segA.start.px;
        const dyA = segA.end.py - segA.start.py;
        const dxB = segB.end.px - segB.start.px;
        const dyB = segB.end.py - segB.start.py;
        const horizA = Math.abs(dxA) > Math.abs(dyA);
        const horizB = Math.abs(dxB) > Math.abs(dyB);
        if (horizA !== horizB) return false;
        if (horizA) return Math.sign(dxA) === Math.sign(dxB);
        return Math.sign(dyA) === Math.sign(dyB);
    }

    static _interpolateColor(colorA, colorB, t) {
        const [rA, gA, bA] = SharePathRenderer._hexToRgb(colorA);
        const [rB, gB, bB] = SharePathRenderer._hexToRgb(colorB);
        const r = Math.round(rA + (rB - rA) * t);
        const g = Math.round(gA + (gB - gA) * t);
        const b = Math.round(bA + (bB - bA) * t);
        return `rgb(${r},${g},${b})`;
    }

    static _hexToRgb(hex) {
        const c = hex.replace("#", "");
        return [
            parseInt(c.substring(0, 2), 16),
            parseInt(c.substring(2, 4), 16),
            parseInt(c.substring(4, 6), 16),
        ];
    }
}

window.SharePathRenderer = SharePathRenderer;
