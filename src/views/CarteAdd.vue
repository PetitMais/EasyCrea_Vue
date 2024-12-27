<template>
  <div>
    <h1>Ajouter une carte au deck</h1>
    <DeckInfo :id="Number(id)" />
    <AleaCheck :id_createur="21" :id_deck="Number(id)" @update:carteRng="handleCarteRng" />

    <!-- Afficher CartePrint uniquement si idCarte est défini -->
    <CartePrint v-if="idCarte" :id_carte="idCarte" @update:carteInfo="handleCarteInfo" />

    <!-- Section pour afficher les infos récupérées -->
    <div v-if="carteInfo" class="carte-details">
      <h2>Une carte aléatoire vous a été attribué :</h2>
      <br>
      <p><strong>Texte :</strong> {{ carteInfo.texte_carte }}</p>
      <br>
      <div class="choice">
        <strong>Choix 1 :</strong>
        <p><strong>Population :</strong> {{ carteInfo.valeurs_choix1_pop }}</p>
        <p><strong>Finance :</strong> {{ carteInfo.valeurs_choix1_fin }}</p>
      </div>
      <br>
      <div class="choice">
        <strong>Choix 2 :</strong>
        <p><strong>Population :</strong> {{ carteInfo.valeurs_choix2_pop }}</p>
        <p><strong>Finance :</strong> {{ carteInfo.valeurs_choix2_fin }}</p>
      </div>
    </div>

    <form @submit.prevent="submitForm">
      <label for="texte">Texte :*</label>
      <textarea v-model="formData.texte" id="texte" required></textarea>

      <label for="choice1">Choix n°1 :*</label>
      <div>
        <input v-model="formData.population1" type="number" placeholder="Population" required />
        <input v-model="formData.finance1" type="number" placeholder="Finance" required />
      </div>

      <label for="choice2">Choix n°2 :*</label>
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
import { reactive, ref, onMounted } from 'vue';
import DeckInfo from '@/components/DeckInfo.vue';
import AleaCheck from '@/components/AleaCheck.vue';
import CartePrint from '@/components/CartePrint.vue';

const props = defineProps({
  id: { // id_deck
    type: [Number, String],
    required: true
  }
});

const idCarte = ref(null);
const carteInfo = ref(null);

const handleCarteRng = (id_carte_rng) => {
  console.log('Valeur de carteRng reçue depuis le component:', id_carte_rng);
  idCarte.value = id_carte_rng;
};

const handleCarteInfo = (info) => {
  console.log('Informations de la carte reçues :', info);
  carteInfo.value = info;
};

const formData = reactive({
  texte: '',
  population1: 0,
  finance1: 0,
  population2: 0,
  finance2: 0,
  idDeck: ''
});

onMounted(() => {
  formData.idDeck = props.id;
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

.carte-details {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 10px;
}
.carte-details > h2{
text-align: center;
}

.choice p {
  text-indent: 1rem;
}
</style>
