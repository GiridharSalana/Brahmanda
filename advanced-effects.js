// Advanced Visual Effects and Post-Processing for Sanatan Cosmos

// Import note: This requires EffectComposer from Three.js examples
// Add to HTML: <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/EffectComposer.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/RenderPass.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/postprocessing/UnrealBloomPass.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/LuminosityHighPassShader.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/shaders/CopyShader.js"></script>

class AdvancedEffects {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.composer = null;
        this.bloomPass = null;
        
        this.initPostProcessing();
    }
    
    initPostProcessing() {
        // Check if EffectComposer is available
        if (typeof THREE.EffectComposer === 'undefined') {
            console.warn('EffectComposer not loaded, using basic rendering');
            return;
        }
        
        // Create composer
        this.composer = new THREE.EffectComposer(this.renderer);
        
        // Add render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        // Add bloom pass for glow effect
        this.bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            2.5,  // strength
            0.4,  // radius
            0.1   // threshold
        );
        this.composer.addPass(this.bloomPass);
        
        // Make sure the last pass renders to screen
        this.bloomPass.renderToScreen = true;
    }
    
    render() {
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight - 70);
        }
    }
}

// Sacred Geometry Generator
class SacredGeometry {
    
    // Create Sri Yantra
    static createSriYantra(scene, position, scale = 1) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        // Central bindu (point)
        const binduGeo = new THREE.SphereGeometry(0.3 * scale, 16, 16);
        const binduMat = new THREE.MeshBasicMaterial({ 
            color: 0xFFD700,
            transparent: true,
            opacity: 1
        });
        const bindu = new THREE.Mesh(binduGeo, binduMat);
        group.add(bindu);
        
        // Create triangles (simplified Sri Yantra)
        const triangleCount = 9;
        const colors = [0xFFD700, 0xFF6B35, 0x8B5CF6];
        
        for (let i = 0; i < triangleCount; i++) {
            const size = (3 + i * 0.5) * scale;
            const shape = new THREE.Shape();
            
            if (i % 2 === 0) {
                // Upward triangle
                shape.moveTo(0, size);
                shape.lineTo(-size, -size);
                shape.lineTo(size, -size);
            } else {
                // Downward triangle
                shape.moveTo(0, -size);
                shape.lineTo(-size, size);
                shape.lineTo(size, size);
            }
            shape.lineTo(0, i % 2 === 0 ? size : -size);
            
            const geometry = new THREE.ShapeGeometry(shape);
            const material = new THREE.LineBasicMaterial({ 
                color: colors[i % 3],
                transparent: true,
                opacity: 0.8,
                linewidth: 2
            });
            
            const edges = new THREE.EdgesGeometry(geometry);
            const line = new THREE.LineSegments(edges, material);
            line.rotation.x = -Math.PI / 2;
            line.position.z = -i * 0.1;
            
            group.add(line);
        }
        
        // Outer circles
        for (let i = 1; i <= 3; i++) {
            const circleGeo = new THREE.RingGeometry(
                (8 + i * 2) * scale, 
                (8 + i * 2 + 0.2) * scale, 
                64
            );
            const circleMat = new THREE.MeshBasicMaterial({ 
                color: colors[i % 3],
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
            const circle = new THREE.Mesh(circleGeo, circleMat);
            circle.rotation.x = -Math.PI / 2;
            group.add(circle);
        }
        
        // Add pulsing animation
        group.userData.animate = (time) => {
            group.rotation.z += 0.001;
            group.children.forEach((child, index) => {
                if (index > 0) {
                    const scale = 1 + Math.sin(time * 2 + index) * 0.02;
                    child.scale.set(scale, scale, scale);
                    child.material.opacity = 0.6 + Math.sin(time * 2 + index) * 0.2;
                }
            });
            
            // Bindu pulse
            const binduScale = 1 + Math.sin(time * 4) * 0.3;
            bindu.scale.set(binduScale, binduScale, binduScale);
        };
        
        scene.add(group);
        return group;
    }
    
    // Create Flower of Life
    static createFlowerOfLife(scene, position, scale = 1) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        const radius = 2 * scale;
        const circleCount = 19; // Traditional Flower of Life has 19 circles
        
        // Calculate circle positions
        const positions = [
            {x: 0, y: 0}, // Center
            // First ring
            ...Array.from({length: 6}, (_, i) => ({
                x: Math.cos(i * Math.PI / 3) * radius * 2,
                y: Math.sin(i * Math.PI / 3) * radius * 2
            })),
            // Second ring
            ...Array.from({length: 12}, (_, i) => ({
                x: Math.cos(i * Math.PI / 6) * radius * 4,
                y: Math.sin(i * Math.PI / 6) * radius * 4
            }))
        ];
        
        positions.forEach((pos, index) => {
            const circleGeo = new THREE.RingGeometry(
                radius - 0.1, 
                radius + 0.1, 
                64
            );
            const hue = (index / circleCount) * 360;
            const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.6);
            
            const circleMat = new THREE.MeshBasicMaterial({ 
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.7
            });
            const circle = new THREE.Mesh(circleGeo, circleMat);
            circle.position.set(pos.x, pos.y, 0);
            circle.rotation.x = -Math.PI / 2;
            group.add(circle);
        });
        
