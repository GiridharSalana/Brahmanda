/**
 * BRAHMANDA — The Cosmic Egg
 * A 3D journey through Sanatan Hindu Philosophy
 * Built with Three.js r160, custom GLSL shaders, bloom post-processing
 */

import * as THREE from 'three';
import { OrbitControls }    from 'three/addons/controls/OrbitControls.js';
import { EffectComposer }   from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/addons/postprocessing/UnrealBloomPass.js';
// OutputPass intentionally omitted — ACESFilmic on renderer handles final output

// ═══════════════════════════════════════════════════════════════
// GLSL SHADERS
// ═══════════════════════════════════════════════════════════════

// ── Galaxy / Nebula Background ──────────────────────────────────
const GALAXY_VERT = /* glsl */`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const GALAXY_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vWorldPos;

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
  float fbm(vec3 p) {
    float v=0.0,a=0.5;
    for(int i=0;i<6;i++){v+=a*vn(p);p*=2.2;a*=0.5;}
    return v;
  }
  void main() {
    vec3 d = normalize(vWorldPos);
    float n1 = fbm(d*2.5 + vec3(uTime*0.006));
    float n2 = fbm(d*5.0 - vec3(uTime*0.004));
    float n3 = vn(d*18.0);

    float phi  = atan(d.z, d.x);
    float arm  = 0.5 + 0.5*sin(phi*2.0 + n1*5.0 + uTime*0.008);
    float arm2 = 0.5 + 0.5*sin(phi*3.0 - n1*3.0 - uTime*0.005);

    vec3 void_  = vec3(0.008, 0.000, 0.045);
    vec3 neb1   = vec3(0.090, 0.020, 0.220);
    vec3 neb2   = vec3(0.260, 0.060, 0.480);
    vec3 golden = vec3(0.380, 0.220, 0.010);
    vec3 starC  = vec3(0.900, 0.850, 0.750);

    float nv = (n1+1.0)*0.5;
    float nv2= (n2+1.0)*0.5;

    vec3 col = void_;
    col = mix(col, neb1, smoothstep(0.35,0.65,nv));
    col = mix(col, neb2, arm*nv2*0.55);
    col += golden * arm2 * 0.28;
    col += golden * 0.08;

    // star sparkles
    float st = max(0.0, n3*16.0 - 14.8);
    col += starC * st * 0.7;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ── Para Brahman (animated divine orb) ─────────────────────────
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
    float n1 = vn(vPos*0.7 + vec3(uTime*0.11));
    float n2 = vn(vPos*1.8 - vec3(uTime*0.08));
    float n3 = vn(vPos*4.2 + vec3(uTime*0.17));
    float n4 = vn(vPos*9.0 - vec3(uTime*0.06));

    float c = (n1*0.50 + n2*0.28 + n3*0.14 + n4*0.08 + 1.0)*0.5;

    // HDR colors — intentionally > 1 to trigger bloom on Para Brahman only
    vec3 deep  = vec3(1.2, 0.25, 0.00);
    vec3 saff  = vec3(1.8, 0.75, 0.08);
    vec3 gold  = vec3(2.2, 1.60, 0.30);
    vec3 white = vec3(2.8, 2.50, 1.80);

    vec3 col = mix(deep, saff, c);
    col = mix(col, gold,  pow(c,1.6));
    col = mix(col, white, pow(c,3.2));

    // Rim glow
    float rim = 1.0 - abs(dot(normalize(vNorm), vec3(0,0,1)));
    col += white * pow(rim,2.0) * 0.4;

    // Solar flares
    float flare = max(0.0, vn(vPos*3.0 + vec3(uTime*0.28)) - 0.25)*2.5;
    col += white * flare * 0.8;

    // Pulse
    col *= 0.87 + 0.13*sin(uTime*1.7);

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
// CAMERA VIEWS
// ═══════════════════════════════════════════════════════════════
const VIEWS = {
  cosmos:   { pos: new THREE.Vector3(0, 80, 450),  look: new THREE.Vector3(0, 70, 0) },
  trimurti: { pos: new THREE.Vector3(0, 130, 170), look: new THREE.Vector3(0, 120, 0) },
  lokas:    { pos: new THREE.Vector3(300, 55, 0),  look: new THREE.Vector3(0, 55, 0) },
  chakras:  { pos: new THREE.Vector3(100, 55, 0),  look: new THREE.Vector3(0, 55, 0) },
  yugas:    { pos: new THREE.Vector3(0, 340, 240), look: new THREE.Vector3(0, 285, 0) }
};

const TOUR_STOPS = [
  { view:'cosmos',   wait:6000 },
  { view:'trimurti', wait:6000 },
  { view:'lokas',    wait:7000 },
  { view:'chakras',  wait:6000 },
  { view:'yugas',    wait:6000 }
];

// ═══════════════════════════════════════════════════════════════
// GLOBALS
// ═══════════════════════════════════════════════════════════════
let scene, camera, renderer, composer, controls;
let uTime = 0;
let clickables = [];     // { mesh, data }
let animatables = [];    // fn(t)
let particles;

// Transition state
let transActive = false;
let transStart  = 0;
let transDur    = 2200;
let transFrom   = new THREE.Vector3();
let transTo     = new THREE.Vector3();
let transLookFrom = new THREE.Vector3();
let transLookTo   = new THREE.Vector3();

// Tour
let tourActive = false;
let tourIdx = 0;
let tourTimer = null;

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
  renderer.toneMappingExposure = 0.9;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}

function setupScene() {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x030007, 0.0004);

  // Warm white ambient so all objects are visible
  scene.add(new THREE.AmbientLight(0xffeedd, 1.8));

  const sun = new THREE.DirectionalLight(0xFFD700, 2.0);
  sun.position.set(50, 300, 100);
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x8844FF, 0.8);
  fill.position.set(-100, 50, -100);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xFF6600, 0.5);
  rim.position.set(0, -100, 200);
  scene.add(rim);
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 1, 3000);
  camera.position.copy(VIEWS.cosmos.pos);
  camera.lookAt(VIEWS.cosmos.look);
}

function setupComposer() {
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new THREE.Vector2(innerWidth, innerHeight),
    0.75,  // strength  — reduced so regular objects don't get washed out
    0.5,   // radius
    0.60   // threshold — only truly bright HDR objects (Para Brahman) bloom
  );
  composer.addPass(bloom);
  // OutputPass skipped intentionally — ACESFilmic on renderer handles tone mapping
}

function setupControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping   = true;
  controls.dampingFactor   = 0.06;
  controls.target.copy(VIEWS.cosmos.look);
  controls.minDistance     = 40;
  controls.maxDistance     = 900;
  controls.enablePan       = false;
  controls.autoRotate      = true;
  controls.autoRotateSpeed = 0.2;
  controls.minPolarAngle   = 0.2;   // prevent going fully overhead
  controls.maxPolarAngle   = Math.PI * 0.85;
}

// ═══════════════════════════════════════════════════════════════
// BUILD THE UNIVERSE
// ═══════════════════════════════════════════════════════════════
function buildUniverse() {
  createGalaxy();
  createParaBrahman();
  createEnergyBeam();
  createKalachakra();
  createTrimurti();
  createLokas();
  createSriYantraFloor();
  createChakraColumn();
  createSheshaNaga();
  createSoulParticles();
  createNavagrahas();
}

// ── Galaxy Nebula Background ─────────────────────────────────
function createGalaxy() {
  const geo = new THREE.SphereGeometry(1400, 48, 48);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader:   GALAXY_VERT,
    fragmentShader: GALAXY_FRAG,
    side: THREE.BackSide,
    depthWrite: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  animatables.push(t => { mat.uniforms.uTime.value = t; });
}

// ── Para Brahman ──────────────────────────────────────────────
function createParaBrahman() {
  const Y = 255;

  // Core orb with custom shader
  const geo = new THREE.SphereGeometry(9, 64, 64);
  const mat = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 } },
    vertexShader:   BRAHMAN_VERT,
    fragmentShader: BRAHMAN_FRAG
  });
  const core = new THREE.Mesh(geo, mat);
  core.position.set(0, Y, 0);
  scene.add(core);
  animatables.push(t => {
    mat.uniforms.uTime.value = t;
    core.rotation.y = t * 0.04;
  });

  // Make it clickable
  const cData = DATA.paraBrahman;
  clickables.push({ mesh: core, data: cData, label: 'Para Brahman' });

  // Multi-layer glow halos
  [14, 22, 33, 48, 70].forEach((r, i) => {
    const g = new THREE.SphereGeometry(r, 32, 32);
    const m = new THREE.MeshBasicMaterial({
      color: new THREE.Color(1.0, 0.85 - i * 0.1, 0.1),
      transparent: true,
      opacity: 0.1 / (i + 1),
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.BackSide
    });
    const halo = new THREE.Mesh(g, m);
    halo.position.set(0, Y, 0);
    scene.add(halo);
    animatables.push(t => {
      const s = 1 + 0.05 * Math.sin(t * 1.2 + i * 0.8);
      halo.scale.setScalar(s);
    });
  });

  // Om label above
  const omSprite = makeLabel('ॐ', 'Para Brahman', '#FFFFFF', 340, 90);
  omSprite.position.set(0, Y + 18, 0);
  omSprite.scale.set(28, 10, 1);
  scene.add(omSprite);
}

// ── Central Energy Beam ───────────────────────────────────────
function createEnergyBeam() {
  const height = 220;
  const geo = new THREE.CylinderGeometry(0.8, 2.5, height, 8, 1, true);
  const mat = new THREE.MeshBasicMaterial({
    color: 0xFFCC00,
    transparent: true,
    opacity: 0.06,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const beam = new THREE.Mesh(geo, mat);
  beam.position.set(0, 255 - height / 2, 0);
  scene.add(beam);

  // Inner tighter beam
  const geo2 = new THREE.CylinderGeometry(0.2, 0.8, height, 6, 1, true);
  const mat2 = new THREE.MeshBasicMaterial({
    color: 0xFFFFAA,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const beam2 = new THREE.Mesh(geo2, mat2);
  beam2.position.set(0, 255 - height / 2, 0);
  scene.add(beam2);

  animatables.push(t => {
    const p = 0.9 + 0.1 * Math.sin(t * 1.1);
    mat.opacity  = 0.06 * p;
    mat2.opacity = 0.12 * p;
  });
}

// ── Kalachakra — Wheel of Time ────────────────────────────────
function createKalachakra() {
  const Y = 285;
  const R = 90;

  // Outer ring
  const ringGeo = new THREE.TorusGeometry(R, 2, 8, 80);
  const ringMat = new THREE.MeshStandardMaterial({
    color: 0xFFD700, emissive: 0xFF8800, emissiveIntensity: 0.7,
    roughness: 0.2, metalness: 0.9
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.y = Y;
  scene.add(ring);

  // 4 yuga segments
  const yugaColors = [
    { c: 0xFFFFCC, e: 0xFFDD00, name: 'satyaYugaSeg' },   // Satya — gold-white
    { c: 0xDDDDCC, e: 0xAAAAAA, name: 'tretaYugaSeg' },   // Treta — silver
    { c: 0xCC9966, e: 0xFF6600, name: 'dwaparaYugaSeg' }, // Dwapara — bronze/copper
    { c: 0x444455, e: 0x2222AA, name: 'kaliYugaSeg' }     // Kali — iron/dark
  ];
  const yugaKeys = ['satya', 'treta', 'dwapara', 'kali'];

  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const arc = new THREE.TorusGeometry(R * 0.6, 10, 6, 20, Math.PI * 0.4);
    const m = new THREE.MeshStandardMaterial({
      color: yugaColors[i].c,
      emissive: yugaColors[i].e,
      emissiveIntensity: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0.85
    });
    const seg = new THREE.Mesh(arc, m);
    seg.rotation.x = Math.PI / 2;
    seg.rotation.z = angle + Math.PI * 0.1;
    seg.position.y = Y;
    scene.add(seg);
    clickables.push({ mesh: seg, data: DATA.yugas[yugaKeys[i]], label: yugaKeys[i].charAt(0).toUpperCase() + yugaKeys[i].slice(1) + ' Yuga' });
  }

  // Spokes
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const spokeGeo = new THREE.CylinderGeometry(0.4, 0.4, R - 10, 6);
    const spokeMat = new THREE.MeshStandardMaterial({
      color: 0xFFD700, emissive: 0xFF8800, emissiveIntensity: 0.4, roughness: 0.3
    });
    const spoke = new THREE.Mesh(spokeGeo, spokeMat);
    spoke.position.set(
      Math.cos(a) * (R - 10) / 2,
      Y,
      Math.sin(a) * (R - 10) / 2
    );
    spoke.rotation.z = Math.PI / 2;
    spoke.rotation.y = -a;
    scene.add(spoke);
  }

  // Hub
  const hubGeo = new THREE.SphereGeometry(8, 16, 16);
  const hubMat = new THREE.MeshStandardMaterial({
    color: 0xFFD700, emissive: 0xFFAA00, emissiveIntensity: 1,
    roughness: 0.1, metalness: 1
  });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  hub.position.set(0, Y, 0);
  scene.add(hub);
  clickables.push({ mesh: hub, data: DATA.kalachakra, label: 'Kalachakra' });

  // Label
  const lbl = makeLabel('KALACHAKRA', 'कालचक्र', '#FFD700', 440, 80);
  lbl.position.set(0, Y + R + 16, 0);
  lbl.scale.set(32, 7, 1);
  scene.add(lbl);

  animatables.push(t => {
    ring.rotation.z = t * 0.08;
  });
}

// ── Trimurti ──────────────────────────────────────────────────
function createTrimurti() {
  const Y = 120;
  makeBrahma(new THREE.Vector3(-72, Y, 0));
  makeVishnu(new THREE.Vector3(0,   Y, 72));
  makeShiva (new THREE.Vector3(72,  Y, 0));
}

function makeBrahma(pos) {
  const g = new THREE.Group();
  g.position.copy(pos);

  const gold   = { color: 0xFFD700, emissive: 0xFF8800, emissiveIntensity: 0.6, roughness: 0.2, metalness: 0.9 };
  const skinG  = { color: 0xFFE5A0, emissive: 0xFFCC44, emissiveIntensity: 0.5, roughness: 0.4 };
  const mkMat  = o => new THREE.MeshStandardMaterial(o);

  // Lotus pedestal
  [0, 3].forEach(dy => {
    const lotus = new THREE.Mesh(new THREE.TorusGeometry(8, 1.2, 8, 24), mkMat(gold));
    lotus.rotation.x = Math.PI / 2;
    lotus.position.y = -12 + dy;
    g.add(lotus);
  });

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(3.5, 16, 16), mkMat({ ...gold, emissiveIntensity: 0.7 }));
  body.scale.set(1, 1.6, 1);
  body.position.y = -5;
  g.add(body);

  // Heads (4)
  const hm = mkMat(skinG);
  const mainH = new THREE.Mesh(new THREE.SphereGeometry(2.5, 20, 20), hm);
  mainH.position.y = 2;
  g.add(mainH);
  [0, Math.PI * 2/3, Math.PI * 4/3].forEach(a => {
    const sh = new THREE.Mesh(new THREE.SphereGeometry(1.8, 12, 12), mkMat({ ...skinG, emissiveIntensity: 0.35 }));
    sh.position.set(Math.sin(a) * 2.8, 2.8, Math.cos(a) * 2.8);
    g.add(sh);
  });

  // Crown
  const crown = new THREE.Mesh(new THREE.ConeGeometry(2, 4, 8), mkMat({ ...gold, emissiveIntensity: 1 }));
  crown.position.y = 6.5;
  g.add(crown);

  // 4 orbiting Vedas
  for (let i = 0; i < 4; i++) {
    const veda = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 1.8, 0.2),
      mkMat({ color: 0xFF6600, emissive: 0xFF2200, emissiveIntensity: 0.8, roughness: 0.5 })
    );
    veda.userData.idx = i;
    g.add(veda);
  }

  const lbl = makeLabel('BRAHMA', 'ब्रह्मा', '#FFD700', 380, 70);
  lbl.position.set(0, 14, 0);
  lbl.scale.set(22, 5, 1);
  g.add(lbl);

  scene.add(g);
  clickables.push({ mesh: g, data: DATA.brahma, label: 'Brahma' });

  animatables.push(t => {
    g.rotation.y = Math.sin(t * 0.18) * 0.35;
    g.children.forEach(c => {
      if (c.userData.idx !== undefined) {
        const a = (c.userData.idx / 4) * Math.PI * 2 + t * 0.55;
        c.position.set(Math.cos(a) * 9, 2 + Math.sin(t * 0.8 + c.userData.idx) * 0.8, Math.sin(a) * 9);
        c.rotation.y = a + Math.PI / 2;
      }
    });
  });
}

function makeVishnu(pos) {
  const g = new THREE.Group();
  g.position.copy(pos);

  const blue  = { color: 0x0D47A1, emissive: 0x1565C0, emissiveIntensity: 0.7, roughness: 0.2, metalness: 0.8 };
  const mkMat = o => new THREE.MeshStandardMaterial(o);

  // Pedestal
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(5, 6, 3, 12), mkMat({ color: 0x880088, emissive: 0x440055, emissiveIntensity: 0.5, roughness: 0.5, metalness: 0.6 }));
  ped.position.y = -13.5;
  g.add(ped);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(4, 16, 16), mkMat(blue));
  body.scale.set(1, 2, 1);
  body.position.y = -5;
  g.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 20), mkMat({ ...blue, color: 0x1565C0, emissiveIntensity: 0.6 }));
  head.position.y = 4;
  g.add(head);

  // Crown / Kirita Mukuta (tall cone)
  const crown = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.5, 6, 8), mkMat({ color: 0xFFD700, emissive: 0xFFAA00, emissiveIntensity: 1, roughness: 0.1, metalness: 0.95 }));
  crown.position.y = 10;
  g.add(crown);

  // Sudarshana Chakra (spinning disc with spokes)
  const chakraGroup = new THREE.Group();
  chakraGroup.position.set(10, 3, 0);
  const chakraRing = new THREE.Mesh(new THREE.TorusGeometry(4, 0.8, 8, 32), mkMat({ color: 0xFFD700, emissive: 0xFF6600, emissiveIntensity: 1.2, roughness: 0.1, metalness: 1 }));
  chakraGroup.add(chakraRing);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 7.5, 4), mkMat({ color: 0xFFD700, emissive: 0xFFAA00, emissiveIntensity: 0.8 }));
    sp.rotation.z = Math.PI / 2;
    sp.rotation.y = a;
    chakraGroup.add(sp);
  }
  g.add(chakraGroup);

  const lbl = makeLabel('VISHNU', 'विष्णु', '#4FC3F7', 360, 70);
  lbl.position.set(0, 16, 0);
  lbl.scale.set(22, 5, 1);
  g.add(lbl);

  scene.add(g);
  clickables.push({ mesh: g, data: DATA.vishnu, label: 'Vishnu' });

  animatables.push(t => {
    chakraGroup.rotation.z = t * 1.4;
    g.rotation.y = Math.sin(t * 0.15 + 1) * 0.3;
  });
}

function makeShiva(pos) {
  const g = new THREE.Group();
  g.position.copy(pos);

  const silver = { color: 0xDDDDFF, emissive: 0x8888FF, emissiveIntensity: 0.6, roughness: 0.15, metalness: 0.85 };
  const mkMat  = o => new THREE.MeshStandardMaterial(o);

  // Pedestal — Lingam-like cylinder
  const ped = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.5, 5, 12), mkMat({ color: 0x222233, emissive: 0x4444AA, emissiveIntensity: 0.5, roughness: 0.4, metalness: 0.7 }));
  ped.position.y = -14;
  g.add(ped);

  // Body
  const body = new THREE.Mesh(new THREE.SphereGeometry(3.8, 16, 16), mkMat(silver));
  body.scale.set(1, 1.8, 1);
  body.position.y = -5;
  g.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(2.8, 20, 20), mkMat(silver));
  head.position.y = 3.5;
  g.add(head);

  // Third eye
  const eye = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), mkMat({ color: 0xFF2200, emissive: 0xFF5500, emissiveIntensity: 3, roughness: 0.1 }));
  eye.position.set(0, 4.2, 2.7);
  g.add(eye);

  // Crescent moon above
  const moon = new THREE.Mesh(new THREE.TorusGeometry(2, 0.5, 8, 20, Math.PI), mkMat({ color: 0xEEEEFF, emissive: 0xCCCCFF, emissiveIntensity: 0.8, roughness: 0.3 }));
  moon.position.y = 8;
  moon.rotation.z = Math.PI;
  g.add(moon);

  // Trishul (trident)
  const shaftGeo = new THREE.CylinderGeometry(0.3, 0.3, 14, 6);
  const shaft = new THREE.Mesh(shaftGeo, mkMat({ color: 0xFFD700, emissive: 0xFF8800, emissiveIntensity: 0.8, metalness: 0.9, roughness: 0.1 }));
  shaft.position.set(-10, 2, 0);
  g.add(shaft);
  [-2, 0, 2].forEach((ox, ci) => {
    const prong = new THREE.Mesh(new THREE.ConeGeometry(0.4, 3, 6), mkMat({ color: 0xFFD700, emissive: 0xFF8800, emissiveIntensity: 1, metalness: 0.9, roughness: 0.1 }));
    prong.position.set(-10 + ox, 10.5, 0);
    g.add(prong);
  });

  // Ring of fire (particles)
  const fireCount = 80;
  const fPositions = new Float32Array(fireCount * 3);
  for (let i = 0; i < fireCount; i++) {
    const a = (i / fireCount) * Math.PI * 2;
    fPositions[i*3]   = Math.cos(a) * 14;
    fPositions[i*3+1] = 0;
    fPositions[i*3+2] = Math.sin(a) * 14;
  }
  const fGeo = new THREE.BufferGeometry();
  fGeo.setAttribute('position', new THREE.BufferAttribute(fPositions, 3));
  const fMat = new THREE.PointsMaterial({
    color: 0xFF4400,
    size: 2.0,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  const fire = new THREE.Points(fGeo, fMat);
  fire.position.y = 0;
  g.add(fire);

  const lbl = makeLabel('SHIVA', 'शिव', '#CE93D8', 320, 70);
  lbl.position.set(0, 16, 0);
  lbl.scale.set(20, 5, 1);
  g.add(lbl);

  scene.add(g);
  clickables.push({ mesh: g, data: DATA.shiva, label: 'Shiva' });

  animatables.push(t => {
    g.rotation.y = Math.sin(t * 0.2 + 2) * 0.35;
    fire.rotation.y = t * 0.9;
    const pFlicker = 0.7 + 0.3 * Math.sin(t * 8);
    fMat.opacity = 0.9 * pFlicker;
  });
}

// ── 14 Lokas ──────────────────────────────────────────────────
const LOKA_DATA = [
  { key:'satya',    name:'Satya Loka',    sk:'सत्यलोक',   y:205, color:0xFFFFEE, em:0xFFFFAA, eI:0.9,  r:85 },
  { key:'tapa',     name:'Tapa Loka',     sk:'तपलोक',     y:182, color:0xFF9933, em:0xFF6600, eI:0.7,  r:85 },
  { key:'jana',     name:'Jana Loka',     sk:'जनलोक',     y:159, color:0xBBCCFF, em:0x8899FF, eI:0.7,  r:85 },
  { key:'mahar',    name:'Mahar Loka',    sk:'महर्लोक',   y:136, color:0x88CC88, em:0x44AA44, eI:0.7,  r:85 },
  { key:'svar',     name:'Svar Loka',     sk:'स्वर्गलोक', y:113, color:0xFFD700, em:0xFFAA00, eI:1.0,  r:90 },
  { key:'bhuvar',   name:'Bhuvar Loka',   sk:'भुवर्लोक',  y: 90, color:0x88AAFF, em:0x4466FF, eI:0.6,  r:85 },
  { key:'bhu',      name:'Bhu Loka',      sk:'भूलोक',     y: 67, color:0x33BB66, em:0x22AA44, eI:0.7,  r:90 },
  { key:'atala',    name:'Atala',         sk:'अतल',       y: 40, color:0xBBAA88, em:0x998866, eI:0.5,  r:85 },
  { key:'vitala',   name:'Vitala',        sk:'वितल',      y: 17, color:0xAA7744, em:0x884422, eI:0.5,  r:85 },
  { key:'sutala',   name:'Sutala',        sk:'सुतल',      y: -6, color:0xBB9900, em:0x997700, eI:0.5,  r:85 },
  { key:'talatala', name:'Talatala',      sk:'तलातल',     y:-29, color:0x884422, em:0x662200, eI:0.5,  r:85 },
  { key:'mahatala', name:'Mahatala',      sk:'महातल',     y:-52, color:0x224444, em:0x113333, eI:0.5,  r:85 },
  { key:'rasatala', name:'Rasatala',      sk:'रसातल',     y:-75, color:0xAA1111, em:0x880000, eI:0.6,  r:85 },
  { key:'patala',   name:'Patala',        sk:'पाताल',     y:-98, color:0x440088, em:0x220055, eI:0.7,  r:85 }
];

function createLokas() {
  LOKA_DATA.forEach((ld, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: ld.color,
      emissive: ld.em,
      emissiveIntensity: ld.eI,
      roughness: 0.3,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85
    });

    // Main torus ring
    const geo = new THREE.TorusGeometry(ld.r, 5, 10, 80);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = ld.y;
    scene.add(mesh);

    // Find data
    const info = DATA.lokas[ld.key];
    if (info) clickables.push({ mesh, data: info, label: ld.name });

    // Label sprite
    const lbl = makeLabel(ld.name, ld.sk, '#' + ld.color.toString(16).padStart(6,'0'), 420, 70);
    lbl.position.set(ld.r + 18, ld.y, 0);
    lbl.scale.set(26, 5, 1);
    scene.add(lbl);

    // Animate — subtle pulse
    animatables.push(t => {
      const p = 0.85 + 0.15 * Math.sin(t * 0.8 + i * 0.45);
      mat.emissiveIntensity = ld.eI * p;
      mesh.rotation.z = t * 0.01 * (i % 2 === 0 ? 1 : -1);
    });
  });
}

// ── Sri Yantra Floor at Bhu Loka ──────────────────────────────
function createSriYantraFloor() {
  const Y = 67;
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  drawSriYantra(ctx, size);

  const tex = new THREE.CanvasTexture(canvas);
  const geo = new THREE.CircleGeometry(88, 64);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  });
  const disc = new THREE.Mesh(geo, mat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = Y - 2;
  scene.add(disc);

  animatables.push(t => {
    disc.rotation.z = -t * 0.015;
  });
}

function drawSriYantra(ctx, s) {
  const cx = s / 2, cy = s / 2, r = s * 0.43;

  ctx.clearRect(0, 0, s, s);

  // Outer square bhupura
  ctx.strokeStyle = 'rgba(255,215,0,0.5)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i++) {
    const d = 8 + i * 10;
    ctx.strokeRect(d, d, s - d * 2, s - d * 2);
  }

  // Lotus petals (16)
  ctx.strokeStyle = 'rgba(255,180,0,0.4)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85);
    ctx.rotate(a);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.1, r * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 8-petal lotus
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r * 0.6, cy + Math.sin(a) * r * 0.6);
    ctx.rotate(a);
    ctx.strokeStyle = 'rgba(255,150,0,0.45)';
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 0.08, r * 0.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // 3 circles
  [r * 0.95, r, r * 1.05].forEach(cr => {
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,215,0,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // 9 interlocking triangles — simplified as 5 upward + 4 downward
  const tris = [
    // Upward (Shiva) triangles — 4 of them at different scales
    [0, -r*0.95, -r*0.82, r*0.48, r*0.82, r*0.48],    // 1 large
    [0, -r*0.55, -r*0.48, r*0.27, r*0.48, r*0.27],    // 2 small
    [0, -r*0.72, -r*0.62, r*0.36, r*0.62, r*0.36],    // 3 mid
    // Downward (Shakti) triangles — 5 of them
    [0, r*0.95, -r*0.82, -r*0.48, r*0.82, -r*0.48],   // 1 large
    [0, r*0.72, -r*0.62, -r*0.36, r*0.62, -r*0.36],   // 2 mid
    [0, r*0.50, -r*0.43, -r*0.25, r*0.43, -r*0.25],   // 3 small
    [-r*0.35, r*0.20, r*0.35, r*0.20, 0, -r*0.40],    // 4 innermost up
    [0, r*0.40, -r*0.35, -r*0.20, r*0.35, -r*0.20],   // 5 innermost down
  ];

  tris.forEach((t, i) => {
    ctx.beginPath();
    ctx.moveTo(cx + t[0], cy + t[1]);
    ctx.lineTo(cx + t[2], cy + t[3]);
    ctx.lineTo(cx + t[4], cy + t[5]);
    ctx.closePath();
    const bright = 255 - i * 15;
    ctx.strokeStyle = `rgba(${bright},${Math.max(100,bright-80)},0,${0.65 - i*0.04})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  // Bindu (center dot)
  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#FFD700';
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 18;
  ctx.fill();
}

