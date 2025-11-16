// Global variables
let scene, camera, renderer, controls;
let spheres = [];
let textLabels = [];
let connections = [];
let particleSystems = [];
let isRotating = false;
let raycaster, mouse;
let selectedSphere = null;
let INTERSECTED = null;

// Hierarchy data with detailed information
const hierarchyData = [
    {
        id: 1,
        name: "PARAMA BRAHMAN",
        subtitle: "Ultimate Reality",
        color: 0xFFD700,
        position: { x: 0, y: 50, z: 0 },
        radius: 4,
        details: {
            title: "Parama Brahman - Ultimate Reality",
            content: `
                <h3>Nirguna Brahman</h3>
                <p>The formless, attribute-less absolute reality beyond all descriptions and concepts.</p>
                
                <h3>Saguna Brahman / Ishwara</h3>
                <p>The personal aspect of the divine with qualities.</p>
                
                <div class="sub-section">
                    <h3>Trimurti (Cosmic Functions)</h3>
                    <ul>
                        <li><strong>Brahma</strong> → Creator of the universe</li>
                        <li><strong>Vishnu</strong> → Preserver and sustainer</li>
                        <li><strong>Shiva</strong> → Destroyer and transformer</li>
                    </ul>
                </div>
                
                <div class="sub-section">
                    <h3>Shakti (Divine Energy)</h3>
                    <ul>
                        <li><strong>Saraswati</strong> → Goddess of knowledge (Brahma)</li>
                        <li><strong>Lakshmi</strong> → Goddess of prosperity (Vishnu)</li>
                        <li><strong>Parvati/Durga/Kali</strong> → Goddess of power (Shiva)</li>
                        <li><strong>Adi Shakti</strong> → Supreme cosmic energy</li>
                    </ul>
                </div>
            `
        }
    },
    {
        id: 2,
        name: "COSMIC REALMS",
        subtitle: "14 Lokas",
        color: 0x8B5CF6,
        position: { x: -15, y: 35, z: 5 },
        radius: 3.5,
        details: {
            title: "Cosmic Realms - The 14 Lokas",
            content: `
                <h3>Upper Lokas (Heavenly Realms)</h3>
                <ul>
                    <li><strong>Satya-loka</strong> → Realm of Brahma, highest existence</li>
                    <li><strong>Tapa-loka</strong> → Realm of self-realized beings</li>
                    <li><strong>Jana-loka</strong> → Realm of Brahma's sons</li>
                    <li><strong>Mahar-loka</strong> → Realm of great sages</li>
                    <li><strong>Svar-loka</strong> → Heaven, realm of Indra</li>
                </ul>
                
                <h3>Middle Loka</h3>
                <ul>
                    <li><strong>Bhu-loka</strong> → Earth and human realm</li>
                </ul>
                
                <h3>Lower Lokas (Subterranean Realms)</h3>
                <ul>
                    <li><strong>Atala through Patala</strong> → Seven underground realms</li>
                </ul>
            `
        }
    },
    {
        id: 3,
        name: "TIME CYCLES",
        subtitle: "Kala Chakra",
        color: 0x3B82F6,
        position: { x: 15, y: 35, z: -5 },
        radius: 3.5,
        details: {
            title: "Cosmic Time Cycles",
            content: `
                <h3>Kalpa</h3>
                <p><strong>4.32 billion years</strong> = One day of Brahma</p>
                <p>At the end of each Kalpa, the universe undergoes partial dissolution.</p>
                
                <h3>Manvantara</h3>
                <p><strong>306.72 million years</strong> = Rule of one Manu</p>
                <p>14 Manvantaras make one Kalpa.</p>
                
                <div class="sub-section">
                    <h3>Maha Yuga (4.32 million years)</h3>
                    <ul>
                        <li><strong>Satya Yuga</strong> → Golden age of truth (1,728,000 years)</li>
                        <li><strong>Treta Yuga</strong> → Age of Ramayana (1,296,000 years)</li>
                        <li><strong>Dvapara Yuga</strong> → Age of Mahabharata (864,000 years)</li>
                        <li><strong>Kali Yuga</strong> → Current age (432,000 years)</li>
                    </ul>
                </div>
            `
        }
    },
    {
        id: 4,
        name: "AVATARS",
        subtitle: "Divine Incarnations",
        color: 0xFF6B35,
        position: { x: -20, y: 20, z: -10 },
        radius: 3,
        details: {
            title: "Avatars & Divine Incarnations",
            content: `
                <h3>Dashavatara (10 Avatars of Vishnu)</h3>
                <ul>
                    <li><strong>Matsya</strong> → Fish, saved Manu from the flood</li>
                    <li><strong>Kurma</strong> → Tortoise, churning of the ocean</li>
                    <li><strong>Varaha</strong> → Boar, rescued Earth</li>
                    <li><strong>Narasimha</strong> → Man-Lion, defeated Hiranyakashipu</li>
                    <li><strong>Vamana</strong> → Dwarf, subdued Bali</li>
                    <li><strong>Parashurama</strong> → Warrior with axe</li>
                    <li><strong>Rama</strong> → Prince of Ayodhya</li>
                    <li><strong>Krishna</strong> → Divine cowherd</li>
                    <li><strong>Buddha</strong> → The enlightened one</li>
                    <li><strong>Kalki</strong> → Future avatar (yet to come)</li>
                </ul>
                
                <h3>Chiranjeevis (8 Immortals)</h3>
                <p>Hanuman, Parashurama, Vyasa, Vibhishana, Kripacharya, Ashwatthama, Bali, Markandeya</p>
            `
        }
    },
    {
        id: 5,
        name: "DEITIES",
        subtitle: "33 Koti Devas",
        color: 0xF59E0B,
        position: { x: 0, y: 20, z: 15 },
        radius: 3,
        details: {
            title: "Deities & Cosmic Forces",
            content: `
                <h3>33 Koti (Types) of Devas</h3>
                <ul>
                    <li><strong>12 Adityas</strong> → Solar deities (Surya, etc.)</li>
                    <li><strong>11 Rudras</strong> → Forms of Shiva</li>
                    <li><strong>8 Vasus</strong> → Elemental deities</li>
                    <li><strong>2 Ashvins</strong> → Divine physicians</li>
                    <li><strong>Indra</strong> → King of Devas</li>
                    <li><strong>Prajapati</strong> → Lord of creatures</li>
                </ul>
                
                <h3>Asuras & Opposition Forces</h3>
                <p>Daityas, Danavas, and Rakshasas maintain cosmic balance through opposition.</p>
                
                <h3>Dharma (Cosmic Law)</h3>
                <p>The eternal order maintained by deities and avatars.</p>
            `
        }
    },
    {
        id: 6,
        name: "EPICS",
        subtitle: "Itihasa",
        color: 0xEC4899,
        position: { x: 20, y: 20, z: 10 },
        radius: 3,
        details: {
            title: "Itihasa & Sacred Epics",
            content: `
                <h3>Ramayana</h3>
                <p><strong>Treta Yuga</strong> → Composed by Sage Valmiki</p>
                <p>Story of Lord Rama's life, exile, and victory over Ravana. Teaches dharma, duty, and devotion.</p>
                
                <h3>Mahabharata</h3>
                <p><strong>Dvapara Yuga</strong> → Composed by Sage Vyasa</p>
                <p>Epic war between Pandavas and Kauravas. Contains the Bhagavad Gita.</p>
                
                <h3>18 Puranas</h3>
                <p>Ancient texts containing stories, cosmology, genealogies, and legends of deities and kings.</p>
                
                <h3>Core Teachings</h3>
                <ul>
                    <li>Dharma (righteousness)</li>
                    <li>Karma (action and consequence)</li>
                    <li>Bhakti (devotion)</li>
                    <li>Moksha (liberation)</li>
                </ul>
            `
        }
    },
    {
        id: 7,
        name: "HUMAN REALM",
        subtitle: "Social Order",
        color: 0x10B981,
        position: { x: -15, y: 5, z: 5 },
        radius: 3.2,
        details: {
            title: "Human Realm - Social & Spiritual Structure",
            content: `
                <h3>Varna System (Social Classes)</h3>
                <ul>
                    <li><strong>Brahmana</strong> → Priests, teachers, scholars</li>
                    <li><strong>Kshatriya</strong> → Warriors, rulers, protectors</li>
                    <li><strong>Vaishya</strong> → Merchants, farmers, traders</li>
                    <li><strong>Shudra</strong> → Artisans, laborers, service providers</li>
                </ul>
                
                <h3>Ashrama System (Life Stages)</h3>
                <ul>
                    <li><strong>Brahmacharya</strong> → Student life, celibacy, learning</li>
                    <li><strong>Grihastha</strong> → Householder, family life</li>
                    <li><strong>Vanaprastha</strong> → Retirement, gradual detachment</li>
                    <li><strong>Sannyasa</strong> → Renunciation, spiritual focus</li>
                </ul>
                
                <div class="sub-section">
                    <h3>Purusharthas (Four Goals of Life)</h3>
                    <ul>
                        <li><strong>Dharma</strong> → Righteousness, duty</li>
                        <li><strong>Artha</strong> → Prosperity, wealth</li>
                        <li><strong>Kama</strong> → Desire, pleasure</li>
                        <li><strong>Moksha</strong> → Liberation, ultimate freedom</li>
                    </ul>
                </div>
            `
        }
    },
    {
        id: 8,
        name: "KARMA",
        subtitle: "Cycle of Rebirth",
        color: 0x6366F1,
        position: { x: 15, y: 5, z: -5 },
        radius: 3.2,
        details: {
            title: "Karma & Reincarnation",
            content: `
                <h3>Jiva (Individual Soul)</h3>
                <p>The eternal soul experiences continuous cycle of birth → death → rebirth (Samsara).</p>
                
                <h3>Three Types of Karma</h3>
                <ul>
                    <li><strong>Sanchita Karma</strong> → Accumulated karma from all past lives</li>
                    <li><strong>Prarabdha Karma</strong> → Portion of karma being experienced in current life</li>
                    <li><strong>Kriyamana Karma</strong> → New karma being created through present actions</li>
                </ul>
                
                <h3>Law of Karma</h3>
                <p>Every action has consequences. Good actions lead to positive outcomes, negative actions lead to suffering.</p>
                
                <h3>Ultimate Goal</h3>
                <p><strong>Moksha (Liberation)</strong> → Breaking free from the cycle of rebirth and reuniting with Brahman.</p>
            `
        }
    },
    {
        id: 9,
        name: "SCRIPTURES",
        subtitle: "Shruti & Smriti",
        color: 0xF97316,
        position: { x: -10, y: -10, z: -8 },
        radius: 3.5,
        details: {
            title: "Sacred Scriptures - Shruti & Smriti",
            content: `
                <h3>Shruti (Heard/Revealed Knowledge)</h3>
                <p>The most authoritative scriptures, considered eternal and divine.</p>
                
                <div class="sub-section">
                    <h3>Four Vedas</h3>
                    <ul>
                        <li><strong>Rigveda</strong> → Hymns and prayers (oldest text)</li>
                        <li><strong>Samaveda</strong> → Musical chants</li>
                        <li><strong>Yajurveda</strong> → Sacrificial formulas</li>
                        <li><strong>Atharvaveda</strong> → Spells and incantations</li>
                    </ul>
                </div>
                
                <div class="sub-section">
                    <h3>Upanishads</h3>
                    <p>108 philosophical texts exploring the nature of reality, Brahman, and Atman.</p>
                </div>
                
                <h3>Smriti (Remembered Knowledge)</h3>
                <ul>
                    <li>Puranas (18 major texts)</li>
                    <li>Ramayana & Mahabharata</li>
                    <li>Bhagavad Gita</li>
                    <li>Dharma Shastras (law codes)</li>
                    <li>Agamas & Tantras</li>
                </ul>
            `
        }
    },
    {
        id: 10,
        name: "MOKSHA",
        subtitle: "Liberation",
        color: 0xFFD700,
        position: { x: 10, y: -10, z: 8 },
        radius: 4,
        details: {
            title: "Moksha - Ultimate Liberation",
            content: `
                <h3>The Ultimate Goal</h3>
                <p>Moksha is the realization of the unity between Atman (individual soul) and Brahman (universal consciousness).</p>
                
                <h3>Freedom from Samsara</h3>
                <p>Liberation from the endless cycle of birth, death, and rebirth. Attainment of eternal bliss and peace.</p>
                
                <div class="sub-section">
                    <h3>Four Paths to Moksha</h3>
                    <ul>
                        <li><strong>Karma Yoga</strong> → Path of selfless action and duty</li>
                        <li><strong>Bhakti Yoga</strong> → Path of devotion and love for God</li>
                        <li><strong>Jnana Yoga</strong> → Path of knowledge and wisdom</li>
                        <li><strong>Raja Yoga</strong> → Path of meditation and mental discipline</li>
                    </ul>
                </div>
                
                <h3>Self-Realization</h3>
                <p>"Tat Tvam Asi" (That Thou Art) - Recognition that the individual self is identical with the ultimate reality.</p>
                
                <p style="text-align: center; margin-top: 30px; font-size: 24px; font-family: 'Noto Sans Devanagari', sans-serif;">ॐ शान्तिः शान्तिः शान्तिः</p>
            `
        }
    }
];

