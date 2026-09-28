/* ============================================================
 * 深空制图仪 · DEEP SPACE CARTOGRAPH
 * ============================================================ */
(function () {
'use strict';
const THREE = window.THREE;
const OrbitControls = THREE.OrbitControls;

const DEG = Math.PI / 180;
const R = 1.25;                      // 地球半径

/* ---------- 陆地掩码（360x180 位图，1 = 陆地） ---------- */
const LAND_B64 = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//4AAD//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf///B/////8AcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeDP/wf///////AAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAf//8Af//////8AAAAArhgAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAABwDn/wf///////4AAAAAfgAAAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AP///////4AAAAAHAAAAAAAAAAAAAAYAAAAAAAAAAAAAAAAAAAAAB4AAACCGAH///////wAAAAAAAAAAAAAAwAAAAB+8AAAAAAAAAAAAAAAAAAAAAD7wMTh8AAAP/////8AAAAAAAAAAAADwAAAAf//+AAAA9AAAAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAAAAAOAAAAH/9/wAAAAAAAAAAAAAAAAAAAAP8AIMeMTAAAD////+wAAAAAAAAAAAA4AAAH///+OYCAAAAAAAAAAAAAAAAAAfPy4OQ55wAAB/////gAAAAAAAAAAABgAHAH///////AAHAAAAAAAAAAAAAAAMP/4Aw//8AAAP////wAAAAAAAAAAABwAPJ9///////4gP+AAAAAAAAP0AAAAAH/8A8H//4AAn///8gAAAAAAA/AAAAAAfP/////////////4AAAAAB///4AfWD/vCMBwP8AAn////AAAAAAAf/4AAAAcPP/////////////85H4gAP///////+AADPxwD8AAH///gAAAAAAB///wAAG/nm////////////v////8AD////////O//f3wQ/wAf//4AAAAAAAH///+I////H//////////////////4Af/////8P////9ABv8Af//gAAAAAAAP//48P///+f/////////////////Dwf//////4P////6AD8YAP/wAAf8AAAAf8f8D///////////////////////AgAf///////////zwx/AAP/gAAP4AAAB/4/+P//////////////////////8AAAf//////////+DAA/gAH/gAAAAAAAD/h/////////////////////////+AAH///////+3/f4AAAGAAD/AAAAAAAAf/H/+/////////////////////v/wAAP///////8P//wAA/AAAB+AAAAAAAB/+D/O////////////////////jP+AAAD/9x////////gAA/wAAAGAAAAAAAB//DxH///////////////////+AeIAAAA/wAB////9//gAA/wQAAAAAAAAAAA/vAD///////////////////ecBgAAAAABwAAf//////4AA/84AAAAAAAAAAA4+A//3////////////////4AAHAAAAAADIAAL////+/4AAf/8AAAAAAAAA8AA8Cf//////////////////gAAfgAAAAAMAAAB///////wAP/8AAAAAAAAA4AEcH///////////////////AAA/gAAAAAAAAAA////3//8Af/+AAAAAAAAAcAMAH//////////////v///8AAA/AAAAAAAAAAAP///////x///wAAAAAAADGAEBP//////////////P///8AAA8AAAAAAAAAABP////r//x///4AAAAAAAHHAP///////////////+f////4AA8AAAAAAAAAAAD////5//x///8AAAAAAAOPh////////////////9/////6AAwAAAAAAAAAAAD///////5///0AAAAAAAAPj//////////////////////6AAQAAAAAAAAAAAB///////////EAAAAAAAAAP//////////////////////zAAAAAAAAAAAAAAA/////vv//8AMAAAAAAAAA///////////////////////zAAAAAAAAAAAAAAAT/////j//7gfAAAAAAAAP///////////////////////wAAAAAAAAAAAAAAAP////+B///gAgAAAAAAAH///////////////////////iAAAAAAAAAAAAAAAP/////5///gAAAAAAAAAD/////uP/x/f/3//////////AAAAAAAAAAAAAAAAP/////5D//cAAAAAAAAAB//P//GP+B8f///////////+AAAAAAAAAAAAAAAAP/////zH/8wAAAAAAAAAB//H/+AP+H8f///////////8CAAAAAAAAAAAAAAAP/////zuPwAAAAAAAAACD9jh/8AD+H/////////////4HgAAAAAAAAAAAAAAP/////zx/gAAAAAAAAAH/4Bwf8AA/B///+////////+AKAAAAAAAAAAAAAAAP/v////n/AAAAAAAAAAH/wAcP8PA/h////////////8AAAAAAAAAAAAAAAAAP///////8AAAAAAAAAAH/AEGPJ///x///////////P4AIAAAAAAAAAAAAAAAP///////4AAAAAAAAAAH/AACOH///g//////////+BgAMAAAAAAAAAAAAAAAH///////4AAAAAAAAAAH/AAAHH///g//////////8BwAIAAAAAAAAAAAAAAAD///////gAAAAAAAAAAH+AAYCH//7g//////////+gYAYAAAAAAAAAAAAAAAD///////wAAAAAAAAAAAgP8AABM//////////////gYB4AAAAAAAAAAAAAAAB///////wAAAAAAAAAAAh/+AAAA/////////////+AYDwAAAAAAAAAAAAAAAA///////AAAAAAAAAAAA//8AAAA//////////////AA2AAAAAAAAAAAAAAAAAP/////+AAAAAAAAAAAD//+AAAB//////////////ACAAAAAAAAAAAAAAAAAAH/////8AAAAAAAAAAAH///wGAB//////////////gDAAAAAAAAAAAAAAAAAAC/////4AAAAAAAAAAAP///8PgB//////////////wAAAAAAAAAAAAAAAAAAACf///jwAAAAAAAAAAAP////P////////////////gAAAAAAAAAAAAAAAAAAABP//hAYAAAAAAAAAAAP/////////H///////////wAAAAAAAAAAAAAAAAAAAAn/+AAYAAAAAAAAAAAf/////////H///////////gAAAAAAAAAAAAAAAAAAAAz/+AAMAAAAAAAAAAB///////8//h///////////AAAAAAAAAAAAAAAAAAAAAR/+AAMAAAAAAAAAAD///////8//wH//////////AAAAAAAAAAAAAAAAAAAAAJ/8AAAAAAAAAAAAAH///////+f/wA/////////+AAAAAAAAAAAAAAAAAAAAAIf8AAAAAAAAAAAAAH///////+P/4YAf///////8QAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAP///////+H//8AF///////4gAAAAAAAAAAAAAAAAAAAAAP8AAOAAAAAAAAAAP////////H//+AD///v///AAAAAAAAAAAAAAAAAAAAAAAH8AABgAAAAAAAAAf////////n//+ADf/4P//IAAAAAAAAAAAAAAAAAAAAAAAH+A4AYAAAAAAAAAP////////j//8AAf/4H/8AAAAAAAAAAAAAAAAAAAAAAAAH/BwABwAAAAAAAAP////////h//8AAf/gD/8YAAAAAAAAAAAAAAAAAAAAAAAB/jwAAwAAAAAAAAP////////w//4AAf/AD/8QAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAP////////4//gAAf+AB/+AAQAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAAAP////////4f+AAAf8ABP/AAwAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAAAf////////8f8AAAPwAAP/gAgAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAf////////+fgAAAPwAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAf////n////cAAAAHwAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAP/////////gAAAAHwAAE/gAAAAAAAAAAAAAAAAAAAAAAAAAABABAAAAAAAAAH/////////gIAAADwAAEfgAAAAAAAAAAAAAAAAAAAAAAAAAADAHcIAAAAAAAD/////////34AAADwAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAgPf+AAAAAAAB//////////4AAABgAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAc///AAAAAAAB//////////wAAABIAAEAAABAAAAAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAA//////////wAAAAMAAEAAADAAAAAAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAf/7///////gAAAAIAADAAADAAAAAAAAAAAAAAAAAAAAAAAAAAf///AAAAAAAH/B///////gAAAAAAADgAMAAAAAAAAAAAAAAAAAAAAAAAAAAAf///wAAAAAAAAAn//////AAAAAAAAxgA8AAAAAAAAAAAAAAAAAAAAAAAAAAAf///4AAAAAAAAAD/////+AAAAAAAAZgB4AAAAAAAAAAAAAAAAAAAAAAAAAAA////4AAAAAAAAAD/////8AAAAAAAAMwD8AAAAAAAAAAAAAAAAAAAAAAAAAAB////8AAAAAAAAAD/////wAAAAAAAAHAf8AAAAAAAAAAAAAAAAAAAAAAAAAAD////8AAAAAAAAAD/////gAAAAAAAAHgf8AAAAAAAAAAAAAAAAAAAAAAAAAAD////+AAAAAAAAAH///z/AAAAAAAAADgf4AAAAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAAH///z/AAAAAAAAABwP5wAwAAAAAAAAAAAAAAAAAAAAAAAD/////8AAAAAAAAD///38AAAAAAAAAB8PxwATwAAAAAAAAAAAAAAAAAAAAAAD//////4AAAAAAAB////8AAAAAAAAAA8AxQAf+AAAAAAAAAAAAAAAAAAAAAAH//////8AAAAAAAA//+/4AAAAAAAAAAcAAIAD/gAAAAAAAAAAAAAAAAAAAAAH///////gAAAAAAA//+/4AAAAAAAAAAIAAAAA/wAAAAAAAAAAAAAAAAAAAAAD///////gAAAAAAAf/+/4AAAAAAAAAADAAAAAf4AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf//f4AAAAAAAAAAB+AAAA/4AAAAAAAAAAAAAAAAAAAAAB///////gAAAAAAAf///4AAAAAAAAAAAAAAAAOMAAAAAAAAAAAAAAAAAAAAAA///////AAAAAAAAf///8AAAAAAAAAAAAACAAAGAAAAAAAAAAAAAAAAAAAAAA//////+AAAAAAAAP//98AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/////+AAAAAAAAP//98AAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAf/////8AAAAAAAAP//98AAAAAAAAAAAAAAB8CAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAAf//98AQAAAAAAAAAAAAD8CAAAAAAAAAAAAAAAAAAAAAAAP/////4AAAAAAAA////+AwAAAAAAAAAAAAz8DAAAAAAAAAAAAAAAAAAAAAAAH/////4AAAAAAAA////8BwAAAAAAAAAAAB/8DgAAAAAAAAAAAAAAAAAAAAAAB/////4AAAAAAAA////4HwAAAAAAAAAAAD//HgAAAAAAAAAAAAAAAAAAAAAAAf////4AAAAAAAA////gPgAAAAAAAAAAAP//nwAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAA////APgAAAAAAAAAAAP///wAAAAAAAAAAAAAAAAAAAAAAAP////wAAAAAAAAf//+AHgAAAAAAAAAAAf///4AAAAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAf//+APAAAAAAAAAAAD////+AAAAAAAAAAAAAAAAAAAAAAAP////gAAAAAAAAP//+APAAAAAAAAAAAP////+AAAAAAAAAAAAAAAAAAAAAAAP////AAAAAAAAAH//+AfAAAAAAAAAAA//////AAAAAAAAAAAAAAAAAAAAAAAP///4AAAAAAAAAH//+APAAAAAAAAAAA//////gAAAAAAAAAAAAAAAAAAAAAAP///gAAAAAAAAAH//+AOAAAAAAAAAAA//////wAAAAAAAAAAAAAAAAAAAAAAP///AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAH//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//4AAAAAAAAAAAAA//////4AAAAAAAAAAAAAAAAAAAAAAf//+AAAAAAAAAAD//wAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAAf//8AAAAAAAAAAB//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAAf//4AAAAAAAAAAA//gAAAAAAAAAAAAAf/////4AAAAAAAAAAAAAAAAAAAAAAf//wAAAAAAAAAAA//AAAAAAAAAAAAAAP/9///4AAAAAAAAAAAAAAAAAAAAAAf//gAAAAAAAAAAA/8AAAAAAAAAAAAAAP+AP//wAAAAAAAAAAAAAAAAAAAAAA///gAAAAAAAAAAA/4AAAAAAAAAAAAAAP8AG//gAAAAAAAAAAAAAAAAAAAAAA//3AAAAAAAAAAAAQAAAAAAAAAAAAAAAOAAA//gAAAAAAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAQAAAAAAAAAAAAAAAAAB//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIAAAAcAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAADAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcAAAGAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAHwAAAAAAH+PgAj+AAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAf+AAAA//////////wAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAA////8Af//////////+AAAAAAAAAAAAAAAAAAAAAAAz4AAAAAAAAAAAAAAAHD////4B/////////////4AAAAAAAAAAAAAAAAAAAAAb8AAAAAAAAAACc/wf//////4f//////////////AAAAAAAAAAAAAAAAAAAAC9+AAAAAAAAb8////////////////////////////gAAAAAAAAAAAAAAAAAAAR+AAAAAAAA//////////////////////////////wAAAAAAAAAAAAAAP/+HM/+AAAAAAA//////////////////////////////+AAAAAAAAAAADpkAf/////8AAAAAAH//////////////////////////////wAAAAAAAAD////////////wAAAAAA///////////////////////////////gAAAAAAAD////////////4AAAAAAf///////////////////////////////gAAAAAB4f//////////zn8AAAAAH////////////////////////////////gAAAAAB////////////wAAAAPwA/////////////////////////////////wAAAAAAP///////////4AAAB/8AA///////////////////////////////8AAAAAAAAH///////////gAHgPgA9///////////////////////////////8AAAAAAAP/////////////AAAAA/////////////////////////////////+AAAAAAAP/////////////4AD////////////////////////////////////gAAAAAAH/////////////////////////////////////////////////////AAcAAAAf/////////////////////////////////////////////////////////AAf//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////';
const LAND = Uint8Array.from(atob(LAND_B64), c => c.charCodeAt(0));
function isLand(lat, lon) {
  let x = Math.floor(lon + 180); if (x > 359) x = 359; if (x < 0) x = 0;
  let y = Math.floor(90 - lat); if (y > 179) y = 179; if (y < 0) y = 0;
  const i = y * 360 + x;
  return (LAND[i >> 3] >> (7 - (i & 7))) & 1;
}

/* ---------- 经纬度 → 三维坐标 ---------- */
function latLonToVec3(lat, lon, radius = R) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
     radius * Math.cos(phi),
     radius * Math.sin(phi) * Math.sin(theta)
  );
}
function slerpUnit(a, b, t) {
  const omega = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
  if (omega < 1e-6) return a.clone();
  const so = Math.sin(omega);
  return a.clone().multiplyScalar(Math.sin((1 - t) * omega) / so)
          .add(b.clone().multiplyScalar(Math.sin(t * omega) / so));
}

