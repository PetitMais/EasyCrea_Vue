<template>
  <div>
    <h1>Ajouter une carte</h1>
    <p>ID du deck reçu : {{ id }}</p>
    <DeckInfo :id="Number(id)" />

    <form @submit.prevent="submitForm">
      <label for="title">Titre de la carte :</label>
      <input v-model="formData.title" type="text" id="title" required />

      <label for="description">Description :</label>
      <textarea v-model="formData.description" id="description" required></textarea>

      <!-- Choix 1 et Choix 2 à finir -->

      <button type="submit">Ajouter la carte</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import DeckInfo from './../components/DeckInfo.vue';

defineProps({
  id: {
    type: String,
    required: true
  }
});

const formData = reactive({
  title: '',
  description: '',
  number: null
});

const submitForm = () => {
  console.log("Données du formulaire :", formData);
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
}

input, textarea, button {
  padding: 8px;
  font-size: 14px;
}
</style>
