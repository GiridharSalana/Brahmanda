/**
 * BRAHMANDA — The Cosmic Egg
 * Redesigned: one scene at a time, one focal point, done beautifully.
 * Three.js r160 · Custom GLSL · UnrealBloom · View-based visibility
 */

import * as THREE from 'three';
import { OrbitControls }   from 'three/addons/controls/OrbitControls.js';
import { EffectComposer }  from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }      from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ═══════════════════════════════════════════════════════════════
// GLSL — Para Brahman Divine Orb
// ═══════════════════════════════════════════════════════════════
const BRAHMAN_VERT = /* glsl */`
  varying vec3 vPos;
  varying vec3 vNorm;
  void main() {
    vPos  = position;
    vNorm = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
`;

const BRAHMAN_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vPos;
  varying vec3 vNorm;

  vec3 h3(vec3 p) {
    p = vec3(dot(p,vec3(127.1,311.7,74.7)),
             dot(p,vec3(269.5,183.3,246.1)),
             dot(p,vec3(113.5,271.9,124.6)));
    return -1.0 + 2.0*fract(sin(p)*43758.5453);
  }
  float vn(vec3 p) {
    vec3 i=floor(p); vec3 f=fract(p); vec3 u=f*f*(3.0-2.0*f);
    return mix(mix(mix(dot(h3(i),f),dot(h3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),
                   mix(dot(h3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(h3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),
               mix(mix(dot(h3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(h3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),
                   mix(dot(h3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(h3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);
  }

  void main() {
    float n1 = vn(vPos*0.7 + vec3(uTime*0.09));
    float n2 = vn(vPos*1.8 - vec3(uTime*0.06));
    float n3 = vn(vPos*4.0 + vec3(uTime*0.13));
    float n4 = vn(vPos*8.5 - vec3(uTime*0.05));

    float c = (n1*0.50 + n2*0.28 + n3*0.14 + n4*0.08 + 1.0)*0.5;

    // HDR — values > 1 trigger bloom on Para Brahman only
    vec3 deep  = vec3(1.0, 0.20, 0.00);
    vec3 saff  = vec3(1.6, 0.65, 0.05);
    vec3 gold  = vec3(2.0, 1.50, 0.25);
    vec3 white = vec3(2.5, 2.20, 1.60);

    vec3 col = mix(deep, saff, c);
    col = mix(col, gold,  pow(c, 1.6));
    col = mix(col, white, pow(c, 3.4));

    float rim = 1.0 - abs(dot(normalize(vNorm), vec3(0,0,1)));
    col += white * pow(rim, 2.2) * 0.35;

    float flare = max(0.0, vn(vPos*2.8 + vec3(uTime*0.24)) - 0.28) * 2.2;
    col += white * flare * 0.65;

    col *= 0.88 + 0.12*sin(uTime*1.6);

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ═══════════════════════════════════════════════════════════════
// PHILOSOPHICAL DATA
// ═══════════════════════════════════════════════════════════════
const DATA = {
  paraBrahman: {
    cat: 'Ultimate Reality', title: 'Para Brahman', sk: 'परब्रह्म',
    body: `<p>Para Brahman is the Supreme Absolute — infinite, eternal, formless consciousness beyond time, space, and causation. The Upanishads describe it through negation: <em>Neti, Neti</em> — "not this, not this." All of creation is its expression.</p>
    <h4>Sat · Chit · Ananda</h4><ul>
    <li><strong>Sat</strong> — Eternal Being, the only true existence</li>
    <li><strong>Chit</strong> — Pure Consciousness, awareness itself</li>
    <li><strong>Ananda</strong> — Infinite Bliss, the nature of reality</li></ul>
    <h4>Core Teaching</h4>
    <p><em>"Aham Brahmasmi"</em> — I am Brahman. The individual soul (Atman) and the universal soul (Brahman) are ultimately one and the same. This non-dual insight is the summit of Advaita Vedanta.</p>
    <p>From Para Brahman arises all — the 14 Lokas, the Trimurti, all living beings, all cycles of time. And to Para Brahman, all returns.</p>`
  },

  brahma: {
    cat: 'The Creator — Trimurti', title: 'Brahma', sk: 'ब्रह्मा',
    body: `<p>Lord Brahma is the architect of creation — born from the golden cosmic egg (Hiranyagarbha), or from the lotus emerging from Vishnu's navel at the beginning of each cosmic cycle.</p>
    <h4>Divine Attributes</h4><ul>
    <li><strong>4 Heads</strong> — The 4 Vedas: Rig, Yajur, Sama, Atharva</li>
    <li><strong>4 Arms</strong> — Vedas, Kamandal (water pot), Sruk (spoon), Akshamala (rosary)</li>
    <li><strong>Hamsa</strong> — His vehicle is the swan, symbolising viveka (discrimination)</li>
    <li><strong>Saraswati</strong> — His consort, goddess of knowledge and arts</li>
    <li><strong>Lotus Throne</strong> — He sits upon a lotus rooted in the cosmic ocean</li></ul>
    <h4>Cosmic Time</h4>
    <p>One day of Brahma (Kalpa) = 4.32 billion human years. Brahma's full lifespan = 311 trillion years. We are currently in the first day of his 51st year.</p>`
  },

  vishnu: {
    cat: 'The Preserver — Trimurti', title: 'Vishnu', sk: 'विष्णु',
    body: `<p>Lord Vishnu is the sustainer of dharma and the cosmic principle of preservation. He rests upon Ananta Shesha, the infinite cosmic serpent, floating on the primordial ocean of consciousness (Kshirasagara).</p>
    <h4>The 4 Divine Weapons</h4><ul>
    <li><strong>Shankha</strong> — Conch shell: primordial sound of Om, victory over evil</li>
    <li><strong>Sudarshana Chakra</strong> — Spinning discus: divine justice, time's wheel</li>
    <li><strong>Gada (Kaumodaki)</strong> — Mace: power of knowledge, destroys ego</li>
    <li><strong>Padma</strong> — Lotus: the self-luminous, ever-pure universe</li></ul>
    <h4>The 10 Avatars — Dashavatara</h4><ul>
    <li>Matsya (Fish) · Kurma (Tortoise) · Varaha (Boar)</li>
    <li>Narasimha (Man-Lion) · Vamana (Dwarf) · Parashurama</li>
    <li>Rama · Krishna · Buddha/Balarama</li>
    <li><em>Kalki — yet to come, at the end of Kali Yuga</em></li></ul>`
  },

  shiva: {
    cat: 'The Transformer — Trimurti', title: 'Shiva', sk: 'शिव',
    body: `<p>Lord Shiva is Mahadeva — the Great God who simultaneously destroys and regenerates. His cosmic dance, the <em>Tandava</em>, maintains the very rhythm of the universe.</p>
    <h4>Sacred Symbols</h4><ul>
    <li><strong>Nataraja</strong> — Lord of the Cosmic Dance; right foot on Apasmara (ignorance), ring of fire = the eternal cycle</li>
    <li><strong>Third Eye</strong> — Eye of transcendental wisdom; opens to burn falsehood</li>
    <li><strong>Trishul</strong> — Trident of creation, preservation, destruction</li>
    <li><strong>Neelkantha</strong> — Blue throat from drinking Halahala, the cosmic poison</li>
    <li><strong>Ganga</strong> — The river Ganges flows from his matted locks (jata)</li>
    <li><strong>Ardhanarisvara</strong> — Left half is Parvati (Shakti) — pure inseparable unity</li></ul>
    <h4>Panchakshara Mantra</h4>
    <p><em>"Om Namah Shivaya"</em> — the five syllables Na-Ma-Shi-Va-Ya represent the five elements: earth, water, fire, air, space.</p>`
  },

  lokas: {
    satya:    { cat:'Upper Loka · I',   title:'Satya Loka',   sk:'सत्यलोक',   body:`<p><strong>The Realm of Absolute Truth.</strong> Highest of all realms, the abode of Brahma the Creator. Souls who reach Satya Loka are liberated from the cycle of rebirth at cosmic dissolution. Time here is immeasurable — one day equals billions of earthly years.</p><p>This is the realm of <em>Satyam-Shivam-Sundaram</em> — Truth, Auspiciousness, Beauty — fully manifested.</p>` },
    tapa:     { cat:'Upper Loka · II',  title:'Tapa Loka',    sk:'तपलोक',     body:`<p><strong>The Realm of Austerity.</strong> Inhabited by the Ajanabhas, beings of supreme purity who practice tapas (spiritual fire/austerity) continuously. This realm survives even the partial dissolution of the lower worlds (Mahapralaya).</p>` },
    jana:     { cat:'Upper Loka · III', title:'Jana Loka',    sk:'जनलोक',     body:`<p><strong>The Realm of the Divine-Born.</strong> Home of the Kumaras — Sanaka, Sanandana, Sanatana, Sanatkumara — the mind-born sons of Brahma who remain eternally young sages, devoted to pure consciousness. They roam freely between all realms.</p>` },
    mahar:    { cat:'Upper Loka · IV',  title:'Mahar Loka',   sk:'महर्लोक',   body:`<p><strong>The Great Intermediate Realm.</strong> Bridge between the upper and middle worlds, home to great sages and Devas who survive even the destruction of the lower three realms. The great sage Bhrigu and other Maharishis dwell here.</p>` },
    svar:     { cat:'Upper Loka · V',   title:'Svar Loka',    sk:'स्वर्गलोक', body:`<p><strong>Heaven — the Divine Kingdom of Indra.</strong> A realm of transcendent beauty and pleasure. Virtuous souls dwell here after death, enjoying celestial delights, until their accumulated merit is exhausted. They then return to earth to continue their spiritual journey.</p><p>The Devas (divine beings), Apsaras (celestial dancers), and Gandharvas (divine musicians) inhabit this luminous realm.</p>` },
    bhuvar:   { cat:'Mid Loka · VI',    title:'Bhuvar Loka',  sk:'भुवर्लोक',  body:`<p><strong>The Atmospheric Realm.</strong> The space between heaven and earth — home to the Pitrs (ancestors), Yakshas, Vidyadharas, and various semi-divine beings. It is the realm of Prana (vital breath) and the subtle astral plane traversed by souls after death.</p>` },
    bhu:      { cat:'Middle Loka · VII',title:'Bhu Loka',     sk:'भूलोक',     body:`<p><strong>The Material Earth — Our Realm.</strong> The only realm where karma is actively accumulated and where the soul can progress toward Moksha. Bhu Loka is unique — it is the only plane where birth, death, and spiritual evolution occur together.</p><p>The Bhagavata Purana describes seven circular continents (Dvipas) surrounded by seven oceans on the surface of Bhu Loka.</p>` },
    atala:    { cat:'Lower Loka · I',   title:'Atala',        sk:'अतल',       body:`<p><strong>First Lower Realm.</strong> Ruled by the asura Bala, son of Maya the architect. This realm contains 96 types of maya (illusion). Three types of intoxicating substances originate here, causing states of supreme power, beauty, or forgetting.</p>` },
    vitala:   { cat:'Lower Loka · II',  title:'Vitala',       sk:'वितल',      body:`<p><strong>Second Lower Realm.</strong> Here Lord Shiva dwells as Hara-Bhava together with Bhavani (Shakti). The Hatakesvara river flows here carrying gold. Inhabitants are adorned in gold and live in divine prosperity.</p>` },
    sutala:   { cat:'Lower Loka · III', title:'Sutala',       sk:'सुतल',      body:`<p><strong>Third Lower Realm — the most sacred of the Patalas.</strong> Ruled by the great king Bali Maharaj, a supreme devotee of Vishnu. This realm surpasses even Svarga in beauty. Lord Vishnu himself guards it, residing here as Vamana.</p><p><em>"O Bali, your realm surpasses even Vaikuntha in opulence."</em> — Bhagavata Purana</p>` },
    talatala: { cat:'Lower Loka · IV',  title:'Talatala',     sk:'तलातल',     body:`<p><strong>Fourth Lower Realm.</strong> Ruled by Maya Danava — the legendary architect of the Asuras. Maya created the three flying cities (Tripura) destroyed by Shiva's arrow. This realm is a testament to the ultimate power of illusion (Maya).</p>` },
    mahatala: { cat:'Lower Loka · V',   title:'Mahatala',     sk:'महातल',     body:`<p><strong>Fifth Lower Realm.</strong> Home of the great serpent beings — the Krodhavasha clan of nagas with many hoods. Though they live in constant dread of Garuda (Vishnu's eagle mount), the realm itself is without suffering. The nagas here are adorned with precious gems.</p>` },
    rasatala: { cat:'Lower Loka · VI',  title:'Rasatala',     sk:'रसातल',     body:`<p><strong>Sixth Lower Realm.</strong> Realm of the Danavas and Daityas — the great enemy clans of the Devas. The Panis, demon cattle-thieves, also reside here. This is a realm of perpetual conflict and ambition, a mirror of unrestrained desire.</p>` },
    patala:   { cat:'Lower Loka · VII', title:'Patala',       sk:'पाताल',     body:`<p><strong>The Deepest Realm — Kingdom of the Nagas.</strong> Home of Vasuki, Takshaka, Ananta (Shesha), and all great serpent kings. The jewels in their hoods illuminate this lightless realm with a light more beautiful than the sun's.</p><p>Despite being the lowest realm, the Vishnu Purana describes Patala as extraordinarily beautiful — adorned with palaces of gems, gardens of divine flowers, and rivers of nectar.</p>` }
  },

  chakras: {
    muladhara:   { cat:'1st Chakra', title:'Muladhara',   sk:'मूलाधार',    body:`<p><strong>The Root — Earth Element.</strong> Located at the base of the spine. Governs survival, grounding, security. Its lotus has 4 petals. Bija mantra: <em>LAM</em>. When awakened, one transcends fear of death.</p>` },
    svadhisthana:{ cat:'2nd Chakra', title:'Svadhisthana',sk:'स्वाधिष्ठान',body:`<p><strong>The Sacral — Water Element.</strong> Located below the navel. Governs creativity, pleasure, relationships. Its lotus has 6 petals. Bija mantra: <em>VAM</em>. The dwelling place of the individual self (Jiva).</p>` },
    manipura:    { cat:'3rd Chakra', title:'Manipura',     sk:'मणिपूर',     body:`<p><strong>The Solar Plexus — Fire Element.</strong> Located at the navel. "City of Jewels." Governs will-power, transformation, identity. Its lotus has 10 petals. Bija mantra: <em>RAM</em>. The seat of the fire of Agni, which transforms food into prana.</p>` },
    anahata:     { cat:'4th Chakra', title:'Anahata',      sk:'अनाहत',      body:`<p><strong>The Heart — Air Element.</strong> Located at the heart center. "Unstruck Sound" — the primordial sound heard in deep meditation. Its lotus has 12 petals. Bija mantra: <em>YAM</em>. The bridge between lower (material) and upper (spiritual) chakras.</p>` },
    vishuddha:   { cat:'5th Chakra', title:'Vishuddha',    sk:'विशुद्ध',    body:`<p><strong>The Throat — Ether Element.</strong> Located at the throat. "Purification." Governs communication, truth, expression. Its lotus has 16 petals. Bija mantra: <em>HAM</em>. When activated, one can hear the cosmic sound (Nada Brahman).</p>` },
    ajna:        { cat:'6th Chakra', title:'Ajna',          sk:'आज्ञा',      body:`<p><strong>The Third Eye — Mind / Light.</strong> Located between the eyebrows. "Command Center." Governs intuition, wisdom, transcendence. Its lotus has 2 petals (Ha and Ksha). Bija mantra: <em>OM</em>. The seat of the Guru within.</p>` },
    sahasrara:   { cat:'7th Chakra', title:'Sahasrara',    sk:'सहस्रार',    body:`<p><strong>The Crown — Pure Consciousness.</strong> Located at the crown of the head. "Thousand-Petaled Lotus." Beyond elements, beyond thought. When Kundalini Shakti rises to Sahasrara and unites with Shiva consciousness here, Moksha is attained. The sound is silence.</p>` }
  },

  yugas: {
    satya:   { cat:'Cosmic Age · I',   title:'Satya Yuga',   sk:'सत्य युग',   body:`<p><strong>The Golden Age — Dharma on 4 Legs.</strong> Duration: 1,728,000 years. Dharma stands perfectly. All beings naturally embody truth, purity, compassion, and tapas. There is no disease, no aging, no pride, no conflict. The lifespan of humans is 100,000 years.</p><p>All humans are Brahmins by nature. The Vedas are one, undivided. No temples are needed — every being is a direct expression of Brahman.</p>` },
    treta:   { cat:'Cosmic Age · II',  title:'Treta Yuga',   sk:'त्रेता युग', body:`<p><strong>The Silver Age — Dharma on 3 Legs.</strong> Duration: 1,296,000 years. The age of Lord Rama. Fire sacrifices (Yajnas) become necessary. Pride, desire, and disease begin to appear. Humans live for 10,000 years. Three-quarters of dharma remains.</p><p>The Ramayana unfolds in this age — the ideal of righteous kingship (Rama Rajya) and perfect devotion (Hanuman).</p>` },
    dwapara: { cat:'Cosmic Age · III', title:'Dwapara Yuga', sk:'द्वापर युग',  body:`<p><strong>The Bronze Age — Dharma on 2 Legs.</strong> Duration: 864,000 years. The age of Lord Krishna and the Mahabharata. The Vedas are divided into four. Suffering, greed, and falsehood multiply. Human lifespan drops to 1,000 years.</p><p>The Bhagavad Gita is spoken on the battlefield of Kurukshetra — the eternal guide for all who follow.</p>` },
    kali:    { cat:'Cosmic Age · IV',  title:'Kali Yuga',    sk:'कलि युग',    body:`<p><strong>The Iron Age — Dharma on 1 Leg.</strong> Duration: 432,000 years. Our current age, began approximately 5,000 years ago. The shortest, most degraded, yet uniquely powerful age — even a small act of sincere devotion yields great merit.</p><p>Humanity lives for just 100 years. Materialism, confusion, and spiritual forgetfulness dominate. Yet at Kali Yuga's end, <em>Kalki</em> — the final avatar of Vishnu — will appear on a white horse, sword in hand, to restore Satya Yuga and the full flower of dharma.</p>` }
  },

  shesha: {
    cat: 'The Cosmic Serpent', title: 'Ananta Shesha', sk: 'अनंत शेष',
    body: `<p><strong>Ananta Shesha</strong> — the infinite cosmic serpent — is the foundation of all existence. Vishnu rests upon his thousand hoods atop the primordial ocean of consciousness (Kshirasagara). "Ananta" means infinite, "Shesha" means remainder — what remains after all of creation dissolves back into Brahman.</p>
    <p>His coils encircle the entire universe. The earth rests upon his hood. He is Adishesha — the first serpent, the original vibration of existence before creation. In his mouth he holds the entire cosmos.</p>
    <p>In a later life, Shesha incarnated as Lakshmana (loyal brother of Rama) and as Balarama (elder brother of Krishna), serving the Lord directly.</p>`
  },

  kalachakra: {
    cat: 'The Wheel of Time', title: 'Kalachakra', sk: 'कालचक्र',
    body: `<p><strong>The Wheel of Cosmic Time</strong> revolves endlessly through four ages. One complete revolution — one Mahayuga — spans 4,320,000 years. 1,000 Mahayugas = 1 Kalpa (one day of Brahma = 4.32 billion years).</p>
    <h4>The Great Cycle</h4><ul>
    <li>1 Mahayuga = 4,320,000 human years</li>
    <li>71 Mahayugas = 1 Manvantara (age of one Manu)</li>
    <li>14 Manvantaras = 1 Kalpa (Brahma's day)</li>
    <li>2 Kalpas = 1 Brahma day+night = 8.64 billion years</li>
    <li>360 such days = 1 Brahma year = 3.11 trillion years</li>
    <li>100 Brahma years = Brahma's lifespan = 311 trillion years</li></ul>
    <p>We are in the Kali Yuga of the 28th Mahayuga of the 7th Manvantara of the current Kalpa — the Shweta Varaha Kalpa.</p>`
  }
};

// ═══════════════════════════════════════════════════════════════
// CAMERA VIEWS  (all centered near origin for each group)
// ═══════════════════════════════════════════════════════════════
const VIEWS = {
  cosmos:   { pos: new THREE.Vector3(0,  30, 360),  look: new THREE.Vector3(0,  0, 0) },
  trimurti: { pos: new THREE.Vector3(0,  20, 240),  look: new THREE.Vector3(0,  0, 0) },
  lokas:    { pos: new THREE.Vector3(240, 0, 120),  look: new THREE.Vector3(0,  0, 0) },
  chakras:  { pos: new THREE.Vector3(90,  0, 170),  look: new THREE.Vector3(0,  0, 0) },
  yugas:    { pos: new THREE.Vector3(0,  280, 210), look: new THREE.Vector3(0,  0, 0) }
};

const TOUR_STOPS = [
  { view:'cosmos',   wait:7000 },
  { view:'trimurti', wait:7000 },
  { view:'lokas',    wait:8000 },
  { view:'chakras',  wait:7000 },
  { view:'yugas',    wait:7000 }
];

// ═══════════════════════════════════════════════════════════════
// GLOBALS
// ═══════════════════════════════════════════════════════════════
let scene, camera, renderer, composer, controls;
let uTime      = 0;
let clickables = [];
let animatables= [];

// ── Scene Groups — show only what's relevant per view ──────────
const GROUPS = {};
function getGroup(name) {
  if (!GROUPS[name]) {
    GROUPS[name] = new THREE.Group();
    scene.add(GROUPS[name]);
  }
  return GROUPS[name];
}

function setViewObjects(viewName) {
  const showMap = {
    cosmos:   ['cosmos', 'stars'],
    trimurti: ['trimurti', 'stars'],
    lokas:    ['lokas', 'stars'],
    chakras:  ['chakras', 'stars'],
    yugas:    ['yugas', 'stars'],
  };
  const show = new Set(showMap[viewName] || ['stars']);
  Object.entries(GROUPS).forEach(([key, grp]) => {
    grp.visible = show.has(key);
  });
}

// Transition state
let transActive   = false;
let transStart    = 0;
const transDur    = 2400;
let transFrom     = new THREE.Vector3();
let transTo       = new THREE.Vector3();
let transLookFrom = new THREE.Vector3();
let transLookTo   = new THREE.Vector3();

// Tour
let tourActive = false;
let tourIdx    = 0;
let tourTimer  = null;

// ═══════════════════════════════════════════════════════════════
// ENTRY POINT
// ═══════════════════════════════════════════════════════════════
document.fonts.ready.then(() => {
  setupRenderer();
  setupScene();
  setupCamera();
  setupComposer();
  setupControls();
  buildUniverse();
  setupInteraction();
  setupUI();
  simulateLoading(() => {
    const el = document.getElementById('loading');
    el.classList.add('out');
    setTimeout(() => { el.style.display = 'none'; }, 1100);
  });
  animate();
});

// ═══════════════════════════════════════════════════════════════
// SETUP
// ═══════════════════════════════════════════════════════════════
function setupRenderer() {
  const canvas = document.getElementById('c');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

function setupScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000005);
  scene.fog = new THREE.FogExp2(0x000005, 0.00025);

  scene.add(new THREE.AmbientLight(0xfff5e0, 1.4));

  const sun = new THREE.DirectionalLight(0xFFD700, 1.8);
  sun.position.set(50, 200, 100);
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x7744AA, 0.5);
  fill.position.set(-100, 50, -100);
  scene.add(fill);
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(52, innerWidth / innerHeight, 1, 3000);
  camera.position.copy(VIEWS.cosmos.pos);
  camera.lookAt(VIEWS.cosmos.look);
}

function setupComposer() {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(innerWidth, innerHeight),
    0.55,  // strength — soft, only HDR objects glow
    0.45,  // radius
    0.68   // threshold — very selective
  );
  composer.addPass(bloom);
}

function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping   = true;
  controls.dampingFactor   = 0.055;
  controls.target.copy(VIEWS.cosmos.look);
  controls.minDistance     = 50;
  controls.maxDistance     = 800;
  controls.enablePan       = false;
  controls.autoRotate      = true;
  controls.autoRotateSpeed = 0.18;
  controls.minPolarAngle   = 0.25;
  controls.maxPolarAngle   = Math.PI * 0.82;
}

// ═══════════════════════════════════════════════════════════════
// BUILD THE UNIVERSE
// ═══════════════════════════════════════════════════════════════
function buildUniverse() {
  createStarfield();     // always visible background
  createParaBrahman();   // cosmos group
  createSoulParticles(); // cosmos group
  createTrimurti();      // trimurti group
  createLokas();         // lokas group
  createSriYantraFloor();// lokas group
  createChakraColumn();  // chakras group
  createSheshaNaga();    // chakras group
  createKalachakra();    // yugas group

  // Start in cosmos view
  setViewObjects('cosmos');
}

// ── Static Starfield (replaces animated galaxy shader) ────────
function createStarfield() {
  const count = 5000;
  const pos   = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 700 + Math.random() * 400;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 1.4,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  getGroup('stars').add(new THREE.Points(geo, mat));
}

// ── Para Brahman — The Infinite ───────────────────────────────
function createParaBrahman() {
  const grp = getGroup('cosmos');

  // Core orb
  const geo = new THREE.SphereGeometry(10, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader:   BRAHMAN_VERT,
    fragmentShader: BRAHMAN_FRAG
  });
  const core = new THREE.Mesh(geo, mat);
  grp.add(core);
  clickables.push({ mesh: core, data: DATA.paraBrahman, label: 'Para Brahman' });
  animatables.push(t => {
    mat.uniforms.uTime.value = t;
    core.rotation.y = t * 0.035;
  });

  // Two soft halos (not five)
  [{ r: 18, op: 0.08 }, { r: 32, op: 0.04 }].forEach(({ r, op }, i) => {
    const hGeo = new THREE.SphereGeometry(r, 32, 32);
    const hMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.0, 0.75, 0.1),
      transparent: true,
      opacity: op,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    });
    const halo = new THREE.Mesh(hGeo, hMat);
    grp.add(halo);
    animatables.push(t => {
      const s = 1 + 0.04 * Math.sin(t * 1.1 + i * 1.2);
      halo.scale.setScalar(s);
    });
  });

  // OM label
  const lbl = makeLabel('ॐ', 'Para Brahman', '#FFD700', 340, 90);
  lbl.position.set(0, 18, 0);
  lbl.scale.set(28, 10, 1);
  grp.add(lbl);
}

// ── Soul Particles — Jivas orbiting Brahman ───────────────────
function createSoulParticles() {
  const grp   = getGroup('cosmos');
  const count = 400;
  const pos   = new Float32Array(count * 3);
  const spd   = new Float32Array(count);
  const orb   = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const r     = 35 + Math.random() * 100;
    pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i*3+2] = r * Math.cos(phi);
    spd[i]  = 0.15 + Math.random() * 0.45;
    orb[i]  = r;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xFFEECC,
    size: 0.8,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const pts = new THREE.Points(geo, mat);
  grp.add(pts);

  animatables.push(t => {
    const pa = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      const x  = pa.getX(i);
      const z  = pa.getZ(i);
      const ang = Math.atan2(z, x) + spd[i] * 0.002;
      const r  = orb[i];
      pa.setX(i, Math.cos(ang) * r);
      pa.setZ(i, Math.sin(ang) * r);
    }
    pa.needsUpdate = true;
    mat.opacity = 0.10 + 0.04 * Math.sin(t * 0.5);
  });
}

// ── Trimurti ──────────────────────────────────────────────────
function createTrimurti() {
  makeBrahma(new THREE.Vector3(-88, 0, 0));
  makeVishnu (new THREE.Vector3(  0, 0, 88));
  makeShiva  (new THREE.Vector3( 88, 0, 0));
}

function makeBrahma(pos) {
  const grp = getGroup('trimurti');
  const g   = new THREE.Group();
  g.position.copy(pos);

  const gold  = { color:0xFFD700, emissive:0xFF8800, emissiveIntensity:0.6, roughness:0.2, metalness:0.9 };
  const skin  = { color:0xFFE5A0, emissive:0xFFCC44, emissiveIntensity:0.4, roughness:0.4 };
  const mk    = o => new THREE.MeshStandardMaterial(o);

  // Lotus pedestal
  [0, 3].forEach(dy => {
    const lotus = new THREE.Mesh(new THREE.TorusGeometry(8, 1.2, 8, 24), mk(gold));
    lotus.rotation.x = Math.PI / 2;
    lotus.position.y = -12 + dy;
    g.add(lotus);
  });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16), mk({ ...gold, emissiveIntensity:0.7 }));
  body.scale.set(1, 1.6, 1);
  body.position.y = -5;
  g.add(body);

  // Main head
  const mainH = new THREE.Mesh(new THREE.SphereGeometry(2.5, 20, 20), mk(skin));
  mainH.position.y = 2;
  g.add(mainH);

  // Side heads (3)
  [0, Math.PI * 2/3, Math.PI * 4/3].forEach(a => {
    const sh = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12), mk({ ...skin, emissiveIntensity:0.3 }));
    sh.position.set(Math.sin(a) * 2.8, 2.8, Math.cos(a) * 2.8);
    g.add(sh);
  });

  // Crown
  const crown = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 8), mk({ ...gold, emissiveIntensity:1 }));
  crown.position.y = 6.5;
  g.add(crown);

  // 4 orbiting Vedas (books)
  for (let i = 0; i < 4; i++) {
    const veda = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.8, 0.2),
      mk({ color:0xFF6600, emissive:0xFF2200, emissiveIntensity:0.8, roughness:0.5 })
    );
    veda.userData.vedaIdx = i;
    g.add(veda);
  }

  const lbl = makeLabel('BRAHMA', 'ब्रह्मा', '#FFD700', 380, 65);
  lbl.position.set(0, 14, 0);
  lbl.scale.set(22, 5, 1);
  g.add(lbl);

  // Saffron point light
  const pl = new THREE.PointLight(0xFF8800, 2.5, 80);
  pl.position.set(0, 5, 0);
  g.add(pl);

  grp.add(g);
  clickables.push({ mesh: g, data: DATA.brahma, label: 'Brahma' });

  animatables.push(t => {
    g.rotation.y = Math.sin(t * 0.18) * 0.3;
    g.children.forEach(c => {
      if (c.userData.vedaIdx !== undefined) {
        const a = (c.userData.vedaIdx / 4) * Math.PI * 2 + t * 0.5;
        c.position.set(Math.cos(a) * 9, 2 + Math.sin(t * 0.8 + c.userData.vedaIdx) * 0.8, Math.sin(a) * 9);
        c.rotation.y = a + Math.PI / 2;
      }
    });
  });
}