/* ---------- 城市表 ---------- */
const CITIES = [
  { zh: '东京',    en: 'TOKYO',        lat: 35.68,  lon: 139.69  },
  { zh: '大阪',    en: 'OSAKA',        lat: 34.69,  lon: 135.50  },
  { zh: '北京',    en: 'BEIJING',      lat: 39.90,  lon: 116.40  },
  { zh: '上海',    en: 'SHANGHAI',     lat: 31.23,  lon: 121.47  },
  { zh: '香港',    en: 'HONG KONG',    lat: 22.32,  lon: 114.17  },
  { zh: '新加坡',  en: 'SINGAPORE',    lat: 1.35,   lon: 103.82  },
  { zh: '悉尼',    en: 'SYDNEY',       lat: -33.87, lon: 151.21  },
  { zh: '孟买',    en: 'MUMBAI',       lat: 19.08,  lon: 72.88   },
  { zh: '迪拜',    en: 'DUBAI',        lat: 25.20,  lon: 55.27   },
  { zh: '莫斯科',  en: 'MOSCOW',       lat: 55.76,  lon: 37.62   },
  { zh: '伦敦',    en: 'LONDON',       lat: 51.51,  lon: -0.13   },
  { zh: '巴黎',    en: 'PARIS',        lat: 48.86,  lon: 2.35    },
  { zh: '开罗',    en: 'CAIRO',        lat: 30.04,  lon: 31.24   },
  { zh: '纽约',    en: 'NEW YORK',     lat: 40.71,  lon: -74.01  },
  { zh: '洛杉矶',  en: 'LOS ANGELES',  lat: 34.05,  lon: -118.24 },
  { zh: '圣保罗',  en: 'SAO PAULO',    lat: -23.55, lon: -46.63  },
  { zh: '约翰内斯堡', en: 'JOHANNESBURG', lat: -26.20, lon: 28.05 },
  { zh: '墨西哥城',   en: 'MEXICO CITY',  lat: 19.43, lon: -99.13 },
];

/* ---------- 渲染器 / 场景 / 相机 ---------- */
const canvas = document.getElementById('stage');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x030614);

const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 200);
camera.position.set(0, 0.55, 7.5);   // 开场从远处推进

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 1.35;   // 允许拉近触发街道级测绘
controls.maxDistance = 9;
controls.rotateSpeed = 0.45;

/* ---------- 太阳方向 & 灯光 ---------- */
const SUN_POS = new THREE.Vector3(-4.2, 2.4, 5.6);   // 太阳置于镜头前侧上方：昼半球朝向观众，晨昏线纵贯球面
const sunDir = SUN_POS.clone().normalize();

scene.add(new THREE.AmbientLight(0x33445f, 0.55));
const sunLight = new THREE.DirectionalLight(0xfff2dd, 1.35);
sunLight.position.copy(SUN_POS);
scene.add(sunLight);

/* ============================================================
 * 地球组（自转，所有地表元素挂在组内）
 * ============================================================ */
const earthGroup = new THREE.Group();
/* 初始朝向：东京面向镜头（还原视频开场视角） */
{
  const tv = latLonToVec3(35.68, 139.69);
  earthGroup.rotation.y = Math.atan2(-tv.x, tv.z);
}
scene.add(earthGroup);

