/* Floating bot: embedded 3D model, works offline and on GitHub Pages */
(function () {
  const links = [
    'https://github.com',
    'https://stackoverflow.com',
    'https://wikipedia.org',
    'https://developer.mozilla.org',
    'https://www.freecodecamp.org'
  ];

  function pickRandom() {
    return links[Math.floor(Math.random() * links.length)];
  }

  function openRandom() {
    const url = pickRandom();
    try {
      window.open(url, '_blank', 'noopener');
    } catch (e) {
      window.location.href = url;
    }
  }

  function setFallbackGraphic(bot) {
    const svg = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <circle cx="50" cy="50" r="48" fill="#f7f5f0" stroke="#1a1a1a" stroke-width="2" />
        <g transform="translate(28,30)" fill="#1a1a1a">
          <rect x="10" y="0" width="24" height="18" rx="3" />
          <rect x="4" y="20" width="36" height="22" rx="4" />
          <circle cx="14" cy="8" r="3" fill="#f7f5f0" />
          <circle cx="30" cy="8" r="3" fill="#f7f5f0" />
        </g>
      </svg>`;
    bot.innerHTML = svg;
    bot.style.display = 'flex';
  }

  function dataUriToBlobUrl(dataUri) {
    const comma = dataUri.indexOf(',');
    const meta = dataUri.substring(5, comma);
    const isBase64 = meta.indexOf('base64') !== -1;
    const data = dataUri.substring(comma + 1);
    let arrayBuffer;

    if (isBase64) {
      const binary = atob(data);
      const u8 = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);
      arrayBuffer = u8.buffer;
    } else {
      const str = decodeURIComponent(data);
      const u8 = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) u8[i] = str.charCodeAt(i);
      arrayBuffer = u8.buffer;
    }

    const mime = meta.split(';')[0] || 'application/octet-stream';
    return URL.createObjectURL(new Blob([arrayBuffer], { type: mime }));
  }

  function startAnimations(mv) {
    try {
      mv.setAttribute('autoplay', '');
      const animations = mv.availableAnimations || [];
      if (animations.length && !mv.animationName) {
        mv.animationName = animations[0];
      }
    } catch (e) {
      /* animation optional */
    }
  }

  function wireModelViewer(bot, mv) {
    let modelLoaded = false;
    bot.style.display = 'flex';

    function onModelReady() {
      if (modelLoaded) return;
      modelLoaded = true;
      startAnimations(mv);
    }

    mv.addEventListener('load', onModelReady);
    mv.addEventListener('error', function () {
      if (!modelLoaded) setFallbackGraphic(bot);
    });

    if (mv.loaded) {
      onModelReady();
    }
  }

  function getEmbeddedModelUri() {
    if (window.BOT_MODEL_DATA_URI) {
      return window.BOT_MODEL_DATA_URI;
    }

    const mv = document.getElementById('bot-model');
    if (!mv) return '';

    const srcVal = mv.getAttribute('src') || '';
    if (srcVal.startsWith('data:')) {
      return srcVal;
    }
    return '';
  }

  async function waitForModelViewer() {
    if (window.customElements && window.customElements.whenDefined) {
      try {
        await window.customElements.whenDefined('model-viewer');
      } catch (e) {}
    }
  }

  async function initBot() {
    const bot = document.getElementById('floating-bot');
    if (!bot) return;

    const mv = document.getElementById('bot-model');
    if (!mv) {
      setFallbackGraphic(bot);
      return;
    }

    try {
      mv.setAttribute('loading', 'eager');
      mv.setAttribute('interaction-prompt', 'none');
      mv.setAttribute('autoplay', '');
    } catch (e) {}

    const dataUri = getEmbeddedModelUri();
    if (!dataUri) {
      setFallbackGraphic(bot);
      return;
    }

    await waitForModelViewer();

    try {
      const blobUrl = dataUriToBlobUrl(dataUri);
      mv.setAttribute('src', blobUrl);
      wireModelViewer(bot, mv);
    } catch (e) {
      setFallbackGraphic(bot);
    }

    bot.setAttribute('tabindex', '0');
    bot.setAttribute('role', 'link');
    bot.addEventListener('click', function (e) {
      e.preventDefault();
      openRandom();
    });
    bot.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openRandom();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBot);
  } else {
    initBot();
  }
})();