function makeVishnu(pos) {
  const grp = getGroup('trimurti');
  const g   = new THREE.Group();
  g.position.copy(pos);

  const blue = { color:0x0D47A1, emissive:0x1565C0, emissiveIntensity:0.7, roughness:0.2, metalness:0.8 };
  const mk   = o => new THREE.MeshStandardMaterial(o);

  const ped = new THREE.Mesh(new THREE.CylinderGeometry(5, 6, 3, 12),
    mk({ color:0x880088, emissive:0x440055, emissiveIntensity:0.5, roughness:0.5, metalness:0.6 }));
  ped.position.y = -13.5;
  g.add(ped);

  const body = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), mk(blue));
  body.scale.set(1, 2, 1);
  body.position.y = -5;
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 20), mk({ ...blue, color:0x1565C0, emissiveIntensity:0.6 }));
  head.position.y = 4;
  g.add(head);

  const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 6, 8),
    mk({ color:0xFFD700, emissive:0xFFAA00, emissiveIntensity:1, roughness:0.1, metalness:0.95 }));
  crown.position.y = 10;
  g.add(crown);

  // Sudarshana Chakra
  const cGrp = new THREE.Group();
  cGrp.position.set(10, 3, 0);
  const cRing = new THREE.Mesh(new THREE.TorusGeometry(4, 0.8, 8, 32),
    mk({ color:0xFFD700, emissive:0xFF6600, emissiveIntensity:1.2, roughness:0.1, metalness:1 }));
  cGrp.add(cRing);
  for (let i = 0; i < 8; i++) {
    const a  = (i / 8) * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 7.5, 4),
      mk({ color:0xFFD700, emissive:0xFFAA00, emissiveIntensity:0.8 }));
    sp.rotation.z = Math.PI / 2;
    sp.rotation.y = a;
    cGrp.add(sp);
  }
  g.add(cGrp);

  const lbl = makeLabel('VISHNU', 'विष्णु', '#4FC3F7', 360, 65);
  lbl.position.set(0, 16, 0);
  lbl.scale.set(22, 5, 1);
  g.add(lbl);

  const pl = new THREE.PointLight(0x1565C0, 2.0, 80);
  pl.position.set(0, 5, 0);
  g.add(pl);

  grp.add(g);
  clickables.push({ mesh: g, data: DATA.vishnu, label: 'Vishnu' });

  animatables.push(t => {
    cGrp.rotation.z = t * 1.4;
    g.rotation.y = Math.sin(t * 0.15 + 1) * 0.28;
  });
}