        // Animation
        group.userData.animate = (time) => {
            group.rotation.z += 0.002;
            group.children.forEach((child, index) => {
                child.material.opacity = 0.5 + Math.sin(time * 3 + index) * 0.3;
            });
        };
        
        scene.add(group);
        return group;
    }
    
    // Create Merkaba (3D Star Tetrahedron)
    static createMerkaba(scene, position, scale = 1) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        // Create two tetrahedrons
        const tetrahedronGeo = new THREE.TetrahedronGeometry(3 * scale);
        
        // Upward tetrahedron
        const mat1 = new THREE.MeshBasicMaterial({ 
            color: 0xFFD700,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const tetra1 = new THREE.Mesh(tetrahedronGeo, mat1);
        group.add(tetra1);
        
        // Downward tetrahedron
        const mat2 = new THREE.MeshBasicMaterial({ 
            color: 0x8B5CF6,
            transparent: true,
            opacity: 0.3,
            wireframe: true
        });
        const tetra2 = new THREE.Mesh(tetrahedronGeo, mat2);
        tetra2.rotation.y = Math.PI;
        group.add(tetra2);
        
        // Add edges for clarity
        const edges1 = new THREE.EdgesGeometry(tetrahedronGeo);
        const line1 = new THREE.LineSegments(
            edges1, 
            new THREE.LineBasicMaterial({ color: 0xFFD700, linewidth: 2 })
        );
        group.add(line1);
        
        const line2 = new THREE.LineSegments(
            edges1, 
            new THREE.LineBasicMaterial({ color: 0x8B5CF6, linewidth: 2 })
        );
        line2.rotation.y = Math.PI;
        group.add(line2);
        
        // Animation
        group.userData.animate = (time) => {
            tetra1.rotation.y += 0.01;
            tetra2.rotation.y -= 0.01;
            line1.rotation.y += 0.01;
            line2.rotation.y -= 0.01;
            
            const scale = 1 + Math.sin(time * 2) * 0.1;
            group.scale.set(scale, scale, scale);
        };
        
        scene.add(group);
        return group;
    }
}

// Energy Vortex Generator
class EnergyVortex {
    static create(scene, position, color = 0xFFD700) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        
        const colorObj = new THREE.Color(color);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 15;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 30;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = height;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            colors[i3] = colorObj.r;
            colors[i3 + 1] = colorObj.g;
            colors[i3 + 2] = colorObj.b;
            
            sizes[i] = Math.random() * 0.5 + 0.2;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const material = new THREE.PointsMaterial({
            size: 0.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, material);
        group.add(particleSystem);
        
        // Animation
        group.userData.animate = (time) => {
            const positions = particleSystem.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const x = positions[i3];
                const z = positions[i3 + 2];
                const y = positions[i3 + 1];
                
                // Spiral motion
                const angle = Math.atan2(z, x) + 0.02;
                const currentRadius = Math.sqrt(x * x + z * z);
                
                positions[i3] = Math.cos(angle) * currentRadius;
                positions[i3 + 2] = Math.sin(angle) * currentRadius;
                positions[i3 + 1] = y + 0.1;
                
                // Reset particles that go too high
                if (positions[i3 + 1] > 15) {
                    positions[i3 + 1] = -15;
                }
            }
            
            particleSystem.geometry.attributes.position.needsUpdate = true;
            group.rotation.y += 0.001;
        };
        
