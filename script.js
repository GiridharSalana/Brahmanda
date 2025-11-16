// Sanatan Cosmos - 3D Interactive Visualization
// Global variables
let scene, camera, renderer;
let spheres = [];
let deityCharacters = [];
let connections = [];
let isRotating = false;
let raycaster, mouse;
let INTERSECTED = null;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Simplified hierarchy for better flow
const cosmicLevels = [
    {
        name: "PARAMA BRAHMAN",
        subtitle: "Ultimate Reality",
        color: 0xFFD700,
        position: { x: 0, y: 60, z: 0 },
        radius: 5,
        description: "The supreme, formless absolute reality"
    },
    {
        name: "TRIMURTI",
        subtitle: "Creator, Preserver, Destroyer",
        color: 0xFF6B35,
        position: { x: 0, y: 45, z: 0 },
        radius: 4,
        description: "Brahma, Vishnu, Shiva - The cosmic trinity"
    },
    {
        name: "LOKAS",
        subtitle: "14 Cosmic Realms",
        color: 0x8B5CF6,
        position: { x: 0, y: 30, z: 0 },
        radius: 3.5,
        description: "Upper, Middle, and Lower worlds"
    },
    {
        name: "KARMA & DHARMA",
        subtitle: "Cosmic Law",
        color: 0x3B82F6,
        position: { x: 0, y: 15, z: 0 },
        radius: 3,
        description: "Universal principles of action and duty"
    },
    {
        name: "MOKSHA",
        subtitle: "Liberation",
        color: 0xFFD700,
        position: { x: 0, y: 0, z: 0 },
        radius: 3,
        description: "Final freedom from cycle of rebirth"
    }
];

// Initialize
function init() {
    console.log('Initializing Sanatan Cosmos...');
    
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.002);
    
    // Camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 30, 80);
    camera.lookAt(0, 30, 0);
    
    // Renderer
    const canvas = document.getElementById('canvas-container');
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    canvas.appendChild(renderer.domElement);
    
    // Raycaster
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Lighting
    setupLighting();
    
    // Create cosmic background
    createStarfield();
    
    // Create main spheres
    createCosmicSpheres();
    
    // Create 3D Deity Characters
    createDeityCharacters();
    
    // Create connections
    createFlowingConnections();
    
    // Controls
    setupControls();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    
    // UI
    setupUI();
    
    // Start animation
    animate();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => loadingScreen.style.display = 'none', 500);
        }
    }, 2000);
    
    console.log('Initialization complete!');
}

// Lighting setup
function setupLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);
    
    // Directional lights
    const light1 = new THREE.DirectionalLight(0xFFD700, 1);
    light1.position.set(50, 100, 50);
    scene.add(light1);
    
    const light2 = new THREE.DirectionalLight(0x8B5CF6, 0.8);
    light2.position.set(-50, 50, -50);
    scene.add(light2);
    
    // Point lights for drama
    const pointLight1 = new THREE.PointLight(0xFF6B35, 2, 100);
    pointLight1.position.set(0, 60, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x4169E1, 1.5, 100);
    pointLight2.position.set(0, 40, -20);
    scene.add(pointLight2);
}

// Create starfield background
function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 0.7,
        transparent: true,
        opacity: 0.8
    });
    
    const starsVertices = [];
    for (let i = 0; i < 10000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
}

