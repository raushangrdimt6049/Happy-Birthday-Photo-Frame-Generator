/**
 * Live Photo Frame Generator — Full Controller
 * Includes Live Customizer Studio, Dynamic Calendar, Real-Time Photo/Text Editing,
 * Custom Editable Font Sizes for Quotes & Greetings, and Full HD / 4K PNG & JPEG Canvas Exporter.
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // 1. Core State
    // -------------------------------------------------------------
    const state = {
        dob: {
            year: 2024,
            month: 6, // 0-indexed: 6 = July
            day: 11,
            monthLeftPercent: 32 // Left position (32%) leaving elegant visible gap after dove (ends at 28.3%)
        },
        images: {
            mainPic: null,
            heartRibbon: null,
            foreverLove: null,
            slots: [null, null, null, null, null, null]
        },
        defaultImages: {
            mainPic: 'main_couple.png',
            heartRibbon: 'heart_ribbon.png',
            foreverLove: 'forever_love.png',
            slots: [
                'gallery_1.png',
                'gallery_2.png',
                'gallery_3.png',
                'gallery_4.png',
                'gallery_5.png',
                'gallery_6.png'
            ]
        },
        quote: {
            sparkles: '💖 ✨ ✨',
            fontSize: 19, // Default font size in px (range 11 - 28)
            lines: [
                '💫 🦋 On your special',
                'day i promise i will',
                'always stand 🦋 with',
                'u even if the ✨ whole',
                'world is against u. 🦋',
                '✨ Always there for',
                'u in your 🦋 bad and',
                'good 🦋 times. ❤️',
                "U're my ✨ happiness",
                '❤️ My 😊 smile. ❤️'
            ]
        },
        greetings: {
            line1: 'Put Your Greetings Here',
            line2: '',
            fontSize1: 44, // Default Line 1 font size in px (range 24 - 64)
            fontSize2: 52  // Default Line 2 font size in px (range 28 - 76)
        },
        frameStyle: 'wood', // 'wood' | 'sleek' | 'none'
        frameRatio: 'original', // 'original' | 'a4' | 'a3' | 'a5' | '3-4' | '3-5' | '5-7' | '4-5' | '2-3' | '1-1'
        transforms: {}, // itemId -> { dxPct: 0, dyPct: 0, scale: 1.0 }
        downloadOptions: {
            format: 'png', // 'png' | 'jpeg'
            frameStyle: 'wood', // 'wood' | 'none'
            resolution: 1, // 1 = 1080p, 2 = 4K
            ratio: 'original'
        }
    };

    // Frame Sizes & Aspect Ratio Presets
    const framePresets = {
        'original': {
            name: 'Original Master',
            tag: '1092 × 1440',
            dims: 'Full HD Master Ratio',
            desc: 'Balanced native frame for digital & custom wall displays.',
            ratioW: 1092,
            ratioH: 1440,
            hd: { width: 1092, height: 1440 },
            ultra: { width: 2184, height: 2880 }
        },
        'a4': {
            name: 'A4 International',
            tag: '210 × 297 mm',
            dims: 'Standard A4 Document & Frame',
            desc: 'ISO 216 standard paper. Perfect for standard household frame printing (300 DPI).',
            ratioW: 210,
            ratioH: 297,
            hd: { width: 1240, height: 1754 },
            ultra: { width: 2480, height: 3508 }
        },
        'a3': {
            name: 'A3 Wall Poster',
            tag: '297 × 420 mm',
            dims: 'Large Format Exhibition Poster',
            desc: 'Double the size of A4. High-impact gallery and wall tribute print (300 DPI).',
            ratioW: 297,
            ratioH: 420,
            hd: { width: 1754, height: 2480 },
            ultra: { width: 3508, height: 4960 }
        },
        'a5': {
            name: 'A5 Compact',
            tag: '148 × 210 mm',
            dims: 'Compact Table & Desk Frame',
            desc: 'Half-A4 size. Beautiful for intimate desktop, shelf, or bedside frames.',
            ratioW: 148,
            ratioH: 210,
            hd: { width: 874, height: 1240 },
            ultra: { width: 1748, height: 2480 }
        },
        '3-4': {
            name: '3:4 Standard Portrait',
            tag: 'Ratio 3:4',
            dims: '18 × 24" / 9 × 12" / 30 × 40 cm',
            desc: 'Most widely used studio portrait ratio. Harmonious and timeless framing.',
            ratioW: 3,
            ratioH: 4,
            hd: { width: 1080, height: 1440 },
            ultra: { width: 2160, height: 2880 }
        },
        '3-5': {
            name: '3:5 Tall Slim Gallery',
            tag: 'Ratio 3:5',
            dims: 'Tall Vertical Pillar Frame',
            desc: 'Modern slender proportions with dramatic vertical elegance.',
            ratioW: 3,
            ratioH: 5,
            hd: { width: 900, height: 1500 },
            ultra: { width: 1800, height: 3000 }
        },
        '5-7': {
            name: '5:7 Classic Frame',
            tag: 'Ratio 5:7 (5" × 7")',
            dims: 'Standard 5 × 7 Inch Print',
            desc: 'The quintessential tabletop and mantle photo frame worldwide.',
            ratioW: 5,
            ratioH: 7,
            hd: { width: 1071, height: 1500 },
            ultra: { width: 2143, height: 3000 }
        },
        '4-5': {
            name: '4:5 (8" × 10") Frame',
            tag: 'Ratio 4:5',
            dims: '8 × 10" / 16 × 20" Print',
            desc: 'Classic gallery portrait and popular social photography framing standard.',
            ratioW: 4,
            ratioH: 5,
            hd: { width: 1200, height: 1500 },
            ultra: { width: 2400, height: 3000 }
        },
        '2-3': {
            name: '2:3 (4" × 6") Frame',
            tag: 'Ratio 2:3',
            dims: '4 × 6" / 24 × 36" Print',
            desc: 'Traditional 35mm photo print standard. Classic nostalgic photography ratio.',
            ratioW: 2,
            ratioH: 3,
            hd: { width: 1000, height: 1500 },
            ultra: { width: 2000, height: 3000 }
        },
        '1-1': {
            name: '1:1 Square Frame',
            tag: 'Ratio 1:1',
            dims: 'Square Studio Art Tile',
            desc: 'Contemporary symmetrical framing. Ideal for modern geometric wall galleries.',
            ratioW: 1,
            ratioH: 1,
            hd: { width: 1200, height: 1200 },
            ultra: { width: 2400, height: 2400 }
        }
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Quote Presets
    const quotePresets = {
        default: {
            sparkles: '💖 ✨ ✨',
            text: `💫 🦋 On your special\nday i promise i will\nalways stand 🦋 with\nu even if the ✨ whole\nworld is against u. 🦋\n✨ Always there for\nu in your 🦋 bad and\ngood 🦋 times. ❤️\nU're my ✨ happiness\n❤️ My 😊 smile. ❤️`
        },
        soulmate: {
            sparkles: '✨ 💖 💍',
            text: `🌹 In this lifetime\nand every lifetime,\nmy heart has found\nits forever home in u. ✨\nEvery beat sings\nyour precious name. 🦋\nMy greatest blessing,\nmy sweetest dream, ❤️\nu make every day ✨\n❤️ pure paradise. ❤️`
        },
        blessing: {
            sparkles: '🎂 🌟 🎁',
            text: `🌟 May your birthday\nbe as wondrous &\nbeautiful as your soul. 🦋\nMay all your dreams\nturn to golden reality. ✨\nHealth, endless joy\nand deepest peace 💖\nalways walk with u. ❤️\nHappy birthday, ✨\n❤️ my queen! ❤️`
        },
        short: {
            sparkles: '💖 ✨ 💖',
            text: `✨ To the love\nof my life, 💖\nthank u for bringing\nmagic to every hour. 🦋\nAlways by your side,\nnow and forever. ❤️\nU are my whole world\nand my greatest smile. ✨\nHappy Birthday! ❤️`
        }
    };

    // -------------------------------------------------------------
    // 2. DOM Elements
    // -------------------------------------------------------------
    // Toolbar & Stage
    const frameContainer = document.getElementById('frameContainer');
    const btnToggleFrame = document.getElementById('btnToggleFrame');
    const frameModeText = document.getElementById('frameModeText');
    const btnToggleLight = document.getElementById('btnToggleLight');
    const btnToggleZoom = document.getElementById('btnToggleZoom');
    const zoomText = document.getElementById('zoomText');

    // Studio Elements
    const customizerStudio = document.getElementById('customizerStudio');
    const btnStudioToggleCollapse = document.getElementById('btnStudioToggleCollapse');
    const btnStudioReset = document.getElementById('btnStudioReset');
    const studioTabs = document.querySelectorAll('.studio-tab-btn');
    const studioPanels = document.querySelectorAll('.studio-panel');

    // DOB Segmented Inputs (2 digits Day, 2 digits Month, 4 digits Year)
    const dobInputDay = document.getElementById('dobInputDay');
    const dobInputMonth = document.getElementById('dobInputMonth');
    const dobInputYear = document.getElementById('dobInputYear');
    const dobMonthSelect = document.getElementById('dobMonthSelect');
    const dobActiveText = document.getElementById('dobActiveText');
    const calMonthTitle = document.getElementById('calMonthTitle');
    const calGrid = document.getElementById('calGrid');

    // Photo Elements on Frame
    const imgMainCouple = document.getElementById('imgMainCouple');
    const mainPicPreview = document.getElementById('mainPicPreview');
    const inputMainPic = document.getElementById('inputMainPic');
    const btnResetMainPic = document.getElementById('btnResetMainPic');

    const inputBatchPhotos = document.getElementById('inputBatchPhotos');
    const btnResetAllGallery = document.getElementById('btnResetAllGallery');

    // Ribbon & Forever Love
    const imgHeartRibbon = document.getElementById('imgHeartRibbon');
    const heartRibbonPreview = document.getElementById('heartRibbonPreview');
    const inputHeartRibbon = document.getElementById('inputHeartRibbon');
    const btnResetHeartRibbon = document.getElementById('btnResetHeartRibbon');

    const imgForeverLove = document.getElementById('imgForeverLove');
    const foreverLovePreview = document.getElementById('foreverLovePreview');
    const inputForeverLove = document.getElementById('inputForeverLove');
    const btnResetForeverLove = document.getElementById('btnResetForeverLove');

    // Quotes & Font Size Controls
    const quotePresetsSelect = document.getElementById('quotePresetsSelect');
    const quoteSparklesInput = document.getElementById('quoteSparklesInput');
    const quoteTextarea = document.getElementById('quoteTextarea');
    const renderedSparkles = document.getElementById('renderedSparkles');
    const renderedQuoteLines = document.getElementById('renderedQuoteLines');
    const birthdayQuote = document.getElementById('birthdayQuote');

    const quoteFontSizeSlider = document.getElementById('quoteFontSizeSlider');
    const quoteFontSizeVal = document.getElementById('quoteFontSizeVal');
    const btnQuoteFontDec = document.getElementById('btnQuoteFontDec');
    const btnQuoteFontInc = document.getElementById('btnQuoteFontInc');
    const btnQuoteFontReset = document.getElementById('btnQuoteFontReset');

    // Greetings & Font Size Controls
    const inputGreetingLine1 = document.getElementById('inputGreetingLine1');
    const inputGreetingLine2 = document.getElementById('inputGreetingLine2');
    const greetingLine1 = document.getElementById('greetingLine1');
    const greetingLine2 = document.getElementById('greetingLine2');
    const previewGreeting1 = document.getElementById('previewGreeting1');
    const previewGreeting2 = document.getElementById('previewGreeting2');

    const greeting1FontSizeSlider = document.getElementById('greeting1FontSizeSlider');
    const greeting1FontSizeVal = document.getElementById('greeting1FontSizeVal');
    const btnG1FontDec = document.getElementById('btnG1FontDec');
    const btnG1FontInc = document.getElementById('btnG1FontInc');
    const btnG1FontReset = document.getElementById('btnG1FontReset');

    const greeting2FontSizeSlider = document.getElementById('greeting2FontSizeSlider');
    const greeting2FontSizeVal = document.getElementById('greeting2FontSizeVal');
    const btnG2FontDec = document.getElementById('btnG2FontDec');
    const btnG2FontInc = document.getElementById('btnG2FontInc');
    const btnG2FontReset = document.getElementById('btnG2FontReset');

    // Lightbox
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');

    // Download Modal
    const downloadModal = document.getElementById('downloadModal');
    const btnToolbarDownload = document.getElementById('btnToolbarDownload');
    const btnStudioDownload = document.getElementById('btnStudioDownload');
    const btnDownloadModalClose = document.getElementById('btnDownloadModalClose');
    const btnCancelDownload = document.getElementById('btnCancelDownload');
    const btnConfirmDownload = document.getElementById('btnConfirmDownload');
    const downloadStatus = document.getElementById('downloadStatus');
    const confirmDownloadText = document.getElementById('confirmDownloadText');
    const btnHeaderDownloadPdf = document.getElementById('btnHeaderDownloadPdf');

    // Toolbar & Studio Frame Ratio Controls
    const toolbarRatioSelect = document.getElementById('toolbarRatioSelect');
    const frameRatioGrid = document.getElementById('frameRatioGrid');
    const specsTitle = document.getElementById('specsTitle');
    const specsDesc = document.getElementById('specsDesc');

    // Month Position & Dove Gap Controls
    const monthLeftSlider = document.getElementById('monthLeftSlider');
    const monthLeftVal = document.getElementById('monthLeftVal');
    const btnMonthLeftDec = document.getElementById('btnMonthLeftDec');
    const btnMonthLeftInc = document.getElementById('btnMonthLeftInc');
    const btnMonthLeftReset = document.getElementById('btnMonthLeftReset');
    const gapPresetChips = document.querySelectorAll('.gap-preset-chip');

    // Download Modal Frame Ratio Controls
    const downloadRatioGrid = document.getElementById('downloadRatioGrid');
    const downloadActiveRatioBadge = document.getElementById('downloadActiveRatioBadge');
    const woodFrameDesc = document.getElementById('woodFrameDesc');
    const framelessDesc = document.getElementById('framelessDesc');

    const actionToast = document.getElementById('actionToast');

    // -------------------------------------------------------------
    // 3. Helper: Toast Notification
    // -------------------------------------------------------------
    let toastTimeout;
    function showToast(message) {
        if (!actionToast) return;
        actionToast.textContent = message;
        actionToast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            actionToast.classList.remove('show');
        }, 3000);
    }

    // -------------------------------------------------------------
    // 4. Dynamic Calendar Controller & Segmented Date Inputs
    // -------------------------------------------------------------
    function updateCalendar() {
        const { year, month, day } = state.dob;

        // Update Month Title on Frame
        if (calMonthTitle) {
            calMonthTitle.textContent = monthNames[month] || 'July';
            calMonthTitle.style.setProperty('--month-left-pos', (state.dob.monthLeftPercent || 32) + '%');
        }
        const calendarSection = document.getElementById('calendarSection');
        if (calendarSection) {
            calendarSection.style.setProperty('--month-left-pos', (state.dob.monthLeftPercent || 32) + '%');
            calendarSection.style.setProperty('--month-left-pos-val', state.dob.monthLeftPercent || 32);
        }
        const calMonthItem = document.getElementById('calMonthItem');
        if (calMonthItem) {
            calMonthItem.style.setProperty('--month-left-pos-val', state.dob.monthLeftPercent || 32);
        }

        // Calculate Days & Grid
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        const totalDays = new Date(year, month + 1, 0).getDate();

        if (calGrid) {
            calGrid.innerHTML = '';

            // Leading empty cells
            for (let i = 0; i < firstDay; i++) {
                const emptyCell = document.createElement('span');
                emptyCell.className = 'cal-cell cal-cell-empty';
                calGrid.appendChild(emptyCell);
            }

            // Days 1 to totalDays
            for (let d = 1; d <= totalDays; d++) {
                const dayCell = document.createElement('span');
                const isSunday = (firstDay + d - 1) % 7 === 0;

                dayCell.className = 'cal-cell';
                if (isSunday) dayCell.classList.add('cal-col-sun');

                if (d === day) {
                    dayCell.classList.add('cal-birthday-cell');
                    dayCell.title = `Birthday: ${monthNames[month]} ${d}`;
                    dayCell.innerHTML = `
                        <span class="cal-day-num">${d}</span>
                        <img src="calendar_heart.png" class="cal-heart-badge" alt="Heart marker">
                    `;
                } else {
                    dayCell.innerHTML = `<span class="cal-day-num">${d}</span>`;
                }

                calGrid.appendChild(dayCell);
            }

            // Trailing empty cells to balance grid (up to multiple of 7)
            const currentCells = firstDay + totalDays;
            const targetCells = currentCells <= 35 ? 35 : 42;
            for (let i = currentCells; i < targetCells; i++) {
                const emptyCell = document.createElement('span');
                emptyCell.className = 'cal-cell cal-cell-empty';
                calGrid.appendChild(emptyCell);
            }

            // Toggle compact 6-row styling for months with 6 calendar weeks
            const calContainer = document.getElementById('calendarSection') || document.getElementById('calGridItem');
            if (calContainer) {
                calContainer.classList.toggle('cal-6-rows', targetCells > 35);
            }
        }

        // Sync Segmented Date Inputs (DD / MM / YYYY)
        if (dobInputDay && document.activeElement !== dobInputDay) {
            dobInputDay.value = String(day).padStart(2, '0');
        }
        if (dobInputMonth && document.activeElement !== dobInputMonth) {
            dobInputMonth.value = String(month + 1).padStart(2, '0');
        }
        if (dobInputYear && document.activeElement !== dobInputYear) {
            dobInputYear.value = String(year);
        }

        // Sync Selectors & Active Text
        if (dobMonthSelect) dobMonthSelect.value = String(month);
        if (dobActiveText) {
            dobActiveText.textContent = `${day} ${monthNames[month]} ${year}`;
        }
    }

    function setBirthdayDate(year, month, day) {
        state.dob.year = parseInt(year, 10);
        state.dob.month = parseInt(month, 10);
        const maxDay = new Date(state.dob.year, state.dob.month + 1, 0).getDate();
        state.dob.day = Math.min(Math.max(1, parseInt(day, 10)), maxDay);
        updateCalendar();
    }

    // --- Segmented Date Inputs Enforcement (Max 2 Digits for Day/Month, Max 4 for Year) ---
    // 1. Day Input (DD - Only 2 numbers)
    if (dobInputDay) {
        dobInputDay.addEventListener('input', (e) => {
            // Strip any non-digit characters
            let val = e.target.value.replace(/\D/g, '').slice(0, 2);
            e.target.value = val;

            if (val.length > 0) {
                const num = parseInt(val, 10);
                if (num >= 1 && num <= 31) {
                    setBirthdayDate(state.dob.year, state.dob.month, num);
                }
            }

            // Auto-advance to Month input when 2 digits are entered
            if (val.length === 2 && dobInputMonth) {
                dobInputMonth.focus();
                dobInputMonth.select();
            }
        });

        dobInputDay.addEventListener('blur', () => {
            if (dobInputDay.value.trim() === '') {
                dobInputDay.value = String(state.dob.day).padStart(2, '0');
            } else {
                let num = parseInt(dobInputDay.value, 10);
                const maxDay = new Date(state.dob.year, state.dob.month + 1, 0).getDate();
                num = Math.min(Math.max(1, num), maxDay);
                setBirthdayDate(state.dob.year, state.dob.month, num);
                dobInputDay.value = String(num).padStart(2, '0');
            }
        });
    }

    // 2. Month Input (MM - Only 2 numbers)
    if (dobInputMonth) {
        dobInputMonth.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').slice(0, 2);
            e.target.value = val;

            if (val.length > 0) {
                const num = parseInt(val, 10);
                if (num >= 1 && num <= 12) {
                    setBirthdayDate(state.dob.year, num - 1, state.dob.day);
                }
            }

            // Auto-advance to Year input when 2 digits are entered
            if (val.length === 2 && dobInputYear) {
                dobInputYear.focus();
                dobInputYear.select();
            }
        });

        dobInputMonth.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && dobInputMonth.value === '' && dobInputDay) {
                dobInputDay.focus();
            }
        });

        dobInputMonth.addEventListener('blur', () => {
            if (dobInputMonth.value.trim() === '') {
                dobInputMonth.value = String(state.dob.month + 1).padStart(2, '0');
            } else {
                let num = parseInt(dobInputMonth.value, 10);
                num = Math.min(Math.max(1, num), 12);
                setBirthdayDate(state.dob.year, num - 1, state.dob.day);
                dobInputMonth.value = String(num).padStart(2, '0');
            }
        });
    }

    // 3. Year Input (YYYY - Only 4 numbers)
    if (dobInputYear) {
        dobInputYear.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').slice(0, 4);
            e.target.value = val;

            if (val.length === 4) {
                const num = parseInt(val, 10);
                if (num >= 1900 && num <= 2100) {
                    setBirthdayDate(num, state.dob.month, state.dob.day);
                }
            }
        });

        dobInputYear.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && dobInputYear.value === '' && dobInputMonth) {
                dobInputMonth.focus();
            }
        });

        dobInputYear.addEventListener('blur', () => {
            let num = parseInt(dobInputYear.value, 10);
            if (isNaN(num) || num < 1900 || num > 2100) {
                num = 2024;
            }
            setBirthdayDate(num, state.dob.month, state.dob.day);
            dobInputYear.value = String(num);
        });
    }

    // Month Selector Sync
    if (dobMonthSelect) {
        dobMonthSelect.addEventListener('change', (e) => {
            setBirthdayDate(state.dob.year, e.target.value, state.dob.day);
            showToast(`Month changed to ${monthNames[e.target.value]}!`);
        });
    }

    // --- Month Name Position & Dove Gap Manager ---
    function setMonthLeftPosition(percent) {
        const clamped = Math.min(Math.max(26, percent), 46);
        state.dob.monthLeftPercent = clamped;

        if (calMonthTitle) {
            calMonthTitle.style.setProperty('--month-left-pos', clamped + '%');
        }
        const calMonthItem = document.getElementById('calMonthItem');
        if (calMonthItem) {
            calMonthItem.style.setProperty('--month-left-pos-val', clamped);
        }
        if (monthLeftSlider) monthLeftSlider.value = clamped;
        if (monthLeftVal) monthLeftVal.textContent = clamped + '% (Left with Gap)';

        gapPresetChips.forEach(chip => {
            const pos = parseInt(chip.getAttribute('data-pos'), 10);
            chip.classList.toggle('active', pos === clamped);
        });
    }

    if (monthLeftSlider) {
        monthLeftSlider.addEventListener('input', (e) => {
            setMonthLeftPosition(parseInt(e.target.value, 10));
        });
    }

    if (btnMonthLeftDec) {
        btnMonthLeftDec.addEventListener('click', () => {
            setMonthLeftPosition((state.dob.monthLeftPercent || 32) - 1);
        });
    }

    if (btnMonthLeftInc) {
        btnMonthLeftInc.addEventListener('click', () => {
            setMonthLeftPosition((state.dob.monthLeftPercent || 32) + 1);
        });
    }

    if (btnMonthLeftReset) {
        btnMonthLeftReset.addEventListener('click', () => {
            setMonthLeftPosition(32);
            showToast('Month position reset to default left gap (32%).');
        });
    }

    gapPresetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const pos = parseInt(chip.getAttribute('data-pos'), 10);
            setMonthLeftPosition(pos);
            showToast(`Month gap set to ${pos}%!`);
        });
    });

    // -------------------------------------------------------------
    // 5. Studio Tabs & Collapsing
    // -------------------------------------------------------------
    studioTabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            studioTabs.forEach(t => t.classList.remove('active'));
            studioPanels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = document.getElementById(`panel${targetTab.charAt(0).toUpperCase() + targetTab.slice(1)}`);
            if (targetPanel) targetPanel.classList.add('active');

            // Ensure studio is expanded when clicking a tab
            if (customizerStudio && customizerStudio.classList.contains('is-collapsed')) {
                customizerStudio.classList.remove('is-collapsed');
            }
        });
    });

    if (btnStudioToggleCollapse) {
        btnStudioToggleCollapse.addEventListener('click', () => {
            customizerStudio.classList.toggle('is-collapsed');
        });
    }

    // -------------------------------------------------------------
    // 6. Image Upload Handlers
    // -------------------------------------------------------------
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    // Main Couple Photo
    if (inputMainPic) {
        inputMainPic.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const dataUrl = await readFileAsDataURL(file);
                state.images.mainPic = dataUrl;
                if (imgMainCouple) imgMainCouple.src = dataUrl;
                if (mainPicPreview) mainPicPreview.src = dataUrl;
                showToast('Main photo updated! 💑');
            } catch (err) {
                console.error(err);
                showToast('Error loading image.');
            }
        });
    }

    if (btnResetMainPic) {
        btnResetMainPic.addEventListener('click', () => {
            state.images.mainPic = null;
            if (imgMainCouple) imgMainCouple.src = state.defaultImages.mainPic;
            if (mainPicPreview) mainPicPreview.src = state.defaultImages.mainPic;
            if (inputMainPic) inputMainPic.value = '';
            showToast('Main photo reset to original.');
        });
    }

    // 6 Side Photos: Individual Slots
    for (let i = 1; i <= 6; i++) {
        const inputSlot = document.getElementById(`inputSlot${i}`);
        const thumbSlot = document.getElementById(`thumbSlot${i}`);
        const imgSlot = document.getElementById(`imgSlot${i}`);

        if (inputSlot) {
            inputSlot.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                try {
                    const dataUrl = await readFileAsDataURL(file);
                    state.images.slots[i - 1] = dataUrl;
                    if (imgSlot) imgSlot.src = dataUrl;
                    if (thumbSlot) thumbSlot.src = dataUrl;
                    showToast(`Photo ${i} updated! 🖼️`);
                } catch (err) {
                    console.error(err);
                    showToast('Error loading image.');
                }
            });
        }
    }

    // 6 Side Photos: Batch Upload All 6 At Once
    if (inputBatchPhotos) {
        inputBatchPhotos.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            const count = Math.min(files.length, 6);
            for (let i = 0; i < count; i++) {
                try {
                    const dataUrl = await readFileAsDataURL(files[i]);
                    state.images.slots[i] = dataUrl;
                    const imgSlot = document.getElementById(`imgSlot${i + 1}`);
                    const thumbSlot = document.getElementById(`thumbSlot${i + 1}`);
                    if (imgSlot) imgSlot.src = dataUrl;
                    if (thumbSlot) thumbSlot.src = dataUrl;
                } catch (err) {
                    console.error(err);
                }
            }
            showToast(`${count} photos uploaded successfully! ⚡`);
        });
    }

    if (btnResetAllGallery) {
        btnResetAllGallery.addEventListener('click', () => {
            state.images.slots = [null, null, null, null, null, null];
            for (let i = 1; i <= 6; i++) {
                const imgSlot = document.getElementById(`imgSlot${i}`);
                const thumbSlot = document.getElementById(`thumbSlot${i}`);
                const defaultSrc = state.defaultImages.slots[i - 1];
                if (imgSlot) imgSlot.src = defaultSrc;
                if (thumbSlot) thumbSlot.src = defaultSrc;
            }
            if (inputBatchPhotos) inputBatchPhotos.value = '';
            showToast('All 6 photos reset to original.');
        });
    }

    // Heart Ribbon
    if (inputHeartRibbon) {
        inputHeartRibbon.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const dataUrl = await readFileAsDataURL(file);
                state.images.heartRibbon = dataUrl;
                if (imgHeartRibbon) imgHeartRibbon.src = dataUrl;
                if (heartRibbonPreview) heartRibbonPreview.src = dataUrl;
                showToast('Heart ribbon updated! 🎀');
            } catch (err) {
                console.error(err);
                showToast('Error loading image.');
            }
        });
    }

    if (btnResetHeartRibbon) {
        btnResetHeartRibbon.addEventListener('click', () => {
            state.images.heartRibbon = null;
            if (imgHeartRibbon) imgHeartRibbon.src = state.defaultImages.heartRibbon;
            if (heartRibbonPreview) heartRibbonPreview.src = state.defaultImages.heartRibbon;
            if (inputHeartRibbon) inputHeartRibbon.value = '';
            showToast('Heart ribbon reset.');
        });
    }

    // Forever Love
    if (inputForeverLove) {
        inputForeverLove.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            try {
                const dataUrl = await readFileAsDataURL(file);
                state.images.foreverLove = dataUrl;
                if (imgForeverLove) imgForeverLove.src = dataUrl;
                if (foreverLovePreview) foreverLovePreview.src = dataUrl;
                showToast('Forever Love emblem updated! ♾️');
            } catch (err) {
                console.error(err);
                showToast('Error loading image.');
            }
        });
    }

    if (btnResetForeverLove) {
        btnResetForeverLove.addEventListener('click', () => {
            state.images.foreverLove = null;
            if (imgForeverLove) imgForeverLove.src = state.defaultImages.foreverLove;
            if (foreverLovePreview) foreverLovePreview.src = state.defaultImages.foreverLove;
            if (inputForeverLove) inputForeverLove.value = '';
            showToast('Forever Love reset.');
        });
    }

    // -------------------------------------------------------------
    // 7. Quotes & Greetings Controller + Editable Font Sizes
    // -------------------------------------------------------------
    // Quote Font Size Manager
    function setQuoteFontSize(size) {
        const clamped = Math.min(Math.max(11, size), 28);
        state.quote.fontSize = clamped;

        // Apply scale factor to frame DOM
        const factor = (clamped / 19).toFixed(3);
        if (birthdayQuote) {
            birthdayQuote.style.setProperty('--quote-font-factor', factor);
        }

        // Sync slider and value label
        if (quoteFontSizeSlider) quoteFontSizeSlider.value = clamped;
        if (quoteFontSizeVal) quoteFontSizeVal.textContent = clamped + 'px';
    }

    if (quoteFontSizeSlider) {
        quoteFontSizeSlider.addEventListener('input', (e) => {
            setQuoteFontSize(parseInt(e.target.value, 10));
        });
    }

    if (btnQuoteFontDec) {
        btnQuoteFontDec.addEventListener('click', () => {
            setQuoteFontSize(state.quote.fontSize - 1);
        });
    }

    if (btnQuoteFontInc) {
        btnQuoteFontInc.addEventListener('click', () => {
            setQuoteFontSize(state.quote.fontSize + 1);
        });
    }

    if (btnQuoteFontReset) {
        btnQuoteFontReset.addEventListener('click', () => {
            setQuoteFontSize(19);
            showToast('Quote font size reset to 19px.');
        });
    }

    function updateQuoteDOM() {
        if (renderedSparkles) {
            renderedSparkles.textContent = state.quote.sparkles;
        }
        if (renderedQuoteLines) {
            renderedQuoteLines.innerHTML = '';
            state.quote.lines.forEach((line, idx) => {
                const p = document.createElement('p');
                p.className = 'quote-line';
                if (idx === state.quote.lines.length - 1) {
                    p.classList.add('quote-last-line');
                }
                p.textContent = line;
                renderedQuoteLines.appendChild(p);
            });
        }
    }

    if (quoteTextarea) {
        quoteTextarea.addEventListener('input', (e) => {
            const rawLines = e.target.value.split('\n').filter(l => l.trim() !== '');
            state.quote.lines = rawLines;
            updateQuoteDOM();
        });
    }

    if (quoteSparklesInput) {
        quoteSparklesInput.addEventListener('input', (e) => {
            state.quote.sparkles = e.target.value;
            if (renderedSparkles) renderedSparkles.textContent = e.target.value;
        });
    }

    if (quotePresetsSelect) {
        quotePresetsSelect.addEventListener('change', (e) => {
            const presetKey = e.target.value;
            const preset = quotePresets[presetKey] || quotePresets.default;

            state.quote.sparkles = preset.sparkles;
            state.quote.lines = preset.text.split('\n');

            if (quoteSparklesInput) quoteSparklesInput.value = preset.sparkles;
            if (quoteTextarea) quoteTextarea.value = preset.text;

            updateQuoteDOM();
            showToast('Quote preset applied! 📜');
        });
    }

    // Inline editable quote sync back to textarea
    if (birthdayQuote) {
        birthdayQuote.addEventListener('input', () => {
            const lines = [];
            const paragraphs = renderedQuoteLines ? renderedQuoteLines.querySelectorAll('.quote-line') : [];
            paragraphs.forEach(p => lines.push(p.textContent));
            if (lines.length) {
                state.quote.lines = lines;
                if (quoteTextarea) quoteTextarea.value = lines.join('\n');
            }
        });
    }

    // --- Greetings Font Size Manager ---
    function setGreeting1FontSize(size) {
        const clamped = Math.min(Math.max(24, size), 64);
        state.greetings.fontSize1 = clamped;

        // Apply scale factor to frame DOM
        const factor = (clamped / 44).toFixed(3);
        if (greetingLine1) {
            greetingLine1.style.setProperty('--greeting1-font-factor', factor);
        }

        // Update preview render and controls
        if (previewGreeting1) previewGreeting1.style.fontSize = Math.round(clamped * 0.62) + 'px';
        if (greeting1FontSizeSlider) greeting1FontSizeSlider.value = clamped;
        if (greeting1FontSizeVal) greeting1FontSizeVal.textContent = clamped + 'px';
    }

    function setGreeting2FontSize(size) {
        const clamped = Math.min(Math.max(28, size), 76);
        state.greetings.fontSize2 = clamped;

        // Apply scale factor to frame DOM
        const factor = (clamped / 52).toFixed(3);
        if (greetingLine2) {
            greetingLine2.style.setProperty('--greeting2-font-factor', factor);
        }

        // Update preview render and controls
        if (previewGreeting2) previewGreeting2.style.fontSize = Math.round(clamped * 0.65) + 'px';
        if (greeting2FontSizeSlider) greeting2FontSizeSlider.value = clamped;
        if (greeting2FontSizeVal) greeting2FontSizeVal.textContent = clamped + 'px';
    }

    // Greeting 1 Listeners
    if (greeting1FontSizeSlider) {
        greeting1FontSizeSlider.addEventListener('input', (e) => {
            setGreeting1FontSize(parseInt(e.target.value, 10));
        });
    }

    if (btnG1FontDec) {
        btnG1FontDec.addEventListener('click', () => {
            setGreeting1FontSize(state.greetings.fontSize1 - 2);
        });
    }

    if (btnG1FontInc) {
        btnG1FontInc.addEventListener('click', () => {
            setGreeting1FontSize(state.greetings.fontSize1 + 2);
        });
    }

    if (btnG1FontReset) {
        btnG1FontReset.addEventListener('click', () => {
            setGreeting1FontSize(44);
            showToast('Greeting Line 1 font size reset to 44px.');
        });
    }

    // Greeting 2 Listeners
    if (greeting2FontSizeSlider) {
        greeting2FontSizeSlider.addEventListener('input', (e) => {
            setGreeting2FontSize(parseInt(e.target.value, 10));
        });
    }

    if (btnG2FontDec) {
        btnG2FontDec.addEventListener('click', () => {
            setGreeting2FontSize(state.greetings.fontSize2 - 2);
        });
    }

    if (btnG2FontInc) {
        btnG2FontInc.addEventListener('click', () => {
            setGreeting2FontSize(state.greetings.fontSize2 + 2);
        });
    }

    if (btnG2FontReset) {
        btnG2FontReset.addEventListener('click', () => {
            setGreeting2FontSize(52);
            showToast('Recipient Name font size reset to 52px.');
        });
    }

    // Greetings Text Update
    function updateGreetingsDOM() {
        if (greetingLine1) greetingLine1.textContent = state.greetings.line1;
        if (greetingLine2) greetingLine2.textContent = state.greetings.line2;
        if (previewGreeting1) previewGreeting1.textContent = state.greetings.line1;
        if (previewGreeting2) previewGreeting2.textContent = state.greetings.line2;
    }

    if (inputGreetingLine1) {
        inputGreetingLine1.addEventListener('input', (e) => {
            state.greetings.line1 = e.target.value;
            updateGreetingsDOM();
        });
    }

    if (inputGreetingLine2) {
        inputGreetingLine2.addEventListener('input', (e) => {
            state.greetings.line2 = e.target.value;
            updateGreetingsDOM();
        });
    }

    // Inline editable greetings sync back to inputs
    if (greetingLine1) {
        greetingLine1.addEventListener('input', (e) => {
            state.greetings.line1 = e.target.textContent;
            if (inputGreetingLine1) inputGreetingLine1.value = state.greetings.line1;
            if (previewGreeting1) previewGreeting1.textContent = state.greetings.line1;
        });
    }

    if (greetingLine2) {
        greetingLine2.addEventListener('input', (e) => {
            state.greetings.line2 = e.target.textContent;
            if (inputGreetingLine2) inputGreetingLine2.value = state.greetings.line2;
            if (previewGreeting2) previewGreeting2.textContent = state.greetings.line2;
        });
    }

    // -------------------------------------------------------------
    // 8. Global Reset All Changes
    // -------------------------------------------------------------
    if (btnStudioReset) {
        btnStudioReset.addEventListener('click', () => {
            if (!confirm('Are you sure you want to reset all customized photos, date, font sizes, and text back to original template?')) {
                return;
            }

            // 1. Reset DOB to July 11, 2024
            setBirthdayDate(2024, 6, 11);

            // 2. Reset Photos
            state.images.mainPic = null;
            if (imgMainCouple) imgMainCouple.src = state.defaultImages.mainPic;
            if (mainPicPreview) mainPicPreview.src = state.defaultImages.mainPic;

            state.images.slots = [null, null, null, null, null, null];
            for (let i = 1; i <= 6; i++) {
                const imgSlot = document.getElementById(`imgSlot${i}`);
                const thumbSlot = document.getElementById(`thumbSlot${i}`);
                const defaultSrc = state.defaultImages.slots[i - 1];
                if (imgSlot) imgSlot.src = defaultSrc;
                if (thumbSlot) thumbSlot.src = defaultSrc;
            }

            state.images.heartRibbon = null;
            if (imgHeartRibbon) imgHeartRibbon.src = state.defaultImages.heartRibbon;
            if (heartRibbonPreview) heartRibbonPreview.src = state.defaultImages.heartRibbon;

            state.images.foreverLove = null;
            if (imgForeverLove) imgForeverLove.src = state.defaultImages.foreverLove;
            if (foreverLovePreview) foreverLovePreview.src = state.defaultImages.foreverLove;

            // 3. Reset Quotes & Font Size
            const defQ = quotePresets.default;
            state.quote.sparkles = defQ.sparkles;
            state.quote.lines = defQ.text.split('\n');
            if (quoteSparklesInput) quoteSparklesInput.value = defQ.sparkles;
            if (quoteTextarea) quoteTextarea.value = defQ.text;
            if (quotePresetsSelect) quotePresetsSelect.value = 'default';
            setQuoteFontSize(19);
            updateQuoteDOM();

            // 4. Reset Greetings & Font Sizes
            state.greetings.line1 = 'Put Your Greetings Here';
            state.greetings.line2 = '';
            if (inputGreetingLine1) inputGreetingLine1.value = state.greetings.line1;
            if (inputGreetingLine2) inputGreetingLine2.value = state.greetings.line2;
            setGreeting1FontSize(44);
            setGreeting2FontSize(52);
            updateGreetingsDOM();

            // 5. Reset Frame Border to Wood
            setFrameBorderStyle('wood', false);

            showToast('All settings reset to original! ✨');
        });
    }

    // -------------------------------------------------------------
    // 9. Frame Border Style Manager (Wood / Sleek / Frameless)
    // -------------------------------------------------------------
    function setFrameBorderStyle(styleKey, notify = true) {
        state.frameStyle = styleKey;
        state.downloadOptions.frameStyle = (styleKey === 'none') ? 'none' : 'wood';

        if (frameContainer) {
            ['wood', 'sleek', 'none'].forEach(s => {
                frameContainer.classList.remove(`frame-style-${s}`);
            });
            frameContainer.classList.add(`frame-style-${styleKey}`);
        }

        // Update active class on border option cards in the studio
        document.querySelectorAll('.border-option-card').forEach(card => {
            const isMatch = card.getAttribute('data-style') === styleKey;
            card.classList.toggle('active', isMatch);
        });

        // Sync Studio Border Status card
        const borderStatusTitle = document.getElementById('borderStatusTitle');
        const borderStatusDesc = document.getElementById('borderStatusDesc');
        const borderActiveStatusCard = document.getElementById('borderActiveStatusCard');
        if (borderStatusTitle && borderStatusDesc) {
            if (styleKey === 'wood') {
                if (borderActiveStatusCard) borderActiveStatusCard.querySelector('.specs-icon').textContent = '🪵';
                borderStatusTitle.textContent = 'Active Frame Style: Authentic Wooden Picture Frame';
                borderStatusDesc.textContent = 'Full authentic carved wooden border overlay with realistic depth, warm lighting and golden highlights.';
            } else if (styleKey === 'sleek') {
                if (borderActiveStatusCard) borderActiveStatusCard.querySelector('.specs-icon').textContent = '✨';
                borderStatusTitle.textContent = 'Active Frame Style: Modern Sleek Beveled Border';
                borderStatusDesc.textContent = 'Contemporary dark studio edge with a refined inner metallic gold border trim and recessed shadows.';
            } else {
                if (borderActiveStatusCard) borderActiveStatusCard.querySelector('.specs-icon').textContent = '🖼️';
                borderStatusTitle.textContent = 'Active Frame Style: Borderless Canvas Only';
                borderStatusDesc.textContent = 'Pure edge-to-edge frameless art canvas for clean wallpaper, social media, or poster printing.';
            }
        }

        // Sync Download Modal Frame Style cards
        const labelFrameWood = document.getElementById('labelFrameWood');
        const labelFrameNone = document.getElementById('labelFrameNone');
        const radioWood = document.querySelector('input[name="downloadFrameStyle"][value="wood"]');
        const radioNone = document.querySelector('input[name="downloadFrameStyle"][value="none"]');
        if (styleKey === 'none') {
            if (radioNone) radioNone.checked = true;
            if (labelFrameNone) labelFrameNone.classList.add('active');
            if (labelFrameWood) labelFrameWood.classList.remove('active');
        } else {
            if (radioWood) radioWood.checked = true;
            if (labelFrameWood) labelFrameWood.classList.add('active');
            if (labelFrameNone) labelFrameNone.classList.remove('active');
        }

        if (notify) {
            const labels = { wood: 'Wooden Frame 🪵', sleek: 'Modern Bevel ✨', none: 'Borderless Canvas 🖼️' };
            showToast(`Frame border set to ${labels[styleKey] || styleKey}!`);
        }
    }

    // Attach click listeners to Studio Frame Border cards
    document.querySelectorAll('.border-option-card').forEach(card => {
        card.addEventListener('click', () => {
            const style = card.getAttribute('data-style');
            if (style) setFrameBorderStyle(style, true);
        });
    });

    // Guarded optional toolbar handlers
    if (btnToggleFrame) {
        const frameStyles = ['wood', 'sleek', 'none'];
        let currentStyleIndex = 0;
        btnToggleFrame.addEventListener('click', () => {
            currentStyleIndex = (currentStyleIndex + 1) % frameStyles.length;
            setFrameBorderStyle(frameStyles[currentStyleIndex], true);
        });
    }

    if (btnToggleLight) {
        btnToggleLight.addEventListener('click', () => {
            document.body.classList.toggle('spotlight-off');
        });
    }

    if (btnToggleZoom) {
        let isFullView = false;
        btnToggleZoom.addEventListener('click', () => {
            isFullView = !isFullView;
            document.body.classList.toggle('view-full', isFullView);
            if (zoomText) zoomText.textContent = isFullView ? 'Actual Size' : 'Fit Screen';
        });
    }

    // -------------------------------------------------------------
    // 10. Frame Size & Aspect Ratio Manager (A4, A3, 3:4, 3:5, 5:7, etc.)
    // -------------------------------------------------------------
    function setFrameRatio(ratioKey, notify = true) {
        const preset = framePresets[ratioKey] || framePresets['original'];
        state.frameRatio = ratioKey;
        state.downloadOptions.ratio = ratioKey;

        const ratioW = preset.ratioW;
        const ratioH = preset.ratioH;
        const ratioVal = ratioW / ratioH;
        const invRatioVal = ratioH / ratioW;
        const ratioCss = `${ratioW} / ${ratioH}`;

        // Directly apply aspect-ratio and CSS custom properties to frameContainer
        if (frameContainer) {
            frameContainer.style.setProperty('--frame-w-ratio', ratioW);
            frameContainer.style.setProperty('--frame-h-ratio', ratioH);
            frameContainer.style.setProperty('--frame-ratio-val', ratioVal.toFixed(6));
            frameContainer.style.setProperty('--frame-inv-ratio-val', invRatioVal.toFixed(6));
            frameContainer.style.setProperty('--frame-ratio-css', ratioCss);
            frameContainer.style.aspectRatio = ratioCss;
            frameContainer.setAttribute('data-ratio', ratioKey);
            frameContainer.classList.toggle('ratio-square-or-wide', ratioVal >= 0.82);
        }

        const frameWorkspace = document.getElementById('frameWorkspace');
        if (frameWorkspace) {
            frameWorkspace.style.setProperty('--frame-w-ratio', ratioW);
            frameWorkspace.style.setProperty('--frame-h-ratio', ratioH);
            frameWorkspace.style.setProperty('--frame-ratio-val', ratioVal.toFixed(6));
            frameWorkspace.style.setProperty('--frame-inv-ratio-val', invRatioVal.toFixed(6));
            frameWorkspace.style.setProperty('--frame-ratio-css', ratioCss);
            frameWorkspace.setAttribute('data-ratio', ratioKey);
        }

        const galleryStage = document.getElementById('galleryStage');
        if (galleryStage) {
            galleryStage.style.setProperty('--frame-w-ratio', ratioW);
            galleryStage.style.setProperty('--frame-h-ratio', ratioH);
            galleryStage.style.setProperty('--frame-ratio-val', ratioVal.toFixed(6));
            galleryStage.style.setProperty('--frame-inv-ratio-val', invRatioVal.toFixed(6));
            galleryStage.style.setProperty('--frame-ratio-css', ratioCss);
        }

        document.documentElement.style.setProperty('--frame-w-ratio', ratioW);
        document.documentElement.style.setProperty('--frame-h-ratio', ratioH);
        document.documentElement.style.setProperty('--frame-ratio-val', ratioVal.toFixed(6));
        document.documentElement.style.setProperty('--frame-inv-ratio-val', invRatioVal.toFixed(6));
        document.documentElement.style.setProperty('--frame-ratio-css', ratioCss);

        // Sync Top Toolbar Dropdown
        if (toolbarRatioSelect && toolbarRatioSelect.value !== ratioKey) {
            toolbarRatioSelect.value = ratioKey;
        }

        // Sync Studio Preset Cards
        document.querySelectorAll('.ratio-preset-card').forEach(card => {
            const key = card.getAttribute('data-ratio');
            card.classList.toggle('active', key === ratioKey);
        });

        // Sync Download Modal Ratio Pills
        document.querySelectorAll('.download-ratio-pill').forEach(pill => {
            const key = pill.getAttribute('data-ratio');
            pill.classList.toggle('active', key === ratioKey);
        });

        // Update Studio Specifications Card
        if (specsTitle) {
            specsTitle.textContent = `Active Format: ${preset.name} (${preset.tag})`;
        }
        if (specsDesc) {
            specsDesc.textContent = `${preset.desc} [Dimensions: ${preset.dims}]`;
        }

        // Update Download Modal Header Badge
        if (downloadActiveRatioBadge) {
            downloadActiveRatioBadge.textContent = `${preset.name} (${preset.tag})`;
        }

        // Update Download Dimension Displays
        updateDimLabels();

        if (notify) {
            showToast(`Frame size set to ${preset.name} (${preset.tag})! 📐`);
        }
    }

    function renderRatioControls() {
        // 1. Studio Panel Grid
        if (frameRatioGrid) {
            frameRatioGrid.innerHTML = '';
            Object.keys(framePresets).forEach(key => {
                const p = framePresets[key];
                const card = document.createElement('div');
                card.className = `ratio-preset-card ${key === state.frameRatio ? 'active' : ''}`;
                card.setAttribute('data-ratio', key);
                card.innerHTML = `
                    <div class="ratio-card-header">
                        <span class="ratio-card-name">${p.name}</span>
                        <span class="ratio-card-tag">${p.tag}</span>
                    </div>
                    <div class="ratio-card-dims">📏 ${p.dims}</div>
                    <div class="ratio-card-desc">${p.desc}</div>
                `;
                card.addEventListener('click', () => {
                    setFrameRatio(key, true);
                });
                frameRatioGrid.appendChild(card);
            });
        }

        // 2. Download Modal Grid
        if (downloadRatioGrid) {
            downloadRatioGrid.innerHTML = '';
            Object.keys(framePresets).forEach(key => {
                const p = framePresets[key];
                const pill = document.createElement('div');
                pill.className = `download-ratio-pill ${key === state.downloadOptions.ratio ? 'active' : ''}`;
                pill.setAttribute('data-ratio', key);
                pill.innerHTML = `
                    <span class="pill-ratio-name">${p.name}</span>
                    <span class="pill-ratio-dim">${p.tag}</span>
                `;
                pill.addEventListener('click', () => {
                    setFrameRatio(key, true);
                });
                downloadRatioGrid.appendChild(pill);
            });
        }
    }

    if (toolbarRatioSelect) {
        toolbarRatioSelect.addEventListener('change', (e) => {
            setFrameRatio(e.target.value, true);
        });
    }

    // Initialize Ratio UI
    renderRatioControls();

    // -------------------------------------------------------------
    // 11. Lightbox Modal (Studio Previews)
    // -------------------------------------------------------------
    const studioPreviewImages = document.querySelectorAll('.studio-upload-thumb, .studio-card-preview img');
    studioPreviewImages.forEach(img => {
        img.addEventListener('click', () => {
            if (img.src && lightboxModal) {
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

    const closeLightbox = () => {
        if (!lightboxModal) return;
        if (typeof lightboxModal.close === 'function') {
            lightboxModal.close();
        } else {
            lightboxModal.removeAttribute('open');
        }
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    // -------------------------------------------------------------
    // 11. Download Modal Controller
    // -------------------------------------------------------------
    const openDownloadModal = () => {
        if (!downloadModal) return;
        if (typeof downloadModal.showModal === 'function') {
            downloadModal.showModal();
        } else {
            downloadModal.setAttribute('open', 'true');
        }
    };

    const closeDownloadModal = () => {
        if (!downloadModal) return;
        if (typeof downloadModal.close === 'function') {
            downloadModal.close();
        } else {
            downloadModal.removeAttribute('open');
        }
        if (downloadStatus) downloadStatus.style.display = 'none';
        if (btnConfirmDownload) btnConfirmDownload.disabled = false;
        if (confirmDownloadText) confirmDownloadText.textContent = 'Download Image';
    };

    if (btnToolbarDownload) btnToolbarDownload.addEventListener('click', openDownloadModal);
    if (btnStudioDownload) btnStudioDownload.addEventListener('click', openDownloadModal);
    if (btnDownloadModalClose) btnDownloadModalClose.addEventListener('click', closeDownloadModal);
    if (btnCancelDownload) btnCancelDownload.addEventListener('click', closeDownloadModal);

    if (downloadModal) {
        downloadModal.addEventListener('click', (e) => {
            if (e.target === downloadModal) closeDownloadModal();
        });
    }

    // Download Option 1: Format (PNG vs JPEG)
    const labelFormatPng = document.getElementById('labelFormatPng');
    const labelFormatJpeg = document.getElementById('labelFormatJpeg');

    if (labelFormatPng && labelFormatJpeg) {
        labelFormatPng.addEventListener('click', () => {
            state.downloadOptions.format = 'png';
            labelFormatPng.classList.add('active');
            labelFormatJpeg.classList.remove('active');
        });

        labelFormatJpeg.addEventListener('click', () => {
            state.downloadOptions.format = 'jpeg';
            labelFormatJpeg.classList.add('active');
            labelFormatPng.classList.remove('active');
        });
    }

    // Download Option 2: Frame Style (Wood vs Frameless)
    const labelFrameWood = document.getElementById('labelFrameWood');
    const labelFrameNone = document.getElementById('labelFrameNone');
    const dim1x = document.getElementById('dim1x');
    const dim2x = document.getElementById('dim2x');

    function updateDimLabels() {
        const ratioKey = state.downloadOptions.ratio || state.frameRatio || 'original';
        const preset = framePresets[ratioKey] || framePresets['original'];
        const isWood = state.downloadOptions.frameStyle === 'wood';

        let res1xW = preset.hd.width;
        let res1xH = preset.hd.height;
        let res2xW = preset.ultra.width;
        let res2xH = preset.ultra.height;

        if (!isWood) {
            res1xW = Math.round(res1xW * (936 / 1092));
            res1xH = Math.round(res1xH * (1279 / 1440));
            res2xW = Math.round(res2xW * (936 / 1092));
            res2xH = Math.round(res2xH * (1279 / 1440));
        }

        if (dim1x) dim1x.textContent = `${res1xW} × ${res1xH} px`;
        if (dim2x) dim2x.textContent = `${res2xW} × ${res2xH} px`;

        if (woodFrameDesc) {
            woodFrameDesc.textContent = `Carved wooden picture frame (${preset.hd.width} × ${preset.hd.height} px)`;
        }
        if (framelessDesc) {
            framelessDesc.textContent = `Clean borderless inner canvas (${Math.round(preset.hd.width * (936 / 1092))} × ${Math.round(preset.hd.height * (1279 / 1440))} px)`;
        }
    }

    if (labelFrameWood && labelFrameNone) {
        labelFrameWood.addEventListener('click', () => {
            state.downloadOptions.frameStyle = 'wood';
            labelFrameWood.classList.add('active');
            labelFrameNone.classList.remove('active');
            updateDimLabels();
        });

        labelFrameNone.addEventListener('click', () => {
            state.downloadOptions.frameStyle = 'none';
            labelFrameNone.classList.add('active');
            labelFrameWood.classList.remove('active');
            updateDimLabels();
        });
    }

    // Download Option 3: Resolution (1080p vs 4K)
    const labelRes1x = document.getElementById('labelRes1x');
    const labelRes2x = document.getElementById('labelRes2x');

    if (labelRes1x && labelRes2x) {
        labelRes1x.addEventListener('click', () => {
            state.downloadOptions.resolution = 1;
            labelRes1x.classList.add('active');
            labelRes2x.classList.remove('active');
        });

        labelRes2x.addEventListener('click', () => {
            state.downloadOptions.resolution = 2;
            labelRes2x.classList.add('active');
            labelRes1x.classList.remove('active');
        });
    }

    // -------------------------------------------------------------
    // 12. Interactive Element Drag, Nudge & Zoom (Double-Tap/Double-Click)
    // -------------------------------------------------------------
    const itemFriendlyNames = {
        'calDoveItem': 'Calendar Dove Artwork',
        'calMonthItem': 'Calendar Month Name',
        'calGridItem': 'Calendar Dates Grid',
        'calBannerItem': 'Calendar Dove & Month Banner',
        'calendarSection': 'Calendar Dates Grid',
        'heartsDeco': 'Heart Ribbon',
        'couplePortrait': 'Main Couple Portrait',
        'dreamcatcherDeco': 'Golden Dreamcatcher',
        'dovesDeco': 'Two Doves with Heart',
        'birthdayQuote': 'Birthday Promise Quote',
        'photoGalleryWrapper': '6-Photo Gallery Collage',
        'photoGallery': '6-Photo Gallery Collage',
        'gallerySlot1': 'Gallery Photo 1',
        'gallerySlot2': 'Gallery Photo 2',
        'gallerySlot3': 'Gallery Photo 3',
        'gallerySlot4': 'Gallery Photo 4',
        'gallerySlot5': 'Gallery Photo 5',
        'gallerySlot6': 'Gallery Photo 6',
        'foreverLove': 'Forever Love Emblem',
        'birthdayGreeting': 'Birthday Greeting',
        'butterflyLeft': 'Left Crystal Butterfly',
        'butterflyRight': 'Right Crystal Butterfly'
    };

    const transformHud = document.getElementById('transformHud');
    const hudElementTitle = document.getElementById('hudElementTitle');
    const hudScaleVal = document.getElementById('hudScaleVal');
    const hudBtnZoomOut = document.getElementById('hudBtnZoomOut');
    const hudBtnZoomIn = document.getElementById('hudBtnZoomIn');
    const hudBtnReset = document.getElementById('hudBtnReset');
    const hudBtnDone = document.getElementById('hudBtnDone');

    let activeTransformItem = null;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragInitialDx = 0;
    let dragInitialDy = 0;

    // Touch pinch state
    let initialPinchDistance = null;
    let initialPinchScale = 1;

    function getElementTransform(item) {
        const id = item.id;
        if (!state.transforms[id]) {
            state.transforms[id] = { dxPct: 0, dyPct: 0, scale: 1.0 };
        }
        return state.transforms[id];
    }

    function updateElementTransformDOM(item) {
        if (!item) return;
        const id = item.id;
        const t = getElementTransform(item);
        const canvasInner = document.getElementById('canvasInner');
        const cWidth = canvasInner ? canvasInner.offsetWidth : 936;
        const cHeight = canvasInner ? canvasInner.offsetHeight : 1279;

        const dxPx = (t.dxPct / 100) * cWidth;
        const dyPx = (t.dyPct / 100) * cHeight;

        if (id === 'birthdayGreeting') {
            item.style.transform = `translate(calc(-50% + ${dxPx}px), ${dyPx}px) scale(${t.scale})`;
        } else {
            item.style.transform = `translate(${dxPx}px, ${dyPx}px) scale(${t.scale})`;
        }
        item.style.transformOrigin = 'center center';

        if (activeTransformItem === item && hudScaleVal) {
            hudScaleVal.textContent = `${Math.round(t.scale * 100)}%`;
        }
    }

    function setElementScale(item, newScale) {
        const t = getElementTransform(item);
        t.scale = Math.min(3.0, Math.max(0.3, Math.round(newScale * 100) / 100));
        updateElementTransformDOM(item);
    }

    function zoomElement(item, delta) {
        const t = getElementTransform(item);
        setElementScale(item, t.scale + delta);
    }

    function nudgeElement(item, deltaX, deltaY) {
        const t = getElementTransform(item);
        const canvasInner = document.getElementById('canvasInner');
        const cWidth = canvasInner ? canvasInner.offsetWidth : 936;
        const cHeight = canvasInner ? canvasInner.offsetHeight : 1279;

        const currentDxPx = (t.dxPct / 100) * cWidth;
        const currentDyPx = (t.dyPct / 100) * cHeight;

        const nextDxPx = currentDxPx + deltaX;
        const nextDyPx = currentDyPx + deltaY;

        t.dxPct = (nextDxPx / cWidth) * 100;
        t.dyPct = (nextDyPx / cHeight) * 100;

        updateElementTransformDOM(item);
    }

    function resetElementTransform(item) {
        if (!item) return;
        const id = item.id;
        state.transforms[id] = { dxPct: 0, dyPct: 0, scale: 1.0 };
        if (id === 'birthdayGreeting') {
            item.style.transform = 'translateX(-50%)';
        } else {
            item.style.transform = '';
        }
        if (hudScaleVal) hudScaleVal.textContent = '100%';
        showToast(`Reset ${itemFriendlyNames[id] || 'element'} to original layout.`);
    }

    function activateTransform(item) {
        if (!item) return;

        // If another item was transforming, deactivate it first
        if (activeTransformItem && activeTransformItem !== item) {
            deactivateTransform(false);
        }

        activeTransformItem = item;
        item.classList.add('is-transforming');

        // Blur any focused editable content & clear text selection
        if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
        }
        if (window.getSelection) {
            const sel = window.getSelection();
            if (sel && sel.removeAllRanges) sel.removeAllRanges();
            else if (sel && sel.empty) sel.empty();
        }

        const id = item.id;
        const friendlyName = itemFriendlyNames[id] || 'Element';

        if (transformHud) {
            transformHud.style.display = 'flex';
            setTimeout(() => {
                if (window.innerWidth < 1024 && typeof transformHud.scrollIntoView === 'function') {
                    transformHud.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 60);
        }
        if (hudElementTitle) {
            hudElementTitle.textContent = friendlyName;
        }

        const t = getElementTransform(item);
        if (hudScaleVal) {
            hudScaleVal.textContent = `${Math.round(t.scale * 100)}%`;
        }

        showToast(`✨ ${friendlyName} selected! Drag with mouse, nudge with arrows, or scroll to zoom.`);
    }

    function deactivateTransform(notify = true) {
        if (!activeTransformItem) return;
        const id = activeTransformItem.id;
        const friendlyName = itemFriendlyNames[id] || 'Element';

        activeTransformItem.classList.remove('is-transforming', 'is-dragging');
        activeTransformItem = null;
        isDragging = false;
        initialPinchDistance = null;

        if (transformHud) {
            transformHud.style.display = 'none';
        }

        if (notify) {
            showToast(`Position & size saved for ${friendlyName}! ✨`);
        }
    }

    const canvasInnerEl = document.getElementById('canvasInner');
    const allFrameItems = canvasInnerEl ? canvasInnerEl.querySelectorAll('.item') : [];

    // Delegated Canvas Double-Click & Double-Tap (ensures any click/tap on frame items or children selects the item)
    if (canvasInnerEl) {
        canvasInnerEl.addEventListener('dblclick', (e) => {
            const targetItem = e.target.closest('.item');
            if (targetItem) {
                e.preventDefault();
                e.stopPropagation();
                activateTransform(targetItem);
            }
        });

        let canvasLastTapTime = 0;
        canvasInnerEl.addEventListener('touchend', (e) => {
            const now = Date.now();
            const tapGap = now - canvasLastTapTime;
            if (tapGap < 380 && tapGap > 0) {
                const targetItem = e.target.closest('.item');
                if (targetItem) {
                    e.preventDefault();
                    e.stopPropagation();
                    activateTransform(targetItem);
                    canvasLastTapTime = 0;
                    return;
                }
            }
            canvasLastTapTime = now;
        }, { passive: false });
    }

    allFrameItems.forEach(item => {
        // Double Click (Desktop Mouse)
        item.addEventListener('dblclick', (e) => {
            e.preventDefault();
            e.stopPropagation();
            activateTransform(item);
        });

        // Double Tap Detection (Touch Devices)
        let lastTapTime = 0;
        item.addEventListener('touchend', (e) => {
            const currentTime = Date.now();
            const tapGap = currentTime - lastTapTime;
            if (tapGap < 380 && tapGap > 0) {
                e.preventDefault();
                e.stopPropagation();
                activateTransform(item);
                lastTapTime = 0;
                return;
            }
            lastTapTime = currentTime;
        }, { passive: false });

        // Pointer Dragging (Mouse & Touch)
        item.addEventListener('pointerdown', (e) => {
            if (activeTransformItem !== item) return;

            // Don't initiate drag if clicking on buttons inside
            if (e.target.closest('button, .hud-btn')) return;

            e.preventDefault();
            e.stopPropagation();

            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;

            const t = getElementTransform(item);
            const cWidth = canvasInnerEl.offsetWidth;
            const cHeight = canvasInnerEl.offsetHeight;
            dragInitialDx = (t.dxPct / 100) * cWidth;
            dragInitialDy = (t.dyPct / 100) * cHeight;

            try {
                item.setPointerCapture(e.pointerId);
            } catch (err) {}

            item.classList.add('is-dragging');
        });

        item.addEventListener('pointermove', (e) => {
            if (!isDragging || activeTransformItem !== item) return;
            e.preventDefault();

            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;

            const nextDxPx = dragInitialDx + deltaX;
            const nextDyPx = dragInitialDy + deltaY;

            const cWidth = canvasInnerEl.offsetWidth;
            const cHeight = canvasInnerEl.offsetHeight;

            const t = getElementTransform(item);
            t.dxPct = (nextDxPx / cWidth) * 100;
            t.dyPct = (nextDyPx / cHeight) * 100;

            updateElementTransformDOM(item);
        });

        const stopDrag = (e) => {
            if (isDragging && activeTransformItem === item) {
                isDragging = false;
                item.classList.remove('is-dragging');
                try {
                    item.releasePointerCapture(e.pointerId);
                } catch (err) {}
            }
        };

        item.addEventListener('pointerup', stopDrag);
        item.addEventListener('pointercancel', stopDrag);

        // Touch Pinch-to-Zoom (2 Fingers on Touch Screen)
        item.addEventListener('touchstart', (e) => {
            if (activeTransformItem === item && e.touches.length === 2) {
                e.preventDefault();
                isDragging = false;
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                initialPinchScale = getElementTransform(item).scale;
            }
        }, { passive: false });

        item.addEventListener('touchmove', (e) => {
            if (activeTransformItem === item && e.touches.length === 2 && initialPinchDistance) {
                e.preventDefault();
                const t1 = e.touches[0];
                const t2 = e.touches[1];
                const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                const scaleFactor = dist / initialPinchDistance;
                setElementScale(item, initialPinchScale * scaleFactor);
            }
        }, { passive: false });

        item.addEventListener('touchend', (e) => {
            if (e.touches.length < 2) {
                initialPinchDistance = null;
            }
        });
    });

    // Mouse Scroll Wheel Zoom on Active Element
    if (canvasInnerEl) {
        canvasInnerEl.addEventListener('wheel', (e) => {
            if (!activeTransformItem) return;
            e.preventDefault();
            const zoomDelta = e.deltaY < 0 ? 0.05 : -0.05;
            zoomElement(activeTransformItem, zoomDelta);
        }, { passive: false });

        // Click outside on background deselects
        canvasInnerEl.addEventListener('pointerdown', (e) => {
            if (!activeTransformItem) return;
            if (!e.target.closest('.is-transforming') && !e.target.closest('.transform-hud')) {
                deactivateTransform(true);
            }
        });
    }

    // HUD Button Handlers
    if (hudBtnZoomIn) {
        hudBtnZoomIn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTransformItem) zoomElement(activeTransformItem, 0.05);
        });
    }
    if (hudBtnZoomOut) {
        hudBtnZoomOut.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTransformItem) zoomElement(activeTransformItem, -0.05);
        });
    }
    if (hudBtnReset) {
        hudBtnReset.addEventListener('click', (e) => {
            e.stopPropagation();
            if (activeTransformItem) resetElementTransform(activeTransformItem);
        });
    }
    if (hudBtnDone) {
        hudBtnDone.addEventListener('click', (e) => {
            e.stopPropagation();
            deactivateTransform(true);
        });
    }

    // Keyboard Arrow Keys & Shortcuts for Nudge & Zoom
    window.addEventListener('keydown', (e) => {
        if (!activeTransformItem) return;

        const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
        if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') return;

        const step = e.shiftKey ? 10 : 2;
        let handled = false;

        switch (e.key) {
            case 'ArrowLeft':
                nudgeElement(activeTransformItem, -step, 0);
                handled = true;
                break;
            case 'ArrowRight':
                nudgeElement(activeTransformItem, step, 0);
                handled = true;
                break;
            case 'ArrowUp':
                nudgeElement(activeTransformItem, 0, -step);
                handled = true;
                break;
            case 'ArrowDown':
                nudgeElement(activeTransformItem, 0, step);
                handled = true;
                break;
            case '+':
            case '=':
            case 'Add':
                zoomElement(activeTransformItem, e.shiftKey ? 0.10 : 0.05);
                handled = true;
                break;
            case '-':
            case '_':
            case 'Subtract':
                zoomElement(activeTransformItem, e.shiftKey ? -0.10 : -0.05);
                handled = true;
                break;
            case '0':
                setElementScale(activeTransformItem, 1.0);
                handled = true;
                break;
            case 'r':
            case 'R':
                resetElementTransform(activeTransformItem);
                handled = true;
                break;
            case 'Escape':
            case 'Enter':
                deactivateTransform(true);
                handled = true;
                break;
        }

        if (handled) {
            e.preventDefault();
        }
    });

    // Re-sync all transformed items on window resize
    window.addEventListener('resize', () => {
        if (!canvasInnerEl) return;
        const cWidth = canvasInnerEl.offsetWidth;
        const cHeight = canvasInnerEl.offsetHeight;
        Object.keys(state.transforms).forEach(itemId => {
            const t = state.transforms[itemId];
            const el = document.getElementById(itemId);
            if (el && t) {
                const dxPx = (t.dxPct / 100) * cWidth;
                const dyPx = (t.dyPct / 100) * cHeight;
                if (itemId === 'birthdayGreeting') {
                    el.style.transform = `translate(calc(-50% + ${dxPx}px), ${dyPx}px) scale(${t.scale})`;
                } else {
                    el.style.transform = `translate(${dxPx}px, ${dyPx}px) scale(${t.scale})`;
                }
                el.style.transformOrigin = 'center center';
            }
        });
    });

    // -------------------------------------------------------------
    // 13. Ultra-HD Canvas Compositor (PNG & JPEG Full HD)
    // -------------------------------------------------------------
    function getImageSource(key, customDataUrl, defaultFile) {
        if (customDataUrl) return customDataUrl;
        if (window.DEFAULT_ASSETS && window.DEFAULT_ASSETS[key]) {
            return window.DEFAULT_ASSETS[key];
        }
        return defaultFile;
    }

    function loadHtmlImage(src) {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn('Failed loading image for canvas:', src);
                resolve(null);
            };
            img.src = src;
        });
    }

    function drawImageCover(ctx, img, x, y, w, h) {
        if (!img || !img.naturalWidth || !img.naturalHeight) return;
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const targetRatio = w / h;
        let sWidth, sHeight, sx, sy;

        if (imgRatio > targetRatio) {
            sHeight = img.naturalHeight;
            sWidth = sHeight * targetRatio;
            sx = (img.naturalWidth - sWidth) / 2;
            sy = 0;
        } else {
            sWidth = img.naturalWidth;
            sHeight = sWidth / targetRatio;
            sx = 0;
            sy = (img.naturalHeight - sHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
        ctx.restore();
    }

    async function generateCanvasHD(options) {
        // Wait for fonts to be ready
        if (document.fonts && document.fonts.ready) {
            await document.fonts.ready;
        }

        const scale = options.resolution; // 1 = 1080p, 2 = 4K / 300 DPI Print
        const isWood = options.frameStyle === 'wood';
        const ratioKey = options.ratio || state.downloadOptions.ratio || state.frameRatio || 'original';
        const preset = framePresets[ratioKey] || framePresets['original'];

        // Determine base dimensions for this preset
        const resObj = (scale === 2) ? preset.ultra : preset.hd;
        let width = resObj.width;
        let height = resObj.height;

        let ox, oy, innerW, innerH;

        if (isWood) {
            ox = width * (78 / 1092);
            oy = height * (74 / 1440);
            innerW = width * (936 / 1092);
            innerH = height * (1279 / 1440);
        } else {
            // In frameless mode, the inner canvas fills the exported file
            width = Math.round(width * (936 / 1092));
            height = Math.round(height * (1279 / 1440));
            ox = 0;
            oy = 0;
            innerW = width;
            innerH = height;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Scaling factors relative to standard 936 x 1279 inner canvas
        const sx = innerW / 936;
        const sy = innerH / 1279;
        const s = Math.min(sx, sy); // uniform text/glyph scale

        // Background: Solid Pure Black
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Preload All Images in Parallel
        const [
            imgCalDove,
            imgCalHeart,
            imgHeartRibbonLoaded,
            imgMainLoaded,
            imgDreamcatcher,
            imgDoves,
            imgSlot1,
            imgSlot2,
            imgSlot3,
            imgSlot4,
            imgSlot5,
            imgSlot6,
            imgForeverLoaded,
            imgBfLeft,
            imgBfRight,
            imgWoodFrame
        ] = await Promise.all([
            loadHtmlImage(getImageSource('calender_dove', null, 'Calender_dove.png')),
            loadHtmlImage(getImageSource('calendar_heart', null, 'calendar_heart.png')),
            loadHtmlImage(getImageSource('heart_ribbon', state.images.heartRibbon, 'heart_ribbon.png')),
            loadHtmlImage(getImageSource('main_couple', state.images.mainPic, 'main_couple.png')),
            loadHtmlImage(getImageSource('dreamcatcher', null, 'dreamcatcher.png')),
            loadHtmlImage(getImageSource('dove_hearts', null, 'dove_hearts.png')),
            loadHtmlImage(getImageSource('gallery_1', state.images.slots[0], 'gallery_1.png')),
            loadHtmlImage(getImageSource('gallery_2', state.images.slots[1], 'gallery_2.png')),
            loadHtmlImage(getImageSource('gallery_3', state.images.slots[2], 'gallery_3.png')),
            loadHtmlImage(getImageSource('gallery_4', state.images.slots[3], 'gallery_4.png')),
            loadHtmlImage(getImageSource('gallery_5', state.images.slots[4], 'gallery_5.png')),
            loadHtmlImage(getImageSource('gallery_6', state.images.slots[5], 'gallery_6.png')),
            loadHtmlImage(getImageSource('forever_love', state.images.foreverLove, 'forever_love.png')),
            loadHtmlImage(getImageSource('butterfly_left', null, 'butterfly_left.png')),
            loadHtmlImage(getImageSource('butterfly_right', null, 'butterfly_right.png')),
            isWood ? loadHtmlImage(getImageSource('frame', null, 'frame.png')) : Promise.resolve(null)
        ]);

        function applyCanvasTransform(itemId, centerX, centerY) {
            const t = state.transforms && state.transforms[itemId];
            if (t && (t.dxPct !== 0 || t.dyPct !== 0 || (t.scale !== undefined && t.scale !== 1.0))) {
                const dx = (t.dxPct / 100) * innerW;
                const dy = (t.dyPct / 100) * innerH;
                const scale = t.scale !== undefined ? t.scale : 1.0;
                ctx.save();
                ctx.translate(centerX + dx, centerY + dy);
                ctx.scale(scale, scale);
                ctx.translate(-centerX, -centerY);
                return true;
            }
            return false;
        }

        // 1. Top-Left: Birthday Calendar (Ratio-adaptive sizing to eliminate any overlap)
        const isSquareOrWide = (width / height) >= 0.82;
        const firstDay = new Date(state.dob.year, state.dob.month, 1).getDay();
        const totalDays = new Date(state.dob.year, state.dob.month + 1, 0).getDate();
        const numCalRows = Math.ceil((firstDay + totalDays) / 7);

        const calX = ox + (isSquareOrWide ? 30 * sx : 35 * sx);
        const calY = oy + (isSquareOrWide ? 15 * sy : 20 * sy);
        const calW = (isSquareOrWide ? 332 : 344) * sx;
        const calH = (isSquareOrWide ? 62 : 68) * sy;

        const calRowHeight = isSquareOrWide 
            ? (numCalRows > 5 ? 32 * sy : 36 * sy)
            : (numCalRows > 5 ? 38 * sy : 44 * sy);
        const gridStartY = calY + (isSquareOrWide ? 104 * sy : 125 * sy);
        const calBottomY = gridStartY + (numCalRows * calRowHeight);

        // 1A. Calendar Banner Dove Artwork (Selectable Separately as #calDoveItem)
        const doveCenterX = calX + calW / 2;
        const doveCenterY = calY + calH / 2;
        const transDove = applyCanvasTransform('calDoveItem', doveCenterX, doveCenterY);
        if (imgCalDove) {
            ctx.drawImage(imgCalDove, calX, calY, calW, calH);
        }
        if (transDove) ctx.restore();

        // 1B. Calendar Month Title (Selectable Separately as #calMonthItem)
        const monthLeftPct = (state.dob.monthLeftPercent || 32) / 100;
        const monthX = calX + (calW * monthLeftPct);
        const monthY = calY + (isSquareOrWide ? 39 * sy : 44 * sy);
        const monthFontSize = Math.round((isSquareOrWide ? 28 : 32) * s);
        const transMonth = applyCanvasTransform('calMonthItem', monthX + (monthFontSize * 2), monthY - (monthFontSize / 2));

        ctx.save();
        ctx.font = `italic 700 ${monthFontSize}px "Playfair Display", Georgia, serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowOffsetY = 2 * s;
        ctx.shadowBlur = 5 * s;
        ctx.fillText(monthNames[state.dob.month] || 'July', monthX, monthY);
        ctx.restore();
        if (transMonth) ctx.restore();

        // 1C. Calendar Weekdays & Dates Grid (Selectable Separately as #calendarSection / #calGridItem)
        const gridCenterX = calX + calW / 2;
        const gridCenterY = (gridStartY + calBottomY) / 2;
        const transGrid = applyCanvasTransform('calendarSection', gridCenterX, gridCenterY) || 
                          applyCanvasTransform('calGridItem', gridCenterX, gridCenterY);

        // Weekday Headers (S M T W T F S)
        const colW = calW / 7;
        const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        ctx.save();
        ctx.font = `800 ${Math.round((isSquareOrWide ? 15 : 18) * s)}px "Montserrat", Arial, sans-serif`;
        ctx.textAlign = 'center';
        weekDays.forEach((wChar, idx) => {
            ctx.fillStyle = idx === 0 ? '#e50000' : '#ffffff';
            ctx.fillText(wChar, calX + (idx + 0.5) * colW, calY + (isSquareOrWide ? 84 * sy : 95 * sy));
        });
        ctx.restore();

        // Days Grid
        ctx.save();
        ctx.textAlign = 'center';
        for (let d = 1; d <= totalDays; d++) {
            const cellIdx = firstDay + d - 1;
            const c = cellIdx % 7;
            const r = Math.floor(cellIdx / 7);

            const cellCenterX = calX + (c + 0.5) * colW;
            const cellCenterY = gridStartY + (r + 0.5) * calRowHeight;

            if (d === state.dob.day) {
                // Birthday Heart Badge
                if (imgCalHeart) {
                    const badgeW = (isSquareOrWide ? 38 : 46) * s;
                    const badgeH = (isSquareOrWide ? 42 : 50) * s;
                    ctx.drawImage(imgCalHeart, cellCenterX - badgeW / 2, cellCenterY - badgeH / 2, badgeW, badgeH);
                }
                ctx.font = `700 ${Math.round((isSquareOrWide ? 15 : 18) * s)}px "Montserrat", Arial, sans-serif`;
                ctx.fillStyle = '#ffffff';
                ctx.fillText(String(d), cellCenterX, cellCenterY + 5 * sy);
            } else {
                ctx.font = `700 ${Math.round((isSquareOrWide ? 15 : 18) * s)}px "Montserrat", Arial, sans-serif`;
                ctx.fillStyle = c === 0 ? '#e50000' : '#ffffff';
                ctx.fillText(String(d), cellCenterX, cellCenterY + 5 * sy);
            }
        }
        ctx.restore();
        if (transGrid) ctx.restore();

        // 2. Top-Center: Hearts with Golden Ribbon
        const hrX = ox + 411 * sx;
        const hrY = oy + 73 * sy;
        const hrW = 197 * sx;
        const hrH = 113 * sy;
        const transHr = applyCanvasTransform('heartsDeco', hrX + hrW / 2, hrY + hrH / 2);
        if (imgHeartRibbonLoaded) {
            ctx.drawImage(imgHeartRibbonLoaded, hrX, hrY, hrW, hrH);
        }
        if (transHr) ctx.restore();

        // 3. Top-Center: Main Couple Portrait
        const cpX = ox + 382 * sx;
        const cpY = oy + 190 * sy;
        const cpW = 249 * sx;
        const cpH = 294 * sy;
        const transCp = applyCanvasTransform('couplePortrait', cpX + cpW / 2, cpY + cpH / 2);
        if (imgMainLoaded) {
            drawImageCover(ctx, imgMainLoaded, cpX, cpY, cpW, cpH);
        }
        if (transCp) ctx.restore();

        // 4. Top-Right: Golden Dreamcatcher
        const dcX = ox + 669 * sx;
        const dcY = oy + 3 * sy;
        const dcW = 262 * sx;
        const dcH = 467 * sy;
        const transDc = applyCanvasTransform('dreamcatcherDeco', dcX + dcW / 2, dcY + dcH / 2);
        if (imgDreamcatcher) {
            ctx.drawImage(imgDreamcatcher, dcX, dcY, dcW, dcH);
        }
        if (transDc) ctx.restore();

        // 5. Left-Mid: Doves with Golden Heart (Positioned below calendar with safe clearance)
        const dovesGap = Math.round(14 * sy);
        const dovesY = Math.max(calBottomY + dovesGap, isSquareOrWide ? oy + 382 * sy : oy + 407 * sy);
        const dovesH = (isSquareOrWide ? 60 : 70) * sy;
        const dovesW = Math.round((159 / 70) * dovesH);
        const dovesX = ox + 103 * sx;

        const transDoves = applyCanvasTransform('dovesDeco', dovesX + dovesW / 2, dovesY + dovesH / 2);
        if (imgDoves) {
            ctx.drawImage(imgDoves, dovesX, dovesY, dovesW, dovesH);
        }
        if (transDoves) ctx.restore();

        // 6. Left-Mid: Birthday Promise Quote (Editable Font Size)
        const quoteCenterX = ox + 17 * sx + (351 * sx) / 2;
        const qSize = state.quote.fontSize;
        const quoteGap = Math.round((isSquareOrWide ? 18 : 26) * sy);
        const sparklesY = dovesY + dovesH + quoteGap;
        const quoteStartY = sparklesY + Math.round((isSquareOrWide ? 28 : 36) * sy);
        const quoteLineSpacing = Math.round(qSize * (isSquareOrWide ? 1.48 : 1.62) * sy);
        const quoteTotalH = (quoteStartY + (state.quote.lines.length - 1) * quoteLineSpacing) - sparklesY + 30 * sy;
        const quoteCenterY = sparklesY + quoteTotalH / 2;

        const transQuote = applyCanvasTransform('birthdayQuote', quoteCenterX, quoteCenterY);
        ctx.save();
        ctx.textAlign = 'center';

        // Sparkles line
        ctx.font = `${Math.round(qSize * (isSquareOrWide ? 1.2 : 1.35) * s)}px serif`;
        ctx.fillText(state.quote.sparkles, quoteCenterX, sparklesY);

        // Quote text lines with dynamic spacing based on custom font size
        ctx.font = `italic 700 ${Math.round(qSize * (isSquareOrWide ? 0.92 : 1.0) * s)}px "Playfair Display", "Lora", Georgia, serif`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.95)';
        ctx.shadowOffsetY = 2 * s;
        ctx.shadowBlur = 6 * s;

        state.quote.lines.forEach((line, idx) => {
            ctx.fillText(line, quoteCenterX, quoteStartY + idx * quoteLineSpacing);
        });
        ctx.restore();
        if (transQuote) ctx.restore();

        // 7. Center-Right: 6-Photo Collage Gallery (Each of the 6 photos separately selectable & movable)
        const gx = ox + 377 * sx;
        const gy = oy + 485 * sy;
        const gw = 532 * sx;
        const gh = 463 * sy;
        const gap = 3 * s;

        const transGallery = applyCanvasTransform('photoGalleryWrapper', gx + gw / 2, gy + gh / 2) || 
                             applyCanvasTransform('photoGallery', gx + gw / 2, gy + gh / 2);

        // Proportions: 124 : 112 : 122 (Total: 358)
        const availW = gw - 2 * gap;
        const cw1 = (124 / 358) * availW;
        const cw2 = (112 / 358) * availW;
        const cw3 = availW - cw1 - cw2;

        // Proportions: 138 : 178 (Total: 316)
        const availH = gh - gap;
        const rh1 = (138 / 316) * availH;
        const rh2 = availH - rh1;

        const slotsData = [
            { id: 'gallerySlot1', img: imgSlot1, x: gx, y: gy, w: cw1, h: rh1 },
            { id: 'gallerySlot2', img: imgSlot2, x: gx + cw1 + gap, y: gy, w: cw2, h: rh1 },
            { id: 'gallerySlot3', img: imgSlot3, x: gx + cw1 + cw2 + 2 * gap, y: gy, w: cw3, h: rh1 },
            { id: 'gallerySlot4', img: imgSlot4, x: gx, y: gy + rh1 + gap, w: cw1, h: rh2 },
            { id: 'gallerySlot5', img: imgSlot5, x: gx + cw1 + gap, y: gy + rh1 + gap, w: cw2, h: rh2 },
            { id: 'gallerySlot6', img: imgSlot6, x: gx + cw1 + cw2 + 2 * gap, y: gy + rh1 + gap, w: cw3, h: rh2 }
        ];

        slotsData.forEach(slot => {
            if (!slot.img) return;
            const transSlot = applyCanvasTransform(slot.id, slot.x + slot.w / 2, slot.y + slot.h / 2);
            drawImageCover(ctx, slot.img, slot.x, slot.y, slot.w, slot.h);
            if (transSlot) ctx.restore();
        });

        if (transGallery) ctx.restore();

        // 8. Bottom-Center: Forever Love Infinity Emblem
        const flX = ox + 323 * sx;
        const flY = oy + 962 * sy;
        const flW = 290 * sx;
        const flH = 110 * sy;
        const transFl = applyCanvasTransform('foreverLove', flX + flW / 2, flY + flH / 2);
        if (imgForeverLoaded) {
            ctx.drawImage(imgForeverLoaded, flX, flY, flW, flH);
        }
        if (transFl) ctx.restore();

        // 9. Bottom-Center: Birthday Greeting in Great Vibes Cursive Script (Editable Font Sizes)
        const greetingCenterX = ox + innerW / 2;
        const greetingCenterY = oy + 1147 * sy;
        const g1Size = state.greetings.fontSize1;
        const g2Size = state.greetings.fontSize2;

        const transGreeting = applyCanvasTransform('birthdayGreeting', greetingCenterX, greetingCenterY);
        ctx.save();
        ctx.textAlign = 'center';

        // Line 1
        ctx.font = `${Math.round(g1Size * s)}px "Great Vibes", cursive`;
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
        ctx.shadowBlur = 20 * s;
        ctx.shadowOffsetY = 0;
        const hasLine2 = state.greetings.line2 && state.greetings.line2.trim().length > 0;
        const line1Y = hasLine2 ? (oy + 1115 * sy) : (oy + 1145 * sy);
        ctx.fillText(state.greetings.line1, greetingCenterX, line1Y);

        // Line 2 (Recipient Name - drawn if provided)
        if (hasLine2) {
            ctx.font = `${Math.round(g2Size * s)}px "Great Vibes", cursive`;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.55)';
            ctx.shadowBlur = 24 * s;
            ctx.fillText(state.greetings.line2, greetingCenterX, oy + 1180 * sy);
        }
        ctx.restore();
        if (transGreeting) ctx.restore();

        // 10. Bottom-Left & Right Butterflies
        const bflX = ox + 19 * sx;
        const bflY = oy + 1053 * sy;
        const bflW = 142 * sx;
        const bflH = 212 * sy;
        const transBfl = applyCanvasTransform('butterflyLeft', bflX + bflW / 2, bflY + bflH / 2);
        if (imgBfLeft) {
            ctx.drawImage(imgBfLeft, bflX, bflY, bflW, bflH);
        }
        if (transBfl) ctx.restore();

        const bfrX = ox + 742 * sx;
        const bfrY = oy + 1054 * sy;
        const bfrW = 174 * sx;
        const bfrH = 211 * sy;
        const transBfr = applyCanvasTransform('butterflyRight', bfrX + bfrW / 2, bfrY + bfrH / 2);
        if (imgBfRight) {
            ctx.drawImage(imgBfRight, bfrX, bfrY, bfrW, bfrH);
        }
        if (transBfr) ctx.restore();

        // 11. Outer Wooden Frame Overlay
        if (isWood && imgWoodFrame) {
            ctx.drawImage(imgWoodFrame, 0, 0, width, height);
        }

        return canvas;
    }

    // Download Confirm Button Listener
    if (btnConfirmDownload) {
        btnConfirmDownload.addEventListener('click', async () => {
            btnConfirmDownload.disabled = true;
            if (confirmDownloadText) confirmDownloadText.textContent = 'Rendering Full HD...';
            if (downloadStatus) downloadStatus.style.display = 'flex';

            try {
                const format = state.downloadOptions.format || 'png';
                const canvas = await generateCanvasHD(state.downloadOptions);
                const ratioKey = state.downloadOptions.ratio || state.frameRatio || 'original';
                const preset = framePresets[ratioKey] || framePresets['original'];
                const safeRatio = preset.name.replace(/[^a-zA-Z0-9]/g, '_');
                const safeName = (state.greetings.line2 && state.greetings.line2.trim().length > 0)
                    ? state.greetings.line2.replace(/[^a-zA-Z0-9]/g, '_')
                    : 'Live_Photo_Frame';
                const filename = `Photo_Frame_${safeName}_${safeRatio}.${format === 'png' ? 'png' : 'jpg'}`;

                if (format === 'png') {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            downloadBlob(blob, filename);
                        } else {
                            downloadDataUrl(canvas.toDataURL('image/png'), filename);
                        }
                        finishDownload();
                    }, 'image/png');
                } else {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            downloadBlob(blob, filename);
                        } else {
                            downloadDataUrl(canvas.toDataURL('image/jpeg', 0.95), filename);
                        }
                        finishDownload();
                    }, 'image/jpeg', 0.95);
                }
            } catch (err) {
                console.error('Download render error:', err);
                showToast('Export failed. Check console for details.');
                btnConfirmDownload.disabled = false;
                if (confirmDownloadText) confirmDownloadText.textContent = 'Download Image';
                if (downloadStatus) downloadStatus.style.display = 'none';
            }
        });
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function downloadDataUrl(dataUrl, filename) {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function finishDownload() {
        showToast('Download started in Full HD! 📥🎉');
        setTimeout(() => {
            closeDownloadModal();
        }, 500);
    }

    // Pure JavaScript PDF 1.4 Binary Generator (DCTDecode Direct Stream)
    // Guarantees 100% offline and standalone 4K PDF exports without external dependencies
    function createJpegPdfBlob(jpegBytes, pixelWidth, pixelHeight, widthPt, heightPt) {
        const encoder = new TextEncoder();
        let header = `%PDF-1.4\n`;
        let body = ``;
        const offsets = [];

        function addTextObj(content) {
            offsets.push(header.length + body.length);
            body += content;
        }

        addTextObj(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`);
        addTextObj(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`);
        addTextObj(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${widthPt.toFixed(2)} ${heightPt.toFixed(2)}] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`);

        const streamContent = `q\n${widthPt.toFixed(2)} 0 0 ${heightPt.toFixed(2)} 0 0 cm\n/Im1 Do\nQ\n`;
        addTextObj(`5 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`);

        const obj4Start = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${pixelWidth} /Height ${pixelHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
        const obj4End = `\nendstream\nendobj\n`;
        offsets.push(header.length + body.length);

        const xrefOffset = header.length + body.length + obj4Start.length + jpegBytes.length + obj4End.length;
        let xref = `xref\n0 6\n0000000000 65535 f \n`;
        offsets.forEach(off => {
            xref += off.toString().padStart(10, '0') + ` 00000 n \n`;
        });
        const trailer = `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

        return new Blob([
            encoder.encode(header),
            encoder.encode(body),
            encoder.encode(obj4Start),
            jpegBytes,
            encoder.encode(obj4End),
            encoder.encode(xref),
            encoder.encode(trailer)
        ], { type: 'application/pdf' });
    }

    // 4K Ultra HD PDF Exporter from Header Action Button
    async function downloadFrameAs4KPdf() {
        if (!btnHeaderDownloadPdf || btnHeaderDownloadPdf.disabled) return;

        const originalHtml = btnHeaderDownloadPdf.innerHTML;
        btnHeaderDownloadPdf.disabled = true;
        btnHeaderDownloadPdf.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" class="spin-icon">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
            </svg>
            <span>Rendering 4K PDF...</span>
        `;

        showToast('Rendering Frame in 4K Ultra HD PDF... 📄✨');

        try {
            // Render at Resolution 2 = 4K Ultra-HD / 300 DPI
            const canvas = await generateCanvasHD({
                resolution: 2,
                frameStyle: state.frameStyle,
                ratio: state.frameRatio || 'original'
            });

            const ratioKey = state.frameRatio || 'original';
            const preset = framePresets[ratioKey] || framePresets['original'];
            const safeRatio = preset.name.replace(/[^a-zA-Z0-9]/g, '_');
            const safeName = (state.greetings.line2 && state.greetings.line2.trim().length > 0)
                ? state.greetings.line2.replace(/[^a-zA-Z0-9]/g, '_')
                : 'Live_Photo_Frame';
            const filename = `Photo_Frame_${safeName}_${safeRatio}_4K.pdf`;

            // Calculate precise PDF dimensions in points (72 pt per inch, 300 DPI)
            const widthPt = (canvas.width / 300) * 72;
            const heightPt = (canvas.height / 300) * 72;

            let pdfDownloaded = false;

            // Method 1: jsPDF if available
            const jsPdfClass = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : window.jsPDF;
            if (typeof jsPdfClass === 'function') {
                try {
                    const orientation = widthPt > heightPt ? 'landscape' : 'portrait';
                    const doc = new jsPdfClass({
                        orientation: orientation,
                        unit: 'pt',
                        format: [widthPt, heightPt],
                        compress: true
                    });
                    const imgData = canvas.toDataURL('image/jpeg', 0.98);
                    doc.addImage(imgData, 'JPEG', 0, 0, widthPt, heightPt, undefined, 'FAST');
                    doc.save(filename);
                    pdfDownloaded = true;
                } catch (pdfErr) {
                    console.warn('jsPDF export error, falling back to pure PDF generator:', pdfErr);
                }
            }

            // Method 2: Pure PDF 1.4 Binary Generator Fallback
            if (!pdfDownloaded) {
                await new Promise((resolve, reject) => {
                    canvas.toBlob(async (blob) => {
                        try {
                            if (!blob) throw new Error('Canvas blob generation failed');
                            const arrayBuffer = await blob.arrayBuffer();
                            const jpegBytes = new Uint8Array(arrayBuffer);
                            const pdfBlob = createJpegPdfBlob(jpegBytes, canvas.width, canvas.height, widthPt, heightPt);
                            downloadBlob(pdfBlob, filename);
                            resolve();
                        } catch (err) {
                            reject(err);
                        }
                    }, 'image/jpeg', 0.98);
                });
            }

            showToast('4K PDF Download Complete! 📥🎉');
        } catch (err) {
            console.error('PDF export error:', err);
            showToast('Failed to export 4K PDF. Please try again.');
        } finally {
            if (btnHeaderDownloadPdf) {
                btnHeaderDownloadPdf.innerHTML = originalHtml;
                btnHeaderDownloadPdf.disabled = false;
            }
        }
    }

    if (btnHeaderDownloadPdf) {
        btnHeaderDownloadPdf.addEventListener('click', downloadFrameAs4KPdf);
    }

    // -------------------------------------------------------------
    // 13. Keyboard Shortcuts & Initial Boot
    // -------------------------------------------------------------
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal && lightboxModal.open) closeLightbox();
            if (downloadModal && downloadModal.open) closeDownloadModal();
        }
    });

    // Initialize Calendar, Views, Default Font Sizes, and Frame Border
    updateCalendar();
    updateQuoteDOM();
    updateGreetingsDOM();
    setQuoteFontSize(19);
    setGreeting1FontSize(44);
    setGreeting2FontSize(52);
    setFrameBorderStyle('wood', false);
    setFrameRatio('original', false);
});