// Initialize scene
function init() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);
    scene.fog = new THREE.FogExp2(0x0a0a0f, 0.008);
    
    // Create camera
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 20, 70);
    camera.lookAt(0, 15, 0);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight - 70);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Add OrbitControls (we'll implement a simple version)
    setupControls();
    
    // Raycaster for mouse interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    
    // Add lights
    setupLights();
    
    // Create hierarchy spheres
    createHierarchySpheres();
    
    // Create connections
    createConnections();
    
    // Create particle systems
    createParticleSystems();
    
    // Add cosmic background
    createCosmicBackground();
    
    // Event listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('click', onClick);
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);
    
    // UI event listeners
    setupUIControls();
    
    // Start animation
    animate();
    
    // Create minimap
    createMinimap();
}

// Setup lighting
function setupLights() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Directional light
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(50, 50, 50);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    // Point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0x8B5CF6, 2, 100);
    pointLight1.position.set(-30, 30, 30);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xFFD700, 2, 100);
    pointLight2.position.set(30, -30, 30);
    scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xFF6B35, 1.5, 100);
    pointLight3.position.set(0, 50, -30);
    scene.add(pointLight3);
}

// Create hierarchy spheres with labels
function createHierarchySpheres() {
    hierarchyData.forEach((level, index) => {
        // Create sphere
        const geometry = new THREE.SphereGeometry(level.radius, 64, 64);
        
        // Create shader material for glowing effect
        const material = new THREE.MeshPhongMaterial({
            color: level.color,
            emissive: level.color,
            emissiveIntensity: 0.4,
            shininess: 100,
            transparent: true,
            opacity: 0.85
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(level.position.x, level.position.y, level.position.z);
        sphere.userData = level;
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        
        scene.add(sphere);
        spheres.push(sphere);
        
        // Add wireframe overlay
        const wireframeGeo = new THREE.EdgesGeometry(geometry);
        const wireframeMat = new THREE.LineBasicMaterial({ 
            color: level.color, 
            transparent: true, 
            opacity: 0.3 
        });
        const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
        sphere.add(wireframe);
        
        // Add glow effect
        addGlowToSphere(sphere, level.color, level.radius);
        
        // Create text label using CSS2DRenderer simulation
        createTextLabel(sphere, level.name, level.subtitle);
    });
}

// Add glow effect
function addGlowToSphere(mesh, color, radius) {
    const glowGeometry = new THREE.SphereGeometry(radius * 1.5, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { value: 0.4 },
            p: { value: 4.0 },
            glowColor: { value: new THREE.Color(color) },
            viewVector: { value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.6 - dot(vNormal, vNormel), 4.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, intensity * 0.8);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glowMesh);
}

// Create text labels (simplified version without CSS2DRenderer)
function createTextLabel(sphere, name, subtitle) {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;
    
    // Draw text
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'Bold 48px Cinzel';
    context.fillStyle = '#FFD700';
    context.textAlign = 'center';
    context.fillText(name, 256, 120);
    
    context.font = '32px Inter';
    context.fillStyle = '#8B5CF6';
    context.fillText(subtitle, 256, 170);
    
    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    
    // Create sprite
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.9
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(15, 7.5, 1);
    sprite.position.y = sphere.userData.radius + 5;
    
    sphere.add(sprite);
    textLabels.push(sprite);
}

// Create connections between spheres
function createConnections() {
    for (let i = 0; i < hierarchyData.length - 1; i++) {
        const start = hierarchyData[i].position;
        const end = hierarchyData[i + 1].position;
        
        // Create curved line
        const curve = new THREE.CubicBezierCurve3(
            new THREE.Vector3(start.x, start.y, start.z),
            new THREE.Vector3(
                (start.x + end.x) / 2 + (Math.random() - 0.5) * 15,
                (start.y + end.y) / 2 + 5,
                (start.z + end.z) / 2 + (Math.random() - 0.5) * 15
            ),
            new THREE.Vector3(
                (start.x + end.x) / 2 + (Math.random() - 0.5) * 15,
                (start.y + end.y) / 2 - 5,
                (start.z + end.z) / 2 + (Math.random() - 0.5) * 15
            ),
            new THREE.Vector3(end.x, end.y, end.z)
        );
        
        const points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.3,
            linewidth: 2
        });
        
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        connections.push({ line, curve, points });
    }
}

