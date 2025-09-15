import * as THREE from 'three';

class HeroAnimation {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = [];
        this.geometries = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.createParticles();
        this.createGeometries();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // Add to hero section
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.appendChild(this.renderer.domElement);
            this.renderer.domElement.style.position = 'absolute';
            this.renderer.domElement.style.top = '0';
            this.renderer.domElement.style.left = '0';
            this.renderer.domElement.style.zIndex = '1';
            this.renderer.domElement.style.pointerEvents = 'none';
        }
    }

    createParticles() {
        const particleCount = 200;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            new THREE.Color(0xff6b6b), // Red
            new THREE.Color(0x4ecdc4), // Teal
            new THREE.Color(0x45b7d1), // Blue
            new THREE.Color(0x96ceb4), // Green
            new THREE.Color(0xffeaa7), // Yellow
            new THREE.Color(0xfd79a8), // Pink
            new THREE.Color(0x6c5ce7), // Purple
        ];

        for (let i = 0; i < particleCount; i++) {
            // Positions
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Sizes
            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Add wave motion
                    pos.y += sin(time + position.x * 0.5) * 0.5;
                    pos.x += cos(time + position.y * 0.5) * 0.3;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    float distance = length(gl_PointCoord - vec2(0.5));
                    if (distance > 0.5) discard;
                    
                    float alpha = 1.0 - distance * 2.0;
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    createGeometries() {
        // Create floating geometric shapes
        const shapes = [
            { geometry: new THREE.BoxGeometry(0.5, 0.5, 0.5), count: 15 },
            { geometry: new THREE.SphereGeometry(0.3, 16, 16), count: 10 },
            { geometry: new THREE.ConeGeometry(0.3, 0.8, 8), count: 8 },
            { geometry: new THREE.OctahedronGeometry(0.4), count: 12 }
        ];

        shapes.forEach(shape => {
            for (let i = 0; i < shape.count; i++) {
                const material = new THREE.MeshPhongMaterial({
                    color: new THREE.Color().setHSL(Math.random(), 0.7, 0.6),
                    transparent: true,
                    opacity: 0.7,
                    shininess: 100
                });

                const mesh = new THREE.Mesh(shape.geometry, material);
                
                // Random position
                mesh.position.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 10
                );
                
                // Random rotation
                mesh.rotation.set(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                );
                
                // Store initial position for animation
                mesh.userData = {
                    initialPosition: mesh.position.clone(),
                    rotationSpeed: {
                        x: (Math.random() - 0.5) * 0.02,
                        y: (Math.random() - 0.5) * 0.02,
                        z: (Math.random() - 0.5) * 0.02
                    },
                    floatSpeed: Math.random() * 0.01 + 0.005
                };
                
                this.geometries.push(mesh);
                this.scene.add(mesh);
            }
        });

        // Add lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xff6b6b, 1, 100);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0x4ecdc4, 1, 100);
        pointLight2.position.set(5, -5, 5);
        this.scene.add(pointLight2);
    }

    addEventListeners() {
        // Mouse movement
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Update particles
        if (this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = this.time;
        }
        
        // Rotate particle system
        this.particles.rotation.y += 0.002;
        this.particles.rotation.x += 0.001;
        
        // Animate geometric shapes
        this.geometries.forEach((mesh, index) => {
            // Rotation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
            
            // Floating motion
            mesh.position.y = mesh.userData.initialPosition.y + 
                Math.sin(this.time * mesh.userData.floatSpeed + index) * 2;
            
            // Mouse interaction
            const distance = mesh.position.distanceTo(this.camera.position);
            const mouseInfluence = 0.1;
            mesh.position.x += (this.mouse.x * mouseInfluence - mesh.position.x * 0.01) * 0.1;
            mesh.position.y += (this.mouse.y * mouseInfluence - mesh.position.y * 0.01) * 0.1;
        });
        
        // Camera movement based on mouse
        this.camera.position.x += (this.mouse.x * 0.5 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouse.y * 0.5 - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});