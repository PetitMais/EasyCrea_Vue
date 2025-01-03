<template>
  <div>
    <h1>Ajouter une carte au deck</h1>

    <DeckInfo :id="Number(id)" @update:nbCartes="handleNbCartes" />

    <AleaCheck :id_createur="21" :id_deck="Number(id)" @update:carteRng="handleCarteRng" />

    <CartePrint v-if="idCarte" :id_carte="idCarte" @update:carteInfo="handleCarteInfo" />

    <div v-if="carteInfo" class="carte-details">
      <h2>Une carte aléatoire vous a été attribuée :</h2>
      <p>Il s'agit de la carte n°{{ carteInfo.ordre_soumission }} sur {{ nbCartes }}.</p>
      <div>
        <p><strong>Texte :</strong> {{ carteInfo.texte_carte }}</p>
      </div>

      <div class="choice">
        <strong>Choix 1 :</strong>
        <p><strong>Population :</strong> {{ carteInfo.valeurs_choix1_pop }}</p>
        <p><strong>Finance :</strong> {{ carteInfo.valeurs_choix1_fin }}</p>
      </div>

      <div class="choice">
        <strong>Choix 2 :</strong>
        <p><strong>Population :</strong> {{ carteInfo.valeurs_choix2_pop }}</p>
        <p><strong>Finance :</strong> {{ carteInfo.valeurs_choix2_fin }}</p>
      </div>
    </div>

    <form @submit.prevent="submitForm">
      <label for="texte">Texte :*</label>
      <textarea v-model="formData.texte" id="texte" minlength="50" maxlength="280" required></textarea>

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

      <p>Les données marquées d'une astérisque sont obligatoires.</p>
      <button type="submit">Ajouter la carte</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DeckInfo from '@/components/DeckInfo.vue';
import AleaCheck from '@/components/AleaCheck.vue';
import CartePrint from '@/components/CartePrint.vue';

const router = useRouter();

const props = defineProps({
  id: { // id_deck
    type: [Number, String],
    required: true,
  },
});

const idCarte = ref(null);
const carteInfo = ref(null);
const nbCartes = ref(null);

const handleCarteRng = (id_carte_rng) => {
  console.log('Valeur de carteRng reçue depuis le component:', id_carte_rng);
  idCarte.value = id_carte_rng;
};

const handleCarteInfo = (info) => {
  console.log('Informations de la carte reçues :', info);
  carteInfo.value = info;
};

const handleNbCartes = (count) => {
  console.log('Nombre de cartes reçu du composant DeckInfo:', count);
  nbCartes.value = count;
};

const formData = reactive({
  texte: '',
  population1: 0,
  finance1: 0,
  population2: 0,
  finance2: 0,
});

const submitForm = async () => {
  console.log('Données du formulaire :', formData);

  const ordre = await fetchOrderDeck();

  const valChoix1 = `${formData.population1}/${formData.finance1}`;
  const valChoix2 = `${formData.population2}/${formData.finance2}`;

  const formattedData = {
    texte: formData.texte,
    valChoix1,
    valChoix2,
    date: dateFormatted(),
    ordre: ordre,
    idDeck: props.id,
    idAdmin: null,
    idCrea: 20,
  };

  console.log('Données formatées :', formattedData);

  await sendCarteInfo(formattedData);
  router.push('/deck');
};

const dateFormatted = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
};

const fetchOrderDeck = async () => {
  const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte/deck/ordermax";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(props.id) }),
  };
  try {
    const response = await fetch(url, options);
    const jsonData = await response.json();
    return jsonData.max_ordre || 0;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'ordre :", error);
    return 0;
  }
};

const sendCarteInfo = async (formattedData) => {
  const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formattedData),
  };
  try {
    await fetch(url, options);
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :", error);
  }
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

.carte-details>h2,
.carte-details>p {
  text-align: center;
}

.choice p {
  text-indent: 1rem;
}
</style>