// Create particle systems along connections
function createParticleSystems() {
    connections.forEach((connection, index) => {
        const particleCount = 20;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const geometry = new THREE.SphereGeometry(0.15, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0xFFD700,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(geometry, material);
            const t = i / particleCount;
            const pos = connection.curve.getPoint(t);
            particle.position.copy(pos);
            particle.userData = { t, connection: index, speed: 0.005 + Math.random() * 0.01 };
            
            scene.add(particle);
            particles.push(particle);
        }
        
        particleSystems.push(particles);
    });
}

// Create cosmic background
function createCosmicBackground() {
    const starCount = 2000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starColors = [];
    
    for (let i = 0; i < starCount; i++) {
        const x = (Math.random() - 0.5) * 300;
        const y = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 300;
        starPositions.push(x, y, z);
        
        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.7);
        starColors.push(color.r, color.g, color.b);
    }
    
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.4,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
}

// Simple orbit controls
function setupControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            // Rotate camera around center
            const rotationSpeed = 0.005;
            const phi = deltaX * rotationSpeed;
            const theta = deltaY * rotationSpeed;
            
            // Update camera position
            const radius = Math.sqrt(
                camera.position.x ** 2 + 
                camera.position.y ** 2 + 
                camera.position.z ** 2
            );
            
            // Spherical coordinates
            let currentPhi = Math.atan2(camera.position.z, camera.position.x);
            let currentTheta = Math.acos(camera.position.y / radius);
            
            currentPhi -= phi;
            currentTheta = Math.max(0.1, Math.min(Math.PI - 0.1, currentTheta - theta));
            
            camera.position.x = radius * Math.sin(currentTheta) * Math.cos(currentPhi);
            camera.position.y = radius * Math.cos(currentTheta);
            camera.position.z = radius * Math.sin(currentTheta) * Math.sin(currentPhi);
            
            camera.lookAt(0, 15, 0);
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
    });
    
    // Zoom with mouse wheel
    renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const direction = e.deltaY > 0 ? 1 : -1;
        
        const factor = 1 + direction * zoomSpeed;
        camera.position.multiplyScalar(factor);
        
        // Limit zoom
        const distance = camera.position.length();
        if (distance < 30) camera.position.multiplyScalar(30 / distance);
        if (distance > 150) camera.position.multiplyScalar(150 / distance);
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Rotate spheres
    spheres.forEach((sphere, index) => {
        sphere.rotation.y += 0.005;
        
        // Floating animation
        const originalY = sphere.userData.position.y;
        sphere.position.y = originalY + Math.sin(time + index) * 1.5;
        
        // Pulse effect on hover
        if (sphere === INTERSECTED) {
            const scale = 1 + Math.sin(time * 3) * 0.05;
            sphere.scale.set(scale, scale, scale);
        } else {
            sphere.scale.set(1, 1, 1);
        }
    });
    
    // Animate particles along connections
    particleSystems.forEach((particles, connectionIndex) => {
        particles.forEach(particle => {
            particle.userData.t += particle.userData.speed;
            if (particle.userData.t > 1) particle.userData.t = 0;
            
            const pos = connections[connectionIndex].curve.getPoint(particle.userData.t);
            particle.position.copy(pos);
            
            // Pulse effect
            const scale = 1 + Math.sin(time * 5 + particle.userData.t * Math.PI * 2) * 0.3;
            particle.scale.set(scale, scale, scale);
        });
    });
    
    // Auto-rotate camera
    if (isRotating) {
        const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
        const angle = Math.atan2(camera.position.z, camera.position.x);
        camera.position.x = radius * Math.cos(angle + 0.005);
        camera.position.z = radius * Math.sin(angle + 0.005);
        camera.lookAt(0, 15, 0);
    }
    
    renderer.render(scene, camera);
}

