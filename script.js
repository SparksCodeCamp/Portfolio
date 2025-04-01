// Three.js 
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x4ecca3, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(20, 20, 20);
scene.add(pointLight);

const geometries = [
    new THREE.TorusGeometry(10, 3, 16, 100),
    new THREE.SphereGeometry(10, 32, 16),
    new THREE.BoxGeometry(15, 15, 15),
];

const material = new THREE.MeshPhongMaterial({
    color: 0x4ecca3,
    wireframe: true,
    transparent: true,
    opacity: 0.6
});

const shapes = geometries.map(geo => new THREE.Mesh(geo, material));
shapes.forEach(shape => {
    shape.visible = false;
    scene.add(shape);
});

let currentShapeIndex = 0;
shapes[currentShapeIndex].visible = true;

let scrollY = window.scrollY;
let targetShapeIndex = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    const newShapeIndex = Math.min(
        Math.floor(scrollY / (document.body.scrollHeight / 3)),
        shapes.length - 1
    );
    if (newShapeIndex !== targetShapeIndex) {
        targetShapeIndex = newShapeIndex;
    }
});

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

window.addEventListener('scroll', () => {
    const backToTop = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const menuBtn = document.getElementById('menu-btn');
const navMenu = document.getElementById('nav-menu');
menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuBtn.innerHTML = navMenu.classList.contains('active') ?
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: target.offsetTop - 60,
            behavior: 'smooth'
        });
        document.querySelectorAll('nav a.active').forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
});

document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! I’ll get back to you soon.');
    e.target.reset();
});

let shapeTransitionProgress = 0;
const shapeTransitionDuration = 30;

function animate() {
    requestAnimationFrame(animate);

    shapes[currentShapeIndex].rotation.x += 0.01;
    shapes[currentShapeIndex].rotation.y += 0.01;

    if (currentShapeIndex !== targetShapeIndex) {
        shapeTransitionProgress++;
        if (shapeTransitionProgress >= shapeTransitionDuration) {
            shapes[currentShapeIndex].visible = false;
            currentShapeIndex = targetShapeIndex;
            shapes[currentShapeIndex].visible = true;
            shapeTransitionProgress = 0;
        }
    }

    renderer.render(scene, camera);
}
animate();