<template>
  <LogoutButton></LogoutButton>

  <main>
    <h1>Liste des decks</h1>

    <!-- Checkbox pour filtrer les decks terminés -->
    <label class="switch">
      <input type="checkbox" v-model="showFinished">
      <span class="slider round"></span>
    </label>
    <span>{{ showFinished ? "Afficher les decks terminés" : "Afficher les decks en cours" }}</span>

    <button v-if="userRank === 'admin'" @click="$router.push('/deck/add')">Ajouter un deck</button>

    <!-- Passer les filtres à DeckList -->
    <DeckList :showFinished="showFinished" />
  </main>
</template>

<script>
import { ref } from 'vue';
import DeckList from '@/components/DeckList.vue';
import LogoutButton from './../components/LogoutButton.vue';
const userRank = sessionStorage.getItem("userRank");
export default {
  components: { DeckList },
  setup() {
    const userRank = ref(sessionStorage.getItem("userRank"));
    const showFinished = ref(false); // Par défaut, afficher les decks en cours

    return { userRank, showFinished };
  }
};
</script>

<style>
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3644DB;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked+.slider {
  background-color: #44DB36;
}

input:focus+.slider {
  box-shadow: 0 0 1px #44DB36;
}

input:checked+.slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
