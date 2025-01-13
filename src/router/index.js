import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import InscriptionView from '../views/InscriptionView.vue'

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
      component: () => import('../views/ConnexionView.vue'),
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: InscriptionView,
    },
    {
      path: '/deck', //url de la page
      name: 'deck', //nom du fichier que j'appel
      component: () => import('../views/DeckView.vue'),
    },
    {
      path: '/deck/add', //url de la page
      name: 'deckAdd', //nom du fichier que j'appel
      component: () => import('../views/DeckAdd.vue'),
    },
    {
      path: '/carteAdd/:id', //url de la page
      name: 'carteAdd', //nom du fichier que j'appel
      component: () => import('../views/CarteAdd.vue'),
      props: true
    },
    {
      path: '/deck/participation/:id', //url de la page
      name: 'deckParticipation', //nom du fichier que j'appel
      component: () => import('../views/DeckParticipation.vue'),
      props: true
    },
  ],
})

export default router
