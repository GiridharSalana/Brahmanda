// Global variables
let scene, camera, renderer;
let spheres = [];
let textLabels = [];
let connections = [];
let particleSystems = [];
let isRotating = false;
let raycaster, mouse;
let selectedSphere = null;
let INTERSECTED = null;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Enhanced features
let trimurtiGroup = null;
let shaktiEnergies = [];
let lokaSpheres = [];
let yugaTimeline = null;
let humanAvatars = [];
let scriptures = [];
let mokshaPaths = [];
let audioManager = null;
let toggleStates = {
    yugas: true,
    lokas: true,
    avatars: true,
    paths: true
};

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
    try {
        console.log('Initializing 3D scene...');
        
        // Check if THREE is available
        if (typeof THREE === 'undefined') {
            throw new Error('Three.js library not loaded');
        }
        
        // Create scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0f);
        scene.fog = new THREE.FogExp2(0x0a0a0f, 0.008);
        
        // Create camera
        camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / (window.innerHeight - 70),
            0.1,
            1000
        );
        camera.position.set(0, 20, 70);
        camera.lookAt(0, 15, 0);
        
        // Create renderer
        const container = document.getElementById('canvas-container');
        if (!container) {
            throw new Error('Canvas container not found');
        }
        
        renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight - 70);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);
        
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
        
        // Create cosmic background
        createCosmicBackground();
        
        // Initialize audio manager
        if (typeof AudioManager !== 'undefined') {
            audioManager = new AudioManager();
        }
        
        // Create enhanced immersive features
        try {
            createEnhancedParamaBrahman();
            createTrimurti();
            createShaktiEnergies();
            createInteractiveLokas();
            createYugaTimeline();
            createHumanRealm();
            createScriptures();
            createMokshaPaths();
        } catch (error) {
            console.warn('Some enhanced features failed to load:', error);
        }
        
        // Add performance optimizations
        optimizePerformance();
        
        // Setup controls
        setupControls();
        
        // Event listeners
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);
        document.addEventListener('keydown', onKeyDown);
        
        // UI event listeners
        setupUIControls();
        
        // Create minimap
        createMinimap();
        
        // Setup additional features
        setupLokaZoom();
        addVisualFeedback();
        
        // Start animation
        animate();
        
        console.log('3D scene initialized successfully!');
    } catch (error) {
        console.error('Error initializing 3D scene:', error);
        document.getElementById('loading-screen').innerHTML = 
            '<div class="loader"><div class="om-symbol">ॐ</div><p>Error: ' + error.message + '</p></div>';
    }
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
        const geometry = new THREE.SphereGeometry(level.radius, 32, 32);
        
        // Create material
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
        wireframe.raycast = function() {}; // Disable raycasting for wireframe
        sphere.add(wireframe);
        
        // Add glow effect
        addGlowToSphere(sphere, level.color, level.radius);
        
        // Create text label
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
    glowMesh.raycast = function() {}; // Disable raycasting for glow
    mesh.add(glowMesh);
}