/* ---------- 昼夜分界线（terminator 大圆环，金色微光，固定于太阳方位） ---------- */
{
  const axis1 = new THREE.Vector3(0, 1, 0).cross(sunDir).normalize();
  if (axis1.lengthSq() < 1e-4) axis1.set(1, 0, 0);
  const axis2 = sunDir.clone().cross(axis1).normalize();
  const pts = [];
  const rr = R * 1.008;
  for (let i = 0; i <= 256; i++) {
    const a = i / 256 * Math.PI * 2;
    pts.push(new THREE.Vector3()
      .addScaledVector(axis1, Math.cos(a) * rr)
      .addScaledVector(axis2, Math.sin(a) * rr));
  }
  const line = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(pts),
    new THREE.LineBasicMaterial({
      color: 0xffc98a, transparent: true, opacity: 0.3,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  scene.add(line);
}

/* ---------- 极光（南北磁纬椭圆上的绿-青色点幕，随呼吸明灭） ---------- */
const auroraMat = (() => {
  const pos = [], sizes = [], phases = [];
  for (const sgn of [1, -1]) {
    for (let k = 0; k < 1100; k++) {
      const lon = Math.random() * 360 - 180;
      const wob = 2.2 * Math.sin(lon * DEG * 3 + sgn * 1.7) + 1.1 * Math.sin(lon * DEG * 7 + sgn);
      const lat = sgn * (65.5 + wob + Math.random() * 4.2);
      const v = latLonToVec3(lat, lon, R * (1.012 + Math.random() * 0.022));
      pos.push(v.x, v.y, v.z);
      sizes.push(0.012 + Math.random() * 0.02);
      phases.push(Math.random() * Math.PI * 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase',   new THREE.Float32BufferAttribute(phases, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 1 }, uTime: { value: 0 } },
    vertexShader: `
      attribute float aSize; attribute float aPhase;
      uniform float uScale; uniform float uTime;
      varying float vA; varying float vPh;
      void main(){
        vPh = aPhase;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float tw = 0.5 + 0.5 * sin(uTime * 0.9 + aPhase * 3.1);
        vA = smoothstep(0.15, 0.9, tw);
        gl_PointSize = aSize * (uScale / -mv.z) * (0.6 + 0.8 * tw);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA; varying float vPh;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        if (dot(uv,uv) > 0.25) discard;
        vec3 col = mix(vec3(0.15, 0.95, 0.55), vec3(0.35, 0.55, 1.0), 0.5 + 0.5 * sin(vPh));
        gl_FragColor = vec4(col, vA * 0.5);
      }`,
  });
  earthGroup.add(new THREE.Points(geo, mat));
  return mat;
})();

/* ---------- 海洋球：NASA 真实贴图（白天 + 夜景灯光） ---------- */
const texLoader = new THREE.TextureLoader();
const dayTex = texLoader.load('lib/tex/day.jpg');
const nightTex = texLoader.load('lib/tex/night.jpg');
if (THREE.sRGBEncoding) { dayTex.encoding = THREE.sRGBEncoding; nightTex.encoding = THREE.sRGBEncoding; }
const ocean = new THREE.Mesh(
  new THREE.SphereGeometry(R, 96, 96),
  new THREE.MeshPhongMaterial({
    map: dayTex,                          // 白天卫星影像
    color: 0xd4dcea,                      // 微压亮度保持深空冷调
    emissive: 0xffe0a0,                   // 夜面城市灯光（夜景贴图自发光）
    emissiveMap: nightTex,
    emissiveIntensity: 0.72,
    specular: 0x1a2740, shininess: 12,    // 海面高光
  })
);
earthGroup.add(ocean);

/* ---------- 云层（叠加球壳，缓慢漂移） ---------- */
const cloudsMesh = new THREE.Mesh(
  new THREE.SphereGeometry(R * 1.018, 64, 64),
  new THREE.MeshPhongMaterial({
    map: texLoader.load('lib/tex/clouds.png'),
    color: 0xd8e2f2,
    transparent: true, opacity: 0.5,
    blending: THREE.AdditiveBlending, depthWrite: false,
  })
);
earthGroup.add(cloudsMesh);

/* ---------- 大气 fresnel 辉光 ---------- */
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(R * 1.06, 64, 64),
  new THREE.ShaderMaterial({
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: { uSunDir: { value: sunDir } },
    vertexShader: `
      varying vec3 vN; varying vec3 vV;
      void main(){
        vec4 wp = modelMatrix * vec4(position,1.0);
        vN = normalize(mat3(modelMatrix) * normal);
        vV = normalize(cameraPosition - wp.xyz);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: `
      uniform vec3 uSunDir;
      varying vec3 vN; varying vec3 vV;
      void main(){
        float f = pow(1.0 - abs(dot(vN, vV)), 2.4);
        /* 晨昏带：朝阳/背阳交界处晕染暖橙，像日出环 */
        float d = dot(normalize(vN), uSunDir);
        float band = smoothstep(0.30, 0.02, abs(d));
        vec3 col = vec3(0.40,0.60,1.0) + vec3(1.0,0.42,0.15) * band * 0.9;
        gl_FragColor = vec4(col * f, f * (0.85 + band * 0.55));
      }`,
  })
);
scene.add(atmosphere);

/* ---------- 大气光晕 sprite ---------- */
function makeGlowTexture(inner, outer, stops) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [p, col] of stops) grad.addColorStop(p, col);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  return tex;
}
const halo = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeGlowTexture('halo', 0, [
    [0.40, 'rgba(70,115,210,0.42)'],
    [0.60, 'rgba(50,88,175,0.20)'],
    [1.0,  'rgba(30,55,120,0)'],
  ]),
  transparent: true, depthWrite: false,
}));
halo.scale.setScalar(R * 6.4);
scene.add(halo);

/* ============================================================
 * 点阵地球
 * ============================================================ */
const dotVert = `
  attribute float aSize; attribute float aPhase;
  uniform float uScale; uniform float uTime;
  uniform vec3 uSunDir;
  varying float vDay; varying float vPhase;
  void main(){
    vec4 wp = modelMatrix * vec4(position,1.0);
    vec3 wn = normalize(mat3(modelMatrix) * normalize(position));
    vDay = dot(wn, uSunDir);
    vPhase = aPhase;
    vec4 mv = viewMatrix * wp;
    gl_PointSize = aSize * (uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }`;

const landFrag = `
  uniform float uTime;
  varying float vDay; varying float vPhase;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    if (dot(uv,uv) > 0.25) discard;
    vec3 dayCol   = vec3(0.85, 0.91, 0.98);
    vec3 nightCol = vec3(0.36, 0.52, 0.80);
    float m = smoothstep(-0.65, 0.5, vDay);
    vec3 col = mix(nightCol, dayCol, m);
    float tw = 0.82 + 0.18 * sin(uTime * 1.7 + vPhase);
    gl_FragColor = vec4(col * tw, 0.92);
  }`;

/* 陆地点：经纬网格采样（半调点阵风格） */
{
  const pos = [], sizes = [], phases = [];
  const step = 1.05;
  for (let lat = -88; lat <= 88; lat += step) {
    const lonStep = step / Math.max(Math.cos(lat * DEG), 0.09);
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (!isLand(lat, lon)) continue;
      const v = latLonToVec3(lat, lon, R * 1.002);
      pos.push(v.x, v.y, v.z);
      sizes.push(0.0082 + Math.random() * 0.003);
      phases.push(Math.random() * Math.PI * 2);
    }
  }
  /* 极地冰盖（白色，覆盖海洋部分） */
  for (const capLat of [1, -1]) {
    for (let lat = 76; lat <= 89; lat += step) {
      const lonStep = step / Math.max(Math.cos(lat * DEG), 0.09);
      for (let lon = -180; lon < 180; lon += lonStep) {
        const v = latLonToVec3(capLat * lat, lon, R * 1.002);
        pos.push(v.x, v.y, v.z);
        sizes.push(0.0088 + Math.random() * 0.003);
        phases.push(Math.random() * Math.PI * 2);
      }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase',   new THREE.Float32BufferAttribute(phases, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: {
      uScale: { value: 1 }, uTime: { value: 0 },
      uSunDir: { value: sunDir },
    },
    vertexShader: dotVert, fragmentShader: landFrag,
  });
  /* 真实贴图模式：点阵陆地层隐藏（保留代码可随时切回） */
  const landPts = new THREE.Points(geo, mat);
  landPts.visible = false;
  earthGroup.add(landPts);
  earthGroup.userData.landMat = mat;
}

/* 海洋微光网格点（极暗） */
{
  const pos = [], sizes = [], phases = [];
  const step = 2.4;
  for (let lat = -84; lat <= 84; lat += step) {
    const lonStep = step / Math.max(Math.cos(lat * DEG), 0.09);
    for (let lon = -180; lon < 180; lon += lonStep) {
      if (isLand(lat, lon)) continue;
      const v = latLonToVec3(lat, lon, R * 1.001);
      pos.push(v.x, v.y, v.z);
      sizes.push(0.005);
      phases.push(Math.random() * Math.PI * 2);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase',   new THREE.Float32BufferAttribute(phases, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uScale: { value: 1 }, uTime: { value: 0 }, uSunDir: { value: sunDir } },
    vertexShader: dotVert,
    fragmentShader: `
      varying float vDay; varying float vPhase;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        if (dot(uv,uv) > 0.25) discard;
        gl_FragColor = vec4(vec3(0.22,0.38,0.66), 0.16);
      }`,
  });
  const seaPts = new THREE.Points(geo, mat);
  seaPts.visible = false;
  earthGroup.add(seaPts);
  earthGroup.userData.seaMat = mat;
}

/* ============================================================
 * 城市灯光（夜面发亮的金色光点）
 * ============================================================ */
const cityFrag = `
  uniform float uTime;
  uniform float uBoost;
  varying float vDay; varying float vPhase;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = dot(uv,uv);
    if (d > 0.25) discard;
    float soft = exp(-d * 9.0);
    float night = 1.0 - smoothstep(-0.4, 0.3, vDay);
    float amp = mix(0.28, 1.0, night) * (1.0 + uBoost * 1.6);
    float tw = 0.75 + 0.25 * sin(uTime * 2.1 + vPhase);
    vec3 col = mix(vec3(1.0, 0.78, 0.42), vec3(1.0, 0.95, 0.8), uBoost * 0.6);
    gl_FragColor = vec4(col * amp * tw * soft, amp * soft);
  }`;

const cityGlowSprites = [];
{
  const pos = [], sizes = [], phases = [];
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  for (const c of CITIES) {
    for (let i = 0; i < 34; i++) {
      const lat = c.lat + gauss() * 2.4;
      const lon = c.lon + gauss() * 2.4 * Math.max(Math.cos(c.lat * DEG), 0.3);
      const v = latLonToVec3(lat, lon, R * 1.004);
      pos.push(v.x, v.y, v.z);
      sizes.push(0.014 + Math.random() * 0.016);
      phases.push(Math.random() * Math.PI * 2);
    }
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeGlowTexture('city', 0, [
        [0,   'rgba(255,196,110,0.55)'],
        [0.4, 'rgba(255,170,80,0.18)'],
        [1,   'rgba(255,150,60,0)'],
      ]),
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    sp.position.copy(latLonToVec3(c.lat, c.lon, R * 1.01));
    sp.scale.setScalar(0.34);
    sp.userData.baseScale = 0.34;
    earthGroup.add(sp);
    cityGlowSprites.push(sp);
  }
  /* 大陆上的零星暖色微光 */
  for (let i = 0; i < 620; i++) {
    const lat = Math.asin(Math.random() * 2 - 1) / DEG;
    const lon = Math.random() * 360 - 180;
    if (!isLand(lat, lon) || Math.abs(lat) > 70) continue;
    const v = latLonToVec3(lat, lon, R * 1.004);
    pos.push(v.x, v.y, v.z);
    sizes.push(0.006 + Math.random() * 0.007);
    phases.push(Math.random() * Math.PI * 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase',   new THREE.Float32BufferAttribute(phases, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 1 }, uTime: { value: 0 }, uSunDir: { value: sunDir }, uBoost: { value: 0 } },
    vertexShader: dotVert, fragmentShader: cityFrag,
  });
  const cityPts = new THREE.Points(geo, mat);
  cityPts.visible = false;   // 夜景贴图已含真实城市灯光，程序化灯光点隐藏
  earthGroup.add(cityPts);
  earthGroup.userData.cityMat = mat;
}

/* ============================================================
 * 星空
 * ============================================================ */
{
  const N = 4200, pos = [], sizes = [], phases = [];
  for (let i = 0; i < N; i++) {
    const r = 34 + Math.random() * 30;
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    pos.push(r * s * Math.cos(a), r * u, r * s * Math.sin(a));
    sizes.push(0.09 + Math.random() * 0.22);
    phases.push(Math.random() * Math.PI * 2);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('aSize',    new THREE.Float32BufferAttribute(sizes, 1));
  geo.setAttribute('aPhase',   new THREE.Float32BufferAttribute(phases, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uScale: { value: 1 }, uTime: { value: 0 }, uSunDir: { value: sunDir } },
    vertexShader: `
      attribute float aSize; attribute float aPhase;
      uniform float uScale; uniform float uTime;
      varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position,1.0);
        gl_PointSize = aSize * (uScale * 0.02) / -mv.z * 8.0;
        vA = 0.72 + 0.28 * sin(uTime * (0.4 + fract(aPhase) * 1.2) + aPhase * 7.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      varying float vA;
      void main(){
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float a = exp(-d * d * 12.0) * vA;
        gl_FragColor = vec4(vec3(0.85, 0.9, 1.0), a);
      }`,
  });
  scene.add(new THREE.Points(geo, mat));
  scene.userData.starMat = mat;
}

/* 远景星云 */
for (const [col, x, y, z, s] of [
  ['rgba(90,70,180,0.055)',  -26, 10, -34, 30],
  ['rgba(40,90,190,0.05)',    30, -6, -30, 26],
  ['rgba(150,60,140,0.04)',   10, 16, -40, 22],
]) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('neb', 0, [[0, col], [1, 'rgba(0,0,0,0)']]),
    transparent: true, depthWrite: false,
  }));
  sp.position.set(x, y, z); sp.scale.setScalar(s);
  scene.add(sp);
}

/* ---------- 太阳 ---------- */
const sunCore = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeGlowTexture('sun', 0, [
    [0,   'rgba(255,250,240,1)'],
    [0.08,'rgba(255,235,195,0.85)'],
    [0.30,'rgba(255,195,115,0.22)'],
    [1,   'rgba(255,165,85,0)'],
  ]),
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
}));
sunCore.position.set(-8.5, 3.6, -6.5);
sunCore.scale.setScalar(3.0);
scene.add(sunCore);

/* ---------- 月球 ---------- */
function makeMoonTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#b7bcc9'; g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 7; i++) {            // 月海
    g.fillStyle = 'rgba(120,128,148,0.5)';
    g.beginPath();
    g.arc(Math.random() * 256, Math.random() * 256, 18 + Math.random() * 26, 0, 7);
    g.fill();
  }
  for (let i = 0; i < 90; i++) {           // 环形山
    const x = Math.random() * 256, y = Math.random() * 256, r = 1.5 + Math.random() * 7;
    g.fillStyle = 'rgba(140,146,162,0.7)';
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = 'rgba(210,214,226,0.5)'; g.lineWidth = 1;
    g.beginPath(); g.arc(x, y, r + 0.5, 0, 7); g.stroke();
  }
  return new THREE.CanvasTexture(c);
}
const moonPivot = new THREE.Group();
moonPivot.rotation.z = 0.18;
scene.add(moonPivot);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.17, 40, 40),
  new THREE.MeshStandardMaterial({ map: makeMoonTexture(), roughness: 1 })
);
moon.position.set(3.6, 0.4, 0.8);
moonPivot.add(moon);

/* ---------- 卫星（3 颗，对应面板「卫星 3 颗」） ---------- */
const satellites = [];
function makeSatellite(radius, inclX, inclZ, speed, phase, color) {
  const orbit = new THREE.Group();
  orbit.rotation.set(inclX, 0, inclZ);
  scene.add(orbit);

  /* 轨道虚线环 */
  const SEG = 128;
  const ringPts = [];
  for (let i = 0; i <= SEG; i++) {
    const a = (i / SEG) * Math.PI * 2;
    ringPts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
  }
  const ring = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(ringPts),
    new THREE.LineDashedMaterial({
      color, dashSize: 0.06, gapSize: 0.05,
      transparent: true, opacity: 0.16,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
  );
  ring.computeLineDistances();
  orbit.add(ring);

  /* 卫星本体：核心 + 太阳能板 */
  const body = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 0.035, 0.055),
    new THREE.MeshStandardMaterial({ color: 0xcfd8e8, emissive: 0x33415c, roughness: 0.5, metalness: 0.6 })
  );
  body.add(core);
  const panelMat = new THREE.MeshStandardMaterial({
    color: 0x2a4a8f, emissive: 0x14264d, roughness: 0.35, metalness: 0.7,
    side: THREE.DoubleSide,
  });
  for (const s of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.032), panelMat);
    panel.position.x = s * 0.062;
    panel.rotation.y = Math.PI / 2;
    body.add(panel);
  }
  orbit.add(body);

  /* 信号闪光 */
  const glint = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('glint', 0, [
      [0, 'rgba(255,255,255,0.9)'],
      [0.25, 'rgba(160,210,255,0.45)'],
      [1, 'rgba(120,180,255,0)'],
    ]),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  glint.scale.setScalar(0.13);
  orbit.add(glint);

  /* 拖尾 */
  const TRAIL = 24;
  const trailGeo = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: TRAIL }, () => new THREE.Vector3())
  );
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({
    color, transparent: true, opacity: 0.35,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  orbit.add(trail);

  const sat = { orbit, body, glint, trail, TRAIL, radius, speed, angle: phase };
  /* 预填拖尾，避免首帧线从地心(0,0,0)画出 */
  const x0 = Math.cos(phase) * radius, y0 = Math.sin(phase) * radius;
  sat.trailPts = Array.from({ length: TRAIL }, () => new THREE.Vector3(x0, y0, 0));
  satellites.push(sat);
  return sat;
}
makeSatellite(R * 1.55, 1.15, 0.35, 0.55, 0.0,        0x8fb8ff);
makeSatellite(R * 1.95, -0.6,  1.0,  0.38, 2.1,       0x9fe8d8);
makeSatellite(R * 2.45, 0.45, -0.75, 0.27, 4.2,       0xffd9a0);

function updateSatellites(dt, t) {
  for (const s of satellites) {
    s.angle += dt * s.speed;
    const x = Math.cos(s.angle) * s.radius, y = Math.sin(s.angle) * s.radius;
    s.body.position.set(x, y, 0);
    s.body.rotation.y = -s.angle;           // 太阳板朝向切线
    s.glint.position.set(x, y, 0);
    s.glint.material.opacity = 0.55 + 0.45 * Math.sin(t * 5 + s.radius * 9);

    /* 拖尾：记录局部坐标，最近 TRAIL 个采样点 */
    s.trailPts.push(new THREE.Vector3(x, y, 0));
    if (s.trailPts.length > s.TRAIL) s.trailPts.shift();
    if (s.trailPts.length >= 2) {
      /* 均匀采样到整条线 */
      const pos = s.trail.geometry.attributes.position;
      const n = pos.count;
      for (let i = 0; i < n; i++) {
        const f = (i / (n - 1)) * (s.trailPts.length - 1);
        const a = s.trailPts[Math.floor(f)], b = s.trailPts[Math.min(s.trailPts.length - 1, Math.ceil(f))];
        const k = f - Math.floor(f);
        pos.setXYZ(i, a.x + (b.x - a.x) * k, a.y + (b.y - a.y) * k, 0);
      }
      pos.needsUpdate = true;
      s.trail.geometry.setDrawRange(0, n);
    }
  }
}

/* ============================================================
 * 航线弧线
 * ============================================================ */
const arcMatProto = new THREE.LineBasicMaterial({
  color: 0x9fc4ff, transparent: true, opacity: 0.24,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
const pulses = [];
const arcs = [];
const HUBS = [0, 0, 0, 2, 3, 1];   // 东京/大阪/北京 为主要枢纽

function makeArc() {
  const from = CITIES[HUBS[Math.floor(Math.random() * HUBS.length)]];
  let to = CITIES[Math.floor(Math.random() * CITIES.length)];
  if (to === from) to = CITIES[(CITIES.indexOf(from) + 3) % CITIES.length];
  const a = latLonToVec3(from.lat, from.lon).normalize();
  const b = latLonToVec3(to.lat, to.lon).normalize();
  const pts = [];
  const SEG = 72;
  for (let i = 0; i <= SEG; i++) {
    const t = i / SEG;
    const p = slerpUnit(a, b, t).multiplyScalar(R * (1 + 0.17 * Math.sin(Math.PI * t)));
    pts.push(p);
  }
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = arcMatProto.clone();
  mat.opacity = 0;
  const line = new THREE.Line(geo, mat);
  earthGroup.add(line);

  const pulse = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('pulse', 0, [
      [0, 'rgba(255,255,255,0.95)'],
      [0.3, 'rgba(180,210,255,0.5)'],
      [1, 'rgba(140,180,255,0)'],
    ]),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  pulse.scale.setScalar(0.09);
  earthGroup.add(pulse);

  const arc = { line, pulse, pts, t: Math.random(), life: 0, maxLife: 5 + Math.random() * 4 };
  arcs.push(arc);
  return arc;
}
for (let i = 0; i < 12; i++) makeArc();

/* ============================================================
 * 流星
 * ============================================================ */
const meteors = [];
const METEOR_POOL = 16;
for (let i = 0; i < METEOR_POOL; i++) {
  const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
  const mat = new THREE.LineBasicMaterial({
    color: 0xcfe2ff, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const line = new THREE.Line(geo, mat);
  line.visible = false;
  scene.add(line);
  meteors.push({ line, mat, active: false, vel: new THREE.Vector3(), life: 0, maxLife: 1 });
}
function spawnMeteor() {
  const m = meteors.find(m => !m.active);
  if (!m) return;
  const r = 4.2 + Math.random() * 2.6;
  const a = Math.random() * Math.PI * 2;
  const y = 1.5 + Math.random() * 3.5;
  const start = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
  const dir = new THREE.Vector3(-0.55 - Math.random() * 0.4, -0.75 - Math.random() * 0.4, (Math.random() - 0.5) * 0.6).normalize();
  const len = 0.9 + Math.random() * 1.2;
  const posAttr = m.line.geometry.attributes.position;
  posAttr.setXYZ(0, start.x, start.y, start.z);
  posAttr.setXYZ(1, start.x - dir.x * len, start.y - dir.y * len, start.z - dir.z * len);
  posAttr.needsUpdate = true;
  m.vel.copy(dir).multiplyScalar(7 + Math.random() * 6);
  m.active = true; m.life = 0; m.maxLife = 0.6 + Math.random() * 0.5;
  m.line.visible = true;
}

/* ============================================================
 * UI 更新
 * ============================================================ */
const $ = id => document.getElementById(id);
const fmt = n => Math.round(n).toLocaleString('en-US');
let sig = 13434;

setInterval(() => {
  const t = Date.now() / 1000;
  const lon = 106.8 + Math.sin(t * 0.021) * 9 + Math.random() * 0.3;
  const lat = 23.3 + Math.cos(t * 0.017) * 6 + Math.random() * 0.3;
  $('v-lon').textContent = lon.toFixed(1) + '° E';
  $('v-lat').textContent = lat.toFixed(1) + '° N';
  $('v-alt').textContent = (6.72 + Math.sin(t * 0.31) * 0.4 + Math.random() * 0.08).toFixed(2) + ' km';
  $('v-pre').textContent = (98.2 + Math.sin(t * 0.11) * 0.9 + Math.random() * 0.3).toFixed(1) + ' kPa';
  sig = Math.max(9000, sig + (Math.random() - 0.48) * 60);
  $('v-route').textContent = fmt(84 + arcs.length);
  const ev = $('v-event');
  if (streetWanted) { ev.textContent = '测绘中'; ev.classList.add('alert'); }
  else if (activeEvent) { ev.textContent = EVENTS[activeEvent.key].zh; ev.classList.add('alert'); }
  else { ev.textContent = '平静'; ev.classList.remove('alert'); }
  $('v-cool').textContent = Math.min(99, 72 + Math.floor(Math.random() * 3 - 1 + flareLevel * 20)) + '%';
  $('v-sig').textContent = fmt(sig * (1 + signalSurge * 0.6));
}, 500);

$('marquee').textContent = (
  'DEEP SPACE CARTOGRAPH · 深空制图仪 · 手控地球计划 第一号 · ' +
  '观测站 263 座在线 · 轨道编队 3 颗 · 数据链路加密中 · 实时测绘中 · '
).repeat(4);

/* 城市聚光 */
const cityTag = $('cityTag');
let spotlightTimer = 0, spotlightCity = -1, tagHold = 0;
function spotlightNext() {
  if (streetWanted) { spotlightTimer = 6.5; return; }   // 街景模式暂停城市轮播大字卡
  const i = Math.floor(Math.random() * CITIES.length);
  spotlightCity = i;
  const c = CITIES[i];
  $('tagZh').textContent = c.zh;
  $('tagEn').textContent = c.en;
  cityTag.classList.add('show');
  const sp = cityGlowSprites[i];
  sp.userData.boost = 1;
  tagHold = 3.4;
  /* 面板天气行：聚光城市的实时天气（带缓存） */
  fetchWeather(i).then(d => {
    if (spotlightCity === i && d) $('v-wx').textContent = `${d.t}°C ${d.w}`;
  });
}
spotlightTimer = 2.5;

/* ============================================================
 * 事件系统：多种随机事件调度（复用流星/城市灯光/弧线/太阳）
 * ============================================================ */
const eventCard = $('eventCard');
const evZh = $('evZh'), evEn = $('evEn');
let showerActive = false, burstTimer = 0;   // 流星雨内部状态（被 updateEvents 驱动）
let overloadLevel = 0;   // 城市过载强度 0~1
let flareLevel = 0;      // 太阳耀斑强度 0~1
let signalSurge = 0;     // 信号风暴强度 0~1

/* 彗星：一个明亮 Sprite + 拖尾线，横穿场景 */
const comet = (() => {
  const grp = new THREE.Group();
  const head = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeGlowTexture('comet', 0, [
      [0, 'rgba(255,255,255,0.95)'],
      [0.25, 'rgba(180,220,255,0.5)'],
      [1, 'rgba(140,190,255,0)'],
    ]),
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  head.scale.setScalar(0.34);
  grp.add(head);
  const tailGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]);
  const tail = new THREE.Line(tailGeo, new THREE.LineBasicMaterial({
    color: 0xbfe0ff, transparent: true, opacity: 0,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  grp.add(tail);
  grp.visible = false;
  scene.add(grp);
  return { grp, head, tail, pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, maxLife: 6, active: false };
})();
function spawnComet() {
  const a = Math.random() * Math.PI * 2;
  const r = 5 + Math.random() * 2;
  comet.pos.set(Math.cos(a) * r, 2 + Math.random() * 2.5, Math.sin(a) * r);
  comet.vel.copy(new THREE.Vector3(-comet.pos.x, -1.2 - Math.random(), -comet.pos.z)).normalize().multiplyScalar(1.6 + Math.random() * 0.8);
  comet.life = 0; comet.maxLife = 6 + Math.random() * 2;
  comet.active = true; comet.grp.visible = true;
}

const EVENTS = {
  shower:   { zh: '流星雨',   en: 'METEOR SHOWER',  dur: 5.5 },
  comet:    { zh: '彗星掠过', en: 'COMET PASSING',  dur: 7.5 },
  overload: { zh: '城市过载', en: 'CITY OVERLOAD',  dur: 5.5 },
  storm:    { zh: '信号风暴', en: 'SIGNAL STORM',   dur: 5 },
  flare:    { zh: '太阳耀斑', en: 'SOLAR FLARE',    dur: 4.5 },
};
const EVENT_KEYS = Object.keys(EVENTS);
let activeEvent = null;        // {key, t, dur}
let nextEventTimer = 12;       // 首个事件稍快出现
if (/#evtest/.test(location.hash)) setTimeout(() => startEvent('overload'), 100);   // 测试钩子：强制触发

function showEventCard(zh, en) {
  evZh.textContent = zh; evEn.textContent = en;
  eventCard.classList.add('show');
  clearTimeout(showEventCard._t);
  showEventCard._t = setTimeout(() => eventCard.classList.remove('show'), 3600);
}
function startEvent(key) {
  const E = EVENTS[key];
  activeEvent = { key, t: 0, dur: E.dur };
  showEventCard(E.zh, E.en);
  playEventSfx(key);
  if (key === 'shower') { showerActive = true; burstTimer = E.dur; }
  else if (key === 'comet') spawnComet();
  else if (key === 'storm') { signalSurge = 1; for (let i = 0; i < 10; i++) makeArc(); }
  else if (key === 'flare') flareLevel = 1;
}
function updateEvents(dt) {
  if (activeEvent) {
    const k = activeEvent.key;
    activeEvent.t += dt;
    const p = activeEvent.t / activeEvent.dur;
    const bell = Math.sin(Math.PI * Math.min(1, p));   // 0→1→0 包络
    if (k === 'overload') overloadLevel = bell;
    if (k === 'storm') signalSurge = bell;
    if (k === 'flare') flareLevel = bell;
    if (activeEvent.t >= activeEvent.dur) {
      if (k === 'shower') showerActive = false;
      overloadLevel = 0; flareLevel = 0; signalSurge = 0;
      activeEvent = null;
    }
  } else {
    nextEventTimer -= dt;
    if (nextEventTimer <= 0) {
      startEvent(EVENT_KEYS[Math.floor(Math.random() * EVENT_KEYS.length)]);
      nextEventTimer = 16 + Math.random() * 16;
    }
  }

  /* 事件视觉效果：城市过载 / 太阳耀斑 */
  earthGroup.userData.cityMat.uniforms.uBoost.value = overloadLevel;
  if (overloadLevel > 0.05) {
    for (const sp of cityGlowSprites) { sp.userData.boost = overloadLevel; }
  }
  sunCore.scale.setScalar(3.0 * (1 + flareLevel * 0.7));
  sunLight.intensity = 1.35 * (1 + flareLevel * 0.9);

  /* 彗星每帧推进（独立于 activeEvent，飞完自动隐藏） */
  if (comet.active) {
    comet.life += dt;
    comet.pos.addScaledVector(comet.vel, dt);
    comet.head.position.copy(comet.pos);
    const tp = comet.tail.geometry.attributes.position;
    for (let i = 0; i < 4; i++) {
      const f = i / 3;
      tp.setXYZ(i, comet.pos.x - comet.vel.x * f * 1.6,
                   comet.pos.y - comet.vel.y * f * 1.6,
                   comet.pos.z - comet.vel.z * f * 1.6);
    }
    tp.needsUpdate = true;
    comet.tail.material.opacity = Math.sin(Math.PI * Math.min(1, comet.life / comet.maxLife)) * 0.55;
    comet.head.material.opacity = comet.tail.material.opacity + 0.3;
    if (comet.life > comet.maxLife) { comet.active = false; comet.grp.visible = false; }
  }
}

/* ============================================================
 * 主循环
 * ============================================================ */
const clock = new THREE.Clock();
const wp = new THREE.Vector3();

function updateScale() {
  const scale = innerHeight / (2 * Math.tan(camera.fov * 0.5 * DEG));
  for (const m of [earthGroup.userData.landMat, earthGroup.userData.seaMat,
                   earthGroup.userData.cityMat, scene.userData.starMat, auroraMat]) {
    m.uniforms.uScale.value = scale;
  }
}
updateScale();

/* ---------- 缩放按钮 ---------- */
let zoomAnim = null;   // 目标相机距离
function zoomStep(f) {
  const r = camera.position.distanceTo(controls.target) * f;
  zoomAnim = THREE.MathUtils.clamp(r, controls.minDistance, controls.maxDistance);
}
$('zoomIn').addEventListener('click', () => {
  /* 已在最近距离 → 进入街道级测绘 */
  if (camera.position.distanceTo(controls.target) < 1.45) { enterStreet(); return; }
  zoomStep(0.72);
});
$('zoomOut').addEventListener('click', () => {
  /* 街景模式：－ = 拉远看更大范围；已在最远(≥2.95)再按一次 → 退出街景 */
  if (streetWanted) {
    if (streetT > 0.98 && camera.position.distanceTo(controls.target) > 2.95) {
      exitStreet(); zoomAnim = 4.5;
    } else {
      zoomStep(1.38);
    }
    return;
  }
  zoomStep(1.38);
});

/* 开场推进结束标志：用户首次交互或超时后停止，避免与缩放/街景相机冲突 */
let introDone = false;
function finishIntro() { introDone = true; }
canvas.addEventListener('pointerdown', finishIntro, { once: true });
canvas.addEventListener('wheel', finishIntro, { once: true });

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;

  /* 开场推进 */
  if (!introDone && t <= 5) {
    const targetZ = 3.35;
    camera.position.z += (targetZ - camera.position.z) * (1 - Math.exp(-dt * 0.8));
  } else {
    introDone = true;
  }
  /* 缩放按钮平滑推进 */
  if (zoomAnim != null) {
    const dir = camera.position.clone().sub(controls.target);
    const next = dir.length() + (zoomAnim - dir.length()) * (1 - Math.exp(-dt * 6));
    if (Math.abs(next - zoomAnim) < 0.004) {
      dir.setLength(zoomAnim);
      zoomAnim = null;
    } else {
      dir.setLength(next);
    }
    camera.position.copy(dir.add(controls.target));
  }
  controls.update();
  gestureTick(dt);
  updateStreet(dt);
  earthGroup.rotation.y += dt * 0.028;
  cloudsMesh.rotation.y += dt * 0.006;   // 云层相对地表缓慢漂移
  atmosphere.rotation.y = earthGroup.rotation.y;

  /* 月球公转 */
  moonPivot.rotation.y += dt * 0.05;
  moon.rotation.y += dt * 0.02;

  /* 卫星 */
  updateSatellites(dt, t);

  /* uniforms */
  for (const m of [earthGroup.userData.landMat, earthGroup.userData.seaMat,
                   earthGroup.userData.cityMat, scene.userData.starMat, auroraMat]) {
    m.uniforms.uTime.value = t;
  }

  /* 搜索定位：地球旋转 + 相机极角缓动 */
  if (locAnim) {
    locAnim.t = Math.min(1, locAnim.t + dt / 1.15);
    const e = 1 - Math.pow(1 - locAnim.t, 3);
    earthGroup.rotation.y = locAnim.from + locAnim.delta * e;
    if (locAnim.t >= 1) locAnim = null;
  }
  if (camAnimPhi) {
    camAnimPhi.t = Math.min(1, camAnimPhi.t + dt / 1.15);
    const e = 1 - Math.pow(1 - camAnimPhi.t, 3);
    const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    sph.phi = camAnimPhi.from + camAnimPhi.delta * e;
    camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(sph));
    if (camAnimPhi.t >= 1) camAnimPhi = null;
  }

  /* 弧线生命周期 */
  for (const arc of arcs) {
    arc.life += dt;
    const fade = Math.min(1, arc.life * 0.8, (arc.maxLife - arc.life) * 0.8);
    arc.line.material.opacity = Math.max(0, 0.22 * fade);
    arc.t += dt * 0.32;
    if (arc.t > 1) { arc.t = 0; }
    const p = arc.pts[Math.floor(arc.t * (arc.pts.length - 1))];
    arc.pulse.position.copy(p);
    arc.pulse.material.opacity = 0.85 * Math.max(0, fade);
    if (arc.life > arc.maxLife) {
      earthGroup.remove(arc.line);
      earthGroup.remove(arc.pulse);
      arc.line.geometry.dispose();
      arcs.splice(arcs.indexOf(arc), 1);
      makeArc();
    }
  }

  /* 事件调度 + 流星 */
  updateEvents(dt);
  if (burstTimer > 0) {
    burstTimer -= dt;
    if (burstTimer <= 0) showerActive = false;
    if (Math.random() < dt * 7) spawnMeteor();
  } else if (Math.random() < dt * 0.7) {
    spawnMeteor();
  }
  for (const m of meteors) {
    if (!m.active) continue;
    m.life += dt;
    const posAttr = m.line.geometry.attributes.position;
    const dx = m.vel.x * dt, dy = m.vel.y * dt, dz = m.vel.z * dt;
    posAttr.setXYZ(0, posAttr.getX(0) + dx, posAttr.getY(0) + dy, posAttr.getZ(0) + dz);
    posAttr.setXYZ(1, posAttr.getX(1) + dx, posAttr.getY(1) + dy, posAttr.getZ(1) + dz);
    posAttr.needsUpdate = true;
    m.mat.opacity = Math.max(0, Math.sin(Math.PI * m.life / m.maxLife)) * 0.9;
    if (m.life > m.maxLife) { m.active = false; m.line.visible = false; }
  }

  /* 城市聚光 */
  spotlightTimer -= dt;
  if (tagHold > 0) tagHold -= dt;
  if (tagHold <= 0 && cityTag.classList.contains('show')) cityTag.classList.remove('show');
  cityGlowSprites.forEach((sp, i) => {
    const boost = sp.userData.boost || 0;
    if (i === spotlightCity && boost > 0) sp.userData.boost = Math.max(0, boost - dt * 0.5);
    else if (boost > 0) sp.userData.boost = Math.max(0, boost - dt * 2);
    sp.scale.setScalar(sp.userData.baseScale * (1 + (sp.userData.boost || 0) * 1.6));
    sp.material.opacity = 0.75 + (sp.userData.boost || 0) * 0.25;
  });
  if (spotlightTimer <= 0) {
    spotlightNext();
    spotlightTimer = 6.5;
  }

  renderer.render(scene, camera);
}

/* ---------- resize ---------- */
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  updateScale();
});

/* ============================================================
 * 手势控制（MediaPipe Hands，按需加载）
 * ============================================================ */
const gBtn = $('gestureBtn');
const gPanel = $('gesturePanel');
const gVideo = $('gvideo');
const gCanvas = $('gcanvas');
const gCtx = gCanvas.getContext('2d');
const gStatus = $('gstatus');

const MP_BASE = './lib/hands';
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('加载失败: ' + src));
    document.head.appendChild(s);
  });
}

const gesture = {
  active: false, hands: null, stream: null, raf: 0, sending: false,
  lastPinch: 0, lastFist: 0, handCount: 0,
};

const HAND_CONNECTIONS = [
  [0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],
  [9,13],[13,14],[14,15],[15,16],[13,17],[17,18],[18,19],[19,20],[0,17],
];

function pinchRatio(lm) {   // 拇指尖(4) 与 食指尖(8) 距离 / 手掌尺寸
  const d = Math.hypot(lm[4].x - lm[8].x, lm[4].y - lm[8].y);
  const palm = Math.hypot(lm[0].x - lm[9].x, lm[0].y - lm[9].y) || 1e-6;
  return d / palm;
}
function openScore(lm) {    // 五指张开程度（指尖到腕关节平均距离 / 掌长）
  let s = 0;
  for (const tip of [8, 12, 16, 20]) {
    s += Math.hypot(lm[tip].x - lm[0].x, lm[tip].y - lm[0].y);
  }
  const palm = Math.hypot(lm[5].x - lm[17].x, lm[5].y - lm[17].y) || 1e-6;
  return (s / 4) / palm;   // 张开 ~1.6+，握拳 ~0.8-
}

function drawOverlay(results) {
  const W = gCanvas.width, H = gCanvas.height;
  gCtx.save();
  gCtx.clearRect(0, 0, W, H);
  gCtx.translate(W, 0); gCtx.scale(-1, 1);   // 镜像
  gCtx.drawImage(results.image, 0, 0, W, H);
  const lm = results.multiHandLandmarks;
  if (lm) for (const hand of lm) {
    gCtx.strokeStyle = 'rgba(130,220,255,0.9)'; gCtx.lineWidth = 1.5;
    for (const [a, b] of HAND_CONNECTIONS) {
      gCtx.beginPath();
      gCtx.moveTo(hand[a].x * W, hand[a].y * H);
      gCtx.lineTo(hand[b].x * W, hand[b].y * H);
      gCtx.stroke();
    }
    gCtx.fillStyle = '#ffd27a';
    for (const p of hand) {
      gCtx.beginPath(); gCtx.arc(p.x * W, p.y * H, 2.2, 0, 7); gCtx.fill();
    }
  }
  gCtx.restore();
}

let camTarget = null;   // {az, pol} 手势驱动的目标视角
let zoomTarget = null;

function applyGestures(results) {
  drawOverlay(results);
  const now = performance.now();
  const lm = results.multiHandLandmarks || [];
  gesture.handCount = lm.length;

  if (lm.length === 1) {
    const h = lm[0];
    const wrist = h[0], mid = h[9];
    const cx = (wrist.x + mid.x) / 2, cy = (wrist.y + mid.y) / 2;
    /* 手在画面中的位置 → 相机方位角/俯仰角（镜像 x） */
    const az = (0.5 - cx) * 3.4 + Math.PI;         // 挥动手臂环绕地球
    const pol = THREE.MathUtils.clamp(0.25 + cy * 2.6, 0.15, Math.PI - 0.15);
    camTarget = { az, pol };

    /* 捏合 → 随机事件 */
    if (pinchRatio(h) < 0.50 && now - gesture.lastPinch > 3000) {
      gesture.lastPinch = now;
      startEvent(EVENT_KEYS[Math.floor(Math.random() * EVENT_KEYS.length)]);
    }
    /* 握拳 → 切换城市聚光 */
    if (pinchRatio(h) >= 0.50 && openScore(h) < 0.95 && now - gesture.lastFist > 1200) {
      gesture.lastFist = now;
      spotlightNext();
      spotlightTimer = 999;   // 手动切换期间暂停自动轮播
    }
  } else if (lm.length >= 2) {
    /* 双掌间距 → 缩放（最近 1.9，避免误触发街景进入阈值 1.7） */
    const a = lm[0][0], b = lm[1][0];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    const d = THREE.MathUtils.clamp(6.4 - dist * 9.0, 1.9, 6.2);
    zoomTarget = d;
  } else {
    camTarget = null; zoomTarget = null;
  }

  gStatus.innerHTML = lm.length === 0 ? '未检测到手 · 将手举到摄像头前'
    : lm.length === 1 ? (pinchRatio(lm[0]) < 0.50 ? '<b>捏合</b> · 释放触发随机事件'
        : openScore(lm[0]) < 0.95 ? '<b>握拳</b> · 切换城市' : '<b>单手</b> · 移动旋转地球')
    : '<b>双手</b> · 开合缩放';
}

function loopDetect() {
  if (!gesture.active) return;
  /* send 是异步且耗时 20~60ms；必须等上一次完成再发，否则任务排队拖垮主线程 */
  if (!gesture.sending && gVideo.readyState >= 2 && window.handsInstance) {
    gesture.sending = true;
    window.handsInstance.send({ image: gVideo })
      .catch(() => {})
      .finally(() => { gesture.sending = false; });
  }
  gesture.raf = requestAnimationFrame(loopDetect);
}

/* 每帧：把手势目标平滑应用到相机 */
const _sph = new THREE.Spherical();
function gestureTick(dt) {
  if (!gesture.active) return;
  /* 街景模式下相机由街景接管，手势只保留检测不驱动相机 */
  if (streetWanted || streetT > 0.02) { camTarget = null; zoomTarget = null; return; }
  if (camTarget) {
    _sph.setFromVector3(camera.position.clone().sub(controls.target));
    let az = _sph.theta, pol = _sph.phi;
    let dAz = camTarget.az - az;
    while (dAz > Math.PI) dAz -= 2 * Math.PI;
    while (dAz < -Math.PI) dAz += 2 * Math.PI;
    az += dAz * (1 - Math.exp(-dt * 6.0));
    pol += (camTarget.pol - pol) * (1 - Math.exp(-dt * 6.0));
    _sph.set(_sph.radius, pol, az);
    camera.position.copy(new THREE.Vector3().setFromSpherical(_sph).add(controls.target));
    controls.update();
  }
  if (zoomTarget != null) {
    _sph.setFromVector3(camera.position.clone().sub(controls.target));
    const r = _sph.radius + (zoomTarget - _sph.radius) * (1 - Math.exp(-dt * 5));
    _sph.radius = r;
    camera.position.copy(new THREE.Vector3().setFromSpherical(_sph).add(controls.target));
    controls.update();
  }
}

async function startGesture() {
  gBtn.classList.add('busy');
  gStatus.textContent = '加载手势模型…';
  gPanel.classList.add('show');
  try {
    await loadScript(`${MP_BASE}/hands.js`);
    const hands = new window.Hands({ locateFile: f => `${MP_BASE}/${f}` });
    hands.setOptions({ maxNumHands: 2, modelComplexity: 0, minDetectionConfidence: 0.55, minTrackingConfidence: 0.62 });
    hands.onResults(applyGestures);
    window.handsInstance = hands;

    gesture.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' } });
    gVideo.srcObject = gesture.stream;
    await gVideo.play();
    gesture.active = true;
    gBtn.classList.remove('busy'); gBtn.classList.add('on');
    gStatus.textContent = '手势控制已激活';
    loopDetect();
  } catch (e) {
    gBtn.classList.remove('busy');
    let msg = '启动失败：' + (e.message || e).toString().slice(0, 40);
    if (location.protocol === 'file:') {
      msg = 'file:// 协议禁止摄像头 · 请双击「启动.command」用 localhost 打开';
    } else if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
      msg = '摄像头权限被拒绝 · 请点击地址栏左侧图标允许后重试';
    } else if (e.name === 'NotFoundError') {
      msg = '未找到摄像头设备';
    }
    gStatus.textContent = msg;
    gesture.active = false;
    if (gesture.stream) { gesture.stream.getTracks().forEach(t => t.stop()); gesture.stream = null; }
    camTarget = null; zoomTarget = null;
    gBtn.classList.remove('on', 'busy');
    setTimeout(() => gPanel.classList.remove('show'), 4000);
  }
}
function stopGesture() {
  gesture.active = false;
  gesture.sending = false;
  cancelAnimationFrame(gesture.raf);
  if (gesture.stream) { gesture.stream.getTracks().forEach(t => t.stop()); gesture.stream = null; }
  camTarget = null; zoomTarget = null;
  gBtn.classList.remove('on', 'busy');
  gPanel.classList.remove('show');
  spotlightTimer = 6.5;   // 恢复城市自动轮播
}
gBtn.addEventListener('click', () => gesture.active ? stopGesture() : startGesture());
if (location.hash === '#auto') startGesture();

/* ============================================================
 * 街道级测绘（街景下钻）
 * ============================================================ */
let streetWanted = false;   // 目标状态：true=街景 false=轨道
let streetT = 0;            // 过渡进度 0→1
let streetBuilt = false;    // 街景内容是否已懒构建
let streetSave = null;      // 进入街景前的相机/UI 状态快照
const streetUniforms = { uTime: { value: 0 }, uK: { value: 1 } };   // uK=平面相对 z17 基准的尺寸比例
const drones = [];          // 低空测绘无人机光点
let imageMat = null;        // 卫星影像平面材质（淡入用）
let imgReadyAt = 0;         // 影像就绪时刻（performance.now）
let streetCityIdx = -1;     // 当前街景城市索引
let streetImagePlane = null;// 影像平面网格
let streetOverlay = null;   // 科幻叠加层网格
let streetLevel = 0;        // 当前瓦片 zoom 级别
let streetReqSeq = 0;       // 瓦片请求序号（防异步竞态）
let streetOffline = false;  // 瓦片整体加载失败 → 程序化回退
const tileCache = {};       // `城市索引_z级别` → 拼接 canvas 缓存
const TILE_N = 5, TILE_PX = 256;

/* 缩放-层级映射（slippy 数学，东京纬度）：
 *   地面分辨率 res(z)=156543.03·cos(lat)/2^z m/px，5×5 瓦片覆盖 G=1280·res：
 *   z17≈1243m → 平面 7×7（约 178 米/单位）
 *   z18≈ 621m → 平面 3.5×3.5（约 177 米/单位）
 *   z19≈ 311m → 平面 2.5×2.5（约 124 米/单位，刻意过采样 → 近景单栋建筑/街道清晰）
 *   相机距离 1.2~1.6 用 z19，1.6~2.3 用 z18，>2.3 用 z17。 */
function streetZoomForDist(d) { return d < 1.6 ? 19 : d <= 2.3 ? 18 : 17; }
function planeSizeForZ(z) { return z === 19 ? 2.5 : z === 18 ? 3.5 : 7; }
const LEVEL_NAME = { 17: '远景', 18: '中景', 19: '近景' };

/* 平滑缓动 */
function streetEase() {
  const x = THREE.MathUtils.clamp(streetT, 0, 1);
  return x * x * (3 - 2 * x);
}

/* 街景根节点（挂在 scene 原点） */
const streetGroup = new THREE.Group();
streetGroup.visible = false;
streetGroup.scale.setScalar(1e-4);
scene.add(streetGroup);

/* ---------- slippy 瓦片坐标（标准 Web 墨卡托公式） ---------- */
function latLonToTile(lat, lon, z) {
  const x = Math.floor((lon + 180) / 360 * Math.pow(2, z));
  const latRad = lat * DEG;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * Math.pow(2, z));
  return { x, y };
}

/* ---------- 拉取 5×5 瓦片拼成 1280×1280 canvas（按 城市+级别 缓存） ---------- */
function loadCityTiles(idx, z) {
  const key = idx + '_' + z;
  if (tileCache[key]) return Promise.resolve(tileCache[key]);
  const c = CITIES[idx];
  const t = latLonToTile(c.lat, c.lon, z);
  const x0 = t.x - ((TILE_N - 1) >> 1), y0 = t.y - ((TILE_N - 1) >> 1);
  const cv = document.createElement('canvas');
  cv.width = cv.height = TILE_N * TILE_PX;
  const g = cv.getContext('2d');
  g.fillStyle = '#0a1322'; g.fillRect(0, 0, cv.width, cv.height);
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  let failed = 0;
  const jobs = [];
  for (let r = 0; r < TILE_N; r++) {
    for (let col = 0; col < TILE_N; col++) {
      const tx = x0 + col, ty = y0 + r;
      const url = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${ty}/${tx}`;
      jobs.push(loader.loadAsync(url).then(tex => {
        /* 从已加载纹理的 Image 元素取像素逐格拼贴（高级别瓦片阴影更重，提亮系数随 z 加大） */
        g.save();
        g.filter = `brightness(${1.85 + (z - 17) * 0.75}) saturate(1.18) contrast(1.06)`;
        g.drawImage(tex.image, col * TILE_PX, r * TILE_PX, TILE_PX, TILE_PX);
        g.restore();
        tex.dispose();
      }).catch(() => { failed++; }));
    }
  }
  return Promise.all(jobs).then(() => {
    if (failed > 8) throw new Error('tiles mostly failed: ' + failed);
    tileCache[key] = cv;
    return cv;
  });
}

