// Global variables
let scene, camera, renderer, controls;
let spheres = [];
let connections = [];
let isRotating = true;
let mouseX = 0, mouseY = 0;

// Level data for 3D visualization
const levelData = [
    { name: "Parama Brahman", color: 0xFFD700, radius: 3, yPos: 40 },
    { name: "Cosmic Realms", color: 0x8B5CF6, radius: 2.5, yPos: 30 },
    { name: "Time Cycles", color: 0x3B82F6, radius: 2.3, yPos: 20 },
    { name: "Avatars", color: 0xFF6B35, radius: 2.1, yPos: 10 },
    { name: "Deities", color: 0xF59E0B, radius: 2, yPos: 0 },
    { name: "Epics", color: 0xEC4899, radius: 2, yPos: -10 },
    { name: "Human Realm", color: 0x10B981, radius: 2.1, yPos: -20 },
    { name: "Karma", color: 0x6366F1, radius: 2.2, yPos: -30 },
    { name: "Scriptures", color: 0xF97316, radius: 2.4, yPos: -40 },
    { name: "Moksha", color: 0xFFD700, radius: 2.8, yPos: -50 }
];

// Initialize Three.js scene
function initThreeJS() {
    const container = document.getElementById('canvas-container');
    
    // Create scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.002);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 0, 80);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight - 70);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Add point lights
    const pointLight1 = new THREE.PointLight(0x8B5CF6, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xFFD700, 1, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);
    
    // Create hierarchy spheres
    createHierarchySpheres();
    
    // Create connections
    createConnections();
    
    // Add particles
    createParticles();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Mouse move for parallax
    document.addEventListener('mousemove', onMouseMove);
    
    // Start animation
    animate();
}

// Create spheres for each level
function createHierarchySpheres() {
    levelData.forEach((level, index) => {
        // Create sphere geometry
        const geometry = new THREE.SphereGeometry(level.radius, 64, 64);
        
        // Create material with glow
        const material = new THREE.MeshPhongMaterial({
            color: level.color,
            emissive: level.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.9,
            shininess: 100
        });
        
        const sphere = new THREE.mesh(geometry, material);
        sphere.position.y = level.yPos;
        sphere.userData = { 
            level: index + 1, 
            name: level.name,
            originalY: level.yPos 
        };
        
        // Add wireframe
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color.setHex(level.color);
        line.material.opacity = 0.3;
        line.material.transparent = true;
        sphere.add(line);
        
        scene.add(sphere);
        spheres.push(sphere);
        
        // Add glow effect
        addGlow(sphere, level.color, level.radius);
    });
}

// Add glow effect to sphere
function addGlow(mesh, color, radius) {
    const glowGeometry = new THREE.SphereGeometry(radius * 1.3, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { type: "f", value: 0.5 },
            p: { type: "f", value: 4.5 },
            glowColor: { type: "c", value: new THREE.Color(color) },
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            uniform float c;
            uniform float p;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(c - dot(vNormal, vNormel), p);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, intensity);
            }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glowMesh);
}

// Create connections between levels
function createConnections() {
    for (let i = 0; i < spheres.length - 1; i++) {
        const points = [];
        const start = spheres[i].position;
        const end = spheres[i + 1].position;
        
        // Create curved connection
        const midPoint = new THREE.Vector3(
            (start.x + end.x) / 2 + Math.random() * 10 - 5,
            (start.y + end.y) / 2,
            (start.z + end.z) / 2 + Math.random() * 10 - 5
        );
        
        const curve = new THREE.QuadraticBezierCurve3(
            start.clone(),
            midPoint,
            end.clone()
        );
        
        points.push(...curve.getPoints(50));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.4,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        connections.push(line);
    }
}

// Create particle system
function createParticles() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions.push(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 200
        );
        
        const color = new THREE.Color();
        color.setHSL(Math.random(), 0.7, 0.5);
        colors.push(color.r, color.g, color.b);
    }
    
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate spheres
    spheres.forEach((sphere, index) => {
        if (isRotating) {
            sphere.rotation.y += 0.005 * (index + 1);
            sphere.rotation.x += 0.003 * (index + 1);
        }
        
        // Floating animation
        sphere.position.y = sphere.userData.originalY + Math.sin(Date.now() * 0.001 + index) * 2;
    });
    
    // Parallax effect
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight - 70);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 70);
}

// Handle mouse move
function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
}

// Control buttons functionality
function setupControls() {
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const resetView = document.getElementById('reset-view');
    const toggleRotation = document.getElementById('toggle-rotation');
    
    zoomIn.addEventListener('click', () => {
        camera.position.z = Math.max(camera.position.z - 10, 20);
    });
    
    zoomOut.addEventListener('click', () => {
        camera.position.z = Math.min(camera.position.z + 10, 150);
    });
    
    resetView.addEventListener('click', () => {
        camera.position.set(0, 0, 80);
        camera.lookAt(scene.position);
    });
    
    toggleRotation.addEventListener('click', () => {
        isRotating = !isRotating;
        toggleRotation.style.opacity = isRotating ? '1' : '0.5';
    });
}

