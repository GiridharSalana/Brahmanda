// 3D Deity Character Models using Three.js

class DeityModels {
    
    // Create Brahma - The Creator (4 heads, 4 arms, holding Vedas and water pot)
    static createBrahma(scene, position) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        // Body - Reddish robes
        const bodyGeometry = new THREE.CylinderGeometry(1.5, 2, 4, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xD4AF37,
            emissive: 0xD4AF37,
            emissiveIntensity: 0.3,
            shininess: 80
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        group.add(body);
        
        // Main Head (front)
        const headGeometry = new THREE.SphereGeometry(1, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFE5CC,
            emissive: 0xFFD700,
            emissiveIntensity: 0.2
        });
        const mainHead = new THREE.Mesh(headGeometry, headMaterial);
        mainHead.position.y = 5;
        group.add(mainHead);
        
        // Crown
        const crownGeometry = new THREE.ConeGeometry(1.2, 1.5, 8);
        const crownMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.6,
            shininess: 100
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.y = 6.2;
        group.add(crown);
        
        // 3 Additional heads (representing 4 heads total)
        const headPositions = [
            { x: 1, y: 5, z: 0, rotation: Math.PI / 2 },
            { x: -1, y: 5, z: 0, rotation: -Math.PI / 2 },
            { x: 0, y: 5, z: -1, rotation: Math.PI }
        ];
        
        headPositions.forEach(pos => {
            const head = new THREE.Mesh(headGeometry, headMaterial.clone());
            head.position.set(pos.x, pos.y, pos.z);
            head.rotation.y = pos.rotation;
            head.scale.set(0.8, 0.8, 0.8);
            group.add(head);
        });
        
