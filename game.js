// 3D Zoo Game - Main Game Logic
class ZooGame {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.animals = [];
        this.animalData = {};
        this.isNight = false;
        this.animationsEnabled = true;
        this.visitorCount = 0;
        this.selectedAnimal = null;
        
        this.init();
    }

    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupControls();
        this.setupLighting();
        this.createEnvironment();
        this.createAnimals();
        this.setupEventListeners();
        this.animate();
        this.hideLoadingScreen();
        this.updateStats();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 400);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(40, 30, 40);
        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        
        const container = document.getElementById('game-container');
        container.appendChild(this.renderer.domElement);
    }

    setupControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxDistance = 200;
        this.controls.minDistance = 10;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(100, 100, 100);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 4096;
        this.sunLight.shadow.mapSize.height = 4096;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 1000;
        this.sunLight.shadow.camera.left = -100;
        this.sunLight.shadow.camera.right = 100;
        this.sunLight.shadow.camera.top = 100;
        this.sunLight.shadow.camera.bottom = -100;
        this.scene.add(this.sunLight);

        // Moon light (for night)
        this.moonLight = new THREE.DirectionalLight(0x4040ff, 0.3);
        this.moonLight.position.set(-100, 100, -100);
        this.moonLight.visible = false;
        this.scene.add(this.moonLight);
    }

    createEnvironment() {
        // Ground - much bigger now
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // More trees for bigger map
        for (let i = 0; i < 40; i++) {
            this.createTree(
                (Math.random() - 0.5) * 160,
                0,
                (Math.random() - 0.5) * 160
            );
        }

        // More rocks
        for (let i = 0; i < 20; i++) {
            this.createRock(
                (Math.random() - 0.5) * 120,
                0,
                (Math.random() - 0.5) * 120
            );
        }

        // Multiple water ponds
        this.createPond(30, 0, -40);
        this.createPond(-30, 0, 40);
        this.createPond(60, 0, 20);

        // Add some hills
        this.createHills();
    }

    createHills() {
        for (let i = 0; i < 5; i++) {
            const hillGeometry = new THREE.SphereGeometry(15 + Math.random() * 10, 16, 16);
            const hillMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x8FBC8F,
                transparent: true,
                opacity: 0.8
            });
            const hill = new THREE.Mesh(hillGeometry, hillMaterial);
            hill.position.set(
                (Math.random() - 0.5) * 120,
                5 + Math.random() * 5,
                (Math.random() - 0.5) * 120
            );
            hill.scale.y = 0.5;
            hill.receiveShadow = true;
            this.scene.add(hill);
        }
    }

    createTree(x, y, z) {
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 4);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, y + 2, z);
        trunk.castShadow = true;
        this.scene.add(trunk);

        const leavesGeometry = new THREE.SphereGeometry(3);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.set(x, y + 6, z);
        leaves.castShadow = true;
        this.scene.add(leaves);
    }

    createRock(x, y, z) {
        const rockGeometry = new THREE.DodecahedronGeometry(1 + Math.random() * 2);
        const rockMaterial = new THREE.MeshLambertMaterial({ color: 0x696969 });
        const rock = new THREE.Mesh(rockGeometry, rockMaterial);
        rock.position.set(x, y + 1, z);
        rock.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        rock.castShadow = true;
        this.scene.add(rock);
    }

    createPond(x, y, z) {
        const pondGeometry = new THREE.CylinderGeometry(8, 8, 0.5, 32);
        const pondMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1,
            transparent: true,
            opacity: 0.7
        });
        const pond = new THREE.Mesh(pondGeometry, pondMaterial);
        pond.position.set(x, y + 0.25, z);
        this.scene.add(pond);
    }

    createAnimals() {
        const animalTypes = [
            { type: 'lion', emoji: '🦁', color: 0xFFA500, size: 2, speed: 0.02 },
            { type: 'elephant', emoji: '🐘', color: 0x808080, size: 3, speed: 0.01 },
            { type: 'giraffe', emoji: '🦒', color: 0xF4A460, size: 2.5, speed: 0.015 },
            { type: 'zebra', emoji: '🦓', color: 0xFFFFFF, size: 1.5, speed: 0.025 },
            { type: 'monkey', emoji: '🐒', color: 0x8B4513, size: 1, speed: 0.03 }
        ];

        animalTypes.forEach((animalType, index) => {
            for (let i = 0; i < 3; i++) {
                const animal = this.createAnimal(animalType, index * 20 + i * 10);
                this.animals.push(animal);
            }
        });

        this.updateAnimalCount();
    }

    createAnimal(animalType, offset) {
        let animalGroup = new THREE.Group();
        
        // Create more realistic animal based on type
        switch(animalType.type) {
            case 'lion':
                animalGroup = this.createLion(animalType);
                break;
            case 'elephant':
                animalGroup = this.createElephant(animalType);
                break;
            case 'giraffe':
                animalGroup = this.createGiraffe(animalType);
                break;
            case 'zebra':
                animalGroup = this.createZebra(animalType);
                break;
            case 'monkey':
                animalGroup = this.createMonkey(animalType);
                break;
            default:
                animalGroup = this.createBasicAnimal(animalType);
        }
        
        animalGroup.position.set(
            (Math.random() - 0.5) * 80 + offset,
            0,
            (Math.random() - 0.5) * 80
        );
        
        animalGroup.castShadow = true;
        animalGroup.userData = {
            type: animalType.type,
            emoji: animalType.emoji,
            speed: animalType.speed,
            originalY: 0,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize(),
            lastDirectionChange: 0
        };

        this.scene.add(animalGroup);
        return animalGroup;
    }

    createLion(animalType) {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(1.5, 3, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(1.2, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(2, 2.5, 0);
        group.add(head);
        
        // Mane
        const maneGeometry = new THREE.SphereGeometry(1.4, 8, 8);
        const maneMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const mane = new THREE.Mesh(maneGeometry, maneMaterial);
        mane.position.set(2, 2.5, 0);
        mane.scale.set(1.1, 1.1, 1.1);
        group.add(mane);
        
        // Legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const angle = (i * Math.PI) / 2;
            leg.position.set(
                Math.cos(angle) * 1.5,
                0.5,
                Math.sin(angle) * 1.5
            );
            group.add(leg);
        }
        
        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.2, 0.1, 2);
        const tailMaterial = new THREE.MeshLambertMaterial({ color: 0xFFA500 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-2.5, 1.5, 0);
        tail.rotation.z = Math.PI / 4;
        group.add(tail);
        
        return group;
    }

    createElephant(animalType) {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(2, 4, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(1.8, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(3, 2.5, 0);
        group.add(head);
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.1, 2);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(4.5, 2, 0);
        trunk.rotation.z = -Math.PI / 6;
        group.add(trunk);
        
        // Legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.6, 0.6, 3);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const angle = (i * Math.PI) / 2;
            leg.position.set(
                Math.cos(angle) * 2,
                0.5,
                Math.sin(angle) * 2
            );
            group.add(leg);
        }
        
        // Ears
        for (let i = 0; i < 2; i++) {
            const earGeometry = new THREE.SphereGeometry(0.8, 8, 8);
            const earMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
            const ear = new THREE.Mesh(earGeometry, earMaterial);
            ear.position.set(3, 3.5, (i - 0.5) * 1.5);
            ear.scale.set(1, 0.3, 1);
            group.add(ear);
        }
        
        return group;
    }

    createGiraffe(animalType) {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(1, 3, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 3;
        group.add(body);
        
        // Neck
        const neckGeometry = new THREE.CylinderGeometry(0.4, 0.6, 4);
        const neckMaterial = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
        const neck = new THREE.Mesh(neckGeometry, neckMaterial);
        neck.position.set(1, 5, 0);
        neck.rotation.z = Math.PI / 6;
        group.add(neck);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(2.5, 7, 0);
        group.add(head);
        
        // Horns
        for (let i = 0; i < 2; i++) {
            const hornGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
            const hornMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const horn = new THREE.Mesh(hornGeometry, hornMaterial);
            horn.position.set(2.5, 7.5, (i - 0.5) * 0.3);
            group.add(horn);
        }
        
        // Legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.3, 0.3, 5);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0xF4A460 });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const angle = (i * Math.PI) / 2;
            leg.position.set(
                Math.cos(angle) * 1.5,
                1.5,
                Math.sin(angle) * 1.5
            );
            group.add(leg);
        }
        
        return group;
    }

    createZebra(animalType) {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.CapsuleGeometry(1, 3, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        group.add(body);
        
        // Add stripes pattern
        for (let i = 0; i < 8; i++) {
            const stripeGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
            const stripeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
            const stripe = new THREE.Mesh(stripeGeometry, stripeMaterial);
            stripe.position.set((i - 4) * 0.4, 1.5, 0);
            group.add(stripe);
        }
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(2, 2, 0);
        group.add(head);
        
        // Legs
        for (let i = 0; i < 4; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2.5);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            const angle = (i * Math.PI) / 2;
            leg.position.set(
                Math.cos(angle) * 1.5,
                0.5,
                Math.sin(angle) * 1.5
            );
            group.add(leg);
        }
        
        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.1, 0.05, 1.5);
        const tailMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(-2.5, 1.5, 0);
        tail.rotation.z = Math.PI / 4;
        group.add(tail);
        
        return group;
    }

    createMonkey(animalType) {
        const group = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.SphereGeometry(0.8, 8, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1;
        group.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.6, 8, 8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(0, 1.8, 0);
        group.add(head);
        
        // Arms
        for (let i = 0; i < 2; i++) {
            const armGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1.5);
            const armMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const arm = new THREE.Mesh(armGeometry, armMaterial);
            arm.position.set((i - 0.5) * 1.2, 1.2, 0);
            arm.rotation.z = (i - 0.5) * Math.PI / 3;
            group.add(arm);
        }
        
        // Legs
        for (let i = 0; i < 2; i++) {
            const legGeometry = new THREE.CylinderGeometry(0.25, 0.25, 1.2);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set((i - 0.5) * 0.8, 0.2, 0);
            group.add(leg);
        }
        
        // Tail
        const tailGeometry = new THREE.CylinderGeometry(0.1, 0.05, 2);
        const tailMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const tail = new THREE.Mesh(tailGeometry, tailMaterial);
        tail.position.set(0, 0.5, -1);
        tail.rotation.x = Math.PI / 4;
        group.add(tail);
        
        return group;
    }

    createBasicAnimal(animalType) {
        const geometry = new THREE.SphereGeometry(animalType.size);
        const material = new THREE.MeshLambertMaterial({ color: animalType.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = animalType.size;
        return mesh;
    }

    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Mouse click for animal selection
        this.renderer.domElement.addEventListener('click', (event) => {
            this.handleMouseClick(event);
        });

        // UI controls
        document.getElementById('reset-camera').addEventListener('click', () => {
            this.resetCamera();
        });

        document.getElementById('toggle-animations').addEventListener('click', () => {
            this.toggleAnimations();
        });

        document.getElementById('day-night-toggle').addEventListener('click', () => {
            this.toggleDayNight();
        });
    }

    handleMouseClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.animals);
        
        if (intersects.length > 0) {
            const animal = intersects[0].object;
            this.selectAnimal(animal);
        } else {
            this.deselectAnimal();
        }
    }

    selectAnimal(animal) {
        this.selectedAnimal = animal;
        const animalInfo = this.getAnimalInfo(animal.userData.type);
        
        document.getElementById('selected-animal').innerHTML = `
            <div class="animal-detail">
                <div class="animal-name">${animal.userData.emoji} ${animalInfo.name}</div>
                <div class="animal-description">${animalInfo.description}</div>
                <div class="animal-description">Habitat: ${animalInfo.habitat}</div>
                <div class="animal-description">Diet: ${animalInfo.diet}</div>
            </div>
        `;
    }

    deselectAnimal() {
        this.selectedAnimal = null;
        document.getElementById('selected-animal').innerHTML = 'Click on an animal to learn more!';
    }

    getAnimalInfo(type) {
        const animalInfo = {
            lion: {
                name: 'African Lion',
                description: 'The king of the jungle, lions are social big cats that live in prides.',
                habitat: 'Savanna grasslands',
                diet: 'Carnivore (antelope, zebra, buffalo)'
            },
            elephant: {
                name: 'African Elephant',
                description: 'The largest land animal on Earth, known for their intelligence and memory.',
                habitat: 'Savanna and forest',
                diet: 'Herbivore (grass, leaves, bark)'
            },
            giraffe: {
                name: 'Giraffe',
                description: 'The tallest animal on Earth, with long necks to reach tree leaves.',
                habitat: 'Savanna',
                diet: 'Herbivore (leaves, twigs, fruits)'
            },
            zebra: {
                name: 'Zebra',
                description: 'Known for their distinctive black and white striped coat.',
                habitat: 'Savanna grasslands',
                diet: 'Herbivore (grass, leaves)'
            },
            monkey: {
                name: 'Monkey',
                description: 'Intelligent primates that are excellent climbers and social animals.',
                habitat: 'Forest and jungle',
                diet: 'Omnivore (fruits, insects, small animals)'
            }
        };
        
        return animalInfo[type] || animalInfo.lion;
    }

    resetCamera() {
        this.camera.position.set(40, 30, 40);
        this.camera.lookAt(0, 0, 0);
        this.controls.reset();
    }

    toggleAnimations() {
        this.animationsEnabled = !this.animationsEnabled;
        const button = document.getElementById('toggle-animations');
        button.textContent = this.animationsEnabled ? 'Toggle Animations' : 'Resume Animations';
    }

    toggleDayNight() {
        this.isNight = !this.isNight;
        
        if (this.isNight) {
            this.scene.fog.color.setHex(0x000033);
            this.renderer.setClearColor(0x000033);
            this.sunLight.visible = false;
            this.moonLight.visible = true;
        } else {
            this.scene.fog.color.setHex(0x87CEEB);
            this.renderer.setClearColor(0x87CEEB);
            this.sunLight.visible = true;
            this.moonLight.visible = false;
        }
        
        const button = document.getElementById('day-night-toggle');
        button.textContent = this.isNight ? 'Switch to Day' : 'Switch to Night';
    }

    updateAnimalMovement() {
        if (!this.animationsEnabled) return;

        this.animals.forEach(animal => {
            const userData = animal.userData;
            const time = Date.now();
            
            // Change direction randomly
            if (time - userData.lastDirectionChange > 3000) {
                userData.direction.set(
                    Math.random() - 0.5,
                    0,
                    Math.random() - 0.5
                ).normalize();
                userData.lastDirectionChange = time;
            }
            
            // Move animal
            animal.position.add(userData.direction.clone().multiplyScalar(userData.speed));
            
            // Keep animals within bounds (bigger bounds now)
            if (Math.abs(animal.position.x) > 80) {
                userData.direction.x *= -1;
            }
            if (Math.abs(animal.position.z) > 80) {
                userData.direction.z *= -1;
            }
            
            // Add some bobbing motion
            animal.position.y = userData.originalY + Math.sin(time * 0.003) * 0.2;
            
            // Rotate animal to face direction
            animal.lookAt(
                animal.position.clone().add(userData.direction)
            );
        });
    }

    updateStats() {
        this.visitorCount = Math.floor(Math.random() * 50) + 10;
        document.getElementById('animal-count').textContent = `Animals: ${this.animals.length}`;
        document.getElementById('visitor-count').textContent = `Visitors: ${this.visitorCount}`;
    }

    updateAnimalCount() {
        document.getElementById('animal-count').textContent = `Animals: ${this.animals.length}`;
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');
        }, 2000);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.updateAnimalMovement();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new ZooGame();
});