// Handle mouse move for hover effect
function onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections
    const intersects = raycaster.intersectObjects(spheres);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        if (INTERSECTED !== object) {
            // Restore previous object
            if (INTERSECTED) {
                INTERSECTED.material.emissiveIntensity = 0.4;
            }
            
            INTERSECTED = object;
            INTERSECTED.material.emissiveIntensity = 0.8;
            
            // Update level indicator
            document.querySelector('.level-name').textContent = object.userData.name;
            document.querySelector('.level-desc').textContent = object.userData.subtitle;
            
            renderer.domElement.style.cursor = 'pointer';
        }
    } else {
        if (INTERSECTED) {
            INTERSECTED.material.emissiveIntensity = 0.4;
        }
        INTERSECTED = null;
        renderer.domElement.style.cursor = 'default';
        
        document.querySelector('.level-name').textContent = 'Exploring the Cosmos';
        document.querySelector('.level-desc').textContent = 'Click on any sphere to explore';
    }
}

// Handle click
function onClick(event) {
    if (INTERSECTED) {
        selectedSphere = INTERSECTED;
        showDetailPanel(selectedSphere.userData);
    }
}

// Show detail panel
function showDetailPanel(levelData) {
    const detailPanel = document.getElementById('detail-panel');
    const detailTitle = document.getElementById('detail-title');
    const detailBody = document.getElementById('detail-body');
    
    detailTitle.textContent = levelData.details.title;
    detailBody.innerHTML = levelData.details.content;
    
    detailPanel.classList.add('active');
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight - 70);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight - 70);
}