// Create text labels
function createTextLabel(sphere, name, subtitle) {
    // Create canvas for text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;
    
    // Draw text
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'Bold 48px Cinzel, serif';
    context.fillStyle = '#FFD700';
    context.textAlign = 'center';
    context.fillText(name, 256, 120);
    
    context.font = '32px Inter, sans-serif';
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
    sprite.raycast = function() {}; // Disable raycasting for sprite
    
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

// ==================== ENHANCED IMMERSIVE FEATURES ====================

// Create enhanced Parama Brahman with infinite glowing light
function createEnhancedParamaBrahman() {
    if (!spheres || spheres.length === 0) return;
    const brahmanSphere = spheres[0]; // First sphere is Parama Brahman
    if (!brahmanSphere || !brahmanSphere.userData) return;
    
    // Add infinite light effect with multiple layers
    for (let i = 0; i < 5; i++) {
        const glowSize = brahmanSphere.userData.radius * (2 + i * 0.5);
        const glowGeo = new THREE.SphereGeometry(glowSize, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.1 / (i + 1),
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.raycast = function() {};
        brahmanSphere.add(glow);
    }
    
    // Add pulsing light particles
    const particleCount = 100;
    const particles = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    
    for (let i = 0; i < particleCount; i++) {
        const radius = brahmanSphere.userData.radius * (1.5 + Math.random() * 2);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        positions.push(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );
        
        colors.push(1, 0.84, 0); // Gold
    }
    
    particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMat);
    particleSystem.raycast = function() {};
    brahmanSphere.add(particleSystem);
}

// Create Trimurti (Brahma, Vishnu, Shiva) with flowing aura
function createTrimurti() {
    trimurtiGroup = new THREE.Group();
    trimurtiGroup.position.set(0, 45, 0);
    
    const trimurtiData = [
        { name: 'Brahma', color: 0xFF6B35, position: { x: -8, y: 0, z: 0 }, symbol: '🕉️' },
        { name: 'Vishnu', color: 0x3B82F6, position: { x: 0, y: 0, z: 0 }, symbol: '🕉️' },
        { name: 'Shiva', color: 0x8B5CF6, position: { x: 8, y: 0, z: 0 }, symbol: '🕉️' }
    ];
    
    trimurtiData.forEach((deity, index) => {
        // Create deity sphere
        const geometry = new THREE.SphereGeometry(1.5, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: deity.color,
            emissive: deity.color,
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9
        });
        
        const deityMesh = new THREE.Mesh(geometry, material);
        deityMesh.position.set(deity.position.x, deity.position.y, deity.position.z);
        deityMesh.userData = { name: deity.name, type: 'trimurti' };
        
        // Add flowing aura
        const auraGeo = new THREE.RingGeometry(2, 4, 32);
        const auraMat = new THREE.MeshBasicMaterial({
            color: deity.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        const aura = new THREE.Mesh(auraGeo, auraMat);
        aura.rotation.x = Math.PI / 2;
        aura.userData = { rotationSpeed: 0.01 + index * 0.005 };
        deityMesh.add(aura);
        
        // Add energy particles flowing around
        const energyParticles = new THREE.BufferGeometry();
        const energyPositions = [];
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 3 + Math.random() * 2;
            energyPositions.push(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius * 0.5,
                Math.sin(angle) * radius
            );
        }
        
        energyParticles.setAttribute('position', new THREE.Float32BufferAttribute(energyPositions, 3));
        const energyMat = new THREE.PointsMaterial({
            color: deity.color,
            size: 0.2,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const energySystem = new THREE.Points(energyParticles, energyMat);
        energySystem.userData = { rotationSpeed: 0.02 };
        deityMesh.add(energySystem);
        
        trimurtiGroup.add(deityMesh);
    });
    
    scene.add(trimurtiGroup);
}

// Create Shakti energies
function createShaktiEnergies() {
    const shaktiData = [
        { name: 'Saraswati', color: 0xFFFFFF, position: { x: -8, y: 42, z: 2 } },
        { name: 'Lakshmi', color: 0xFFD700, position: { x: 0, y: 42, z: 2 } },
        { name: 'Parvati', color: 0xFF6B35, position: { x: 8, y: 42, z: 2 } },
        { name: 'Adi Shakti', color: 0xFF1493, position: { x: 0, y: 48, z: 0 } }
    ];
    
    shaktiData.forEach((shakti, index) => {
        const geometry = new THREE.OctahedronGeometry(0.8, 0);
        const material = new THREE.MeshPhongMaterial({
            color: shakti.color,
            emissive: shakti.color,
            emissiveIntensity: 0.7,
            transparent: true,
            opacity: 0.9
        });
        
        const shaktiMesh = new THREE.Mesh(geometry, material);
        shaktiMesh.position.set(shakti.position.x, shakti.position.y, shakti.position.z);
        shaktiMesh.userData = { name: shakti.name, type: 'shakti', position: shakti.position };
        
        // Add glowing trail
        const trailGeo = new THREE.BufferGeometry();
        const trailPositions = [];
        const trailCount = 20;
        
        for (let i = 0; i < trailCount; i++) {
            trailPositions.push(
                shakti.position.x,
                shakti.position.y - i * 0.3,
                shakti.position.z
            );
        }
        
        trailGeo.setAttribute('position', new THREE.Float32BufferAttribute(trailPositions, 3));
        const trailMat = new THREE.LineBasicMaterial({
            color: shakti.color,
            transparent: true,
            opacity: 0.5,
            linewidth: 2
        });
        const trail = new THREE.Line(trailGeo, trailMat);
        trail.userData = { baseY: shakti.position.y };
        shaktiMesh.add(trail);
        
        scene.add(shaktiMesh);
        shaktiEnergies.push(shaktiMesh);
    });
}

// Create interactive Lokas as layered spheres
function createInteractiveLokas() {
    const lokaData = [
        { name: 'Satya-loka', color: 0xFFD700, y: 40, radius: 2.5 },
        { name: 'Tapa-loka', color: 0xFFA500, y: 35, radius: 2.3 },
        { name: 'Jana-loka', color: 0xFF6B35, y: 30, radius: 2.1 },
        { name: 'Mahar-loka', color: 0x8B5CF6, y: 25, radius: 2.0 },
        { name: 'Svar-loka', color: 0x3B82F6, y: 20, radius: 1.9 },
        { name: 'Bhu-loka', color: 0x10B981, y: 5, radius: 3.0 },
        { name: 'Atala', color: 0x6366F1, y: -5, radius: 1.8 },
        { name: 'Vitala', color: 0x8B5CF6, y: -10, radius: 1.7 },
        { name: 'Sutala', color: 0x6B46C1, y: -15, radius: 1.6 }
    ];
    
    lokaData.forEach((loka, index) => {
        const geometry = new THREE.SphereGeometry(loka.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: loka.color,
            emissive: loka.color,
            emissiveIntensity: 0.3,
            transparent: true,
            opacity: 0.6
        });
        
        const lokaMesh = new THREE.Mesh(geometry, material);
        lokaMesh.position.set(0, loka.y, 0);
        lokaMesh.userData = { name: loka.name, type: 'loka', originalY: loka.y };
        
        // Add floating particles
        const cloudGeo = new THREE.BufferGeometry();
        const cloudPositions = [];
        const cloudCount = 50;
        
        for (let i = 0; i < cloudCount; i++) {
            const radius = loka.radius * 1.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            cloudPositions.push(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta) * 0.3,
                radius * Math.cos(phi)
            );
        }
        
        cloudGeo.setAttribute('position', new THREE.Float32BufferAttribute(cloudPositions, 3));
        const cloudMat = new THREE.PointsMaterial({
            color: loka.color,
            size: 0.1,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        const clouds = new THREE.Points(cloudGeo, cloudMat);
        clouds.raycast = function() {};
        lokaMesh.add(clouds);
        
        scene.add(lokaMesh);
        lokaSpheres.push(lokaMesh);
    });
}

// Create Yuga timeline with energy flows
function createYugaTimeline() {
    yugaTimeline = new THREE.Group();
    yugaTimeline.position.set(20, 15, -10);
    
    const yugaData = [
        { name: 'Satya', color: 0xFFD700, duration: 1.728, position: 0 },
        { name: 'Treta', color: 0xFF6B35, duration: 1.296, position: 1.728 },
        { name: 'Dvapara', color: 0x8B5CF6, duration: 0.864, position: 3.024 },
        { name: 'Kali', color: 0x6366F1, duration: 0.432, position: 3.888 }
    ];
    
    const totalDuration = 4.32;
    const scale = 5;
    
    yugaData.forEach((yuga, index) => {
        // Create timeline segment
        const segmentGeo = new THREE.BoxGeometry(yuga.duration * scale, 1, 1);
        const segmentMat = new THREE.MeshPhongMaterial({
            color: yuga.color,
            emissive: yuga.color,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const segment = new THREE.Mesh(segmentGeo, segmentMat);
        segment.position.set(yuga.position * scale + (yuga.duration * scale) / 2, 0, 0);
        segment.userData = { name: yuga.name, type: 'yuga' };
        
        // Add energy flow particles
        const flowGeo = new THREE.BufferGeometry();
        const flowPositions = [];
        const flowCount = 20;
        
        for (let i = 0; i < flowCount; i++) {
            const t = i / flowCount;
            flowPositions.push(
                yuga.position * scale + t * yuga.duration * scale,
                Math.sin(t * Math.PI * 4) * 0.5,
                0
            );
        }
        
        flowGeo.setAttribute('position', new THREE.Float32BufferAttribute(flowPositions, 3));
        const flowMat = new THREE.LineBasicMaterial({
            color: yuga.color,
            transparent: true,
            opacity: 0.6
        });
        const flow = new THREE.Line(flowGeo, flowMat);
        segment.add(flow);
        
        yugaTimeline.add(segment);
    });
    
    scene.add(yugaTimeline);
}

// Create human realm with luminous avatars
function createHumanRealm() {
    const humanRealm = spheres.find(s => s.userData.id === 7); // Human Realm sphere
    if (!humanRealm) return;
    
    // Create human avatars as glowing points
    const avatarCount = 20;
    const avatarGeo = new THREE.BufferGeometry();
    const avatarPositions = [];
    const avatarColors = [];
    
    for (let i = 0; i < avatarCount; i++) {
        const radius = humanRealm.userData.radius * (0.8 + Math.random() * 0.4);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        avatarPositions.push(
            humanRealm.position.x + radius * Math.sin(phi) * Math.cos(theta),
            humanRealm.position.y + radius * Math.sin(phi) * Math.sin(theta),
            humanRealm.position.z + radius * Math.cos(phi)
        );
        
        // Random colors representing different souls
        const hue = Math.random();
        const color = new THREE.Color().setHSL(hue, 0.7, 0.6);
        avatarColors.push(color.r, color.g, color.b);
    }
    
    avatarGeo.setAttribute('position', new THREE.Float32BufferAttribute(avatarPositions, 3));
    avatarGeo.setAttribute('color', new THREE.Float32BufferAttribute(avatarColors, 3));
    
    const avatarMat = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    
    const avatars = new THREE.Points(avatarGeo, avatarMat);
    avatars.userData = { type: 'humanAvatars', count: avatarCount };
    scene.add(avatars);
    humanAvatars.push(avatars);
    
    // Create reincarnation cycle visualization
    createReincarnationCycles(humanRealm);
}

// Create reincarnation cycles
function createReincarnationCycles(centerSphere) {
    const cycleCount = 5;
    
    for (let i = 0; i < cycleCount; i++) {
        const radius = centerSphere.userData.radius * (1.2 + i * 0.3);
        const cycleGeo = new THREE.RingGeometry(radius, radius + 0.5, 64);
        const cycleMat = new THREE.MeshBasicMaterial({
            color: 0x10B981,
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        const cycle = new THREE.Mesh(cycleGeo, cycleMat);
        cycle.rotation.x = Math.PI / 2 + (i * Math.PI / 8);
        cycle.position.copy(centerSphere.position);
        cycle.userData = { rotationSpeed: 0.01 + i * 0.005 };
        cycle.raycast = function() {};
        
        scene.add(cycle);
    }
}

// Create floating scriptures
function createScriptures() {
    const scriptureData = [
        { name: 'Rigveda', color: 0xFFD700, position: { x: -25, y: -5, z: -15 } },
        { name: 'Samaveda', color: 0xFF6B35, position: { x: -20, y: -5, z: -10 } },
        { name: 'Yajurveda', color: 0x8B5CF6, position: { x: -15, y: -5, z: -5 } },
        { name: 'Atharvaveda', color: 0x3B82F6, position: { x: -10, y: -5, z: 0 } },
        { name: 'Upanishads', color: 0x10B981, position: { x: -5, y: -5, z: 5 } },
        { name: 'Bhagavad Gita', color: 0xFF1493, position: { x: 0, y: -5, z: 10 } }
    ];
    
    scriptureData.forEach((scripture, index) => {
        // Create book/scroll shape
        const geometry = new THREE.BoxGeometry(1, 1.5, 0.3);
        const material = new THREE.MeshPhongMaterial({
            color: scripture.color,
            emissive: scripture.color,
            emissiveIntensity: 0.4,
            transparent: true,
            opacity: 0.9
        });
        
        const book = new THREE.Mesh(geometry, material);
        book.position.set(scripture.position.x, scripture.position.y, scripture.position.z);
        book.userData = { name: scripture.name, type: 'scripture' };
        
        // Add glow
        const glowGeo = new THREE.BoxGeometry(1.2, 1.7, 0.5);
        const glowMat = new THREE.MeshBasicMaterial({
            color: scripture.color,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending
        });
        const glow = new THREE.Mesh(glowGeo, glowMat);
        glow.raycast = function() {};
        book.add(glow);
        
        scene.add(book);
        scriptures.push(book);
    });
}

// Create Moksha paths (Karma, Bhakti, Jnana, Raja Yoga)
function createMokshaPaths() {
    const mokshaSphere = spheres.find(s => s.userData.id === 10); // Moksha sphere
    const humanSphere = spheres.find(s => s.userData.id === 7); // Human Realm sphere
    
    if (!mokshaSphere || !humanSphere) return;
    
    const pathData = [
        { name: 'Karma Yoga', color: 0xFF6B35 },
        { name: 'Bhakti Yoga', color: 0xFF1493 },
        { name: 'Jnana Yoga', color: 0x3B82F6 },
        { name: 'Raja Yoga', color: 0x8B5CF6 }
    ];
    
    pathData.forEach((path, index) => {
        const start = humanSphere.position;
        const end = mokshaSphere.position;
        
        // Create curved path
        const midPoint = new THREE.Vector3(
            (start.x + end.x) / 2 + (Math.cos(index * Math.PI / 2) * 10),
            (start.y + end.y) / 2,
            (start.z + end.z) / 2 + (Math.sin(index * Math.PI / 2) * 10)
        );
        
        const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        
        const material = new THREE.LineBasicMaterial({
            color: path.color,
            transparent: true,
            opacity: 0.6,
            linewidth: 3
        });
        
        const pathLine = new THREE.Line(geometry, material);
        pathLine.userData = { name: path.name, type: 'mokshaPath', curve: curve };
        scene.add(pathLine);
        mokshaPaths.push(pathLine);
        
        // Add flowing particles along path
        const particleCount = 10;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const pos = curve.getPoint(t);
            
            const particleGeo = new THREE.SphereGeometry(0.2, 8, 8);
            const particleMat = new THREE.MeshBasicMaterial({
                color: path.color,
                transparent: true,
                opacity: 0.8,
                blending: THREE.AdditiveBlending
            });
            
            const particle = new THREE.Mesh(particleGeo, particleMat);
            particle.position.copy(pos);
            particle.userData = { t, pathIndex: index, speed: 0.01, curve: curve };
            scene.add(particle);
            particles.push(particle);
        }
        
        pathLine.userData.particles = particles;
    });
}

// Simple orbit controls
function setupControls() {
    const canvas = renderer.domElement;
    let mouseDownPosition = null;
    let hasMoved = false;
    
    canvas.addEventListener('mousedown', (e) => {
        mouseDownPosition = { x: e.clientX, y: e.clientY };
        hasMoved = false;
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        canvas.style.cursor = 'grabbing';
    });
    
    canvas.addEventListener('mousemove', (e) => {
        if (isDragging && mouseDownPosition) {
            const deltaX = Math.abs(e.clientX - mouseDownPosition.x);
            const deltaY = Math.abs(e.clientY - mouseDownPosition.y);
            
            // Only consider it dragging if mouse moved more than 5 pixels
            if (deltaX > 5 || deltaY > 5) {
                hasMoved = true;
            }
            
            if (hasMoved) {
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
        }
    });
    
    canvas.addEventListener('mouseup', (e) => {
        // Only trigger click if mouse didn't move much (wasn't dragging)
        if (!hasMoved && mouseDownPosition) {
            // Update mouse position for raycasting
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / (window.innerHeight - 70)) * 2 + 1;
            
            // Check for sphere intersection - check all interactive objects
            raycaster.setFromCamera(mouse, camera);
            const allObjects = [...spheres, ...lokaSpheres, ...shaktiEnergies, ...scriptures];
            if (trimurtiGroup) allObjects.push(...trimurtiGroup.children);
            
            const intersects = raycaster.intersectObjects(allObjects, false);
            
            if (intersects.length > 0) {
                const object = intersects[0].object;
                
                // Handle Loka zoom
                if (object.userData && object.userData.type === 'loka') {
                    if (object.userData.isZoomed) {
                        // Zoom out
                        smoothCameraTransition(
                            new THREE.Vector3(0, 20, 70),
                            new THREE.Vector3(0, 15, 0)
                        );
                        object.userData.isZoomed = false;
                    } else {
                        // Zoom in
                        const targetPos = object.position.clone().add(new THREE.Vector3(0, 0, 20));
                        smoothCameraTransition(targetPos, object.position);
                        object.userData.isZoomed = true;
                    }
                }
                // Handle main spheres
                else if (object.userData && object.userData.name && object.userData.id) {
                    selectedSphere = object;
                    showDetailPanel(object.userData);
                    
                    // Smooth camera transition to sphere
                    const targetPos = object.position.clone().add(new THREE.Vector3(0, 0, 15));
                    smoothCameraTransition(targetPos, object.position);
                }
                // Handle Trimurti
                else if (object.userData && object.userData.type === 'trimurti') {
                    const detailContent = {
                        title: object.userData.name + ' - Trimurti',
                        content: `<p>${object.userData.name} is one of the three primary deities of Hinduism.</p>`
                    };
                    showDetailPanel(detailContent);
                }
                // Handle Shakti
                else if (object.userData && object.userData.type === 'shakti') {
                    const detailContent = {
                        title: object.userData.name + ' - Shakti',
                        content: `<p>${object.userData.name} represents divine feminine energy.</p>`
                    };
                    showDetailPanel(detailContent);
                }
                // Handle Scriptures
                else if (object.userData && object.userData.type === 'scripture') {
                    const detailContent = {
                        title: object.userData.name,
                        content: `<p>${object.userData.name} is a sacred text of Sanatan Dharma.</p>`
                    };
                    showDetailPanel(detailContent);
                }
            }
        }
        
        isDragging = false;
        hasMoved = false;
        mouseDownPosition = null;
        canvas.style.cursor = 'default';
    });
    
    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        hasMoved = false;
        mouseDownPosition = null;
        canvas.style.cursor = 'default';
    });
    
    // Zoom with mouse wheel
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const direction = e.deltaY > 0 ? 1 : -1;
        
        const factor = 1 + direction * zoomSpeed;
        camera.position.multiplyScalar(factor);
        
        // Limit zoom
        const distance = camera.position.length();
        if (distance < 30) camera.position.multiplyScalar(30 / distance);
        if (distance > 150) camera.position.multiplyScalar(150 / distance);
        
        camera.lookAt(0, 15, 0);
    });
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    if (!scene || !camera || !renderer) return;
    
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
    
    // Animate Trimurti auras and energy particles
    if (trimurtiGroup && trimurtiGroup.children) {
        trimurtiGroup.children.forEach((deity, index) => {
            if (deity && deity.children) {
                deity.children.forEach(child => {
                    if (child && child.userData && child.userData.rotationSpeed) {
                        child.rotation.z += child.userData.rotationSpeed;
                    }
                });
                deity.rotation.y += 0.01;
            }
        });
    }
    
    // Animate Shakti energies
    if (shaktiEnergies && shaktiEnergies.length > 0) {
        shaktiEnergies.forEach((shakti, index) => {
            if (!shakti || !shakti.userData || !shakti.userData.position) return;
            shakti.rotation.y += 0.02;
            shakti.rotation.x += 0.01;
            shakti.position.y = shakti.userData.position.y + Math.sin(time + index) * 0.5;
            
            // Animate trails
            if (shakti.children) {
                shakti.children.forEach(child => {
                    if (child && child.userData && child.userData.baseY && child.geometry && child.geometry.attributes) {
                        const positions = child.geometry.attributes.position.array;
                        for (let i = 0; i < positions.length; i += 3) {
                            positions[i + 1] = child.userData.baseY - (i / 3) * 0.3 + Math.sin(time * 2 + i) * 0.2;
                        }
                        child.geometry.attributes.position.needsUpdate = true;
                    }
                });
            }
        });
    }
    
    // Animate Lokas
    if (toggleStates.lokas && lokaSpheres && lokaSpheres.length > 0) {
        lokaSpheres.forEach((loka, index) => {
            if (loka && loka.userData && loka.userData.originalY !== undefined) {
                loka.position.y = loka.userData.originalY + Math.sin(time + index) * 1;
                loka.rotation.y += 0.005;
            }
        });
    }
    
    // Animate Yuga timeline
    if (toggleStates.yugas && yugaTimeline) {
        yugaTimeline.rotation.y += 0.01;
    }
    
    // Animate human avatars
    if (humanAvatars && humanAvatars.length > 0) {
        humanAvatars.forEach(avatarSystem => {
            if (avatarSystem && avatarSystem.geometry && avatarSystem.geometry.attributes && avatarSystem.geometry.attributes.position) {
                const positions = avatarSystem.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    positions[i + 1] += Math.sin(time + i) * 0.01;
                }
                avatarSystem.geometry.attributes.position.needsUpdate = true;
            }
        });
    }
    
    // Animate scriptures
    if (scriptures && scriptures.length > 0) {
        scriptures.forEach((scripture, index) => {
            if (scripture) {
                scripture.rotation.y += 0.01;
                scripture.position.y += Math.sin(time * 0.5 + index) * 0.3;
            }
        });
    }
    
    // Animate Moksha path particles
    if (toggleStates.paths && mokshaPaths && mokshaPaths.length > 0) {
        mokshaPaths.forEach((path, pathIndex) => {
            if (path && path.userData && path.userData.particles) {
                path.userData.particles.forEach(particle => {
                    if (particle && particle.userData && particle.userData.curve) {
                        particle.userData.t += particle.userData.speed;
                        if (particle.userData.t > 1) particle.userData.t = 0;
                        
                        const pos = particle.userData.curve.getPoint(particle.userData.t);
                        particle.position.copy(pos);
                    }
                });
            }
        });
    }
    
    // Update audio listener position
    if (audioManager && audioManager.isEnabled) {
        audioManager.updateListener(camera);
    }
    
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
    if (!raycaster || !camera || isDragging) return;
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / (window.innerHeight - 70)) * 2 + 1;
    
    // Update raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections - check all interactive objects
    const allObjects = [...spheres, ...lokaSpheres, ...shaktiEnergies, ...scriptures];
    if (trimurtiGroup) allObjects.push(...trimurtiGroup.children);
    
    const intersects = raycaster.intersectObjects(allObjects, false);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Make sure it's an interactive object
        if (object.userData && (object.userData.name || object.userData.type)) {
            if (INTERSECTED !== object) {
                // Restore previous object
                if (INTERSECTED && INTERSECTED.material) {
                    INTERSECTED.material.emissiveIntensity = 0.4;
                }
                
                INTERSECTED = object;
                if (INTERSECTED.material) {
                    INTERSECTED.material.emissiveIntensity = 0.8;
                }
                
                // Update level indicator
                const levelName = document.querySelector('.level-name');
                const levelDesc = document.querySelector('.level-desc');
                const tooltip = document.getElementById('tooltip');
                
                if (object.userData.name) {
                    if (levelName) levelName.textContent = object.userData.name;
                    if (levelDesc) {
                        levelDesc.textContent = object.userData.subtitle || 
                            (object.userData.type === 'loka' ? 'Click to zoom in' : 'Click to explore');
                    }
                    
                    // Show tooltip
                    if (tooltip) {
                        tooltip.textContent = object.userData.name;
                        tooltip.style.left = event.clientX + 10 + 'px';
                        tooltip.style.top = event.clientY + 10 + 'px';
                        tooltip.classList.add('visible');
                    }
                }
                
                renderer.domElement.style.cursor = 'pointer';
            }
        }
    } else {
        if (INTERSECTED && INTERSECTED.material) {
            INTERSECTED.material.emissiveIntensity = 0.4;
        }
        INTERSECTED = null;
        renderer.domElement.style.cursor = 'default';
        
        const levelName = document.querySelector('.level-name');
        const levelDesc = document.querySelector('.level-desc');
        const tooltip = document.getElementById('tooltip');
        
        if (levelName) levelName.textContent = 'Exploring the Cosmos';
        if (levelDesc) levelDesc.textContent = 'Click on any sphere to explore';
        if (tooltip) tooltip.classList.remove('visible');
    }
}