// Create main cosmic spheres
function createCosmicSpheres() {
    cosmicLevels.forEach((level, index) => {
        const geometry = new THREE.SphereGeometry(level.radius, 64, 64);
        const material = new THREE.MeshPhongMaterial({
            color: level.color,
            emissive: level.color,
            emissiveIntensity: 0.5,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(level.position.x, level.position.y, level.position.z);
        sphere.userData = level;
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        
        // Add glow
        const glowGeometry = new THREE.SphereGeometry(level.radius * 1.2, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: level.color,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.raycast = () => {}; // Disable raycasting
        sphere.add(glow);
        
        scene.add(sphere);
        spheres.push(sphere);
    });
}

// Create 3D Deity Characters
function createDeityCharacters() {
    if (typeof DeityModels === 'undefined') {
        console.warn('DeityModels not loaded');
        return;
    }
    
    try {
        // Brahma - Left of Trimurti sphere
        const brahma = DeityModels.createBrahma(scene, new THREE.Vector3(-25, 45, 10));
        brahma.scale.set(0.8, 0.8, 0.8);
        deityCharacters.push(brahma);
        
        // Shiva - Right of Trimurti sphere
        const shiva = DeityModels.createShiva(scene, new THREE.Vector3(25, 45, -10));
        shiva.scale.set(0.8, 0.8, 0.8);
        deityCharacters.push(shiva);
        
        // Krishna - Front center
        const krishna = DeityModels.createKrishna(scene, new THREE.Vector3(0, 42, 25));
        krishna.scale.set(0.8, 0.8, 0.8);
        deityCharacters.push(krishna);
        
        console.log(`Created ${deityCharacters.length} deity characters`);
    } catch (error) {
        console.error('Error creating deities:', error);
    }
}

// Create flowing energy connections
function createFlowingConnections() {
    for (let i = 0; i < cosmicLevels.length - 1; i++) {
        const start = cosmicLevels[i].position;
        const end = cosmicLevels[i + 1].position;
        
        // Create curved path
        const curve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(start.x, start.y, start.z),
            new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2, (start.z + end.z) / 2 + 10),
            new THREE.Vector3(end.x, end.y, end.z)
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.4,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        connections.push(line);
        
        // Add flowing particles
        createFlowingParticles(curve, cosmicLevels[i].color);
    }
}

// Create particles that flow along connections
function createFlowingParticles(curve, color) {
    const particleCount = 20;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const geometry = new THREE.SphereGeometry(0.3, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.userData.t = i / particleCount;
        particle.userData.speed = 0.001 + Math.random() * 0.002;
        particle.userData.curve = curve;
        
        scene.add(particle);
        particles.push(particle);
    }
    
    return particles;
}

// Setup controls
function setupControls() {
    const canvas = renderer.domElement;
    let mouseDownPosition = null;
    let hasMoved = false;
    
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        hasMoved = false;
        mouseDownPosition = { x: e.clientX, y: e.clientY };
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            
            if (Math.abs(deltaMove.x) > 5 || Math.abs(deltaMove.y) > 5) {
                hasMoved = true;
            }
            
            if (hasMoved) {
                const rotationSpeed = 0.005;
                camera.position.x += deltaMove.x * rotationSpeed * 5;
                camera.position.z += deltaMove.y * rotationSpeed * 5;
                camera.lookAt(0, 30, 0);
            }
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        if (!hasMoved && mouseDownPosition) {
            // Click detected
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
            
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(spheres, false);
            
            if (intersects.length > 0) {
                const clicked = intersects[0].object;
                showInfo(clicked.userData);
            }
        }
        
        isDragging = false;
        hasMoved = false;
        mouseDownPosition = null;
    });
    
    // Scroll zoom
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const delta = e.deltaY * zoomSpeed;
        
        camera.position.z += delta;
        camera.position.z = Math.max(40, Math.min(camera.position.z, 150));
    });
    
    // Space for auto-rotate
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            isRotating = !isRotating;
        }
    });
}

// Show information panel
function showInfo(data) {
    const panel = document.getElementById('detail-panel');
    const title = document.getElementById('detail-title');
    const body = document.getElementById('detail-body');
    
    if (panel && title && body) {
        title.textContent = data.name;
        body.innerHTML = `
            <p style="font-size: 18px; color: #FFD700; margin-bottom: 15px;">${data.subtitle}</p>
            <p style="font-size: 16px; line-height: 1.8;">${data.description}</p>
        `;
        panel.classList.add('active');
    }
}

