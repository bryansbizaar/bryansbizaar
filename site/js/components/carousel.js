// /js/components/carousel.js
// Shared carousel component that preserves your exact design and functionality

export function createCarousel(container, options = {}) {
  const { images = [], interval = 9500, autoplay = true } = options;

  if (!images.length) return null;

  // Create carousel HTML structure - your exact original structure
  const carouselHTML = `
        <div class="carousel-container">
            ${images
              .map(
                (image, index) => `
                <div class="carousel-slide" ${
                  index === 0 ? 'style="opacity: 1;"' : ""
                }>
                    <img src="${image}" alt="Image ${index + 1}" ${
                  index > 0 ? 'loading="lazy"' : ""
                } />
                </div>
            `
              )
              .join("")}
        </div>
    `;

  container.innerHTML = carouselHTML;

  // Your exact original carousel logic preserved
  const slides = container.querySelectorAll(".carousel-slide");
  let currentSlide = 0;
  let intervalId = null;

  // Show first slide initially
  if (slides[0]) {
    slides[0].classList.add("active");
  }

  function preloadNextImage() {
    // Calculate next slide index
    const nextIndex = (currentSlide + 1) % slides.length;
    // Find the image in the next slide
    const nextImage = slides[nextIndex]?.querySelector("img");
    // Trigger load if it hasn't loaded yet
    if (nextImage && !nextImage.complete) {
      nextImage.src = nextImage.src;
    }
  }

  function nextSlide() {
    // Remove active class from current slide and add prev class
    slides[currentSlide].classList.remove("active");
    slides[currentSlide].classList.add("prev");

    // Calculate next slide index
    currentSlide = (currentSlide + 1) % slides.length;

    // Add active class to next slide
    slides[currentSlide].classList.add("active");

    // Preload next image
    preloadNextImage();

    // Clean up prev class after transition
    setTimeout(() => {
      slides.forEach((slide, index) => {
        if (index !== currentSlide) {
          slide.classList.remove("prev");
        }
      });
    }, 2000);
  }

  // Start the carousel if autoplay is enabled
  if (autoplay && slides.length > 1) {
    intervalId = setInterval(nextSlide, interval);
  }

  // Return carousel controller for external control if needed
  return {
    next: nextSlide,
    stop: () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    start: () => {
      if (!intervalId && autoplay && slides.length > 1) {
        intervalId = setInterval(nextSlide, interval);
      }
    },
    getCurrentSlide: () => currentSlide,
    getTotalSlides: () => slides.length,
  };
}

// Utility function to add carousel CSS if not already present
export function ensureCarouselStyles() {
  if (document.getElementById("carousel-styles")) return;

  const styles = document.createElement("style");
  styles.id = "carousel-styles";
  styles.textContent = `
        /* Your exact carousel styles preserved */
        .carousel-container {
            position: relative;
            width: 100%;
            height: 100vh;
            overflow: hidden;
        }

        .carousel-slide {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 2s ease-in-out;
        }

        .carousel-slide.active {
            opacity: 1;
        }

        .carousel-slide.prev {
            opacity: 0;
        }

        .carousel-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    `;

  document.head.appendChild(styles);
}
