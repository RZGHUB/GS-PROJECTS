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
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 200);
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(20, 15, 20);
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
        this.controls.maxDistance = 100;
        this.controls.minDistance = 5;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(50, 50, 50);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 0.5;
        this.sunLight.shadow.camera.far = 500;
        this.sunLight.shadow.camera.left = -50;
        this.sunLight.shadow.camera.right = 50;
        this.sunLight.shadow.camera.top = 50;
        this.sunLight.shadow.camera.bottom = -50;
        this.scene.add(this.sunLight);

        // Moon light (for night)
        this.moonLight = new THREE.DirectionalLight(0x4040ff, 0.3);
        this.moonLight.position.set(-50, 50, -50);
        this.moonLight.visible = false;
        this.scene.add(this.moonLight);
    }

    createEnvironment() {
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x90EE90,
            side: THREE.DoubleSide 
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Trees
        for (let i = 0; i < 15; i++) {
            this.createTree(
                (Math.random() - 0.5) * 80,
                0,
                (Math.random() - 0.5) * 80
            );
        }

        // Rocks
        for (let i = 0; i < 8; i++) {
            this.createRock(
                (Math.random() - 0.5) * 60,
                0,
                (Math.random() - 0.5) * 60
            );
        }

        // Water pond
        this.createPond(15, 0, -20);
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
            for (let i = 0; i < 2; i++) {
                const animal = this.createAnimal(animalType, index * 10 + i * 5);
                this.animals.push(animal);
            }
        });

        this.updateAnimalCount();
    }

    createAnimal(animalType, offset) {
        const geometry = new THREE.SphereGeometry(animalType.size);
        const material = new THREE.MeshLambertMaterial({ color: animalType.color });
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.set(
            (Math.random() - 0.5) * 40 + offset,
            animalType.size,
            (Math.random() - 0.5) * 40
        );
        
        mesh.castShadow = true;
        mesh.userData = {
            type: animalType.type,
            emoji: animalType.emoji,
            speed: animalType.speed,
            originalY: animalType.size,
            direction: new THREE.Vector3(
                Math.random() - 0.5,
                0,
                Math.random() - 0.5
            ).normalize(),
            lastDirectionChange: 0
        };

        this.scene.add(mesh);
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
        this.camera.position.set(20, 15, 20);
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
            
            // Keep animals within bounds
            if (Math.abs(animal.position.x) > 40) {
                userData.direction.x *= -1;
            }
            if (Math.abs(animal.position.z) > 40) {
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

