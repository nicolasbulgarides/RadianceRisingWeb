/**
 * ShareOutputHandler
 *
 * Stage 4 of the share image pipeline.
 * Converts the final canvas to various output formats.
 *
 * Current implementation supports clipboard copy and blob/dataURL export.
 * The share() method stubs future Capacitor Share plugin integration.
 *
 * Exposed as window.ShareOutputHandler.
 */

class ShareOutputHandler {

    static config = {
        imageFormat:  "image/png",
        imageQuality: 0.95,
        fileName:     "radiant-rays-solution.png",
    };

    /**
     * Copies the canvas to the system clipboard as a PNG image.
     * Requires a secure context (HTTPS or localhost).
     * @param {HTMLCanvasElement} canvas
     * @returns {Promise<boolean>} true on success, false on failure
     */
    static async toClipboard(canvas) {
        try {
            const blob = await ShareOutputHandler.toBlob(canvas);
            if (!blob) return false;
            const item = new ClipboardItem({ [ShareOutputHandler.config.imageFormat]: blob });
            await navigator.clipboard.write([item]);
            return true;
        } catch (err) {
            console.warn("[ShareOutputHandler] Clipboard write failed:", err);
            return false;
        }
    }

    /**
     * Converts canvas to Blob.
     * @param {HTMLCanvasElement} canvas
     * @returns {Promise<Blob|null>}
     */
    static toBlob(canvas) {
        const { imageFormat, imageQuality } = ShareOutputHandler.config;
        return new Promise((resolve) => {
            try {
                canvas.toBlob((blob) => resolve(blob), imageFormat, imageQuality);
            } catch (e) {
                console.warn("[ShareOutputHandler] toBlob failed:", e);
                resolve(null);
            }
        });
    }

    /**
     * Converts canvas to a data URL string.
     * @param {HTMLCanvasElement} canvas
     * @returns {string}
     */
    static toDataURL(canvas) {
        const { imageFormat, imageQuality } = ShareOutputHandler.config;
        return canvas.toDataURL(imageFormat, imageQuality);
    }

    /**
     * Share the image natively (future: Capacitor Share plugin / Web Share API).
     *
     * FUTURE PLAN:
     *   Capacitor:
     *     import { Share } from '@capacitor/share';
     *     // Save blob to temp file via Capacitor Filesystem, then:
     *     Share.share({ title: 'Radiant Rays', files: [tempFilePath] });
     *
     *   Web Share API (PWA):
     *     const file = new File([blob], 'radiant-rays-solution.png', { type: 'image/png' });
     *     navigator.share({ files: [file] });
     *
     * Currently falls back to clipboard copy.
     *
     * @param {HTMLCanvasElement} canvas
     * @param {Object} metadata
     * @returns {Promise<boolean>}
     */
    static async share(canvas, metadata) {
        // Try Web Share API with files if available
        if (typeof navigator.share === "function" && navigator.canShare) {
            try {
                const blob = await ShareOutputHandler.toBlob(canvas);
                if (blob) {
                    const file = new File([blob], ShareOutputHandler.config.fileName, { type: ShareOutputHandler.config.imageFormat });
                    if (navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], title: "Radiant Rays" });
                        return true;
                    }
                }
            } catch (e) {
                // Fall through to clipboard
            }
        }
        return ShareOutputHandler.toClipboard(canvas);
    }
}

window.ShareOutputHandler = ShareOutputHandler;
