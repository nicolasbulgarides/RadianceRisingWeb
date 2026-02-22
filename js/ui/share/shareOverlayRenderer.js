/**
 * ShareOverlayRenderer
 *
 * Stage 3 of the share image pipeline.
 * Extends the canvas height by ~17% to add a branding banner below the grid image.
 *
 * Banner contents:
 *   - "Radiant Rays" title (Cinzel or Georgia serif fallback)
 *   - Level info: constellation name, star name
 *   - Completion text (full: "Solved in X moves" | partial: "Hint: first X moves revealed ✦")
 *   - Decorative purple separator and corner stars
 *
 * NOTE: When isPartialReveal is true, the total move count is deliberately omitted from
 * the generated image to avoid leaking solution length to the recipient.
 *
 * Exposed as window.ShareOverlayRenderer.
 */

class ShareOverlayRenderer {

    static config = {
        bannerHeightRatio:    0.12,    // Refinement 5: was 0.17 — grid is the hero
        bannerGradientStart:  "#1a0a2e",
        bannerGradientEnd:    "#0a0520",
        titleFont:            "Cinzel",
        titleFallbackFont:    "Georgia, serif",
        titleColor:           "#FFFFFF",
        titleGlowColor:       "#7b4fd4",
        titleGlowBlur:        8,
        titleText:            "Radiant Rays",
        metadataColor:        "#b8a9d4",
        metadataFont:         "Raleway",
        metadataFallbackFont: "Arial, sans-serif",
        separatorColor:       "#7b4fd4",
        separatorWidth:       2,
        showDecorativeStars:  true,
    };

    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Object} metadata
     *   { starName, constellationName, moveCount, optimalMoves,
     *     heartsRemaining, movesRevealed, totalMoves, isPartialReveal }
     * @returns {HTMLCanvasElement} — new canvas with extended height
     */
    static applyOverlay(canvas, metadata) {
        const cfg = ShareOverlayRenderer.config;
        const originalW = canvas.width;
        const originalH = canvas.height;
        const bannerH   = Math.round(originalH * cfg.bannerHeightRatio);
        const totalH    = originalH + bannerH;

        // New canvas with banner extension
        const out = document.createElement("canvas");
        out.width  = originalW;
        out.height = totalH;
        const ctx = out.getContext("2d");

        // Copy grid + path image
        ctx.drawImage(canvas, 0, 0);

        // Separator line
        ctx.fillStyle = cfg.separatorColor;
        ctx.fillRect(0, originalH, originalW, cfg.separatorWidth);

        // Banner gradient
        const grad = ctx.createLinearGradient(0, originalH, 0, totalH);
        grad.addColorStop(0, cfg.bannerGradientStart);
        grad.addColorStop(1, cfg.bannerGradientEnd);
        ctx.fillStyle = grad;
        ctx.fillRect(0, originalH + cfg.separatorWidth, originalW, bannerH - cfg.separatorWidth);

        const bannerY = originalH + cfg.separatorWidth;
        const bh      = bannerH - cfg.separatorWidth;
        const cx      = originalW / 2;

        // --- Decorative corner stars ---
        if (cfg.showDecorativeStars) {
            ShareOverlayRenderer._drawSmallStar(ctx, 28, bannerY + bh * 0.5, 10, "#7b4fd4");
            ShareOverlayRenderer._drawSmallStar(ctx, originalW - 28, bannerY + bh * 0.5, 10, "#7b4fd4");
        }

        // --- Title: "Radiant Rays" ---
        // Refinement 5: reduced font size (bh*0.30 vs 0.38) to fit compact banner
        const titleSize = Math.round(bh * 0.30);
        const titleFont = `bold ${titleSize}px ${cfg.titleFont}, ${cfg.titleFallbackFont}`;

        // Purple glow pass
        ctx.save();
        ctx.font          = titleFont;
        ctx.fillStyle     = cfg.titleGlowColor;
        ctx.shadowColor   = cfg.titleGlowColor;
        ctx.shadowBlur    = cfg.titleGlowBlur * 2;
        ctx.textAlign     = "center";
        ctx.textBaseline  = "middle";
        ctx.fillText(cfg.titleText, cx, bannerY + bh * 0.27);
        ctx.restore();

        // White title
        ctx.save();
        ctx.font          = titleFont;
        ctx.fillStyle     = cfg.titleColor;
        ctx.textAlign     = "center";
        ctx.textBaseline  = "middle";
        ctx.fillText(cfg.titleText, cx, bannerY + bh * 0.27);
        ctx.restore();

        // --- Metadata ---
        // Refinement 5: tighter vertical positions (line 1 at 0.57, line 2 at 0.82 vs 0.62/0.84)
        const metaSize = Math.round(bh * 0.19);
        const metaFont = `${metaSize}px ${cfg.metadataFont}, ${cfg.metadataFallbackFont}`;
        ctx.save();
        ctx.font         = metaFont;
        ctx.fillStyle    = cfg.metadataColor;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";

        // Line 1: constellation — star
        const { starName, constellationName, moveCount, optimalMoves, movesRevealed, isPartialReveal } = metadata;
        const loc = [constellationName, starName].filter(Boolean).join(" \u2014 ");
        if (loc) {
            ctx.fillText(`\u2726 ${loc} \u2726`, cx, bannerY + bh * 0.57);
        }

        // Line 2: completion info
        let completionLine;
        if (isPartialReveal) {
            completionLine = `Hint: first ${movesRevealed} move${movesRevealed !== 1 ? "s" : ""} revealed \u2726`;
        } else {
            const isPerfectMoves = optimalMoves && moveCount === optimalMoves;
            completionLine = isPerfectMoves
                ? `Perfect: ${moveCount} move${moveCount !== 1 ? "s" : ""}`
                : `Solved in ${moveCount} move${moveCount !== 1 ? "s" : ""}`;
        }
        ctx.fillText(completionLine, cx, bannerY + bh * 0.82);

        ctx.restore();

        return out;
    }

    static _drawSmallStar(ctx, cx, cy, radius, color) {
        const points = 4;
        const outer = radius, inner = radius * 0.4;
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 4;
            const r = i % 2 === 0 ? outer : inner;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

window.ShareOverlayRenderer = ShareOverlayRenderer;
