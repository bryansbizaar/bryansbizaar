// /js/components/header.js
// Shared header component that preserves your exact design and functionality

export function createHeader(container) {
  const headerHTML = `
        <div class="name-tag">
            <h1 class="name">
                <a href="../index.html">Bryan Owens</a>
            </h1>
            <h2 class="tag">Multi-instrumentalist</h2>
        </div>
        <div>
            <input type="checkbox" id="nav-toggle" class="nav-toggle" />
            <nav>
                <ul>
                    <li><a href="about.html">About</a></li>
                    <li><a href="music.html">Music</a></li>
                    <li><a href="video.html">Video</a></li>
                    <li>
                        <a href="https://www.facebook.com/bryansbizaar" target="_blank">
                            <img src="../pics/facebook.png" alt="facebook logo" width="17" height="17" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/@BryansBizaar/playlists" target="_blank">
                            <img src="../pics/youtube.png" alt="youtube logo" width="16" height="16" />
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div>
            <label for="nav-toggle" class="nav-toggle-label">
                <span></span>
            </label>
        </div>
    `;

  container.innerHTML = headerHTML;

  // Initialize mobile navigation - minimal JavaScript, CSS handles everything else
  const navToggleLabel = container.querySelector(".nav-toggle-label");
  const navToggle = container.querySelector("#nav-toggle");

  if (navToggleLabel && navToggle) {
    navToggleLabel.addEventListener("click", function (e) {
      e.preventDefault();
      navToggle.checked = !navToggle.checked;
    });
  }
}

// Alternative version for landing page (with different styling)
export function createLandingHeader(container) {
  const headerHTML = `
        <div class="name-tag">
            <h1 class="name">Bryan Owens</h1>
            <h2 class="tag">Multi-instrumentalist</h2>
        </div>
        <div>
            <input type="checkbox" id="nav-toggle" class="nav-toggle" />
            <nav>
                <ul>
                    <li><a href="site/">About</a></li>
                    <li><a href="site/#music">Music</a></li>
                    <li><a href="site/#video">Video</a></li>
                    <li>
                        <a href="https://www.facebook.com/bryansbizaar" target="_blank">
                            <img src="pics/facebook.png" alt="facebook logo" width="17" height="17" />
                        </a>
                    </li>
                    <li>
                        <a href="https://www.youtube.com/@BryansBizaar/playlists" target="_blank">
                            <img src="pics/youtube.png" alt="youtube logo" width="16" height="16" />
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        <div>
            <label for="nav-toggle" class="nav-toggle-label">
                <span></span>
            </label>
        </div>
    `;

  container.innerHTML = headerHTML;

  // Initialize mobile navigation
  const navToggleLabel = container.querySelector(".nav-toggle-label");
  const navToggle = container.querySelector("#nav-toggle");

  if (navToggleLabel && navToggle) {
    navToggleLabel.addEventListener("click", function () {
      navToggle.checked = !navToggle.checked;
    });
  }
}