function makeShiva(pos) {
  const grp = getGroup('trimurti');
  const g   = new THREE.Group();
  g.position.copy(pos);

  const silver = { color:0xDDDDFF, emissive:0x8888FF, emissiveIntensity:0.6, roughness:0.15, metalness:0.85 };
  const mk     = o => new THREE.MeshStandardMaterial(o);

  const ped = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.5, 5, 12),
    mk({ color:0x222233, emissive:0x4444AA, emissiveIntensity:0.5, roughness:0.4, metalness:0.7 }));
  ped.position.y = -14;
  g.add(ped);

  const body = new THREE.Mesh(new THREE.SphereGeometry(3.8, 16, 16), mk(silver));
  body.scale.set(1, 1.8, 1);
  body.position.y = -5;
  g.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(2.8, 20, 20), mk(silver));
  head.position.y = 3.5;
  g.add(head);

  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8),
    mk({ color:0xFF2200, emissive:0xFF5500, emissiveIntensity:3, roughness:0.1 }));
  eye.position.set(0, 4.2, 2.7);
  g.add(eye);

  const moon = new THREE.Mesh(new THREE.TorusGeometry(2, 0.5, 8, 20, Math.PI),
    mk({ color:0xEEEEFF, emissive:0xCCCCFF, emissiveIntensity:0.8, roughness:0.3 }));
  moon.position.y = 8;
  moon.rotation.z = Math.PI;
  g.add(moon);

  // Trishul
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 14, 6),
    mk({ color:0xFFD700, emissive:0xFF8800, emissiveIntensity:0.8, metalness:0.9, roughness:0.1 }));
  shaft.position.set(-10, 2, 0);
  g.add(shaft);
  [-2, 0, 2].forEach(ox => {
    const prong = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3, 6),
      mk({ color:0xFFD700, emissive:0xFF8800, emissiveIntensity:1, metalness:0.9, roughness:0.1 }));
    prong.position.set(-10 + ox, 10.5, 0);
    g.add(prong);
  });

  // Ring of fire
  const fireCount = 72;
  const fPos = new Float32Array(fireCount * 3);
  for (let i = 0; i < fireCount; i++) {
    const a = (i / fireCount) * Math.PI * 2;
    fPos[i*3]   = Math.cos(a) * 14;
    fPos[i*3+1] = 0;
    fPos[i*3+2] = Math.sin(a) * 14;
  }
  const fGeo = new THREE.BufferGeometry();
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
  const fMat = new THREE.PointsMaterial({
    color:0xFF4400, size:2.2, transparent:true, opacity:0.85,
    blending:THREE.AdditiveBlending, depthWrite:false
  });
  const fire = new THREE.Points(fGeo, fMat);
  g.add(fire);

  const lbl = makeLabel('SHIVA', 'शिव', '#CE93D8', 320, 65);
  lbl.position.set(0, 16, 0);
  lbl.scale.set(20, 5, 1);
  g.add(lbl);

  const pl = new THREE.PointLight(0xCC3333, 2.0, 80);
  pl.position.set(0, 5, 0);
  g.add(pl);

  grp.add(g);
  clickables.push({ mesh: g, data: DATA.shiva, label: 'Shiva' });

  animatables.push(t => {
    g.rotation.y = Math.sin(t * 0.2 + 2) * 0.3;
    fire.rotation.y = t * 0.85;
    fMat.opacity = 0.85 * (0.7 + 0.3 * Math.sin(t * 7));
  });
}

