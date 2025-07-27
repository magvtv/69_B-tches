<template>
  <div class="admin-curator">
    <div class="container">
      <h1>Curator Dashboard</h1>
      
      <div class="dashboard-grid">
        <div class="dashboard-card">
          <h3>Artwork Management</h3>
          <div class="stats">
            <div class="stat">
              <span class="stat-number">{{ totalArtworks }}</span>
              <span class="stat-label">Total Artworks</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ pendingArtworks }}</span>
              <span class="stat-label">Pending Review</span>
            </div>
          </div>
          <RenaissanceButton @click="addArtwork">Add New Artwork</RenaissanceButton>
        </div>
        
        <div class="dashboard-card">
          <h3>User Management</h3>
          <div class="stats">
            <div class="stat">
              <span class="stat-number">{{ totalUsers }}</span>
              <span class="stat-label">Total Users</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ premiumUsers }}</span>
              <span class="stat-label">Premium Members</span>
            </div>
          </div>
          <RenaissanceButton @click="manageUsers">Manage Users</RenaissanceButton>
        </div>
        
        <div class="dashboard-card">
          <h3>Analytics</h3>
          <div class="stats">
            <div class="stat">
              <span class="stat-number">{{ totalViews }}</span>
              <span class="stat-label">Total Views</span>
            </div>
            <div class="stat">
              <span class="stat-number">{{ totalSales }}</span>
              <span class="stat-label">Total Sales</span>
            </div>
          </div>
          <RenaissanceButton @click="viewAnalytics">View Analytics</RenaissanceButton>
        </div>
      </div>
      
      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon">{{ activity.icon }}</div>
            <div class="activity-content">
              <p class="activity-text">{{ activity.text }}</p>
              <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RenaissanceButton from '@/components/UI/RenaissanceButton.vue';

interface Activity {
  id: string;
  icon: string;
  text: string;
  timestamp: Date;
}

const totalArtworks = ref(156);
const pendingArtworks = ref(12);
const totalUsers = ref(1247);
const premiumUsers = ref(89);
const totalViews = ref(45678);
const totalSales = ref(23);

const recentActivity = ref<Activity[]>([
  {
    id: '1',
    icon: '🎨',
    text: 'New artwork "Mysterious Femininity" added to Renaissance hall',
    timestamp: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: '2',
    icon: '👤',
    text: 'New premium member registered: jane.doe@example.com',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: '3',
    icon: '💰',
    text: 'Artwork "Renaissance Reimagined" sold for KES 75,000',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  }
]);

function addArtwork() {
  // TODO: Implement add artwork functionality
  console.log('Add artwork clicked');
}

function manageUsers() {
  // TODO: Implement user management
  console.log('Manage users clicked');
}

function viewAnalytics() {
  // TODO: Implement analytics view
  console.log('View analytics clicked');
}

function formatTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
</script>

<style scoped>
.admin-curator {
  padding: 2rem 0;
  background: linear-gradient(135deg, var(--background-light) 0%, var(--background-dark) 100%);
  min-height: 100vh;
}

.admin-curator h1 {
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.dashboard-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.dashboard-card h3 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.recent-activity {
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.recent-activity h2 {
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(224, 195, 252, 0.1);
  border-radius: 8px;
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-color);
  border-radius: 50%;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
}

.activity-time {
  font-size: 0.8rem;
  color: #666;
}

@media (max-width: 768px) {
  .admin-curator {
    padding: 1rem 0;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .dashboard-card {
    padding: 1.5rem;
  }
  
  .stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 