/* ---------- 提示条文案（含当前层级） ---------- */
function updateStreetChip() {
  const c = CITIES[streetCityIdx];
  if (streetOffline) {
    $('streetChip').textContent = `▼ 离线 · 程序化街景 · ${c.zh} ${c.en} · ESC 返回轨道`;
  } else if (!streetLevel) {
    $('streetChip').textContent = `▼ 获取卫星影像 · ${c.zh} ${c.en} …`;
  } else {
    $('streetChip').textContent =
      `▼ 卫星实景 · ${c.zh} ${c.en} · ${LEVEL_NAME[streetLevel]} z${streetLevel} · ESC 返回轨道`;
  }
}

/* ---------- 按当前相机距离同步瓦片层级（加载中保持旧影像） ---------- */
function syncStreetLevel(force) {
  if (!streetWanted || streetOffline) return;
  const d = camera.position.distanceTo(controls.target);
  const z = streetZoomForDist(d);
  if (!force && z === streetLevel) return;
  streetLevel = z;
  updateStreetChip();
  const seq = ++streetReqSeq;
  loadCityTiles(streetCityIdx, z).then(cv => {
    if (seq === streetReqSeq && streetWanted) applyStreetImage(cv, z);
  }).catch(() => {
    if (seq !== streetReqSeq) return;
    streetOffline = true;
    if (streetGround) streetGround.visible = true;
    updateStreetChip();
    renderer.render(scene, camera);
  });
}

