<template>
  <div>
    <h1>Ajouter une carte au deck</h1>
    <DeckInfo :id="Number(id)" />

    <form @submit.prevent="submitForm">

      <label for="texte">Texte :</label>
      <textarea v-model="formData.texte" id="texte" required></textarea>

      <label for="choice1">Choix n°1 :</label>
      <div>
        <input v-model="formData.population1" type="number" placeholder="Population" required />
        <input v-model="formData.finance1" type="number" placeholder="Finance" required />
      </div>

      <label for="choice2">Choix n°2 :</label>
      <div>
        <input v-model="formData.population2" type="number" placeholder="Population" required />
        <input v-model="formData.finance2" type="number" placeholder="Finance" required />
      </div>

      <input v-model="formData.idDeck" type="hidden" />

      <br>
      <p>Les données marquées d'une astérisque sont obligatoires.</p>
      <button type="submit">Ajouter la carte</button>

    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import DeckInfo from './../components/DeckInfo.vue';

defineProps({
  id: {
    type: String,
    required: true
  }
});

const formData = reactive({
  texte: '',
  population1: 0,
  finance1: 0,
  population2: 0,
  finance2: 0,
  idDeck: '' 
});

// à finir
onMounted(() => {
  formData.idDeck = id;
});

const submitForm = () => {
  console.log('Données du formulaire :', formData);
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

input,
textarea,
button {
  padding: 8px;
  font-size: 14px;
}
</style>