// Show detail panel
function showDetailPanel(levelData) {
    const detailPanel = document.getElementById('detail-panel');
    const detailTitle = document.getElementById('detail-title');
    const detailBody = document.getElementById('detail-body');
    
    if (detailTitle) detailTitle.textContent = levelData.details.title;
    if (detailBody) detailBody.innerHTML = levelData.details.content;
    if (detailPanel) detailPanel.classList.add('active');
}

// Handle window resize
function onWindowResize() {
    if (!camera || !renderer) return;
    
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
            const btn = document.querySelector('[data-action="auto-rotate"]');
            if (btn) btn.classList.toggle('active');
            break;
        case 'Escape':
            const panel = document.getElementById('detail-panel');
            if (panel) panel.classList.remove('active');
            break;
    }
}

// Setup UI controls
function setupUIControls() {
    // Instructions
    const gotItBtn = document.getElementById('got-it');
    if (gotItBtn) {
        gotItBtn.addEventListener('click', () => {
            const instructions = document.getElementById('instructions');
            if (instructions) instructions.classList.add('hidden');
        });
    }
    
    // Close detail panel
    const closeDetail = document.getElementById('close-detail');
    if (closeDetail) {
        closeDetail.addEventListener('click', () => {
            const panel = document.getElementById('detail-panel');
            if (panel) panel.classList.remove('active');
        });
    }
    
    // Nav buttons
    const resetBtn = document.querySelector('[data-action="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (camera) {
                camera.position.set(0, 20, 70);
                camera.lookAt(0, 15, 0);
            }
        });
    }
    
    const autoRotateBtn = document.querySelector('[data-action="auto-rotate"]');
    if (autoRotateBtn) {
        autoRotateBtn.addEventListener('click', function() {
            isRotating = !isRotating;
            this.classList.toggle('active');
        });
    }
    
    const expandBtn = document.querySelector('[data-action="expand"]');
    if (expandBtn) {
        expandBtn.addEventListener('click', () => {
            if (camera) {
                camera.position.set(0, 30, 120);
                camera.lookAt(0, 15, 0);
            }
        });
    }
    
    const helpBtn = document.querySelector('[data-action="help"]');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            const instructions = document.getElementById('instructions');
            if (instructions) instructions.classList.remove('hidden');
        });
    }
    
    // Toggle controls
    document.querySelector('[data-action="toggle-yugas"]')?.addEventListener('click', function() {
        toggleStates.yugas = !toggleStates.yugas;
        this.classList.toggle('active');
        if (yugaTimeline) {
            yugaTimeline.visible = toggleStates.yugas;
        }
    });
    
    document.querySelector('[data-action="toggle-lokas"]')?.addEventListener('click', function() {
        toggleStates.lokas = !toggleStates.lokas;
        this.classList.toggle('active');
        if (lokaSpheres && lokaSpheres.length > 0) {
            lokaSpheres.forEach(loka => {
                if (loka) loka.visible = toggleStates.lokas;
            });
        }
    });
    
    document.querySelector('[data-action="toggle-avatars"]')?.addEventListener('click', function() {
        toggleStates.avatars = !toggleStates.avatars;
        this.classList.toggle('active');
        if (humanAvatars && humanAvatars.length > 0) {
            humanAvatars.forEach(avatar => {
                if (avatar) avatar.visible = toggleStates.avatars;
            });
        }
    });
    
    document.querySelector('[data-action="toggle-paths"]')?.addEventListener('click', function() {
        toggleStates.paths = !toggleStates.paths;
        this.classList.toggle('active');
        if (mokshaPaths && mokshaPaths.length > 0) {
            mokshaPaths.forEach(path => {
                if (path) {
                    path.visible = toggleStates.paths;
                    if (path.userData && path.userData.particles) {
                        path.userData.particles.forEach(particle => {
                            if (particle) particle.visible = toggleStates.paths;
                        });
                    }
                }
            });
        }
    });
}

