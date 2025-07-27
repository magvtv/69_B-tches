interface ArtworkMetadata {
  dominantColors: string[];
  mood: string;
  tags: string[];
}

interface ArtworkAssets {
  original: string;
  protected: string;
  thumbnail: string;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  metadata: ArtworkMetadata;
  assets: ArtworkAssets;
  createdAt: string;
  updatedAt: string;
  year?: number;
  medium?: string;
  hall?: string;
  price?: number;
  dimensions?: string;
}

class ArtworkService {
  private artworks: Artwork[] = [];
  private loaded = false;

  async loadArtworks(): Promise<void> {
    if (this.loaded) return;
    
    try {
      const response = await fetch('/art-vault/artworks.json');
      if (!response.ok) {
        throw new Error('Failed to load artworks');
      }
      this.artworks = await response.json();
      this.loaded = true;
    } catch (error) {
      console.error('Error loading artworks:', error);
      // Fallback data for development
      this.artworks = [
        {
          id: '1',
          title: 'Mysterious Femininity',
          artist: 'Contemporary Artist',
          description: 'A powerful exploration of modern femininity through bold colors and expressive brushwork',
          metadata: {
            dominantColors: ['blue', 'red'],
            mood: 'mysterious',
            tags: ['feminine', 'modern', 'bold']
          },
          assets: {
            original: '/art-vault/bitch-1.jpeg',
            protected: '/art-protected/bitch-1.jpeg',
            thumbnail: '/thumbnails/bitch-1.jpeg'
          },
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15',
          year: 2024,
          medium: 'Digital Art',
          hall: 'Renaissance',
          price: 45000,
          dimensions: '800x600px',
          imageUrl: '/art-vault/bitch-1.jpeg'
        }
        // More fallback artworks can be added here
      ];
      this.loaded = true;
    }
  }

  async getArtwork(id: string): Promise<Artwork | null> {
    await this.loadArtworks();
    return this.artworks.find(artwork => artwork.id === id) || null;
  }

  async getAllArtworks(): Promise<Artwork[]> {
    await this.loadArtworks();
    return this.artworks;
  }

  async getFeaturedArtworks(limit: number = 6): Promise<Artwork[]> {
    await this.loadArtworks();
    return this.artworks.slice(0, limit);
  }

  async getArtworksByMood(mood: string): Promise<Artwork[]> {
    await this.loadArtworks();
    return this.artworks.filter(artwork => artwork.metadata.mood === mood);
  }

  async getArtworksByTags(tags: string[]): Promise<Artwork[]> {
    await this.loadArtworks();
    return this.artworks.filter(artwork => 
      tags.some(tag => artwork.metadata.tags.includes(tag))
    );
  }

  async getRelatedArtworks(artworkId: string, limit: number = 3): Promise<Artwork[]> {
    const artwork = await this.getArtwork(artworkId);
    if (!artwork) return [];
    
    await this.loadArtworks();
    
    // Find artworks with similar tags or mood
    const related = this.artworks.filter(a => 
      a.id !== artworkId && (
        a.metadata.mood === artwork.metadata.mood ||
        a.metadata.tags.some(tag => artwork.metadata.tags.includes(tag))
      )
    );
    
    return related.slice(0, limit);
  }
}

export const artworkService = new ArtworkService();
export default artworkService;
