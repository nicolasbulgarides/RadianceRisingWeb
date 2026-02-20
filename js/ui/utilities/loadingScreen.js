/**
 * LoadingScreen
 *
 * CSS-only loading screen. All animations are CSS keyframes running on the
 * GPU compositor thread — no canvas, no requestAnimationFrame, zero JS
 * overhead while active. This lets the level-loading await chains run
 * uninterrupted on the JS main thread on all devices including iOS Safari.
 */
class LoadingScreen {
  constructor() {
    this.isActive = false;
    this.container = null;
    this.styleElement = null;
    this.init();
  }

  init() {
    // All animation is declared in CSS keyframes so it runs on the compositor,
    // not the JS thread. lsPulse and lsFloat animate different properties
    // (opacity vs transform) so they compose cleanly on the same element.
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = `
      #loadingScreenContainer {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 9999;
        background: #050010;
        display: none;
        pointer-events: none;
        overflow: hidden;
      }

      @keyframes lsPulse {
        0%, 100% { opacity: 0.45; }
        50%       { opacity: 0.85; }
      }

      @keyframes lsFloat {
        0%, 100% { transform: translate(0px,   0px)   scale(1.00); }
        25%       { transform: translate(12px,  -18px) scale(1.15); }
        50%       { transform: translate(-10px, -26px) scale(1.05); }
        75%       { transform: translate(8px,   -12px) scale(1.20); }
      }

      @keyframes lsTextPulse {
        0%, 100% { opacity: 0.75; }
        50%       { opacity: 1.0; }
      }

      @keyframes lsSpin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      .ls-orb {
        position: absolute;
        border-radius: 50%;
        will-change: transform, opacity;
      }

      #loadingText {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-family: Arial, sans-serif;
        font-size: 2.5em;
        font-weight: bold;
        color: #fff;
        letter-spacing: 0.1em;
        text-shadow: 0 0 20px rgba(255,255,255,0.7), 0 0 40px rgba(180,0,255,0.4);
        z-index: 10000;
        pointer-events: none;
        animation: lsTextPulse 2.5s ease-in-out infinite;
        will-change: opacity;
      }

      #lsSpinner {
        position: absolute;
        top: calc(50% + 55px);
        left: 50%;
        margin-left: -18px;
        width: 36px; height: 36px;
        border: 3px solid rgba(255,255,255,0.15);
        border-top-color: rgba(255,255,255,0.85);
        border-radius: 50%;
        animation: lsSpin 0.9s linear infinite;
        will-change: transform;
      }
    `;
    document.head.appendChild(this.styleElement);

    this.container = document.createElement('div');
    this.container.id = 'loadingScreenContainer';

    // Ambient glow orbs — CSS radial-gradient backgrounds, no canvas, no blur filter.
    // Each orb pulses (opacity) and floats (transform) independently via separate
    // keyframe animations on different CSS properties.
    const orbDefs = [
      { color: 'rgba(255,0,150,0.45)',  size: 380, top: '18%', left: '12%', pulse: '4.2s', float: '7.1s', delay: '0s'    },
      { color: 'rgba(0,220,255,0.35)',  size: 320, top: '65%', left: '72%', pulse: '3.8s', float: '8.5s', delay: '-2.1s' },
      { color: 'rgba(140,0,255,0.40)',  size: 270, top: '78%', left: '22%', pulse: '5.0s', float: '6.3s', delay: '-4.0s' },
      { color: 'rgba(255,180,0,0.30)',  size: 240, top: '12%', left: '68%', pulse: '3.5s', float: '9.0s', delay: '-1.5s' },
    ];

    orbDefs.forEach(orb => {
      const el = document.createElement('div');
      el.className = 'ls-orb';
      el.style.cssText = `
        width: ${orb.size}px;
        height: ${orb.size}px;
        top: ${orb.top};
        left: ${orb.left};
        margin-top: -${orb.size / 2}px;
        margin-left: -${orb.size / 2}px;
        background: radial-gradient(ellipse, ${orb.color} 0%, transparent 70%);
        animation: lsPulse ${orb.pulse} ease-in-out infinite ${orb.delay},
                   lsFloat  ${orb.float} ease-in-out infinite ${orb.delay};
      `;
      this.container.appendChild(el);
    });

    const loadingText = document.createElement('div');
    loadingText.id = 'loadingText';
    loadingText.textContent = 'Loading...';
    this.container.appendChild(loadingText);

    const spinner = document.createElement('div');
    spinner.id = 'lsSpinner';
    this.container.appendChild(spinner);

    document.body.appendChild(this.container);
  }

  start() {
    if (this.isActive) return;
    this.isActive = true;
    if (this.container) {
      this.container.style.display = 'block';
      this.container.style.pointerEvents = 'auto';
    }
  }

  stop() {
    if (!this.isActive) return;
    this.isActive = false;
    if (this.container) {
      this.container.style.pointerEvents = 'none';
      this.container.style.transition = 'opacity 0.1s ease-out';
      this.container.style.opacity = '0';
      setTimeout(() => {
        if (this.container) {
          this.container.style.display = 'none';
          this.container.style.opacity = '1';
          this.container.style.transition = '';
        }
      }, 100);
    }
  }

  destroy() {
    this.stop();
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
    }
  }
}
