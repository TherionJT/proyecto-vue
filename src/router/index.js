import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import ProfesorView from '../views/ProfesorView.vue'
import TutoriasProfesorView from '../views/TutoriasProfesorView.vue'
import EstudianteView from '../views/EstudianteView.vue'
import TutoriasView from '../views/TutoriasView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/admin', component: AdminView },
  { path: '/estudiante', component: EstudianteView },
  { path: '/profesor', component: ProfesorView },
  { path: '/tutorias-profesor', component: TutoriasProfesorView },
  { path: '/tutorias', component: TutoriasView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