// Handle keyboard
function onKeyDown(event) {
    switch (event.code) {
        case 'Space':
            event.preventDefault();
            isRotating = !isRotating;
            document.querySelector('[data-action="auto-rotate"]').classList.toggle('active');
            break;
        case 'Escape':
            document.getElementById('detail-panel').classList.remove('active');
            break;
    }
}

// Setup UI controls
function setupUIControls() {
    // Instructions
    const gotItBtn = document.getElementById('got-it');
    gotItBtn.addEventListener('click', () => {
        document.getElementById('instructions').classList.add('hidden');
    });
    
    // Close detail panel
    document.getElementById('close-detail').addEventListener('click', () => {
        document.getElementById('detail-panel').classList.remove('active');
    });
    
    // Nav buttons
    document.querySelector('[data-action="reset"]').addEventListener('click', () => {
        camera.position.set(0, 20, 70);
        camera.lookAt(0, 15, 0);
    });
    
    document.querySelector('[data-action="auto-rotate"]').addEventListener('click', function() {
        isRotating = !isRotating;
        this.classList.toggle('active');
    });
    
    document.querySelector('[data-action="expand"]').addEventListener('click', () => {
        // Zoom out to see everything
        camera.position.set(0, 30, 120);
        camera.lookAt(0, 15, 0);
    });
    
    document.querySelector('[data-action="help"]').addEventListener('click', () => {
        document.getElementById('instructions').classList.remove('hidden');
    });
}

