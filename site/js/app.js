// Main Application JavaScript
class BryanOwensApp {
  constructor() {
    this.currentSection = "home";
    this.carouselInstances = new Map();
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupCarousels();
    this.handleInitialRoute();
    this.setupMobileNav();
  }

  // Navigation System
  setupNavigation() {
    const navLinks = document.querySelectorAll("nav a[data-section]");

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const section = link.getAttribute("data-section");
        this.navigateToSection(section);
        this.closeMobileNav();
      });
    });

    // Handle browser back/forward buttons
    window.addEventListener("popstate", (e) => {
      const section = e.state?.section || "home";
      this.showSection(section, false);
    });
  }

  navigateToSection(section) {
    this.showSection(section, true);

    // Update URL without page reload
    const url = section === "home" ? "#" : `#${section}`;
    history.pushState({ section }, "", url);
  }

  showSection(section, updateCarousel = true) {
    // Stop all currently running carousels
    this.carouselInstances.forEach((carousel) => {
      carousel.stop();
    });

    // Hide all sections
    const sections = document.querySelectorAll(".page-section");
    sections.forEach((s) => s.classList.remove("active"));

    // Show target section
    const targetSection = document.getElementById(section);
    if (targetSection) {
      targetSection.classList.add("active");
      this.currentSection = section;

      // Update header styling based on section
      this.updateHeaderStyling(section);

      // Update active nav link
      this.updateActiveNavLink(section);

      // Reset and start carousel for this section if needed
      if (updateCarousel && this.carouselInstances.has(section)) {
        const carousel = this.carouselInstances.get(section);
        carousel.reset(); // Reset to first slide
        carousel.start(); // Start the carousel
      }
    }
  }

  updateHeaderStyling(section) {
    const body = document.body;
    if (section === "home") {
      body.classList.remove("show-header-bg");
    } else {
      body.classList.add("show-header-bg");
    }
  }

  updateActiveNavLink(section) {
    const navLinks = document.querySelectorAll("nav a[data-section]");
    navLinks.forEach((link) => {
      if (link.getAttribute("data-section") === section) {
        link.style.color = "var(--link-hover)";
      } else {
        link.style.color = "";
      }
    });
  }

  handleInitialRoute() {
    const hash = window.location.hash.substring(1);
    const section = hash || "about";
    this.showSection(section);
  }

  // Mobile Navigation
  setupMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    const navToggleLabel = document.querySelector(".nav-toggle-label");

    if (navToggleLabel && navToggle) {
      navToggleLabel.addEventListener("click", (e) => {
        e.preventDefault();
        navToggle.checked = !navToggle.checked;
      });
    } else {
      console.error('Mobile nav elements not found:', {
        navToggle: !!navToggle,
        navToggleLabel: !!navToggleLabel
      });
    }
  }

  closeMobileNav() {
    const navToggle = document.getElementById("nav-toggle");
    if (navToggle) {
      navToggle.checked = false;
    }
  }

  // Carousel System
  setupCarousels() {
    // Only sections with carousels: about, music, video (not home)
    const sections = ["about", "music", "video"];

    sections.forEach((section) => {
      const carousel = new ImageCarousel(section);
      this.carouselInstances.set(section, carousel);
    });

    // Start carousel for initial section if it has one
    if (this.carouselInstances.has(this.currentSection)) {
      const carousel = this.carouselInstances.get(this.currentSection);
      carousel.reset();
      carousel.start();
    }
  }
}

// Image Carousel Class
class ImageCarousel {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.section = document.getElementById(sectionId);
    this.slides = this.section?.querySelectorAll(".carousel-slide") || [];
    this.currentSlide = 0;
    this.slideInterval = 9500; // 9.5 seconds
    this.intervalId = null;
    this.isActive = false;

    if (this.slides.length > 0) {
      this.init();
    }
  }

  init() {
    // Reset all slides to initial state
    this.reset();
    // Preload images for better performance
    this.preloadImages();
  }

  reset() {
    // Stop any running carousel
    this.stop();

    // Reset current slide to 0
    this.currentSlide = 0;

    // Remove all classes from all slides
    this.slides.forEach((slide) => {
      slide.classList.remove("active", "prev");
    });

    // Show first slide if it exists
    if (this.slides[0]) {
      this.slides[0].classList.add("active");
    }
  }

  start() {
    if (this.isActive || this.slides.length <= 1) return;

    this.isActive = true;
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, this.slideInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isActive = false;
  }

  nextSlide() {
    if (this.slides.length <= 1) return;

    // Remove active class from current slide and add prev class
    this.slides[this.currentSlide].classList.remove("active");
    this.slides[this.currentSlide].classList.add("prev");

    // Calculate next slide index
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;

    // Add active class to next slide
    this.slides[this.currentSlide].classList.add("active");

    // Preload next image
    this.preloadNextImage();

    // Clean up prev class after transition
    setTimeout(() => {
      this.slides.forEach((slide, index) => {
        if (index !== this.currentSlide) {
          slide.classList.remove("prev");
        }
      });
    }, 2000);
  }

  preloadImages() {
    this.slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img && img.loading === "lazy") {
        // Create a new image to trigger loading
        const preloadImg = new Image();
        preloadImg.src = img.src;
      }
    });
  }

  preloadNextImage() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length;
    const nextImage = this.slides[nextIndex]?.querySelector("img");

    if (nextImage && !nextImage.complete) {
      const preloadImg = new Image();
      preloadImg.src = nextImage.src;
    }
  }
}

// Utility Functions
const utils = {
  // Smooth scroll to element
  scrollToElement(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  },

  // Debounce function for performance
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Check if element is in viewport
  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.bryanApp = new BryanOwensApp();
});

// Handle window resize for responsive adjustments
window.addEventListener(
  "resize",
  utils.debounce(() => {
    // Add any resize handling logic here if needed
    console.log("Window resized");
  }, 250)
);
