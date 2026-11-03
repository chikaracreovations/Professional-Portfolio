// ==========================================================================
// SPATIAL 3D BACKGROUND (THREE.JS NEURAL COSMOS & DEPTH MATRIX)
// ==========================================================================

(function initSpatialBackground() {
  if (typeof THREE === 'undefined') {
    console.warn('Three.js not loaded. Skipping spatial background initialization.');
    return;
  }

  // Check for prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const canvas = document.getElementById('spatial-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
  );
  camera.position.z = 700;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // -------------------------------------------------------------------------
  // 1. Interactive 3D Particle Cloud (Crimson & Diamond White)
  // -------------------------------------------------------------------------
  const particleCount = window.innerWidth < 768 ? 160 : 320;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const velocities = [];

  // Theme Colors: Crimson (#ff3344), Ruby (#850505), Star White (#ffffff), Cyan Accent (#00ffff)
  const colorPalette = [
    new THREE.Color(0xff3344),
    new THREE.Color(0x850505),
    new THREE.Color(0xffffff),
    new THREE.Color(0xd00000),
    new THREE.Color(0x00ffff)
  ];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 1400;
    const y = (Math.random() - 0.5) * 900;
    const z = (Math.random() - 0.5) * 1200;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Pick color
    const pickedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = pickedColor.r;
    colors[i * 3 + 1] = pickedColor.g;
    colors[i * 3 + 2] = pickedColor.b;

    velocities.push({
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      vz: (Math.random() - 0.5) * 0.35
    });
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Circular soft particle texture
  function createCircleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(pCanvas);
    texture.needsUpdate = true;
    return texture;
  }

  const pMaterial = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    map: createCircleTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, pMaterial);
  scene.add(particleSystem);

  // -------------------------------------------------------------------------
  // 2. Dynamic 3D Neural Constellation Lines
  // -------------------------------------------------------------------------
  const maxLineConnections = particleCount * 2;
  const linePositions = new Float32Array(maxLineConnections * 6);
  const lineColors = new Float32Array(maxLineConnections * 6);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage));
  lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage));

  const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.28,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lineMesh);

  // -------------------------------------------------------------------------
  // 3. Floating Spatial Wireframe Geometries
  // -------------------------------------------------------------------------
  // Floating Wireframe Icosahedron
  const icoGeometry = new THREE.IcosahedronGeometry(70, 1);
  const icoWireframe = new THREE.WireframeGeometry(icoGeometry);
  const icoMaterial = new THREE.LineBasicMaterial({
    color: 0xff3344,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending
  });
  const floatingIco = new THREE.LineSegments(icoWireframe, icoMaterial);
  floatingIco.position.set(380, 120, -150);
  scene.add(floatingIco);

  // Floating Wireframe Octahedron
  const octGeometry = new THREE.OctahedronGeometry(50, 0);
  const octWireframe = new THREE.WireframeGeometry(octGeometry);
  const octMaterial = new THREE.LineBasicMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.25,
    blending: THREE.AdditiveBlending
  });
  const floatingOct = new THREE.LineSegments(octWireframe, octMaterial);
  floatingOct.position.set(-420, -180, -220);
  scene.add(floatingOct);

  // -------------------------------------------------------------------------
  // 4. Spatial Mouse Parallax & Scroll Gliding
  // -------------------------------------------------------------------------
  let mouseX = 0;
  let mouseY = 0;
  let targetCameraX = 0;
  let targetCameraY = 0;
  let scrollProgress = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    targetCameraX = mouseX * 120;
    targetCameraY = mouseY * 80;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress = docHeight > 0 ? window.scrollY / docHeight : 0;
  }, { passive: true });

  // -------------------------------------------------------------------------
  // 5. Animation Loop
  // -------------------------------------------------------------------------
  let animationFrameId = null;
  let isTabVisible = true;

  document.addEventListener('visibilitychange', () => {
    isTabVisible = !document.hidden;
    if (isTabVisible && !animationFrameId) {
      animate();
    }
  });

  const clock = new THREE.Clock();

  function animate() {
    if (!isTabVisible) {
      animationFrameId = null;
      return;
    }
    animationFrameId = requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Subtle particle drifting
    const pos = geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i].vx;
      pos[i * 3 + 1] += velocities[i].vy;
      pos[i * 3 + 2] += velocities[i].vz;

      // Wrap around bounds
      if (Math.abs(pos[i * 3]) > 750) velocities[i].vx *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 500) velocities[i].vy *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 650) velocities[i].vz *= -1;
    }
    geometry.attributes.position.needsUpdate = true;

    // Connect nearby particles with lines
    let lineIndex = 0;
    const maxDistance = window.innerWidth < 768 ? 95 : 125;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDistance && lineIndex < maxLineConnections) {
          const alpha = 1.0 - dist / maxDistance;

          linePositions[lineIndex * 6] = pos[i * 3];
          linePositions[lineIndex * 6 + 1] = pos[i * 3 + 1];
          linePositions[lineIndex * 6 + 2] = pos[i * 3 + 2];

          linePositions[lineIndex * 6 + 3] = pos[j * 3];
          linePositions[lineIndex * 6 + 4] = pos[j * 3 + 1];
          linePositions[lineIndex * 6 + 5] = pos[j * 3 + 2];

          // Line color with distance fade
          lineColors[lineIndex * 6] = 0.85 * alpha;
          lineColors[lineIndex * 6 + 1] = 0.1 * alpha;
          lineColors[lineIndex * 6 + 2] = 0.2 * alpha;

          lineColors[lineIndex * 6 + 3] = 0.9 * alpha;
          lineColors[lineIndex * 6 + 4] = 0.2 * alpha;
          lineColors[lineIndex * 6 + 5] = 0.3 * alpha;

          lineIndex++;
        }
      }
    }

    lineGeometry.setDrawRange(0, lineIndex * 2);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    // Rotate floating 3D shapes
    floatingIco.rotation.x = elapsedTime * 0.18;
    floatingIco.rotation.y = elapsedTime * 0.22;
    floatingIco.position.y = 120 + Math.sin(elapsedTime * 0.9) * 20;

    floatingOct.rotation.x = -elapsedTime * 0.15;
    floatingOct.rotation.z = elapsedTime * 0.25;
    floatingOct.position.y = -180 + Math.cos(elapsedTime * 0.8) * 16;

    // Camera spatial parallax + scroll glide
    camera.position.x += (targetCameraX - camera.position.x) * 0.04;
    camera.position.y += (targetCameraY - camera.position.y) * 0.04;

    // Scroll depth traversal: glides camera through 3D space
    const targetZ = 700 - scrollProgress * 350;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }, 120);
  });
})();