/* ---------- 把拼接 canvas 贴到影像平面并淡入（z=瓦片级别） ---------- */
let streetImgTex = null;
let streetGround = null;    // 程序化垫底（影像就绪后隐藏）
function applyStreetImage(cv, z) {
  if (streetImgTex) streetImgTex.dispose();
  streetImgTex = new THREE.CanvasTexture(cv);
  streetImgTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  imageMat.map = streetImgTex;
  imageMat.needsUpdate = true;
  /* 平面尺寸随级别缩放：z 每 +1 覆盖范围减半，贴图细节翻倍 */
  const k = planeSizeForZ(z) / 7;
  streetImagePlane.scale.setScalar(k);
  streetOverlay.scale.setScalar(k);
  streetUniforms.uK.value = k;   // 叠加层网格/脉冲尺度同步，避免拉伸
  imgReadyAt = performance.now();
  if (streetGround) streetGround.visible = false;   // 立即隐藏程序化垫底，避免亮线透出
  updateStreetChip();
  /* 淡入用 setTimeout 自驱动（无头/后台标签 rAF 被节流时也能完成），约 0.8 秒 */
  (function fadeIn() {
    const t = Math.min((performance.now() - imgReadyAt) / 800, 1);
    imageMat.opacity = t;
    renderer.render(scene, camera);
    if (t < 1) setTimeout(fadeIn, 33);
  })();
}