// Create minimap
function createMinimap() {
    const svg = document.getElementById('mini-map-svg');
    if (!svg) return;
    
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
            if (camera) {
                const pos = level.position;
                camera.position.set(pos.x + 30, pos.y + 20, pos.z + 30);
                camera.lookAt(pos.x, pos.y, pos.z);
            }
        });
        
        svg.appendChild(circle);
    });
}

// Initialize when page loads
function startApp() {
    // Wait for Three.js to be available
    if (typeof THREE === 'undefined') {
        console.log('Waiting for Three.js to load...');
        setTimeout(startApp, 100);
        return;
    }
    
    console.log('Three.js is ready, initializing...');
    
    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) loadingScreen.classList.add('hidden');
                init();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) loadingScreen.classList.add('hidden');
            init();
        }, 1000);
    }
}

// Performance optimization
function optimizePerformance() {
    // Reduce quality on mobile devices
    if (window.innerWidth < 768) {
        renderer.setPixelRatio(1);
        // Reduce particle counts
        if (particleSystems) {
            particleSystems.forEach(particles => {
                particles.forEach(particle => {
                    if (particle.geometry) {
                        particle.geometry.dispose();
                        const lowGeo = new THREE.SphereGeometry(0.1, 8, 8);
                        particle.geometry = lowGeo;
                    }
                });
            });
        }
    }
    
    // Enable frustum culling
    renderer.sortObjects = false;
    
    // Optimize shadows
    if (renderer.shadowMap) {
        renderer.shadowMap.autoUpdate = false;
    }
}

// Smooth camera transitions
function smoothCameraTransition(targetPosition, targetLookAt, duration = 2000) {
    const startPosition = camera.position.clone();
    const startLookAt = new THREE.Vector3(0, 15, 0);
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPosition, targetPosition, easeProgress);
        const currentLookAt = startLookAt.clone().lerp(targetLookAt, easeProgress);
        camera.lookAt(currentLookAt);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    update();
}

// Add click-to-zoom functionality for Lokas
function setupLokaZoom() {
    lokaSpheres.forEach((loka, index) => {
        loka.userData.originalPosition = loka.position.clone();
        loka.userData.isZoomed = false;
    });
}

// Enhanced visual feedback
function addVisualFeedback() {
    // Add subtle pulse to all spheres
    spheres.forEach((sphere, index) => {
        const originalScale = sphere.scale.clone();
        sphere.userData.originalScale = originalScale;
    });
}

// Start the app
startApp();
