## Folder Scaffolding
frontend/
├── components/
│   ├── Gallery/
│   │   ├── ArtworkCard.vue
│   │   ├── ArtworkModal.vue
│   │   └── GalleryGrid.vue
│   ├── Protection/
│   │   ├── CanvasRenderer.vue
│   │   └── AntiScrapeLayer.vue
│   ├── UI/
│   │   ├── RenaissanceButton.vue
│   │   ├── HallNavigation.vue
│   │   └── MembershipTier.vue
│   └── Layout/
│       ├── Header.vue
│       ├── Footer.vue
│       └── Sidebar.vue
├── pages/
│   ├── index.vue
│   ├── gallery/
│   │   ├── [hall].vue
│   │   └── artwork/
│   │       └── [id].vue
│   ├── auth/
│   │   ├── login.vue
│   │   └── register.vue
│   ├── membership/
│   │   └── index.vue
│   └── admin/
│       └── curator.vue
├── stores/
│   ├── auth.js
│   ├── artwork.js
│   └── payment.js
├── composables/
│   ├── useAuth.js
│   ├── useArtwork.js
│   └── useMpesa.js
├── middleware/
│   ├── auth.js
│   └── membership.js
└── assets/
    ├── css/
    │   └── main.css
    └── fonts/
        └── renaissance-fonts/

## Frontend Architecture

### Vue3 + Typescript Setup
```
// Advanced Vue 3 composition API with TypeScript
interface ArtworkStore {
  artworks: Ref<Artwork[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  
  // Actions
  fetchArtworks: (query: ArtworkQuery) => Promise<void>;
  protectImage: (id: string) => Promise<ProtectedImage>;
  trackView: (id: string) => Promise<void>;
}

// Pinia store with TypeScript
export const useArtworkStore = defineStore('artwork', (): ArtworkStore => {
  const artworks = ref<Artwork[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  
  const fetchArtworks = async (query: ArtworkQuery) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await $fetch('/api/artworks', {
        query: artworkQuerySchema.parse(query)
      });
      
      artworks.value = response.data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };
  
  return {
    artworks,
    loading,
    error,
    fetchArtworks,
    protectImage,
    trackView
  };
});
```

### Advanced Component Architecture
```
<!-- components/Gallery/ProtectedArtwork.vue -->
<template>
  <div class="protected-artwork" ref="containerRef">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      @contextmenu.prevent
      @dragstart.prevent
      @selectstart.prevent
    />
    
    <div class="artwork-overlay" v-if="showOverlay">
      <div class="artwork-info">
        <h3>{{ artwork.title }}</h3>
        <p>{{ artwork.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useIntersectionObserver } from '@vueuse/core';
import { ImageProtectionEngine } from '~/utils/imageProtection';

interface Props {
  artwork: Artwork;
  protectionLevel: 'basic' | 'advanced' | 'paranoid';
}

const props = defineProps<Props>();
const canvasRef = ref<HTMLCanvasElement>();
const containerRef = ref<HTMLElement>();

const protectionEngine = new ImageProtectionEngine();

// Intersection observer for lazy loading
const { stop } = useIntersectionObserver(
  containerRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      loadAndProtectImage();
      stop();
    }
  },
  { threshold: 0.1 }
);

const loadAndProtectImage = async () => {
  if (!canvasRef.value) return;
  
  const imageData = await fetchProtectedImage(props.artwork.id);
  const protectedCanvas = await protectionEngine.renderProtectedImage(
    imageData,
    props.artwork.protection.noiseConfig
  );
  
  // Copy protected canvas to display canvas
  const ctx = canvasRef.value.getContext('2d');
  ctx?.drawImage(protectedCanvas, 0, 0);
};
</script>
```

### Security Implementation

#### Advanced Rate Limiting

```
// Distributed rate limiting with Redis
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator: (req: Request) => string;
  onLimitReached: (req: Request) => void;
}

class DistributedRateLimiter {
  private redis: Redis.Cluster;
  
  async isAllowed(key: string, config: RateLimitConfig): Promise<boolean> {
    const pipeline = this.redis.pipeline();
    const window = Math.floor(Date.now() / config.windowMs);
    const redisKey = `rate_limit:${key}:${window}`;
    
    pipeline.incr(redisKey);
    pipeline.expire(redisKey, Math.ceil(config.windowMs / 1000));
    
    const results = await pipeline.exec();
    const count = results?.[0]?.[1] as number;
    
    return count <= config.maxRequests;
  }
}
```
#### Content Security Policy
```
// Advanced CSP configuration
const cspConfig = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
  'style-src': ["'self'", "'unsafe-inline'"],
  'img-src': ["'self'", 'data:', 'https://*.cloudflare.com'],
  'connect-src': ["'self'", 'https://api.stripe.com'],
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'object-src': ["'none'"]
};
```



## Performance Optimization
### Frontend Performance
```
// Advanced lazy loading with intersection observer
class LazyImageLoader {
  private observer: IntersectionObserver;
  private loadingQueue: Set<string> = new Set();
  
  constructor() {
    this.observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );
  }
  
  private async handleIntersection(entries: IntersectionObserverEntry[]) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        const artworkId = element.dataset.artworkId;
        
        if (artworkId && !this.loadingQueue.has(artworkId)) {
          this.loadingQueue.add(artworkId);
          await this.loadProtectedImage(artworkId);
          this.observer.unobserve(element);
        }
      }
    }
  }
}
```
