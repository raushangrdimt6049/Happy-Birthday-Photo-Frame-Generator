# 🎁 Live Photo Frame Generator

An interactive, responsive digital picture frame web application with real-time customization, live calligraphy, and Full HD / 4K export.

## ✨ Features

- **Desktop Side-by-Side Studio & Frame View**:
  - On desktop screens (>= 1024px), the **✨ Live Customizer (Customize Photo Frame)** studio panel and the **Photo Frame** render side by side in a synchronized creative workstation.
  - **Identical Matching Container Dimensions**: Both the studio container and the photo frame container share the exact same width and height (`--box-w` and `--box-h`), automatically calculated from viewport height and the active aspect ratio.
  - **Zero Outer Screen Scroll**: The desktop viewport fits cleanly within the screen without page scrollbars (`overflow: hidden`), while studio controls scroll smoothly within their internal panel.
  - Every adjustment made in the studio (Date of birth, photos, quotes, fonts, ribbons, greetings) updates the photo frame live in real time right beside your controls.
- **Customization Studio (Uploads & Settings)**:
  - **All Asset Uploads & Changes Handled Exclusively via Studio**: All photo uploads, ribbons, emblems, and text edits are centralized in the studio tabs, ensuring that clicking or double-tapping on the frame never accidentally opens native folder upload dialogs.
  - **📐 Frame Size & Ratio**: Choose from 10 popular print and digital aspect ratios:
    - **A4 International** (210 × 297 mm, 1240 × 1754 HD / 2480 × 3508 300 DPI)
    - **A3 Wall Poster** (297 × 420 mm, 1754 × 2480 HD / 3508 × 4960 300 DPI)
    - **A5 Compact** (148 × 210 mm, 874 × 1240 HD / 1748 × 2480 300 DPI)
    - **3:4 Standard Portrait** (1080 × 1440 HD / 2160 × 2880 4K)
    - **3:5 Tall Slim Gallery** (900 × 1500 HD / 1800 × 3000 4K)
    - **5:7 Classic Photo Frame** (1071 × 1500 HD / 2143 × 3000 4K)
    - **4:5 (8" × 10") Frame** (1200 × 1500 HD / 2400 × 3000 4K)
    - **2:3 (4" × 6") Frame** (1000 × 1500 HD / 2000 × 3000 4K)
    - **1:1 Square Art Tile** (1200 × 1200 HD / 2400 × 2400 4K)
    - **Original Master** (1092 × 1440 HD / 2184 × 2880 4K)
    - Seamless live preview resizing and native canvas HD/4K rendering for every ratio.
  - **Date of Birth**:
    - Smart numeric inputs restricted to 2 digits for Date (1-31), 2 digits for Month (1-12), and 4 digits for Year.
    - **Month Position & Dove Gap Control**: Fine-tune the horizontal position of the month name on the golden banner (26% to 46% slider with live value badge, stepper buttons, and quick preset chips: *Closer Gap (30%)*, *Balanced Gap (32%)*, *Spacious Gap (35%)*, *Centered (40%)*), ensuring a tasteful and distinct gap from the dove.
    - Automatically updates the month title, recalculates the calendar weekdays, and places the 3D glossy red heart badge on the birthday day. Customized with precision exclusively from the Live Customizer.
  - **Quotes**: Live text editor with adjustable font size slider (11px to 22px) and romantic presets.
  - **Greetings**: Live calligraphy editor in flowing *Great Vibes* script with dedicated font size slider (20px to 48px) and custom recipient names.
  - **Main Pic**: Upload a custom photo for the center portrait with automatic aspect ratio fitting and live preview.
  - **All Side Photos (6 Gallery Photos)**: Batch upload up to 6 photos simultaneously or customize each slot individually.
  - **Heart Ribbon**: Upload custom romantic artwork or graphics.
  - **Forever Love Emblem**: Upload custom infinity emblem or artwork.
  - **Reset All**: Revert back to the default template anytime with one click.
- **Interactive Element Drag, Nudge & Zoom (Double-Tap / Double-Click)**:
  - **Unified Whole Calendar Selection**:
    - **Birthday Calendar** (`calendarSection`): Double-tap anywhere on the calendar to select, move, scale, or reset the entire calendar (Dove artwork, Month title, Weekday initials, Dates grid, and 3D Heart badge) together in complete visual harmony.
  - **Separately Selectable 6 Gallery Photos**:
    - All 6 photos in the gallery collage (`gallerySlot1` through `gallerySlot6`) can be double-tapped individually to reposition and zoom each photo independently!
  - **Quotes & Calligraphy Greetings**:
    - Fully selectable on double-tap with preserved cursive centering and live repositioning/zooming.
  - **Double-Tap / Double-Click Any of 18 Elements**: Select any element to enter live transform mode with a glowing golden outline.
  - **🖱️ Mouse / Pointer Drag**: Smoothly drag and reposition the active element anywhere inside the frame.
  - **⌨️ Keyboard Arrow Nudge**: Use `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown` to nudge the element pixel-by-pixel (hold `Shift` for faster 10px steps).
  - **🔍 Mouse Scroll Wheel Zoom**: Scroll up to zoom in (+5%), scroll down to zoom out (-5%) with live scale display (30% to 300%).
  - **⌨️ Keyboard Scale**: Press `+` or `=` to zoom in, `-` or `_` to zoom out, and `0` to reset to 100%.
  - **✌️ Touch Screen 2-Finger Pinch**: Natural two-finger pinch-to-zoom on phones, iPads, and touch displays.
  - **Floating Glassmorphic HUD Bar**: Displays element name, live zoom badge, `−` / `+` steppers, `↺ Reset` button, and `✓ Done` button. Press `Esc` or click outside to finish.
  - **100% Canvas HD/4K Export Integration**: Custom positions and zoom levels for all 18 elements are preserved identically in downloaded Full HD and 4K PNG/JPEG files!
- **Full HD & 4K Download Exporter**:
  - Download modal with format selection: **PNG (Lossless Full HD)** or **JPEG (Ultra HD 1080p — 95% Quality)**.
  - Aspect Ratio selection directly within the download modal with dynamic resolution preview pills.
  - Style selection: With authentic carved wooden picture frame or borderless inner canvas.
  - Resolution selector: Full HD (1080p) or Ultra HD 4K (300 DPI print quality).
  - 100% offline & CORS-safe canvas compositor with Base64 asset fallback (`assets-base64.js`).
- **Authentic Carved Wood Frame**: High-resolution wooden picture frame with multiple frame modes (Wood Frame, Modern Bevel, Frameless).
- **Ambient Lighting & View Modes**: Atmospheric gallery spotlight toggle and screen fitting controls.
- **Lightbox Preview**: Click on studio photo cards to zoom and preview in high resolution.

## 🚀 Getting Started

1. Open [index.html](file:///c:/Users/Raushan_143/Pictures/Photo%20Frame/index.html) directly in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Choose your preferred frame aspect ratio (A4, A3, 3:4, 3:5, 5:7, etc.) from the top toolbar or the Frame Size tab.
3. Customize any photo, date, quote, greeting font size, or month position using the studio bar above the frame or by clicking directly on the frame elements.
4. Click **"Download HD"** to export your customized photo frame as Full HD PNG or JPEG in your chosen aspect ratio!

## 🛠️ Built With

- Semantic HTML5
- Vanilla CSS3 (Container queries, flexbox, CSS grid, glassmorphism)
- Vanilla JavaScript (HTML5 Canvas HD Compositor, FileReader API)
- Google Fonts (*Great Vibes*, *Playfair Display*, *Lora*, *Montserrat*, *Inter*)