/* ---------- 懒构建街景内容 ---------- */
function buildStreet() {
  if (streetBuilt) return;
  streetBuilt = true;

  /* 程序化地面垫底：深色沥青 + 青色发光路网 + 扫描脉冲环（影像未就绪/离线时可见） */
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(3.6, 96),
    new THREE.ShaderMaterial({
      uniforms: streetUniforms,
      extensions: { derivatives: true },   // fwidth 抗锯齿需要
      vertexShader: `
        varying vec2 vXZ;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vXZ = wp.xz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vXZ;
        void main(){
          float px = max(fwidth(vXZ.x), fwidth(vXZ.y)) + 1e-5;
          /* 路网网格：间距 0.5，fwidth 抗锯齿 */
          vec2 g = abs(fract(vXZ / 0.5) - 0.5) * 0.5;
          float line = 1.0 - smoothstep(px * 0.6, px * 2.0, min(g.x, g.y));
          /* 主干道：每 2 格（间距 1.0）加亮 */
          vec2 G = abs(fract(vXZ) - 0.5);
          float major = 1.0 - smoothstep(px * 0.9, px * 2.8, min(G.x, G.y));
          float len = length(vXZ);
          /* 从中心向外的扫描脉冲环 */
          float pulse = smoothstep(0.55, 1.0, sin(len * 8.0 - uTime * 2.0)) * exp(-len * 0.30);
          vec3 col = vec3(0.024, 0.045, 0.085);
          col += vec3(0.10, 0.42, 0.55) * line * 0.55;
          col += vec3(0.16, 0.62, 0.78) * major * 0.85;
          col += vec3(0.22, 0.85, 0.95) * pulse * (line * 0.75 + major * 0.5);
          gl_FragColor = vec4(col, 1.0);
        }`,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.03;
  streetGroup.add(ground);
  streetGround = ground;

  /* ---------- 真实卫星影像平面（尺寸随瓦片级别缩放，淡入） ---------- */
  imageMat = new THREE.MeshBasicMaterial({
    transparent: true, opacity: 0, depthWrite: false,
  });
  const imagePlane = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), imageMat);
  imagePlane.rotation.x = -Math.PI / 2;
  imagePlane.position.y = -0.02;
  streetGroup.add(imagePlane);
  streetImagePlane = imagePlane;

  /* ---------- 科幻叠加层：青色脉冲环 + 微弱网格 + 圆形渐隐遮罩 ---------- */
  const overlay = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 7),
    new THREE.ShaderMaterial({
      uniforms: streetUniforms,
      transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      extensions: { derivatives: true },
      vertexShader: `
        varying vec2 vXZ;
        void main(){
          vec4 wp = modelMatrix * vec4(position,1.0);
          vXZ = wp.xz;
          gl_Position = projectionMatrix * viewMatrix * wp;
        }`,
      fragmentShader: `
        uniform float uTime;
        uniform float uK;      // 平面尺寸比例：换算到 z17 参考空间，图案随平面同步缩放
        varying vec2 vXZ;
        void main(){
          vec2 p = vXZ / max(uK, 1e-4);
          float len = length(p);
          /* 圆形渐隐遮罩：边缘淡出，遮住方形接缝 */
          float mask = (1.0 - smoothstep(2.7, 3.5, len)) * smoothstep(0.0, 0.25, len);
          /* 微弱测绘网格：参考空间间距 0.5 */
          float px = max(fwidth(p.x), fwidth(p.y)) + 1e-5;
          vec2 g = abs(fract(p / 0.5) - 0.5) * 0.5;
          float grid = 1.0 - smoothstep(px * 0.6, px * 2.0, min(g.x, g.y));
          /* 从中心向外的扫描脉冲环 */
          float pulse = smoothstep(0.6, 1.0, sin(len * 8.0 - uTime * 2.0));
          vec3 col = vec3(0.10, 0.45, 0.58) * grid * 0.03
                   + vec3(0.20, 0.80, 0.95) * pulse * 0.08;
          gl_FragColor = vec4(col * mask, mask * (grid * 0.05 + pulse * 0.15));
        }`,
    })
  );
  overlay.rotation.x = -Math.PI / 2;
  overlay.position.y = 0.005;
  streetGroup.add(overlay);
  streetOverlay = overlay;

  /* ---------- 低空测绘无人机光点 ---------- */
  const droneTex = makeGlowTexture('drone', 0, [
    [0, 'rgba(200,250,255,0.9)'], [0.25, 'rgba(110,220,255,0.45)'], [1, 'rgba(80,180,240,0)'],
  ]);
  for (let i = 0; i < 5; i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: droneTex, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    sp.scale.setScalar(0.09);
    drones.push({ sp, ph: Math.random() * 7, r: 1.0 + Math.random() * 1.8 });
    streetGroup.add(sp);
  }
}

