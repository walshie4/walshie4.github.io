const matrixRainContainer = document.body; // You can also make this specific to a div if needed

function createRaindrop() {
    const raindrop = document.createElement('span');
    raindrop.textContent = String.fromCharCode(Math.random() * 94 + 33); // Random ASCII characters
    raindrop.style.left = Math.random() * 100 + 'vw';
    raindrop.style.animationDuration = Math.random() * 5 + 5 + 's'; // Random duration between 5-10s
    raindrop.style.animationDelay = Math.random() * -5 + 's'; // Start some drops early

    matrixRainContainer.appendChild(raindrop);

    // Remove raindrop after animation ends
    raindrop.addEventListener('animationend', () => {
        raindrop.remove();
    });
}

// Create initial raindrops
for (let i = 0; i < 100; i++) { // Adjust the number of initial drops as needed
    createRaindrop();
}

// Continuously add new raindrops to maintain the effect
setInterval(createRaindrop, 50); // Adjust interval to control drop frequency