// ── Chakra Column ─────────────────────────────────────────────
const CHAKRA_DATA = [
  { key:'muladhara',    color:0xFF1111, em:0xCC0000, y: 25, name:'Muladhara',    sk:'मूलाधार'    },
  { key:'svadhisthana', color:0xFF6600, em:0xDD4400, y: 35, name:'Svadhisthana', sk:'स्वाधिष्ठान'},
  { key:'manipura',     color:0xFFFF00, em:0xCCCC00, y: 45, name:'Manipura',     sk:'मणिपूर'     },
  { key:'anahata',      color:0x00CC44, em:0x008833, y: 55, name:'Anahata',      sk:'अनाहत'      },
  { key:'vishuddha',    color:0x00AAFF, em:0x0077DD, y: 65, name:'Vishuddha',    sk:'विशुद्ध'    },
  { key:'ajna',         color:0x4400FF, em:0x2200CC, y: 75, name:'Ajna',         sk:'आज्ञा'      },
  { key:'sahasrara',    color:0xFF00FF, em:0xCC00CC, y: 85, name:'Sahasrara',    sk:'सहस्रार'    }
];

function createChakraColumn() {
  const X_OFFSET = 0;

  CHAKRA_DATA.forEach((cd, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: cd.color,
      emissive: cd.em,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.92
    });

    // Chakra sphere
    const geo = new THREE.SphereGeometry(2.8, 20, 20);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(X_OFFSET, cd.y, 0);
    scene.add(mesh);

    // Orbital ring
    const oMat = new THREE.MeshBasicMaterial({
      color: cd.color,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const oRing = new THREE.Mesh(new THREE.TorusGeometry(5 + i * 0.3, 0.4, 6, 24), oMat);
    oRing.position.set(X_OFFSET, cd.y, 0);
    oRing.rotation.x = Math.PI / 2;
    scene.add(oRing);

    const info = DATA.chakras[cd.key];
    if (info) clickables.push({ mesh, data: info, label: cd.name });

    const lbl = makeLabel(cd.name, cd.sk, '#' + cd.color.toString(16).padStart(6,'0'), 360, 65);
    lbl.position.set(X_OFFSET + 14, cd.y, 0);
    lbl.scale.set(20, 4.5, 1);
    scene.add(lbl);

    animatables.push(t => {
      const p = 0.8 + 0.2 * Math.sin(t * 1.5 + i * 0.6);
      mat.emissiveIntensity = 0.9 * p;
      oRing.rotation.z = t * (0.5 + i * 0.08) * (i % 2 === 0 ? 1 : -1);

      if (cd.key === 'sahasrara') {
        mesh.rotation.y = t * 0.3;
      }
    });
  });

  // Sushumna channel (central vertical tube)
  const pts = CHAKRA_DATA.map(c => new THREE.Vector3(X_OFFSET, c.y, 0));
  const curve = new THREE.CatmullRomCurve3(pts);
  const tubeGeo = new THREE.TubeGeometry(curve, 40, 0.4, 6, false);
  const tubeMat = new THREE.MeshBasicMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  scene.add(new THREE.Mesh(tubeGeo, tubeMat));
}

