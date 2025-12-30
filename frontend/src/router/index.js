import { createRouter, createWebHistory } from 'vue-router'
import SecureFileShare from '../components/SecureFileShare.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SecureFileShare
  },
  {
    path: '/text/:id',
    name: 'TextView',
    component: () => import('../components/TextViewer.vue')
  },
  {
    path: '/file/:id',
    name: 'FileView',
    component: () => import('../components/FileViewer.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router