// Create minimap
function createMinimap() {
    const svg = document.getElementById('mini-map-svg');
    const height = 400;
    const width = 200;
    const padding = 20;
    
    // Calculate scale
    const yValues = hierarchyData.map(d => d.position.y);
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const yScale = (height - 2 * padding) / (yMax - yMin);
    
    // Draw connections
    hierarchyData.forEach((level, i) => {
        if (i < hierarchyData.length - 1) {
            const y1 = padding + (yMax - level.position.y) * yScale;
            const y2 = padding + (yMax - hierarchyData[i + 1].position.y) * yScale;
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', width / 2);
            line.setAttribute('y1', y1);
            line.setAttribute('x2', width / 2);
            line.setAttribute('y2', y2);
            line.setAttribute('stroke', '#8B5CF6');
            line.setAttribute('stroke-width', '2');
            line.setAttribute('opacity', '0.4');
            svg.appendChild(line);
        }
    });
    
    // Draw nodes
    hierarchyData.forEach((level, i) => {
        const y = padding + (yMax - level.position.y) * yScale;
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', width / 2);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '6');
        circle.setAttribute('fill', '#' + level.color.toString(16).padStart(6, '0'));
        circle.setAttribute('opacity', '0.8');
        circle.style.cursor = 'pointer';
        
        circle.addEventListener('click', () => {
            // Focus camera on this level
            const pos = level.position;
            camera.position.set(pos.x + 30, pos.y + 20, pos.z + 30);
            camera.lookAt(pos.x, pos.y, pos.z);
        });
        
        svg.appendChild(circle);
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        init();
    }, 2000);
});
