import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home'
import CarteList from '../views/CarteList'
import Register from '../views/Register'
import Login from '../views/Login'
import AddAutor from '../views/AddAutor'
import AddCarte from '../views/AddCarte'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/carti',
    name: 'Carti',
    component: CarteList
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/addAutor',
    name: 'AddAutor',
    component: AddAutor
  },
  {
    path: '/addCarte',
    name: 'AddCarte',
    component: AddCarte
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Global navigation guard example
router.beforeEach((to, from, next) => {
  if (to.name === 'Register' || to.name === 'Login' || to.name === 'Home') {
    next();
  } else if (to.name !== 'Login' && !store.state.isAuthenticated) {
    next({ name: 'Login' });
  } else {
    next();
  }
})

export default router