// ── Ananta Shesha — Cosmic Serpent ───────────────────────────
function createSheshaNaga() {
  const coils = 10;
  const pts = [];
  const segments = 400;

  for (let i = 0; i <= segments; i++) {
    const t   = i / segments;
    const a   = t * Math.PI * 2 * coils;
    const y   = -100 + t * (225 - (-100));
    const rad = 105 + Math.sin(t * Math.PI * 5) * 15;
    pts.push(new THREE.Vector3(Math.cos(a) * rad, y, Math.sin(a) * rad));
  }

  const curve   = new THREE.CatmullRomCurve3(pts);
  const tubeGeo = new THREE.TubeGeometry(curve, 400, 2.8, 8, false);

  const mat = new THREE.MeshStandardMaterial({
    color: 0x1A5C1A,
    emissive: 0x004400,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.7,
    transparent: true,
    opacity: 0.75
  });

  const snake = new THREE.Mesh(tubeGeo, mat);
  scene.add(snake);
  clickables.push({ mesh: snake, data: DATA.shesha, label: 'Ananta Shesha' });

  // Hooded head
  const headGeo = new THREE.SphereGeometry(5, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x228822, emissive: 0x00AA00, emissiveIntensity: 0.8,
    roughness: 0.2, metalness: 0.8
  });
  const head = new THREE.Mesh(headGeo, headMat);
  const lastPt = pts[pts.length - 1];
  head.position.copy(lastPt);
  scene.add(head);

  // Glow
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x00FF44,
    transparent: true, opacity: 0.08,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.BackSide
  });
  const glow = new THREE.Mesh(headGeo.clone().scale(1.5,1.5,1.5), glowMat);
  head.add(glow);

  animatables.push(t => {
    mat.emissiveIntensity = 0.5 + 0.2 * Math.sin(t * 0.6);
  });
}

