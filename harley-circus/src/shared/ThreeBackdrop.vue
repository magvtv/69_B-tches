<template>
  <div ref="container" class="fixed inset-0 -z-10 pointer-events-none"></div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let animationId = 0

function init() {
  if (!container.value) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
  camera.position.z = 6

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  container.value.appendChild(renderer.domElement)

  const particles = new THREE.BufferGeometry()
  const count = 250
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20
  }
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({ color: 0xff3355, size: 0.04, transparent: true, opacity: 0.6 })
  const points = new THREE.Points(particles, material)
  scene.add(points)

  const clock = new THREE.Clock()
  const animate = () => {
    const t = clock.getElapsedTime()
    points.rotation.y = t * 0.05
    points.rotation.x = Math.sin(t * 0.2) * 0.1
    renderer!.render(scene!, camera!)
    animationId = requestAnimationFrame(animate)
  }
  animate()

  window.addEventListener('resize', onResize)
}

function onResize() {
  if (!container.value || !renderer || !camera) return
  const width = container.value.clientWidth
  const height = container.value.clientHeight
  renderer.setSize(width, height)
  camera.aspect = width / height
  camera.updateProjectionMatrix()
}

onMounted(() => init())
onBeforeUnmount(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  if (renderer) {
    renderer.dispose()
  }
})
</script>

<style scoped>
</style>


