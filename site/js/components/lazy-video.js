// /js/components/lazy-video.js
// Lazy loading component for YouTube videos to improve page performance

export function initLazyVideos() {
  const videoElements = document.querySelectorAll(".video-embed-loading");

  if (!videoElements.length) return;

  // Convert all video placeholders to thumbnail format
  videoElements.forEach((element) => {
    createVideoThumbnail(element);
  });

  // Create intersection observer for automatic loading of first video in each section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Auto-load first video in each section for better UX
          const container = entry.target.closest(".container");
          const firstVideo = container?.querySelector(".video-thumbnail-container");
          if (firstVideo === entry.target) {
            // Auto-load after a short delay to let thumbnails show first
            setTimeout(() => loadVideo(entry.target), 1000);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "50px",
    }
  );

  // Observe first video in each section for auto-loading
  const containers = document.querySelectorAll(".container");
  containers.forEach((container) => {
    const firstVideo = container.querySelector(".video-thumbnail-container");
    if (firstVideo) {
      observer.observe(firstVideo);
    }
  });
}

function loadVideo(element) {
  const videoId = element.dataset.videoId;

  if (!videoId) {
    console.warn("No video ID found for element:", element);
    return;
  }

  // Create YouTube iframe with your exact original attributes
  const iframeHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
        </iframe>
    `;

  // Fade out loading state and fade in iframe
  element.style.transition = "opacity 0.3s ease-in-out";
  element.style.opacity = "0";

  setTimeout(() => {
    element.outerHTML = iframeHTML;
  }, 300);
}

// Function to create thumbnail-based loading
export function createVideoThumbnail(element) {
  const videoId = element.dataset.videoId;

  if (!videoId) return;

  // Create thumbnail with play button overlay and title
  const thumbnailHTML = `
    <div class="video-thumbnail" data-video-id="${videoId}">
      <img src="https://img.youtube.com/vi/${videoId}/maxresdefault.jpg" 
           alt="Video thumbnail" 
           loading="lazy" />
      <div class="play-button-overlay">
        <div class="play-button">▶</div>
      </div>
      <div class="video-title-overlay">
        <div class="video-title">Loading title...</div>
      </div>
    </div>
  `;

  element.innerHTML = thumbnailHTML;
  element.classList.remove("video-embed-loading");
  element.classList.add("video-thumbnail-container");

  // Fetch video title from YouTube API (optional - we can also use a manual mapping)
  fetchVideoTitle(videoId).then(title => {
    const titleElement = element.querySelector('.video-title');
    if (titleElement && title) {
      titleElement.textContent = title;
    }
  }).catch(() => {
    // Fallback to a generic title if API fails
    const titleElement = element.querySelector('.video-title');
    if (titleElement) {
      titleElement.textContent = 'Bryan Owens Performance';
    }
  });

  // Add click handler
  element.addEventListener("click", () => {
    loadVideo(element);
  });
}

// Utility function to pause all playing videos (useful for navigation)
export function pauseAllVideos() {
  const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');

  iframes.forEach((iframe) => {
    try {
      // Pause video by reloading iframe
      const src = iframe.src;
      iframe.src = src.replace("autoplay=1", "autoplay=0");
    } catch (e) {
      console.warn("Could not pause video:", e);
    }
  });
}

// Function to load videos in a specific section
export function loadSectionVideos(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const videoElements = section.querySelectorAll(".video-embed-loading");
  videoElements.forEach((element) => {
    loadVideo(element);
  });
}

// Function to fetch video title (using YouTube's oEmbed API - no API key required)
async function fetchVideoTitle(videoId) {
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (response.ok) {
      const data = await response.json();
      return data.title;
    }
  } catch (error) {
    console.warn('Could not fetch video title:', error);
  }
  return null;
}
