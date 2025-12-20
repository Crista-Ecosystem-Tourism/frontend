import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform vec3 uColorWater;
uniform vec3 uColorLand;

// Simplex 3D Noise 
// by Ian McEwan, Ashima Arts
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

float snoise(vec3 v){ 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

// Permutations
  i = mod(i, 289.0 ); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients
// ( N*N points uniformly over a square, mapped onto an octahedron.)
  float n_ = 1.0/7.0; // N=7
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
    // Pixelate
    float pixels = 60.0;
    vec2 p_uv = floor(vUv * pixels) / pixels;
    
    // Rotating noise coordinate
    vec3 noiseCoord = vPosition * 2.0;
    float time = uTime * 0.1;
    
    // Rotate noise to simulate planet rotation against the frame
    float c = cos(time);
    float s = sin(time);
    mat2 rot = mat2(c, -s, s, c);
    noiseCoord.xz = rot * noiseCoord.xz;

    float n = snoise(noiseCoord);
    
    // Threshold for land vs water
    vec3 color = uColorWater;
    if (n > 0.05) {
        color = uColorLand;
    }
    
    // Basic lighting
    vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
    float diff = max(dot(vNormal, lightDir), 0.0);
    
    // Cel shading steps
    float steps = 3.0;
    diff = floor(diff * steps) / steps;
    
    // Ambient
    float ambient = 0.4;
    
    vec3 finalColor = color * (diff + ambient);
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`

const Planet = () => {
    const meshRef = useRef<THREE.Mesh>(null)

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColorWater: { value: new THREE.Color('#4F46E5') }, // Indigo-600
            uColorLand: { value: new THREE.Color('#10B981') },  // Emerald-500
        }),
        []
    )

    useFrame((state) => {
        const { clock } = state
        if (meshRef.current) {
            // meshRef.current.rotation.y = clock.getElapsedTime() * 0.1
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime()
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]} scale={2.5}>
            <icosahedronGeometry args={[1, 4]} /> {/* Higher detail geometry for sphere */}
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    )
}

// Add a pixelated cloud layer slightly larger
const Clouds = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
        }),
        []
    )

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
            // Oscilate scale slightly
            // meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.getElapsedTime()) * 0.02)
        }
    })

    // Simple transparent cloud shader
    const cloudVertex = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
             vUv = uv;
             vPosition = position;
             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `
    const cloudFragment = `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float uTime;
        
        // Simplex noise (reusing same function or simplified for clouds)
        // ... include snoise function ...
        vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
        vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
        float snoise(vec3 v){ 
          const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
          const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i  = floor(v + dot(v, C.yyy) );
          vec3 x0 = v - i + dot(i, C.xxx) ;
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min( g.xyz, l.zxy );
          vec3 i2 = max( g.xyz, l.zxy );
          vec3 x1 = x0 - i1 + 1.0 * C.xxx;
          vec3 x2 = x0 - i2 + 2.0 * C.xxx;
          vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
          i = mod(i, 289.0 ); 
          vec4 p = permute( permute( permute( 
                     i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                   + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                   + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
          float n_ = 1.0/7.0; 
          vec3  ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z *ns.z); 
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_ ); 
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4( x.xy, y.xy );
          vec4 b1 = vec4( x.zw, y.zw );
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
          vec3 p0 = vec3(a0.xy,h.x);
          vec3 p1 = vec3(a0.zw,h.y);
          vec3 p2 = vec3(a1.xy,h.z);
          vec3 p3 = vec3(a1.zw,h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
          p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
            float pixels = 40.0; // coarser clouds
            
            // vec2 p_uv = floor(vUv * pixels) / pixels; 
            vec3 noiseCoord = vPosition * 1.5;
            float n = snoise(noiseCoord + vec3(uTime * 0.1, 0.0, 0.0));
            
            if (n < 0.2) discard;
            
            gl_FragColor = vec4(1.0, 1.0, 1.0, 0.4); // Semi-transparent white
        }
    `

    return (
        <mesh ref={meshRef} scale={3.0}>
            <icosahedronGeometry args={[1, 3]} />
            <shaderMaterial
                vertexShader={cloudVertex}
                fragmentShader={cloudFragment}
                uniforms={uniforms}
                transparent
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

export default function PixelPlanet() {
    return (
        <div className="w-full h-full min-h-[500px]">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Planet />
                <Clouds />

                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
        </div>
    )
}
