const invertButton = document.getElementById('btn-invert')

invertButton?.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
})

const clock = document.getElementById('clock');

function updateClock() {
    if (!clock) return;

    clock.textContent = new Date().toLocaleTimeString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        hour: '2-digit',
        minute: '2-digit'
    });
}

if (clock) {
    updateClock();
    setInterval(updateClock, 60000);
}

const discordUserId = '836178992817504346';
const musicText = document.getElementById('spotify-text');
const musicImage = document.getElementById('spotify-image');
const activityText = document.getElementById('activity-text');

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
        const { data } = await response.json();

        if (musicText && musicImage) {
            if (data.listening_to_spotify) {
                musicText.textContent = `listening to ${data.spotify.song} by ${data.spotify.artist}`;
                musicImage.style.backgroundImage = `url(${data.spotify.album_art_url})`;
            } else {
                musicText.textContent = 'Not listening to Spotify.';
                musicImage.style.backgroundImage = 'none';
            }
        }

        if (activityText) {
            const activity = data.activities.find(({ type }) => type !== 2 && type !== 4);
            const details = activity?.details ? ` (${activity.details})` : '';
            activityText.textContent = activity
                ? `Using ${activity.name}${details}`
                : 'Not doing anything on Discord.';
        }
    } catch (error) {
        console.error('Error fetching Discord status:', error);
    }
}

if (musicText || activityText) {
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 30000);
}

const revealTargets = document.querySelectorAll(
    '#pageContent > h1, #pageContent > section:not(#Awards):not(#Projects), .project-intro, .award-intro, .timeline-item, #project-table, footer.glass-footer'
);

if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
    }, { threshold: 0.05 });

    revealTargets.forEach((target) => {
        target.classList.add('scroll-reveal');
        revealObserver.observe(target);
    });
}


const slides = [
    {
        image: 'src/awards/2024 state.webp',
        description: 'Designed & built an autonomous rescue robot, placing 4th regionally and 1st statewide to reach the National finals.'
    },
    {
        image: 'src/awards/2026 regional.webp',
        description: 'Coded and wired an autonomous rescue robot in just 3 days, securing a top regional rank through precise line-following.'
    },
    {
        image: 'src/awards/rnm.webp',
        description: 'Earned a full scholarship for a 1-month exchange at Brock University (Canada) after ranking top 100/1,000 in the Recife no Mundo program.'
    }
];

const slider = document.querySelector('.slider');
const stage = document.querySelector('.stage');
const orbit = document.querySelector('.orbit');
const previewBox = document.querySelector('.preview');
const titleElement = document.querySelector('.title');

if (slider && stage && orbit && previewBox) {
    const angleBetweenSlides = 360 / slides.length;
    const previewText = document.createElement('p');
    previewText.className = 'preview-text';
    previewBox.appendChild(previewText);

    function getOrbitRadius() {
        return window.innerWidth <= 768
            ? Math.min(400, window.innerWidth * 0.28)
            : Math.min(400, window.innerWidth * 0.42);
    }

    let orbitRadius = getOrbitRadius();

    function updateOrbitRadius() {
        orbitRadius = getOrbitRadius();
        orbit.querySelectorAll('.panel').forEach((panel, index) => {
            panel.style.transform = `rotateY(${index * angleBetweenSlides}deg) translateZ(${orbitRadius}px)`;
        });
    }

    slides.forEach((item, index) => {
        const panel = document.createElement('div');
        const image = document.createElement('img');

        panel.className = 'panel';
        image.src = item.image;
        image.alt = item.description;
        panel.appendChild(image);
        panel.style.transform = `rotateY(${index * angleBetweenSlides}deg) translateZ(${orbitRadius}px)`;
        orbit.appendChild(panel);
    });

    function updateSlideDescription(index) {
        previewText.textContent = slides[index].description;
        if (titleElement) {
            titleElement.textContent = slides[index].description;
        }
    }

    window.addEventListener('resize', updateOrbitRadius);
    updateSlideDescription(0);

    const interpolate = (from, to, amount) => from + (to - from) * amount;
    const animationSmoothing = 0.12;
    let targetRotation = 0;
    let currentRotation = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartRotation = 0;
    let activeSlideIndex = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;

    slider.addEventListener('pointerdown', (event) => {
        isDragging = true;
        dragStartX = event.clientX;
        dragStartRotation = targetRotation;
        slider.setPointerCapture(event.pointerId);
    });

    slider.addEventListener('pointermove', (event) => {
        if (isDragging) {
            targetRotation = dragStartRotation + (event.clientX - dragStartX) * 1.9;
        }
    });

    slider.addEventListener('pointerup', (event) => {
        isDragging = false;
        if (slider.hasPointerCapture(event.pointerId)) {
            slider.releasePointerCapture(event.pointerId);
        }
    });

    slider.addEventListener('pointercancel', () => {
        isDragging = false;
    });

    slider.addEventListener('mousemove', (event) => {
        targetTiltX = (event.clientX / window.innerWidth - 0.5) * 30;
        targetTiltY = (event.clientY / window.innerHeight - 0.5) * 30;
    });

    slider.addEventListener('mouseleave', () => {
        targetTiltX = 0;
        targetTiltY = 0;
    });

    function animate() {
        currentRotation = interpolate(currentRotation, targetRotation, animationSmoothing);
        currentTiltX = interpolate(currentTiltX, targetTiltX, animationSmoothing);
        currentTiltY = interpolate(currentTiltY, targetTiltY, animationSmoothing);

        const rotationStep = Math.round(-currentRotation / angleBetweenSlides);
        const nextSlideIndex = (rotationStep % slides.length + slides.length) % slides.length;

        if (nextSlideIndex !== activeSlideIndex) {
            activeSlideIndex = nextSlideIndex;
            updateSlideDescription(activeSlideIndex);
        }

        orbit.style.transform = `translate(-50%, -50%) rotateY(${currentRotation}deg)`;
        stage.style.transform = `rotateY(${currentTiltX}deg) rotateX(${-currentTiltY}deg)`;
        requestAnimationFrame(animate);
    }

    animate();
}