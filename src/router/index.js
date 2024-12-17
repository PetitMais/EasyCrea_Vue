import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', //url de la page
      name: 'home', //nom du fichier que j'appel
      component: HomeView, //c'est le component que j'appel
    },
    {
      path: '/connexion',
      name: 'connexion',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ConnexionView.vue'),
    },
    {
      path: '/deck', //url de la page
      name: 'deck', //nom du fichier que j'appel
      component: () => import('../views/DeckView.vue'),
    },
    {
      path: '/carteAdd/:id', //url de la page
      name: 'carteAdd', //nom du fichier que j'appel
      component: () => import('../views/CarteAdd.vue'),
      props: true
    },
  ],
})

export default router