// ── 14 Lokas — unified gold-to-dark-copper gradient ───────────
const LOKA_DATA = [
  { key:'satya',    name:'Satya Loka',    sk:'सत्यलोक',   y: 175 },
  { key:'tapa',     name:'Tapa Loka',     sk:'तपलोक',     y: 150 },
  { key:'jana',     name:'Jana Loka',     sk:'जनलोक',     y: 125 },
  { key:'mahar',    name:'Mahar Loka',    sk:'महर्लोक',   y: 100 },
  { key:'svar',     name:'Svar Loka',     sk:'स्वर्गलोक', y:  75 },
  { key:'bhuvar',   name:'Bhuvar Loka',   sk:'भुवर्लोक',  y:  50 },
  { key:'bhu',      name:'Bhu Loka',      sk:'भूलोक',     y:  25 },
  { key:'atala',    name:'Atala',         sk:'अतल',       y: -25 },
  { key:'vitala',   name:'Vitala',        sk:'वितल',      y: -50 },
  { key:'sutala',   name:'Sutala',        sk:'सुतल',      y: -75 },
  { key:'talatala', name:'Talatala',      sk:'तलातल',     y:-100 },
  { key:'mahatala', name:'Mahatala',      sk:'महातल',     y:-125 },
  { key:'rasatala', name:'Rasatala',      sk:'रसातल',     y:-150 },
  { key:'patala',   name:'Patala',        sk:'पाताल',     y:-175 }
];