/* ---------- 进入 / 退出 ---------- */
function enterStreet() {
  if (streetWanted) return;
  buildStreet();
  introDone = true;   // 停止开场推进，避免相机被拉走
  camTarget = null; zoomTarget = null;   // 释放手势对相机的控制
  if (!streetSave) {
    streetSave = {
      target: controls.target.clone(),
      pos: camera.position.clone(),
      obs: $('v-obs').textContent,
    };
  }
  streetCityIdx = spotlightCity >= 0 ? spotlightCity : 0;
  const c = CITIES[streetCityIdx];
  cityTag.classList.remove('show');   // 隐藏城市轮播大字卡，避免浮在街景上
  $('infoCard').classList.remove('show');
  updateStreetChip();
  $('v-obs').textContent = `街道级 · ${c.zh}`;
  streetWanted = true;
  scene.fog = new THREE.FogExp2(0x050a18, 0.10);
  /* 相机摆位：距离 1.7（中景 z18），俯角约 53°，让卫星影像占据画面主体 */
  const dir = new THREE.Vector3(0.2, 1.35, 1).normalize();
  controls.target.set(0, 0.1, 0);
  camera.position.copy(controls.target).addScaledVector(dir, 1.7);
  controls.minDistance = 1.2;   // 街景内滚轮/按钮 = 观察地景的远近
  controls.maxDistance = 3.0;
  zoomAnim = null;
  /* 按当前距离拉取对应层级瓦片；失败回退程序化街景 */
  streetOffline = false;
  streetLevel = 0;
  if (imageMat) imageMat.opacity = 0;   // 影像就绪前先显示程序化垫底
  if (streetGround) streetGround.visible = true;
  syncStreetLevel(true);
}
function exitStreet() {
  if (!streetWanted) return;
  streetWanted = false;
  $('streetChip').classList.remove('show');
}

/* ---------- 每帧更新：过渡缓动 + 进入检测 + 层级同步 + 无人机动画 ---------- */
const FADE_TARGETS = [earthGroup, atmosphere, moonPivot];
function updateStreet(dt) {
  /* 轨道模式下拉近到阈值 → 自动进入 */
  if (!streetWanted && streetT < 0.02 && introDone &&
      camera.position.distanceTo(controls.target) < 1.7) {
    enterStreet();
  }
  /* 街景内滚轮改变相机距离 → 按距离切换瓦片层级（退出改为显式：ESC/提示条/最远再按－） */
  if (streetWanted && streetT > 0.98) syncStreetLevel();

  const speed = 1 / 1.2;   // 约 1.2 秒完成过渡
  streetT = THREE.MathUtils.clamp(streetT + (streetWanted ? speed : -speed) * dt, 0, 1);
  const e = streetEase();
  const s = Math.max(Math.pow(1 - e, 2), 1e-4);
  const earthVis = e < 0.999;
  for (const o of FADE_TARGETS) { o.scale.setScalar(s); o.visible = earthVis; }
  for (const sat of satellites) { sat.orbit.scale.setScalar(s); sat.orbit.visible = earthVis; }
  halo.scale.setScalar(R * 6.4 * s);   halo.visible = earthVis;
  sunCore.scale.setScalar(3.0 * s);    sunCore.visible = earthVis;
  streetGroup.visible = e > 0.001;
  streetGroup.scale.setScalar(Math.max(e, 1e-4));

  streetUniforms.uTime.value += dt;
  if (streetGroup.visible) {
    const tt = streetUniforms.uTime.value;
    for (const d of drones) {
      d.sp.position.set(
        Math.sin(tt * 0.3 + d.ph) * d.r,
        0.5 + Math.sin(tt * 0.5 + d.ph * 2) * 0.08,
        Math.cos(tt * 0.22 + d.ph) * d.r
      );
    }
  }
  $('streetChip').classList.toggle('show', streetT > 0.5);

  /* 过渡完全退出：恢复相机 / 雾 / 缩放范围 / 面板 */
  if (!streetWanted && streetT <= 0 && streetSave) {
    scene.fog = null;
    controls.minDistance = 1.35;
    controls.maxDistance = 9;
    const dir = streetSave.pos.clone().sub(streetSave.target);
    if (dir.lengthSq() < 1e-6) dir.set(0, 0.55, 3);
    const dist = Math.max(dir.length(), 2.9);   // 避免退出后立即再触发进入
    controls.target.copy(streetSave.target);
    camera.position.copy(streetSave.target).addScaledVector(dir.normalize(), dist);
    $('v-obs').textContent = streetSave.obs;
    streetSave = null;
    zoomAnim = null;
  }
}

/* ---------- 触发源：双击 / 双指轻点 / ESC / 点击提示条 ---------- */
canvas.addEventListener('dblclick', () => enterStreet());
/* 移动端 Safari 不派发 dblclick：双指快速轻点作为等效手势 */
canvas.addEventListener('touchend', e => {
  const now = performance.now();
  if (e.touches.length === 0 && e.changedTouches.length === 2) {
    if (now - (gesture._twoTapAt || 0) < 350) { enterStreet(); e.preventDefault(); }
    gesture._twoTapAt = now;
  }
}, { passive: false });
$('streetChip').addEventListener('click', () => exitStreet());
addEventListener('keydown', e => { if (e.key === 'Escape') exitStreet(); });