        // 4 Arms
        const armGeometry = new THREE.CylinderGeometry(0.3, 0.2, 3, 8);
        const armMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFE5CC,
            emissive: 0xFFD700,
            emissiveIntensity: 0.1
        });
        
        // Right arms
        const rightArm1 = new THREE.Mesh(armGeometry, armMaterial);
        rightArm1.position.set(2, 3, 0);
        rightArm1.rotation.z = -Math.PI / 4;
        group.add(rightArm1);
        
        const rightArm2 = new THREE.Mesh(armGeometry, armMaterial);
        rightArm2.position.set(2.2, 2, -0.5);
        rightArm2.rotation.z = -Math.PI / 3;
        group.add(rightArm2);
        
        // Left arms
        const leftArm1 = new THREE.Mesh(armGeometry, armMaterial);
        leftArm1.position.set(-2, 3, 0);
        leftArm1.rotation.z = Math.PI / 4;
        group.add(leftArm1);
        
        const leftArm2 = new THREE.Mesh(armGeometry, armMaterial);
        leftArm2.position.set(-2.2, 2, -0.5);
        leftArm2.rotation.z = Math.PI / 3;
        group.add(leftArm2);
        
        // Sacred items - Vedas (books)
        const vedaGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.4);
        const vedaMaterial = new THREE.MeshPhongMaterial({
            color: 0xFF6B35,
            emissive: 0xFF6B35,
            emissiveIntensity: 0.4
        });
        const veda = new THREE.Mesh(vedaGeometry, vedaMaterial);
        veda.position.set(3, 4.5, 0);
        group.add(veda);
        
        // Water pot (Kamandalu)
        const potGeometry = new THREE.SphereGeometry(0.5, 8, 8);
        const potMaterial = new THREE.MeshPhongMaterial({
            color: 0xC0C0C0,
            metalness: 0.8,
            emissive: 0xC0C0C0,
            emissiveIntensity: 0.2
        });
        const pot = new THREE.Mesh(potGeometry, potMaterial);
        pot.position.set(-3, 4.5, 0);
        group.add(pot);
        
        // Aura
        const auraGeometry = new THREE.SphereGeometry(5, 32, 32);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        group.add(aura);
        
        // Animation
        group.userData.animate = (time) => {
            group.rotation.y = Math.sin(time * 0.5) * 0.1;
            aura.scale.set(
                1 + Math.sin(time * 2) * 0.1,
                1 + Math.sin(time * 2) * 0.1,
                1 + Math.sin(time * 2) * 0.1
            );
            crown.rotation.y += 0.01;
        };
        
        group.userData.type = 'deity';
        group.userData.name = 'Brahma - The Creator';
        
        scene.add(group);
        return group;
    }
    
    // Create Shiva - The Destroyer (Third eye, Trishul, Damaru, Snake)
    static createShiva(scene, position) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        // Body - Blue/Ash colored
        const bodyGeometry = new THREE.CylinderGeometry(1.5, 2, 5, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0x4169E1,
            emissive: 0x4169E1,
            emissiveIntensity: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2.5;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(1.2, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0xE8E8E8,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.2
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 5.5;
        group.add(head);
        
        // Third Eye
        const thirdEyeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const thirdEyeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            emissive: 0xFF0000,
            emissiveIntensity: 1
        });
        const thirdEye = new THREE.Mesh(thirdEyeGeometry, thirdEyeMaterial);
        thirdEye.position.set(0, 5.8, 1);
        group.add(thirdEye);
        
        // Jata (matted hair) - Crescent moon
        const jataGeometry = new THREE.ConeGeometry(1.5, 2, 8);
        const jataMaterial = new THREE.MeshPhongMaterial({
            color: 0x2F4F4F,
            emissive: 0x000000
        });
        const jata = new THREE.Mesh(jataGeometry, jataMaterial);
        jata.position.y = 7;
        group.add(jata);
        
        // Crescent moon
        const moonGeometry = new THREE.TorusGeometry(0.5, 0.15, 8, 16, Math.PI);
        const moonMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.8
        });
        const moon = new THREE.Mesh(moonGeometry, moonMaterial);
        moon.position.set(0, 7.5, 0);
        moon.rotation.x = Math.PI / 2;
        group.add(moon);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.3, 0.25, 3.5, 8);
        const armMaterial = new THREE.MeshPhongMaterial({
            color: 0xE8E8E8,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.1
        });
        
        // Right arm with Trishul (trident)
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(2.5, 3.5, 0);
        rightArm.rotation.z = -Math.PI / 6;
        group.add(rightArm);
        
        // Trishul
        const trishulHandle = new THREE.CylinderGeometry(0.1, 0.1, 5, 8);
        const trishulMaterial = new THREE.MeshPhongMaterial({
            color: 0xC0C0C0,
            metalness: 0.9,
            emissive: 0xFFFFFF,
            emissiveIntensity: 0.3
        });
        const trishul = new THREE.Mesh(trishulHandle, trishulMaterial);
        trishul.position.set(3.5, 5, 0);
        group.add(trishul);
        
        // Trishul prongs
        const prongGeometry = new THREE.ConeGeometry(0.15, 1, 4);
        [-0.4, 0, 0.4].forEach(offset => {
            const prong = new THREE.Mesh(prongGeometry, trishulMaterial);
            prong.position.set(3.5 + offset, 7.5, 0);
            group.add(prong);
        });
        
        // Left arm with Damaru (drum)
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-2.5, 3.5, 0);
        leftArm.rotation.z = Math.PI / 6;
        group.add(leftArm);
        
        // Damaru
        const damaruGeometry = new THREE.CylinderGeometry(0.5, 0.3, 0.8, 8);
        const damaruMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            emissive: 0xFF6B35,
            emissiveIntensity: 0.2
        });
        const damaru = new THREE.Mesh(damaruGeometry, damaruMaterial);
        damaru.position.set(-3.5, 5, 0);
        group.add(damaru);
        
        // Snake around neck
        const snakeGeometry = new THREE.TorusGeometry(0.8, 0.15, 8, 16);
        const snakeMaterial = new THREE.MeshPhongMaterial({
            color: 0x006400,
            emissive: 0x00FF00,
            emissiveIntensity: 0.3
        });
        const snake = new THREE.Mesh(snakeGeometry, snakeMaterial);
        snake.position.y = 5;
        snake.rotation.x = Math.PI / 2;
        group.add(snake);
        
        // Aura - Blue energy
        const auraGeometry = new THREE.SphereGeometry(6, 32, 32);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0x0000FF,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        group.add(aura);
        
        // Animation
        group.userData.animate = (time) => {
            group.rotation.y = Math.sin(time * 0.3) * 0.15;
            aura.scale.set(
                1 + Math.sin(time * 3) * 0.1,
                1 + Math.sin(time * 3) * 0.1,
                1 + Math.sin(time * 3) * 0.1
            );
            thirdEye.material.emissiveIntensity = 0.8 + Math.sin(time * 5) * 0.2;
            damaru.rotation.z += 0.05;
            moon.material.emissiveIntensity = 0.6 + Math.sin(time * 2) * 0.2;
        };
        
        group.userData.type = 'deity';
        group.userData.name = 'Shiva - The Destroyer';
        
        scene.add(group);
        return group;
    }
    
    // Create Krishna - (Flute, Peacock feather, Blue skin)
    static createKrishna(scene, position) {
        const group = new THREE.Group();
        group.position.copy(position);
        
        // Body - Yellow dhoti
        const bodyGeometry = new THREE.CylinderGeometry(1.3, 1.8, 4, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        group.add(body);
        
        // Torso - Blue
        const torsoGeometry = new THREE.CylinderGeometry(1, 1.3, 2, 8);
        const torsoMaterial = new THREE.MeshPhongMaterial({
            color: 0x1E90FF,
            emissive: 0x1E90FF,
            emissiveIntensity: 0.3
        });
        const torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
        torso.position.y = 4.5;
        group.add(torso);
        
        // Head - Blue complexion
        const headGeometry = new THREE.SphereGeometry(1, 16, 16);
        const headMaterial = new THREE.MeshPhongMaterial({
            color: 0x4169E1,
            emissive: 0x4169E1,
            emissiveIntensity: 0.4
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 6;
        group.add(head);
        
        // Crown with peacock feather
        const crownGeometry = new THREE.CylinderGeometry(1.1, 1.2, 0.8, 8);
        const crownMaterial = new THREE.MeshPhongMaterial({
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.6,
            metalness: 0.8
        });
        const crown = new THREE.Mesh(crownGeometry, crownMaterial);
        crown.position.y = 6.8;
        group.add(crown);
        
        // Peacock feather
        const featherGeometry = new THREE.ConeGeometry(0.3, 2, 8);
        const featherMaterial = new THREE.MeshPhongMaterial({
            color: 0x00CED1,
            emissive: 0x00CED1,
            emissiveIntensity: 0.6
        });
        const feather = new THREE.Mesh(featherGeometry, featherMaterial);
        feather.position.set(0.5, 8, 0);
        feather.rotation.z = -Math.PI / 6;
        group.add(feather);
        
        // Feather eye
        const featherEyeGeometry = new THREE.SphereGeometry(0.2, 8, 8);
        const featherEyeMaterial = new THREE.MeshPhongMaterial({
            color: 0x9400D3,
            emissive: 0x9400D3,
            emissiveIntensity: 0.8
        });
        const featherEye = new THREE.Mesh(featherEyeGeometry, featherEyeMaterial);
        featherEye.position.set(0.5, 8.8, 0);
        group.add(featherEye);
        
        // Arms
        const armGeometry = new THREE.CylinderGeometry(0.25, 0.22, 3, 8);
        const armMaterial = new THREE.MeshPhongMaterial({
            color: 0x4169E1,
            emissive: 0x4169E1,
            emissiveIntensity: 0.2
        });
        
        // Right arm with flute
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.8, 4.5, 0.5);
        rightArm.rotation.z = -Math.PI / 3;
        rightArm.rotation.x = Math.PI / 4;
        group.add(rightArm);
        
        // Left arm with flute
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.8, 4.5, 0.5);
        leftArm.rotation.z = Math.PI / 3;
        leftArm.rotation.x = Math.PI / 4;
        group.add(leftArm);
        
        // Flute (Bansuri)
        const fluteGeometry = new THREE.CylinderGeometry(0.1, 0.1, 3, 8);
        const fluteMaterial = new THREE.MeshPhongMaterial({
            color: 0x8B4513,
            emissive: 0xFFD700,
            emissiveIntensity: 0.3
        });
        const flute = new THREE.Mesh(fluteGeometry, fluteMaterial);
        flute.position.set(0, 5.5, 1.5);
        flute.rotation.z = Math.PI / 2;
        group.add(flute);
        
        // Flute holes
        for (let i = 0; i < 6; i++) {
            const holeGeometry = new THREE.SphereGeometry(0.08, 6, 6);
            const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
            const hole = new THREE.Mesh(holeGeometry, holeMaterial);
            hole.position.set(-1 + i * 0.4, 5.5, 1.6);
            group.add(hole);
        }
        
        // Aura - Divine golden-blue glow
        const auraGeometry = new THREE.SphereGeometry(5, 32, 32);
        const auraMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });
        const aura = new THREE.Mesh(auraGeometry, auraMaterial);
        group.add(aura);
        
        // Music notes particles
        const notesGeometry = new THREE.SphereGeometry(0.1, 4, 4);
        const notesMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFD700,
            transparent: true,
            opacity: 0.8
        });
        
        const musicNotes = [];
        for (let i = 0; i < 8; i++) {
            const note = new THREE.Mesh(notesGeometry, notesMaterial.clone());
            note.position.set(
                Math.sin(i) * 3,
                5 + Math.cos(i) * 2,
                Math.cos(i) * 3
            );
            note.userData.offset = i;
            group.add(note);
            musicNotes.push(note);
        }
        
        // Animation
        group.userData.animate = (time) => {
            group.rotation.y = Math.sin(time * 0.4) * 0.1;
            aura.scale.set(
                1 + Math.sin(time * 2.5) * 0.15,
                1 + Math.sin(time * 2.5) * 0.15,
                1 + Math.sin(time * 2.5) * 0.15
            );
            feather.rotation.z = -Math.PI / 6 + Math.sin(time * 2) * 0.1;
            featherEye.material.emissiveIntensity = 0.6 + Math.sin(time * 4) * 0.2;
            
            // Animate music notes
            musicNotes.forEach((note, i) => {
                const angle = time + note.userData.offset;
                note.position.x = Math.sin(angle) * 3;
                note.position.y = 5 + Math.sin(angle * 2) * 2;
                note.position.z = Math.cos(angle) * 3;
                note.material.opacity = 0.5 + Math.sin(time * 3 + i) * 0.3;
            });
        };
        
        group.userData.type = 'deity';
        group.userData.name = 'Krishna - The Divine';
        
        scene.add(group);
        return group;
    }
}