function createLokas() {
  const g = getGroup('lokas');

  // Vertical axis line — subtle
  const axGeo = new THREE.CylinderGeometry(0.3, 0.3, 380, 6);
  const axMat = new THREE.MeshBasicMaterial({ color:0x443322, transparent:true, opacity:0.25 });
  g.add(new THREE.Mesh(axGeo, axMat));

  LOKA_DATA.forEach((ld, i) => {
    const frac  = i / (LOKA_DATA.length - 1); // 0=Satya, 1=Patala
    const bright = 1 - frac * 0.78;

    const col = new THREE.Color(
      0.92 * bright + 0.08,
      0.65 * bright + 0.02,
      0.04 * bright
    );
    const emi = new THREE.Color(
      0.7  * bright,
      0.35 * bright,
      0.0
    );
    const eI = 0.85 - frac * 0.55;

    const mat = new THREE.MeshStandardMaterial({
      color: col, emissive: emi, emissiveIntensity: eI,
      roughness:0.3, metalness:0.7, transparent:true, opacity:0.9
    });

    const mesh = new THREE.Mesh(new THREE.TorusGeometry(82, 4, 10, 80), mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = ld.y;
    g.add(mesh);

    const info = DATA.lokas[ld.key];
    if (info) clickables.push({ mesh, data: info, label: ld.name });

    const hexStr = '#' + col.getHexString();
    const lbl = makeLabel(ld.name, ld.sk, hexStr, 420, 62);
    lbl.position.set(100, ld.y, 0);
    lbl.scale.set(26, 4.5, 1);
    g.add(lbl);

    animatables.push(tt => {
      const p = 0.85 + 0.15 * Math.sin(tt * 0.8 + i * 0.45);
      mat.emissiveIntensity = eI * p;
      mesh.rotation.z = tt * 0.008 * (i % 2 === 0 ? 1 : -1);
    });
  });
}

// ── Sri Yantra at Bhu Loka ────────────────────────────────────
function createSriYantraFloor() {
  const g    = getGroup('lokas');
  const size = 512;
  const can  = document.createElement('canvas');
  can.width  = size; can.height = size;
  const ctx  = can.getContext('2d');

  drawSriYantra(ctx, size);

  const tex = new THREE.CanvasTexture(can);
  const geo = new THREE.CircleGeometry(80, 64);
  const mat = new THREE.MeshBasicMaterial({
    map:tex, transparent:true, opacity:0.5,
    blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide
  });
  const disc = new THREE.Mesh(geo, mat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 23;
  g.add(disc);

  animatables.push(t => { disc.rotation.z = -t * 0.012; });
}

function drawSriYantra(ctx, s) {
  const cx = s/2, cy = s/2, r = s*0.43;
  ctx.clearRect(0, 0, s, s);

  ctx.strokeStyle = 'rgba(255,215,0,0.45)';
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i++) {
    const d = 8 + i * 9;
    ctx.strokeRect(d, d, s - d*2, s - d*2);
  }

  for (let i = 0; i < 16; i++) {
    const a = (i/16)*Math.PI*2;
    ctx.save();
    ctx.translate(cx + Math.cos(a)*r*0.85, cy + Math.sin(a)*r*0.85);
    ctx.rotate(a);
    ctx.strokeStyle = 'rgba(255,180,0,0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, r*0.09, r*0.21, 0, 0, Math.PI*2);
    ctx.stroke();
    ctx.restore();
  }

  [r*0.95, r, r*1.05].forEach(cr => {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(255,215,0,0.28)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  const tris = [
    [0,-r*0.95,-r*0.82,r*0.48,r*0.82,r*0.48],
    [0,-r*0.55,-r*0.48,r*0.27,r*0.48,r*0.27],
    [0,-r*0.72,-r*0.62,r*0.36,r*0.62,r*0.36],
    [0,r*0.95,-r*0.82,-r*0.48,r*0.82,-r*0.48],
    [0,r*0.72,-r*0.62,-r*0.36,r*0.62,-r*0.36],
    [0,r*0.50,-r*0.43,-r*0.25,r*0.43,-r*0.25],
    [-r*0.35,r*0.20,r*0.35,r*0.20,0,-r*0.40],
    [0,r*0.40,-r*0.35,-r*0.20,r*0.35,-r*0.20],
  ];
  tris.forEach((t, i) => {
    ctx.beginPath();
    ctx.moveTo(cx+t[0], cy+t[1]);
    ctx.lineTo(cx+t[2], cy+t[3]);
    ctx.lineTo(cx+t[4], cy+t[5]);
    ctx.closePath();
    const br = 255 - i*14;
    ctx.strokeStyle = `rgba(${br},${Math.max(100,br-80)},0,${0.6-i*0.04})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  });

  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI*2);
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 18;
  ctx.fill();
}

// ── Chakra Column ─────────────────────────────────────────────
const CHAKRA_DATA = [
  { key:'muladhara',    color:0xCC2200, em:0xAA1100, y:-80, name:'Muladhara',    sk:'मूलाधार'     },
  { key:'svadhisthana', color:0xDD5500, em:0xBB3300, y:-48, name:'Svadhisthana', sk:'स्वाधिष्ठान' },
  { key:'manipura',     color:0xDDCC00, em:0xBBAA00, y:-16, name:'Manipura',     sk:'मणिपूर'      },
  { key:'anahata',      color:0x22AA55, em:0x118833, y: 16, name:'Anahata',      sk:'अनाहत'       },
  { key:'vishuddha',    color:0x1188DD, em:0x0066BB, y: 48, name:'Vishuddha',    sk:'विशुद्ध'     },
  { key:'ajna',         color:0x4422CC, em:0x2200AA, y: 80, name:'Ajna',         sk:'आज्ञा'       },
  { key:'sahasrara',    color:0xBB00CC, em:0x880099, y:112, name:'Sahasrara',    sk:'सहस्रार'     }
];

function createChakraColumn() {
  const grp = getGroup('chakras');

  CHAKRA_DATA.forEach((cd, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color:cd.color, emissive:cd.em, emissiveIntensity:0.75,
      roughness:0.2, metalness:0.5, transparent:true, opacity:0.9
    });

    const sz   = 3 + (i === 6 ? 1.5 : 0); // sahasrara larger
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(sz, 24, 24), mat);
    mesh.position.set(0, cd.y, 0);
    grp.add(mesh);

    const oMat = new THREE.MeshBasicMaterial({
      color:cd.color, transparent:true, opacity:0.3,
      blending:THREE.AdditiveBlending, depthWrite:false
    });
    const oRing = new THREE.Mesh(new THREE.TorusGeometry(5 + i*0.5, 0.4, 6, 28), oMat);
    oRing.position.set(0, cd.y, 0);
    oRing.rotation.x = Math.PI / 2;
    grp.add(oRing);

    const info = DATA.chakras[cd.key];
    if (info) clickables.push({ mesh, data: info, label: cd.name });

    const hexStr = '#' + new THREE.Color(cd.color).getHexString();
    const lbl = makeLabel(cd.name, cd.sk, hexStr, 360, 62);
    lbl.position.set(16, cd.y, 0);
    lbl.scale.set(20, 4.5, 1);
    grp.add(lbl);

    animatables.push(t => {
      const p = 0.78 + 0.22 * Math.sin(t * 1.4 + i * 0.6);
      mat.emissiveIntensity = 0.75 * p;
      oRing.rotation.z = t * (0.45 + i*0.07) * (i % 2 === 0 ? 1 : -1);
    });
  });

  // Sushumna tube
  const spts   = CHAKRA_DATA.map(c => new THREE.Vector3(0, c.y, 0));
  const curve  = new THREE.CatmullRomCurve3(spts);
  const tubGeo = new THREE.TubeGeometry(curve, 50, 0.4, 6, false);
  const tubMat = new THREE.MeshBasicMaterial({ color:0xFFFFFF, transparent:true, opacity:0.12,
    blending:THREE.AdditiveBlending, depthWrite:false });
  grp.add(new THREE.Mesh(tubGeo, tubMat));
}

// ── Ananta Shesha — Cosmic Serpent ───────────────────────────
function createSheshaNaga() {
  const grp  = getGroup('chakras');
  const coils= 8;
  const pts  = [];
  for (let i = 0; i <= 280; i++) {
    const tt  = i / 280;
    const a   = tt * Math.PI * 2 * coils;
    const y   = -100 + tt * 240;
    const rad = 90 + Math.sin(tt * Math.PI * 4) * 12;
    pts.push(new THREE.Vector3(Math.cos(a)*rad, y, Math.sin(a)*rad));
  }

  const curve = new THREE.CatmullRomCurve3(pts);
  const tGeo  = new THREE.TubeGeometry(curve, 300, 2.5, 8, false);
  const tMat  = new THREE.MeshStandardMaterial({
    color:0x1A5C1A, emissive:0x004400, emissiveIntensity:0.5,
    roughness:0.3, metalness:0.7, transparent:true, opacity:0.7
  });
  const snake = new THREE.Mesh(tGeo, tMat);
  grp.add(snake);
  clickables.push({ mesh:snake, data:DATA.shesha, label:'Ananta Shesha' });

  // Head
  const hGeo  = new THREE.SphereGeometry(5, 16, 16);
  const hMat  = new THREE.MeshStandardMaterial({ color:0x228822, emissive:0x00AA00, emissiveIntensity:0.8, roughness:0.2, metalness:0.8 });
  const head  = new THREE.Mesh(hGeo, hMat);
  const last  = pts[pts.length-1];
  head.position.copy(last);
  grp.add(head);

  animatables.push(t => { tMat.emissiveIntensity = 0.5 + 0.2*Math.sin(t*0.6); });
}

// ── Kalachakra — Wheel of Time ────────────────────────────────
function createKalachakra() {
  const grp = getGroup('yugas');
  const R   = 110;

  // Outer ring
  const ringMat = new THREE.MeshStandardMaterial({
    color:0xFFD700, emissive:0xFF8800, emissiveIntensity:0.7, roughness:0.2, metalness:0.9
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(R, 2.5, 8, 100), ringMat);
  ring.rotation.x = Math.PI/2;
  grp.add(ring);

  // 4 Yuga arc segments
  const yugaCols = [
    { c:0xFFFFCC, e:0xFFDD00 },  // Satya — gold-white
    { c:0xCCCCCC, e:0xAAAAAA },  // Treta — silver
    { c:0xCC9966, e:0xFF6600 },  // Dwapara — bronze
    { c:0x555566, e:0x2222AA }   // Kali — iron/dark
  ];
  const yugaKeys = ['satya', 'treta', 'dwapara', 'kali'];

  for (let i = 0; i < 4; i++) {
    const angle = (i/4) * Math.PI * 2;
    const arc   = new THREE.TorusGeometry(R*0.6, 10, 6, 20, Math.PI*0.42);
    const m     = new THREE.MeshStandardMaterial({
      color:yugaCols[i].c, emissive:yugaCols[i].e,
      emissiveIntensity:0.5, roughness:0.4, transparent:true, opacity:0.9
    });
    const seg = new THREE.Mesh(arc, m);
    seg.rotation.x = Math.PI/2;
    seg.rotation.z = angle + Math.PI*0.1;
    grp.add(seg);
    clickables.push({ mesh:seg, data:DATA.yugas[yugaKeys[i]], label:yugaKeys[i].charAt(0).toUpperCase()+yugaKeys[i].slice(1)+' Yuga' });
  }

  // 8 spokes
  for (let i = 0; i < 8; i++) {
    const a   = (i/8)*Math.PI*2;
    const spk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.5, 0.5, R-12, 6),
      new THREE.MeshStandardMaterial({ color:0xFFD700, emissive:0xFF8800, emissiveIntensity:0.4, roughness:0.3 })
    );
    spk.position.set(Math.cos(a)*(R-12)/2, 0, Math.sin(a)*(R-12)/2);
    spk.rotation.z = Math.PI/2;
    spk.rotation.y = -a;
    grp.add(spk);
  }

  // Hub
  const hub = new THREE.Mesh(
    new THREE.SphereGeometry(9, 16, 16),
    new THREE.MeshStandardMaterial({ color:0xFFD700, emissive:0xFFAA00, emissiveIntensity:1, roughness:0.1, metalness:1 })
  );
  grp.add(hub);
  clickables.push({ mesh:hub, data:DATA.kalachakra, label:'Kalachakra' });

  const lbl = makeLabel('KALACHAKRA', 'कालचक्र', '#FFD700', 480, 72);
  lbl.position.set(0, R + 18, 0);
  lbl.scale.set(36, 7, 1);
  grp.add(lbl);

  animatables.push(t => { ring.rotation.z = t * 0.06; });
}

// ═══════════════════════════════════════════════════════════════
// LABEL FACTORY
// ═══════════════════════════════════════════════════════════════
function makeLabel(text, sub, color, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);

  ctx.fillStyle = color || '#FFD700';
  ctx.font = `bold ${Math.round(h * 0.50)}px Cinzel, Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color || '#FFD700';
  ctx.shadowBlur = 12;
  ctx.fillText(text, w/2, h * 0.38);

  if (sub) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = `${Math.round(h * 0.30)}px serif`;
    ctx.shadowBlur = 5;
    ctx.fillText(sub, w/2, h * 0.72);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map:tex, transparent:true, depthWrite:false });
  return new THREE.Sprite(mat);
}

// ═══════════════════════════════════════════════════════════════
// INTERACTION
// ═══════════════════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-9, -9);
const tip       = document.getElementById('tip');

function findClickable(hitObject) {
  let obj = hitObject;
  while (obj) {
    const entry = clickables.find(c => c.mesh === obj);
    if (entry) return entry;
    obj = obj.parent;
  }
  return null;
}

function setupInteraction() {
  renderer.domElement.addEventListener('click', onCanvasClick);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);
}

function onMouseMove(e) {
  mouse.x =  (e.clientX / innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickables.map(c => c.mesh), true);

  if (hits.length > 0) {
    const entry = findClickable(hits[0].object);
    if (entry) {
      tip.textContent = entry.label;
      tip.classList.add('on');
      renderer.domElement.style.cursor = 'pointer';
    }
    tip.style.left = (e.clientX + 14) + 'px';
    tip.style.top  = (e.clientY + 10) + 'px';
  } else {
    tip.classList.remove('on');
    renderer.domElement.style.cursor = 'default';
  }
}

function onCanvasClick(e) {
  mouse.x =  (e.clientX / innerWidth)  * 2 - 1;
  mouse.y = -(e.clientY / innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(clickables.map(c => c.mesh), true);
  if (hits.length > 0) {
    const entry = findClickable(hits[0].object);
    if (entry) showPanel(entry.data);
  }
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
}

// ═══════════════════════════════════════════════════════════════
// INFO PANEL
// ═══════════════════════════════════════════════════════════════
function showPanel(data) {
  document.getElementById('panel-cat').textContent   = data.cat   || '';
  document.getElementById('panel-title').textContent = data.title || '';
  document.getElementById('panel-sk').textContent    = data.sk    || '';
  document.getElementById('panel-body').innerHTML    = data.body  || '';
  document.getElementById('panel').classList.add('open');
}

function hidePanel() {
  document.getElementById('panel').classList.remove('open');
}

// ═══════════════════════════════════════════════════════════════
// CAMERA FLIGHT
// ═══════════════════════════════════════════════════════════════
function flyTo(viewName) {
  const v = VIEWS[viewName];
  if (!v) return;

  setViewObjects(viewName);

  controls.enabled = false;
  transActive      = true;
  transStart       = performance.now();
  transFrom.copy(camera.position);
  transTo.copy(v.pos);
  transLookFrom.copy(controls.target);
  transLookTo.copy(v.look);
}

function updateTransition(now) {
  if (!transActive) return;
  const elapsed = now - transStart;
  const t = Math.min(elapsed / transDur, 1);
  const e = 1 - Math.pow(1-t, 3);

  camera.position.lerpVectors(transFrom, transTo, e);
  controls.target.lerpVectors(transLookFrom, transLookTo, e);
  camera.lookAt(controls.target);

  if (t >= 1) {
    transActive      = false;
    controls.enabled = true;
  }
}

// ═══════════════════════════════════════════════════════════════
// GUIDED TOUR
// ═══════════════════════════════════════════════════════════════
function startTour() {
  stopTour();
  tourActive = true;
  tourIdx    = 0;
  doTourStop();
}

function doTourStop() {
  if (!tourActive || tourIdx >= TOUR_STOPS.length) { stopTour(); return; }
  const stop = TOUR_STOPS[tourIdx];
  flyTo(stop.view);
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nb[data-view="${stop.view}"]`);
  if (btn) btn.classList.add('active');
  tourTimer = setTimeout(() => { tourIdx++; doTourStop(); }, stop.wait + transDur);
}

function stopTour() {
  tourActive = false;
  if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
}

// ═══════════════════════════════════════════════════════════════
// UI SETUP
// ═══════════════════════════════════════════════════════════════
function setupUI() {
  document.querySelectorAll('.nb').forEach(btn => {
    btn.addEventListener('click', () => {
      stopTour();
      document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      flyTo(btn.dataset.view);
    });
  });

  document.getElementById('btn-tour').addEventListener('click', () => {
    tourActive ? stopTour() : startTour();
  });

  document.getElementById('btn-reset').addEventListener('click', () => {
    stopTour();
    flyTo('cosmos');
    document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
    document.querySelector('.nb[data-view="cosmos"]').classList.add('active');
  });

  document.getElementById('panel-close').addEventListener('click', hidePanel);

  setTimeout(() => { document.getElementById('hint').classList.add('gone'); }, 6000);
}

// ═══════════════════════════════════════════════════════════════
// LOADING
// ═══════════════════════════════════════════════════════════════
function simulateLoading(done) {
  const bar  = document.getElementById('load-bar');
  const text = document.getElementById('load-text');
  const msgs = [
    'Awakening Para Brahman…',
    'Weaving the starfield…',
    'Summoning the Trimurti…',
    'Arranging the 14 Lokas…',
    'Coiling Ananta Shesha…',
    'Spinning the Kalachakra…',
    'Universe ready.'
  ];
  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + (3 + Math.random() * 7), 100);
    bar.style.width = pct + '%';
    const idx = Math.floor((pct/100) * msgs.length);
    text.textContent = msgs[Math.min(idx, msgs.length-1)];
    if (pct >= 100) { clearInterval(iv); setTimeout(done, 400); }
  }, 120);
}

// ═══════════════════════════════════════════════════════════════
// ANIMATION LOOP
// ═══════════════════════════════════════════════════════════════
function animate() {
  requestAnimationFrame(animate);
  uTime += 0.007;
  const now = performance.now();
  updateTransition(now);
  controls.update();
  animatables.forEach(fn => fn(uTime));
  composer.render();
}