// Scroll-based interactions
function setupScrollInteractions() {
    const contentOverlay = document.getElementById('content-overlay');
    const levelCards = document.querySelectorAll('.level-card');
    
    contentOverlay.addEventListener('scroll', () => {
        const scrollTop = contentOverlay.scrollTop;
        const scrollHeight = contentOverlay.scrollHeight - contentOverlay.clientHeight;
        const scrollPercentage = scrollTop / scrollHeight;
        
        // Update camera position based on scroll
        if (camera && spheres.length > 0) {
            const targetY = 40 - (scrollPercentage * 90);
            camera.position.y += (targetY - camera.position.y) * 0.1;
        }
        
        // Highlight corresponding sphere
        levelCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
            
            if (isVisible && spheres[index]) {
                spheres[index].material.emissiveIntensity = 0.8;
                spheres[index].scale.set(1.2, 1.2, 1.2);
            } else if (spheres[index]) {
                spheres[index].material.emissiveIntensity = 0.3;
                spheres[index].scale.set(1, 1, 1);
            }
        });
    });
}

// Info panel functionality
function setupInfoPanel() {
    const infoPanel = document.getElementById('info-panel');
    const closeBtn = document.getElementById('close-info');
    const levelCards = document.querySelectorAll('.level-card');
    
    closeBtn.addEventListener('click', () => {
        infoPanel.classList.remove('active');
    });
    
    levelCards.forEach((card, index) => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a')) {
                const levelContent = card.querySelector('.level-content').innerHTML;
                const levelTitle = card.querySelector('.level-header h2').textContent;
                
                infoPanel.querySelector('.info-content').innerHTML = `
                    <h2>${levelTitle}</h2>
                    ${levelContent}
                `;
                infoPanel.classList.add('active');
            }
        });
    });
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = link.getAttribute('data-view');
            
            switch(view) {
                case '3d':
                    document.getElementById('canvas-container').style.display = 'block';
                    document.getElementById('content-overlay').style.opacity = '0.3';
                    break;
                case 'hierarchy':
                    document.getElementById('content-overlay').style.opacity = '1';
                    document.getElementById('content-overlay').scrollTo({ top: 0, behavior: 'smooth' });
                    break;
                case 'timeline':
                    // Scroll to time cycles section
                    const timeCard = document.querySelector('.level-card[data-level="3"]');
                    timeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    break;
                case 'about':
                    showAboutModal();
                    break;
            }
        });
    });
}

// Show about modal
function showAboutModal() {
    const infoPanel = document.getElementById('info-panel');
    infoPanel.querySelector('.info-content').innerHTML = `
        <h2>About Sanatan Cosmos</h2>
        <p>This interactive visualization presents the hierarchical structure of Sanatan Dharma (Hinduism), one of the world's oldest spiritual traditions.</p>
        
        <h3>Navigation</h3>
        <ul>
            <li>Scroll through the levels to explore the cosmic hierarchy</li>
            <li>Use the floating controls to interact with the 3D visualization</li>
            <li>Click on any level card to see more details</li>
        </ul>
        
        <h3>The Journey</h3>
        <p>From the formless Ultimate Reality (Parama Brahman) to the goal of Liberation (Moksha), this visualization traces the complete cosmological and spiritual framework of Sanatan Dharma.</p>
        
        <h3>Technology</h3>
        <p>Built with Three.js for 3D visualization, featuring modern CSS animations and responsive design.</p>
        
        <p style="margin-top: 30px; text-align: center; font-family: 'Noto Sans Devanagari', sans-serif; font-size: 24px;">ॐ</p>
    `;
    infoPanel.classList.add('active');
}

// Initialize keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp':
                camera.position.z = Math.max(camera.position.z - 5, 20);
                break;
            case 'ArrowDown':
                camera.position.z = Math.min(camera.position.z + 5, 150);
                break;
            case 'r':
            case 'R':
                camera.position.set(0, 0, 80);
                camera.lookAt(scene.position);
                break;
            case ' ':
                isRotating = !isRotating;
                e.preventDefault();
                break;
            case 'Escape':
                document.getElementById('info-panel').classList.remove('active');
                break;
        }
    });
}

// Add smooth scroll reveal for level cards
function setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.level-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
    }, 2000);
    
    // Initialize Three.js
    setTimeout(() => {
        initThreeJS();
        setupControls();
        setupScrollInteractions();
        setupInfoPanel();
        setupNavigation();
        setupKeyboardShortcuts();
        setupScrollReveal();
    }, 2100);
});

// Add touch support for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchmove', (e) => {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    
    const deltaX = (touchEndX - touchStartX) / 100;
    const deltaY = (touchEndY - touchStartY) / 100;
    
    if (camera) {
        camera.position.x += deltaX;
        camera.position.y -= deltaY;
    }
});

document.addEventListener('touchend', () => {
    touchStartX = 0;
    touchStartY = 0;
});