        scene.add(group);
        return group;
    }
}

// Cosmic Nebula Background
class CosmicNebula {
    static create(scene) {
        const group = new THREE.Group();
        
        // Create multiple layers of nebula
        for (let layer = 0; layer < 3; layer++) {
            const geometry = new THREE.BufferGeometry();
            const particleCount = 5000;
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);
            const sizes = new Float32Array(particleCount);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const radius = 100 + layer * 50;
                
                positions[i3] = (Math.random() - 0.5) * radius * 2;
                positions[i3 + 1] = (Math.random() - 0.5) * radius * 2;
                positions[i3 + 2] = (Math.random() - 0.5) * radius * 2;
                
                // Color variation based on layer
                const hue = (0.6 + layer * 0.1 + Math.random() * 0.1) % 1;
                const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
                
                sizes[i] = Math.random() * 2 + 0.5;
            }
            
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            
            const material = new THREE.PointsMaterial({
                size: 1,
                vertexColors: true,
                transparent: true,
                opacity: 0.3 - layer * 0.05,
                blending: THREE.AdditiveBlending
            });
            
            const particles = new THREE.Points(geometry, material);
            particles.userData.layerSpeed = 0.0001 * (layer + 1);
            group.add(particles);
        }
        
        // Animation
        group.userData.animate = (time) => {
            group.children.forEach((particleSystem, index) => {
                particleSystem.rotation.y += particleSystem.userData.layerSpeed;
                particleSystem.rotation.x += particleSystem.userData.layerSpeed * 0.5;
            });
        };
        
        scene.add(group);
        return group;
    }
}

// Portal Effect
class DimensionalPortal {
    static create(scene, position, targetSphere) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        // Create portal ring
        const ringCount = 10;
        for (let i = 0; i < ringCount; i++) {
            const radius = 2 + i * 0.3;
            const ringGeo = new THREE.TorusGeometry(radius, 0.1, 16, 100);
            const hue = (i / ringCount + 0.5) % 1;
            const color = new THREE.Color().setHSL(hue, 1, 0.5);
            
            const ringMat = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.7 - i * 0.05,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.userData.offset = i;
            group.add(ring);
        }
        
        // Portal particles
        const particleCount = 500;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            const radius = Math.random() * 5;
            const angle = Math.random() * Math.PI * 2;
            
            positions[i3] = Math.cos(angle) * radius;
            positions[i3 + 1] = (Math.random() - 0.5) * 10;
            positions[i3 + 2] = Math.sin(angle) * radius;
            
            const color = new THREE.Color().setHSL(Math.random(), 1, 0.5);
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMat = new THREE.PointsMaterial({
            size: 0.3,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        
        const particleSystem = new THREE.Points(particles, particleMat);
        group.add(particleSystem);
        
        // Animation
        group.userData.animate = (time) => {
            // Rotate rings
            group.children.forEach((child, index) => {
                if (child.geometry && child.geometry.type === 'TorusGeometry') {
                    child.rotation.x = time * (0.5 + index * 0.1);
                    child.rotation.y = time * (0.3 + index * 0.05);
                    const scale = 1 + Math.sin(time * 3 + index) * 0.1;
                    child.scale.set(scale, scale, scale);
                }
            });
            
            // Animate particles
            const positions = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const x = positions[i3];
                const z = positions[i3 + 2];
                
                const angle = Math.atan2(z, x) - 0.03;
                let radius = Math.sqrt(x * x + z * z);
                radius *= 0.98;
                
                positions[i3] = Math.cos(angle) * radius;
                positions[i3 + 2] = Math.sin(angle) * radius;
                
                if (radius < 0.5) {
                    radius = 5;
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 2] = Math.sin(angle) * radius;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        };
        
        scene.add(group);
        return group;
    }
}

