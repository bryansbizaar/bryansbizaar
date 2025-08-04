// /js/components/lazy-media.js
// Lazy loading component for music embeds to improve page performance

export function initLazyMedia() {
  const embedElements = document.querySelectorAll(".music-embed-loading");

  if (!embedElements.length) return;

  // Create intersection observer for lazy loading
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadEmbed(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "100px", // Start loading 100px before element comes into view
    }
  );

  // Observe all embed elements
  embedElements.forEach((element) => {
    observer.observe(element);
  });
}

function loadEmbed(element) {
  const embedType = element.dataset.embedType;
  const embedSrc = element.dataset.embedSrc;

  if (!embedSrc) return;

  let iframeHTML = "";

  switch (embedType) {
    case "spotify":
      iframeHTML = `
                <iframe
                    class="spotify"
                    style="border-radius: 12px"
                    src="${embedSrc}"
                    width="100%"
                    height="400"
                    frameborder="0"
                    allowfullscreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy">
                </iframe>
            `;
      break;

    case "soundcloud":
      iframeHTML = `
                <iframe
                    width="100%"
                    height="400"
                    scrolling="no"
                    frameborder="no"
                    allow="autoplay"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    loading="lazy"
                    src="${embedSrc}">
                </iframe>
            `;
      break;

    case "bandcamp":
      iframeHTML = `
                <iframe
                    src="${embedSrc}"
                    seamless
                    width="100%"
                    height="400"
                    loading="lazy">
                    <a href="https://ninalane.bandcamp.com/">Nina Lane on Bandcamp</a>
                </iframe>
            `;
      break;

    case "youtube":
      iframeHTML = `
                <iframe
                    src="${embedSrc}"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            `;
      break;

    default:
      console.warn("Unknown embed type:", embedType);
      return;
  }

  // Fade out loading state and fade in iframe
  element.style.transition = "opacity 0.3s ease-in-out";
  element.style.opacity = "0";

  setTimeout(() => {
    element.innerHTML = iframeHTML;
    element.style.opacity = "1";
    element.classList.remove("music-embed-loading");
    element.classList.add("music-embed-loaded");
  }, 300);
}

// Utility function to preload critical embeds (above the fold)
export function preloadCriticalEmbeds(selector = ".music-embed-loading") {
  const criticalEmbeds = document.querySelectorAll(
    `${selector}:nth-child(-n+2)`
  );

  criticalEmbeds.forEach((element) => {
    // Load first 2 embeds immediately for better perceived performance
    setTimeout(() => loadEmbed(element), 100);
  });
}

// Function to pause all currently playing media (useful for navigation)
export function pauseAllMedia() {
  const iframes = document.querySelectorAll(
    'iframe[src*="spotify"], iframe[src*="soundcloud"], iframe[src*="youtube"]'
  );

  iframes.forEach((iframe) => {
    // For Spotify and other embeds that support postMessage
    try {
      iframe.contentWindow.postMessage('{"method":"pause"}', "*");
    } catch (e) {
      // Fallback: reload iframe to stop playback
      const src = iframe.src;
      iframe.src = "";
      setTimeout(() => {
        iframe.src = src;
      }, 100);
    }
  });
}
