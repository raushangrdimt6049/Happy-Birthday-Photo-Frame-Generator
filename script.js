/**
 * Happy Birthday Nandini — Photo Frame Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const frameContainer = document.getElementById('frameContainer');
    const btnToggleFrame = document.getElementById('btnToggleFrame');
    const frameModeText = document.getElementById('frameModeText');
    const btnToggleLight = document.getElementById('btnToggleLight');
    const btnToggleZoom = document.getElementById('btnToggleZoom');
    const zoomText = document.getElementById('zoomText');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // 1. Frame Style Cycling: Wood -> Sleek -> Frameless
    const frameStyles = ['wood', 'sleek', 'none'];
    const frameLabels = ['Wood Frame', 'Modern Bevel', 'Frameless'];
    let currentStyleIndex = 0;

    btnToggleFrame.addEventListener('click', () => {
        currentStyleIndex = (currentStyleIndex + 1) % frameStyles.length;
        
        // Remove all style classes
        frameStyles.forEach(style => {
            frameContainer.classList.remove(`frame-style-${style}`);
        });

        // Add new style class
        const nextStyle = frameStyles[currentStyleIndex];
        frameContainer.classList.add(`frame-style-${nextStyle}`);
        frameModeText.textContent = frameLabels[currentStyleIndex];
    });

    // 2. Ambient Lighting Toggle
    btnToggleLight.addEventListener('click', () => {
        document.body.classList.toggle('spotlight-off');
    });

    // 3. Zoom / Fit View Toggle
    let isFullView = false;
    btnToggleZoom.addEventListener('click', () => {
        isFullView = !isFullView;
        document.body.classList.toggle('view-full', isFullView);
        zoomText.textContent = isFullView ? 'Actual Size' : 'Fit Screen';
    });

    // 4. Lightbox for Photo Previews
    const clickablePhotos = document.querySelectorAll('.gallery-cell, .item-couple');

    clickablePhotos.forEach(cell => {
        cell.addEventListener('click', () => {
            const img = cell.querySelector('img');
            if (img && lightboxModal) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt || 'Photo Preview';
                if (typeof lightboxModal.showModal === 'function') {
                    lightboxModal.showModal();
                } else {
                    lightboxModal.setAttribute('open', 'true');
                }
            }
        });
    });

    // Close Lightbox
    const closeLightbox = () => {
        if (typeof lightboxModal.close === 'function') {
            lightboxModal.close();
        } else {
            lightboxModal.removeAttribute('open');
        }
    };

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.open) {
            closeLightbox();
        }
    });
});