// Mouse move for hover
function onMouseMove(event) {
    if (isDragging) return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(spheres, false);
    
    const tooltip = document.getElementById('tooltip');
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        if (INTERSECTED !== object) {
            if (INTERSECTED && INTERSECTED.material) {
                INTERSECTED.material.emissiveIntensity = 0.5;
            }
            
            INTERSECTED = object;
            INTERSECTED.material.emissiveIntensity = 1.0;
            
            if (tooltip && object.userData.name) {
                tooltip.textContent = object.userData.name;
                tooltip.style.left = event.clientX + 10 + 'px';
                tooltip.style.top = event.clientY + 10 + 'px';
                tooltip.classList.add('visible');
            }
        }
        
        renderer.domElement.style.cursor = 'pointer';
    } else {
        if (INTERSECTED && INTERSECTED.material) {
            INTERSECTED.material.emissiveIntensity = 0.5;
        }
        INTERSECTED = null;
        renderer.domElement.style.cursor = 'default';
        
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }
}

// Window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// UI Setup
function setupUI() {
    // Close detail panel
    const closeBtn = document.getElementById('close-detail');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const panel = document.getElementById('detail-panel');
            if (panel) panel.classList.remove('active');
        });
    }
    
    // Control orb
    const orbToggle = document.getElementById('orb-toggle');
    const controlRing = document.getElementById('control-ring');
    
    if (orbToggle && controlRing) {
        orbToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            orbToggle.classList.toggle('active');
            controlRing.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!orbToggle.contains(e.target) && !controlRing.contains(e.target)) {
                orbToggle.classList.remove('active');
                controlRing.classList.remove('active');
            }
        });
    }
    
    // Reset button
    document.querySelector('[data-action="reset"]')?.addEventListener('click', () => {
        camera.position.set(0, 30, 80);
        camera.lookAt(0, 30, 0);
        isRotating = false;
    });
    
    // Auto-rotate button
    document.querySelector('[data-action="auto-rotate"]')?.addEventListener('click', () => {
        isRotating = !isRotating;
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Auto-rotate camera
    if (isRotating) {
        camera.position.x = Math.sin(time * 0.2) * 80;
        camera.position.z = Math.cos(time * 0.2) * 80;
        camera.lookAt(0, 30, 0);
    }
    
    // Animate spheres
    spheres.forEach((sphere, index) => {
        sphere.rotation.y += 0.003;
        
        // Floating effect
        const originalY = cosmicLevels[index].position.y;
        sphere.position.y = originalY + Math.sin(time + index) * 1;
        
        // Pulse glow
        if (sphere.children[0]) {
            const glowScale = 1 + Math.sin(time * 2 + index) * 0.1;
            sphere.children[0].scale.set(glowScale, glowScale, glowScale);
        }
    });
    
    // Animate deity characters
    deityCharacters.forEach(deity => {
        if (deity.userData && deity.userData.animate) {
            deity.userData.animate(time);
        }
    });
    
    // Animate particles
    scene.children.forEach(child => {
        if (child.userData.curve) {
            child.userData.t += child.userData.speed;
            if (child.userData.t > 1) child.userData.t = 0;
            
            const point = child.userData.curve.getPoint(child.userData.t);
            child.position.copy(point);
        }
    });
    
    renderer.render(scene, camera);
}

// Start when ready
function startApp() {
    let attempts = 0;
    const maxAttempts = 50;
    
    const checkAndStart = () => {
        attempts++;
        
        if (typeof THREE !== 'undefined') {
            console.log('Three.js loaded, starting app...');
            init();
        } else if (attempts < maxAttempts) {
            console.log(`Waiting for Three.js... (${attempts}/${maxAttempts})`);
            setTimeout(checkAndStart, 100);
        } else {
            console.error('Failed to load Three.js after maximum attempts');
        }
    };
    
    checkAndStart();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
} else {
    startApp();
}