// ── Soul Particles (Jivas rising to Brahman) ──────────────────
function createSoulParticles() {
  const count = 1800;
  const pos   = new Float32Array(count * 3);
  const spd   = new Float32Array(count);
  const orb   = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const a  = Math.random() * Math.PI * 2;
    // Keep particles close to the central column, not spread far out
    const r  = 5 + Math.random() * 55;
    pos[i*3]   = Math.cos(a) * r;
    pos[i*3+1] = -100 + Math.random() * 360;
    pos[i*3+2] = Math.sin(a) * r;
    spd[i] = 0.25 + Math.random() * 0.9;
    orb[i] = r;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

  const mat = new THREE.PointsMaterial({
    color: 0xFFEEAA,
    size: 0.7,
    transparent: true,
    opacity: 0.30,          // was 0.65 — much more subtle now
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  particles = new THREE.Points(geo, mat);
  scene.add(particles);

  animatables.push(t => {
    const pa = geo.attributes.position;
    for (let i = 0; i < count; i++) {
      pa.setY(i, pa.getY(i) + spd[i] * 0.035);
      if (pa.getY(i) > 256) pa.setY(i, -105);

      const yN  = Math.max(0, (pa.getY(i) + 100) / 360);
      const ra  = orb[i] * (1 - yN * 0.88);
      const ang = Math.atan2(pa.getZ(i), pa.getX(i)) + 0.003;
      pa.setX(i, Math.cos(ang) * ra);
      pa.setZ(i, Math.sin(ang) * ra);
    }
    pa.needsUpdate = true;
    // Gentle pulsing opacity
    mat.opacity = 0.22 + 0.08 * Math.sin(t * 0.4);
  });
}

// ── Navagrahas (9 Planets) ────────────────────────────────────
const GRAHA_DATA = [
  { name:'Surya',       color:0xFF8800, em:0xFF4400, eI:1.2, orbitR:50,  speed:0.30, size:3.5 },
  { name:'Chandra',     color:0xEEEEFF, em:0xCCCCFF, eI:0.6, orbitR:62,  speed:0.24, size:2.5 },
  { name:'Mangala',     color:0xFF2200, em:0xCC0000, eI:0.7, orbitR:74,  speed:0.45, size:2.2 },
  { name:'Budha',       color:0x33FF66, em:0x00CC44, eI:0.7, orbitR:84,  speed:0.55, size:2.0 },
  { name:'Brihaspati',  color:0xFFDD44, em:0xFFAA00, eI:0.6, orbitR:95,  speed:0.18, size:3.8 },
  { name:'Shukra',      color:0xFFFFCC, em:0xEEEE88, eI:0.5, orbitR:105, speed:0.38, size:2.8 },
  { name:'Shani',       color:0x5566AA, em:0x223388, eI:0.5, orbitR:118, speed:0.12, size:3.2 },
  { name:'Rahu',        color:0x222244, em:0x111133, eI:0.3, orbitR:130, speed:-0.20, size:2.0 },
  { name:'Ketu',        color:0x446644, em:0x224422, eI:0.3, orbitR:138, speed:0.20,  size:2.0 }
];

function createNavagrahas() {
  const Y = 115;
  const mkMat = o => new THREE.MeshStandardMaterial(o);

  GRAHA_DATA.forEach((gd, i) => {
    const mat = mkMat({ color: gd.color, emissive: gd.em, emissiveIntensity: gd.eI, roughness: 0.3, metalness: 0.7 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(gd.size, 14, 14), mat);
    mesh.position.set(gd.orbitR, Y, 0);
    scene.add(mesh);

    // Saturn rings
    if (gd.name === 'Shani') {
      const rMat = mkMat({ color: 0x8899BB, emissive: 0x445588, emissiveIntensity: 0.3, roughness: 0.6, transparent: true, opacity: 0.7 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(gd.size * 1.8, 0.8, 6, 32), rMat);
      ring.rotation.x = Math.PI / 3;
      mesh.add(ring);
    }

    animatables.push(t => {
      const a = t * gd.speed + (i / 9) * Math.PI * 2;
      mesh.position.set(Math.cos(a) * gd.orbitR, Y + Math.sin(t * 0.3 + i) * 2, Math.sin(a) * gd.orbitR);
      mesh.rotation.y = t * 0.5;
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// LABEL FACTORY (Canvas → Sprite)
// ═══════════════════════════════════════════════════════════════
function makeLabel(text, sub, color, w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');

  // Clear
  ctx.clearRect(0, 0, w, h);

  // Main text
  ctx.fillStyle = color || '#FFD700';
  ctx.font = `bold ${Math.round(h * 0.52)}px Cinzel, Georgia, serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = color || '#FFD700';
  ctx.shadowBlur = 14;
  ctx.fillText(text, w / 2, h * 0.38);

  // Sub text
  if (sub) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = `${Math.round(h * 0.32)}px serif`;
    ctx.shadowBlur = 6;
    ctx.fillText(sub, w / 2, h * 0.72);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending
  });
  return new THREE.Sprite(mat);
}

// ═══════════════════════════════════════════════════════════════
// INTERACTION — Raycasting
// ═══════════════════════════════════════════════════════════════
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-9, -9);
const tip       = document.getElementById('tip');

/** Walk up the parent chain to find the matching clickable entry. */
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

  controls.enabled = false;
  transActive   = true;
  transStart    = performance.now();
  transFrom.copy(camera.position);
  transTo.copy(v.pos);
  transLookFrom.copy(controls.target);
  transLookTo.copy(v.look);
}

function updateTransition(now) {
  if (!transActive) return;
  const elapsed = now - transStart;
  const t = Math.min(elapsed / transDur, 1);
  const e = 1 - Math.pow(1 - t, 3); // ease-out cubic

  camera.position.lerpVectors(transFrom, transTo, e);
  controls.target.lerpVectors(transLookFrom, transLookTo, e);
  camera.lookAt(controls.target);

  if (t >= 1) {
    transActive = false;
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
  if (!tourActive || tourIdx >= TOUR_STOPS.length) {
    stopTour();
    return;
  }
  const stop = TOUR_STOPS[tourIdx];
  flyTo(stop.view);
  document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.nb[data-view="${stop.view}"]`);
  if (btn) btn.classList.add('active');

  tourTimer = setTimeout(() => {
    tourIdx++;
    doTourStop();
  }, stop.wait + transDur);
}

function stopTour() {
  tourActive = false;
  if (tourTimer) { clearTimeout(tourTimer); tourTimer = null; }
}

// ═══════════════════════════════════════════════════════════════
// UI SETUP
// ═══════════════════════════════════════════════════════════════
function setupUI() {
  // Nav buttons
  document.querySelectorAll('.nb').forEach(btn => {
    btn.addEventListener('click', () => {
      stopTour();
      document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      flyTo(btn.dataset.view);
    });
  });

  // Tour
  document.getElementById('btn-tour').addEventListener('click', () => {
    if (tourActive) { stopTour(); }
    else            { startTour(); }
  });

  // Reset
  document.getElementById('btn-reset').addEventListener('click', () => {
    stopTour();
    flyTo('cosmos');
    document.querySelectorAll('.nb').forEach(b => b.classList.remove('active'));
    document.querySelector('.nb[data-view="cosmos"]').classList.add('active');
  });

  // Panel close
  document.getElementById('panel-close').addEventListener('click', hidePanel);

  // Hide hint after 6s
  setTimeout(() => {
    document.getElementById('hint').classList.add('gone');
  }, 6000);
}

// ═══════════════════════════════════════════════════════════════
// LOADING SIMULATION
// ═══════════════════════════════════════════════════════════════
function simulateLoading(done) {
  const bar  = document.getElementById('load-bar');
  const text = document.getElementById('load-text');
  const msgs = [
    'Awakening Para Brahman…',
    'Weaving the cosmic nebula…',
    'Summoning the Trimurti…',
    'Arranging the 14 Lokas…',
    'Coiling Ananta Shesha…',
    'Releasing the Jiva souls…',
    'Spinning the Kalachakra…',
    'Universe ready.'
  ];
  let pct = 0, mi = 0;
  const iv = setInterval(() => {
    pct = Math.min(pct + (3 + Math.random() * 6), 100);
    bar.style.width = pct + '%';
    const idx = Math.floor((pct / 100) * msgs.length);
    text.textContent = msgs[Math.min(idx, msgs.length - 1)];
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(done, 400);
    }
  }, 120);
}

// ═══════════════════════════════════════════════════════════════
// ANIMATION LOOP
// ═══════════════════════════════════════════════════════════════
function animate() {
  requestAnimationFrame(animate);

  uTime += 0.008;
  const now = performance.now();

  updateTransition(now);
  controls.update();

  animatables.forEach(fn => fn(uTime));

  composer.render();
}