if (location.hash === '#street') { enterStreet(); streetT = 1; }   // 测试钩子：默认中景
if (location.hash === '#street-z19') {                              // 测试钩子：强制最近距离 z19
  enterStreet(); streetT = 1;
  const dir = new THREE.Vector3(0.2, 1.35, 1).normalize();
  camera.position.copy(controls.target).addScaledVector(dir, 1.4);
  syncStreetLevel(true);
}

/* ============================================================
 * 实时数据：Open-Meteo 天气 + OpenSky 航班（免费公开 API，失败静默降级）
 * ============================================================ */
const WT_CODES = {
  0:'晴', 1:'大致晴', 2:'多云', 3:'阴', 45:'雾', 48:'雾凇',
  51:'毛毛雨', 53:'毛毛雨', 55:'密毛毛雨', 56:'冻毛毛雨', 57:'冻毛毛雨',
  61:'小雨', 63:'中雨', 65:'大雨', 66:'冻雨', 67:'冻雨',
  71:'小雪', 73:'中雪', 75:'大雪', 77:'雪粒',
  80:'阵雨', 81:'阵雨', 82:'强阵雨', 85:'阵雪', 86:'阵雪',
  95:'雷暴', 96:'雷暴·冰雹', 99:'雷暴·冰雹',
};
const weatherCache = {};
function fetchWeather(i) {
  if (weatherCache[i] && Date.now() - weatherCache[i].at < 30 * 60 * 1000) {
    return Promise.resolve(weatherCache[i].d);
  }
  const c = CITIES[i];
  const ctl = new AbortController();
  const tid = setTimeout(() => ctl.abort(), 5000);
  return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weather_code,wind_speed_10m`, { signal: ctl.signal })
    .then(r => { if (!r.ok) throw 0; return r.json(); })
    .then(j => {
      const cur = j.current || {};
      const d = { t: Math.round(cur.temperature_2m), w: WT_CODES[cur.weather_code] || '—', wind: Math.round(cur.wind_speed_10m) };
      weatherCache[i] = { at: Date.now(), d };
      return d;
    })
    .catch(() => null)
    .finally(() => clearTimeout(tid));
}

let flightsReal = false;
function fetchFlights(i) {
  const c = CITIES[i];
  const d = 8;
  const ctl = new AbortController();
  const tid = setTimeout(() => ctl.abort(), 6000);
  return fetch(`https://opensky-network.org/api/states/all?lamin=${(c.lat - d).toFixed(1)}&lamax=${(c.lat + d).toFixed(1)}&lomin=${(c.lon - d).toFixed(1)}&lomax=${(c.lon + d).toFixed(1)}`, { signal: ctl.signal })
    .then(r => { if (!r.ok) throw 0; return r.json(); })
    .then(j => {
      const n = j && j.states ? j.states.length : 0;
      flightsReal = true;
      $('v-fly').textContent = fmt(n) + ' 架';
      $('v-fly').classList.add('alert');
      return n;
    })
    .catch(() => null)
    .finally(() => clearTimeout(tid));
}
/* 航班轮询：OpenSky 匿名接口有每日配额，5 分钟一次 + 首次延迟拉取 */
setInterval(() => {
  if (spotlightCity >= 0 && !document.hidden) fetchFlights(spotlightCity);
}, 300000);
setTimeout(() => { if (spotlightCity >= 0) fetchFlights(spotlightCity); }, 4000);

/* ============================================================
 * 搜索定位 + 城市信息卡
 * ============================================================ */
let locAnim = null, camAnimPhi = null;
function locateCity(i) {
  if (streetWanted) { exitStreet(); streetT = 0.02; }
  introDone = true; zoomAnim = null; locAnim = null; camAnimPhi = null;
  /* 相机太近会误触发街景，先拉回安全距离 */
  if (camera.position.distanceTo(controls.target) < 2.4) zoomAnim = 3.4;
  spotlightCity = i;
  const c = CITIES[i];
  $('tagZh').textContent = c.zh; $('tagEn').textContent = c.en;
  cityTag.classList.add('show'); tagHold = 4.2;
  cityGlowSprites[i].userData.boost = 1;
  const v = latLonToVec3(c.lat, c.lon);
  const target = Math.atan2(-v.x, v.z);
  let delta = target - earthGroup.rotation.y;
  delta = ((delta + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  locAnim = { from: earthGroup.rotation.y, delta, t: 0 };
  const sph = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  const targetPhi = THREE.MathUtils.clamp((90 - c.lat) * DEG, 0.45, Math.PI - 0.45);
  let pd = targetPhi - sph.phi;
  pd = ((pd + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
  camAnimPhi = { from: sph.phi, delta: pd, t: 0 };
  openInfo(i);
}
function tryLocate(q) {
  q = (q || '').trim().toLowerCase();
  if (!q) return;
  const i = CITIES.findIndex(c => c.zh.includes(q) || c.en.toLowerCase().includes(q));
  if (i >= 0) { locateCity(i); return true; }
  return false;
}
$('citySearch').addEventListener('keydown', e => {
  if (e.key === 'Enter') { tryLocate(e.target.value); e.target.blur(); }
});
$('citySearch').addEventListener('change', e => { if (tryLocate(e.target.value)) e.target.value = ''; });

/* ---------- 城市信息卡 ---------- */
let infoIdx = -1;
function openInfo(i) {
  infoIdx = i;
  const c = CITIES[i];
  $('icZh').textContent = c.zh;
  $('icEn').textContent = c.en;
  $('icPos').textContent = `${Math.abs(c.lat).toFixed(1)}°${c.lat >= 0 ? 'N' : 'S'} ${Math.abs(c.lon).toFixed(1)}°${c.lon >= 0 ? 'E' : 'W'}`;
  $('icWx').textContent = '获取中…';
  $('icFly').textContent = '—';
  $('infoCard').classList.add('show');
  updateInfoTime();
  fetchWeather(i).then(d => {
    if (infoIdx === i) $('icWx').textContent = d ? `${d.t}°C · ${d.w} · 风 ${d.wind} km/h` : '离线';
  });
  if (flightsReal) $('icFly').textContent = $('v-fly').textContent;
  else fetchFlights(i).then(n => { if (infoIdx === i && n != null) $('icFly').textContent = fmt(n) + ' 架'; });
}
function updateInfoTime() {
  if (infoIdx < 0) return;
  const c = CITIES[infoIdx];
  const offset = Math.round(c.lon / 15);
  const d = new Date(Date.now() + offset * 3600 * 1000);
  $('icTime').textContent =
    `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}` +
    ` UTC${offset >= 0 ? '+' : ''}${offset}`;
}
$('icClose').addEventListener('click', () => { infoIdx = -1; $('infoCard').classList.remove('show'); });
/* 信息卡当地时间随面板 500ms 刷新一起更新 */
setInterval(updateInfoTime, 1000);

/* ---------- 点击拾取城市（拖拽超过 7px 不算点击） ---------- */
{
  const hitMeshes = CITIES.map((c, i) => {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    m.position.copy(latLonToVec3(c.lat, c.lon, R * 1.01));
    m.userData.idx = i;
    earthGroup.add(m);
    return m;
  });
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downPos = null;
  canvas.addEventListener('pointerdown', e => { downPos = [e.clientX, e.clientY]; });
  canvas.addEventListener('pointerup', e => {
    if (!downPos) return;
    const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
    downPos = null;
    if (moved > 7 || streetWanted) return;
    ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hits = ray.intersectObjects(hitMeshes);
    if (hits.length) openInfo(hits[0].object.userData.idx);
    else if (!$('infoCard').contains(e.target)) { infoIdx = -1; $('infoCard').classList.remove('show'); }
  });
}

/* ============================================================
 * 程序化音效（WebAudio 合成，无外部文件；点按钮开启）
 * ============================================================ */
let AC = null, master = null, sfxOn = false;
function ensureAudio() {
  if (AC) return true;
  try {
    AC = new (window.AudioContext || window.webkitAudioContext)();
    master = AC.createGain();
    master.gain.value = 0;
    master.connect(AC.destination);
    return true;
  } catch { return false; }
}
function noiseBuffer(sec) {
  const b = AC.createBuffer(1, Math.floor(AC.sampleRate * sec), AC.sampleRate);
  const d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return b;
}
function startAmbient() {
  if (startAmbient._on || !AC) return;
  startAmbient._on = true;
  const g = AC.createGain(); g.gain.value = 0.05; g.connect(master);
  const o1 = AC.createOscillator(); o1.type = 'sine'; o1.frequency.value = 54;
  const o2 = AC.createOscillator(); o2.type = 'sine'; o2.frequency.value = 54.6;
  const og = AC.createGain(); og.gain.value = 0.5;
  o1.connect(og); o2.connect(og); og.connect(g);
  const ns = AC.createBufferSource(); ns.buffer = noiseBuffer(4); ns.loop = true;
  const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 0.6;
  const ng = AC.createGain(); ng.gain.value = 0.035;
  ns.connect(bp); bp.connect(ng); ng.connect(g);
  const lfo = AC.createOscillator(); lfo.frequency.value = 0.07;
  const lg = AC.createGain(); lg.gain.value = 0.018;
  lfo.connect(lg); lg.connect(ng.gain);
  o1.start(); o2.start(); ns.start(); lfo.start();
}
function sfxToggle() {
  if (!ensureAudio()) return;
  if (AC.state === 'suspended') AC.resume();
  sfxOn = !sfxOn;
  master.gain.linearRampToValueAtTime(sfxOn ? 0.5 : 0, AC.currentTime + 0.4);
  if (sfxOn) startAmbient();
  $('sfxBtn').classList.toggle('on', sfxOn);
  $('sfxLabel').textContent = sfxOn ? '音效开' : '音效关';
}
$('sfxBtn').addEventListener('click', sfxToggle);
function playEventSfx(key) {
  if (!sfxOn || !AC || AC.state !== 'running') return;
  const t0 = AC.currentTime;
  if (key === 'shower' || key === 'comet') {
    const s = AC.createBufferSource(); s.buffer = noiseBuffer(2.2);
    const f = AC.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(key === 'comet' ? 1400 : 2400, t0);
    f.frequency.exponentialRampToValueAtTime(160, t0 + 2);
    const g = AC.createGain();
    g.gain.setValueAtTime(0.0, t0);
    g.gain.linearRampToValueAtTime(0.5, t0 + 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 2.1);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t0); s.stop(t0 + 2.2);
  } else if (key === 'flare') {
    const o = AC.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 42;
    const f = AC.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180;
    const g = AC.createGain();
    g.gain.setValueAtTime(0.001, t0);
    g.gain.linearRampToValueAtTime(0.6, t0 + 0.9);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 3.4);
    o.connect(f); f.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + 3.5);
  } else if (key === 'storm') {
    for (let k = 0; k < 7; k++) {
      const ts = t0 + k * 0.22 + Math.random() * 0.06;
      const s = AC.createBufferSource(); s.buffer = noiseBuffer(0.09);
      const f = AC.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 1800;
      const g = AC.createGain();
      g.gain.setValueAtTime(0.35, ts);
      g.gain.exponentialRampToValueAtTime(0.001, ts + 0.08);
      s.connect(f); f.connect(g); g.connect(master);
      s.start(ts);
    }
  } else if (key === 'overload') {
    [523, 659, 784].forEach((fr, k) => {
      const ts = t0 + k * 0.12;
      const o = AC.createOscillator(); o.type = 'triangle'; o.frequency.value = fr;
      const g = AC.createGain();
      g.gain.setValueAtTime(0.0001, ts);
      g.gain.exponentialRampToValueAtTime(0.3, ts + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ts + 1.6);
      o.connect(g); g.connect(master);
      o.start(ts); o.stop(ts + 1.7);
    });
  }
}

animate();

})();
