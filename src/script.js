document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Terminal Tabs Handling
    // -------------------------------------------------------------------------
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            navButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetTab = document.getElementById(tabId);
            if (targetTab) targetTab.classList.add('active');
        });
    });

    // -------------------------------------------------------------------------
    // 2. Blog Post Accordion
    // -------------------------------------------------------------------------
    const blogPosts = document.querySelectorAll('.blog-post');
    blogPosts.forEach(post => {
        const header = post.querySelector('.blog-header');
        header.addEventListener('click', () => {
            const isExpanded = post.classList.contains('expanded');
            
            // Optional: collapse other posts
            blogPosts.forEach(p => p.classList.remove('expanded'));

            if (!isExpanded) {
                post.classList.add('expanded');
            }
        });
    });

    // -------------------------------------------------------------------------
    // 3. Matrix Digital Rain Canvas
    // -------------------------------------------------------------------------
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initializeColumns();
    });

    const fontHeight = 16;
    ctx.font = `${fontHeight}px monospace`;

    // Characters array (Matrix katakana, symbols, digits)
    const chars = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ$+-*/=<>[]{}#&@_".split("");

    let columns = [];
    
    // Matrix effect states
    let colorMode = 'green'; // 'green', 'red', 'blue', 'gold'
    let bulletTime = false; // slow-motion flag
    let warpEffect = false;  // sine wave bending spoon effect
    let zionFrenzy = false;  // intense drop rate
    let timeScale = 1.0;
    
    // Ripple effects triggered on mouse click
    let ripples = [];

    // Tracks cursor position for mouse interaction
    let mouse = { x: -9999, y: -9999, lastActive: 0 };

    class Drop {
        constructor(x) {
            this.x = x;
            this.reset();
            // Stagger initial Y positions to avoid line alignment at start
            this.y = Math.random() * -100 - 20;
        }

        reset() {
            this.y = Math.random() * -20 - 20;
            this.speed = Math.random() * 2 + 1.5; // Base falling speed
            this.length = Math.floor(Math.random() * 18) + 8; // Length of the falling stream
            this.chars = [];
            this.glows = [];
            
            // Pre-populate characters in the stream
            for (let i = 0; i < this.length; i++) {
                this.chars.push(chars[Math.floor(Math.random() * chars.length)]);
                this.glows.push(Math.random() < 0.15); // Some characters glow natively
            }
            this.mutationRate = Math.random() * 0.05 + 0.01;
            this.opacity = Math.random() * 0.4 + 0.6;
        }

        update() {
            let speedFactor = timeScale;
            if (bulletTime) speedFactor = 0.12;
            if (zionFrenzy) speedFactor = 3.5;

            // Mouse proximity speedup
            const dx = this.x - mouse.x;
            if (Math.abs(dx) < 60 && Date.now() - mouse.lastActive < 2000) {
                speedFactor *= 1.8;
            }

            this.y += this.speed * speedFactor;

            // Mutate letters occasionally
            for (let i = 0; i < this.length; i++) {
                if (Math.random() < this.mutationRate) {
                    this.chars[i] = chars[Math.floor(Math.random() * chars.length)];
                }
            }

            // Reset when column falls off screen
            if (this.y - (this.length * fontHeight) > height) {
                this.reset();
            }
        }

        draw() {
            const startY = Math.floor(this.y);
            const gridX = Math.floor(this.x);

            for (let i = 0; i < this.length; i++) {
                const charY = startY - (i * fontHeight);
                
                // Don't render if off-screen vertically
                if (charY < -20 || charY > height + 20) continue;

                // Calculate fade out along the stream length
                const lengthFade = 1 - (i / this.length);
                let alpha = lengthFade * this.opacity;

                // Calculate base color depending on mode
                let color;
                const isLeading = (i === 0);

                // Mouse proximity brightness
                const distToMouse = Math.sqrt(Math.pow(gridX - mouse.x, 2) + Math.pow(charY - mouse.y, 2));
                let mouseGlow = 1.0;
                if (distToMouse < 80 && Date.now() - mouse.lastActive < 2000) {
                    mouseGlow = (1 - (distToMouse / 80)) * 1.5 + 1.0;
                }

                // Check ripple intersections
                let inRipple = false;
                ripples.forEach(ripple => {
                    const distToRipple = Math.sqrt(Math.pow(gridX - ripple.x, 2) + Math.pow(charY - ripple.y, 2));
                    const rippleDiff = Math.abs(distToRipple - ripple.radius);
                    if (rippleDiff < ripple.thickness) {
                        inRipple = true;
                        alpha = Math.max(alpha, (1 - (rippleDiff / ripple.thickness)) * 1.0);
                    }
                });

                if (inRipple) {
                    // Turn intersecting characters bright cyan/blue and glow
                    color = `rgba(0, 235, 255, ${alpha})`;
                    ctx.shadowColor = '#00e1ff';
                    ctx.shadowBlur = 15;
                } else if (isLeading) {
                    // Leading character is always bright white/glowing
                    color = `rgba(255, 255, 255, ${alpha * mouseGlow})`;
                    ctx.shadowColor = colorMode === 'red' ? '#ff3333' : (colorMode === 'blue' ? '#3399ff' : (colorMode === 'gold' ? '#ffe600' : '#ffffff'));
                    ctx.shadowBlur = 10;
                } else {
                    // Body characters
                    ctx.shadowBlur = this.glows[i] ? 8 : 0;
                    
                    if (colorMode === 'red') {
                        ctx.shadowColor = '#ff0000';
                        color = isLeading ? '#ffffff' : (this.glows[i] ? `rgba(255, 100, 100, ${alpha * mouseGlow})` : `rgba(200, 0, 0, ${alpha * mouseGlow})`);
                    } else if (colorMode === 'blue') {
                        ctx.shadowColor = '#0055ff';
                        color = isLeading ? '#ffffff' : (this.glows[i] ? `rgba(150, 200, 255, ${alpha * mouseGlow})` : `rgba(0, 50, 220, ${alpha * mouseGlow})`);
                    } else if (colorMode === 'gold') {
                        ctx.shadowColor = '#ffaa00';
                        color = isLeading ? '#ffffff' : (this.glows[i] ? `rgba(255, 230, 150, ${alpha * mouseGlow})` : `rgba(212, 140, 0, ${alpha * mouseGlow})`);
                    } else {
                        // Standard green
                        ctx.shadowColor = '#00ff00';
                        color = this.glows[i] ? `rgba(180, 255, 180, ${alpha * mouseGlow})` : `rgba(0, 200, 0, ${alpha * mouseGlow})`;
                    }
                }

                ctx.fillStyle = color;

                // Warp effect (spoon bending) using simple sine wave x-offset
                let finalX = gridX;
                if (warpEffect) {
                    finalX += Math.sin((charY / 50) + (Date.now() / 200)) * 25;
                }

                ctx.fillText(this.chars[i], finalX, charY);
                ctx.shadowBlur = 0; // Reset blur for next char
            }
        }
    }

    function initializeColumns() {
        columns = [];
        const colWidth = 18; // space between drops
        const colCount = Math.floor(width / colWidth) + 1;
        for (let i = 0; i < colCount; i++) {
            columns.push(new Drop(i * colWidth));
        }
    }

    initializeColumns();

    // -------------------------------------------------------------------------
    // 4. Input Interactions
    // -------------------------------------------------------------------------
    // Mouse movement updates coordinates and tracks activity
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastActive = Date.now();
    });

    // Mouse click spawns shockwave/ripple
    window.addEventListener('click', (e) => {
        // Only trigger ripple if clicking the background canvas, not terminal window
        if (!e.target.closest('.terminal-container') && !e.target.closest('#dance-overlay')) {
            ripples.push({
                x: e.clientX,
                y: e.clientY,
                radius: 0,
                maxRadius: Math.max(width, height) * 0.4,
                speed: 12,
                thickness: 25
            });
        }
    });

    // Keyboard press spawns a fast falling column at random location containing the key pressed
    window.addEventListener('keydown', (e) => {
        // If they are typing in input or active terminal, ignore
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        // Spawn a custom fast column close to the mouse or at a random coordinate
        if (e.key.length === 1) {
            const randomX = Math.random() * width;
            const newDrop = new Drop(randomX);
            newDrop.speed = 8; // much faster
            newDrop.opacity = 1.0;
            newDrop.chars[0] = e.key; // leading char is what they typed
            newDrop.glows[0] = true;
            columns.push(newDrop);
            
            // Cap columns array size so it doesn't leak memory indefinitely
            if (columns.length > 300) {
                columns.shift();
            }
        }

        handleSecretPhrase(e.key);
    });

    // -------------------------------------------------------------------------
    // 5. Secret Phrases History Buffer & Dances
    // -------------------------------------------------------------------------
    let keyBuffer = '';
    const danceOverlay = document.getElementById('dance-overlay');
    const overlayText = document.getElementById('overlay-text');
    const overlaySubtext = document.getElementById('overlay-subtext');
    const terminalContainer = document.querySelector('.terminal-container');

    const phrases = [
        { key: "red pill", action: triggerRedPill },
        { key: "blue pill", action: triggerBluePill },
        { key: "white rabbit", action: triggerWhiteRabbit },
        { key: "neo", action: triggerNeoGold },
        { key: "morpheus", action: triggerMorpheus },
        { key: "there is no spoon", action: triggerSpoonWarp },
        { key: "knock knock", action: triggerWhiteRabbit },
        { key: "zion", action: triggerZionCore }
    ];

    function handleSecretPhrase(key) {
        // Accumulate keys, only keep letters and spaces
        if (key.length === 1) {
            keyBuffer += key.toLowerCase();
            // Cap history
            if (keyBuffer.length > 50) {
                keyBuffer = keyBuffer.slice(-50);
            }

            // Check if buffer ends with any of the key phrases
            for (const item of phrases) {
                if (keyBuffer.endsWith(item.key)) {
                    item.action();
                    keyBuffer = ''; // Reset buffer on match
                    break;
                }
            }
        }
    }

    function showOverlay(title, subtext, cssClass = '', duration = 8000) {
        danceOverlay.className = cssClass; // Clear and set classes
        overlayText.textContent = title;
        overlaySubtext.textContent = subtext;
        
        danceOverlay.classList.remove('hidden');
        
        setTimeout(() => {
            danceOverlay.classList.add('hidden');
        }, duration);
    }

    function triggerRedPill() {
        colorMode = 'red';
        terminalContainer.className = 'terminal-container red-state';
        showOverlay(
            "SYSTEM COMPROMISED: RED PILL PATH",
            "You take the red pill. You stay in Wonderland, and I show you how deep the rabbit hole goes.",
            "red-overlay"
        );
        setTimeout(() => {
            resetMatrixDances();
        }, 10000);
    }

    function triggerBluePill() {
        colorMode = 'blue';
        terminalContainer.className = 'terminal-container blue-state';
        showOverlay(
            "SYSTEM RESTORED: BLUE PILL PATH",
            "You take the blue pill. The story ends, you wake up in your bed and believe whatever you want to believe.",
            "blue-overlay"
        );
        setTimeout(() => {
            resetMatrixDances();
        }, 10000);
    }

    function triggerNeoGold() {
        colorMode = 'gold';
        bulletTime = true;
        terminalContainer.className = 'terminal-container gold-state';
        showOverlay(
            "COGNITIVE OVERCLOCK: CHOSEN_ONE_MODE",
            "Establishing bypass... 'There is a difference between knowing the path and walking the path.' Bullet time enabled.",
            "gold-overlay",
            6000
        );
        setTimeout(() => {
            resetMatrixDances();
        }, 8000);
    }

    function triggerMorpheus() {
        colorMode = 'gold';
        showOverlay(
            "AUTHORIZED BY MORPHEUS",
            "\"No one can be told what the Matrix is. You have to see it for yourself.\" High-resonance stream activated.",
            "gold-overlay",
            6000
        );
        setTimeout(() => {
            resetMatrixDances();
        }, 8000);
    }

    function triggerSpoonWarp() {
        warpEffect = true;
        showOverlay(
            "PERCEPTUAL ERROR: WAVE_WARP_ACTIVE",
            "\"Do not try and bend the spoon, that's impossible. Instead, only try to realize the truth... There is no spoon.\"",
            "",
            7000
        );
        setTimeout(() => {
            resetMatrixDances();
        }, 12000);
    }

    function triggerZionCore() {
        zionFrenzy = true;
        showOverlay(
            "ZION CORE INITIALIZED",
            "Decentralized mainframe overload! Operational rain capacity amplified 350%.",
            "",
            6000
        );
        setTimeout(() => {
            resetMatrixDances();
        }, 8000);
    }

    function triggerWhiteRabbit() {
        // Pause rain
        bulletTime = true;
        colorMode = 'green';
        
        // Show plain pitch-black overlay
        danceOverlay.className = '';
        danceOverlay.classList.remove('hidden');
        overlayText.textContent = '';
        overlaySubtext.textContent = '';

        const dialogue = [
            "Wake up, Neo...",
            "The Matrix has you...",
            "Follow the white rabbit.",
            "Knock, knock."
        ];

        let lineIdx = 0;
        let charIdx = 0;
        let currentString = '';
        
        function typeWriter() {
            if (lineIdx < dialogue.length) {
                const targetLine = dialogue[lineIdx];
                if (charIdx < targetLine.length) {
                    currentString += targetLine[charIdx];
                    overlayText.textContent = currentString;
                    charIdx++;
                    setTimeout(typeWriter, 110);
                } else {
                    // Line done. Pause and go to next line
                    lineIdx++;
                    charIdx = 0;
                    currentString = '';
                    setTimeout(() => {
                        overlayText.textContent = '';
                        typeWriter();
                    }, 1200);
                }
            } else {
                // Done writing dialogue! Resume
                danceOverlay.classList.add('hidden');
                resetMatrixDances();
                
                // Trigger massive burst
                ripples.push({
                    x: width / 2,
                    y: height / 2,
                    radius: 0,
                    maxRadius: Math.max(width, height) * 0.9,
                    speed: 18,
                    thickness: 50
                });
            }
        }

        typeWriter();
    }

    function resetMatrixDances() {
        colorMode = 'green';
        bulletTime = false;
        warpEffect = false;
        zionFrenzy = false;
        terminalContainer.className = 'terminal-container';
    }

    // -------------------------------------------------------------------------
    // 6. Animation Loop
    // -------------------------------------------------------------------------
    function animate() {
        // Clear background with semi-transparent black to create trailing fade
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, width, height);

        // Update and draw columns
        columns.forEach(col => {
            col.update();
            col.draw();
        });

        // Update and draw ripples
        ripples = ripples.filter(ripple => {
            ripple.radius += ripple.speed;
            return ripple.radius < ripple.maxRadius;
        });

        requestAnimationFrame(animate);
    }

    animate();
});
