<template>
  <div>
    <h1>Ajouter une carte au deck</h1>

    <DeckInfo :id="Number(id)" @update:nbCartes="handleNbCartes" />

    <AleaCheck :id_createur="userId" :id_deck="Number(id)" @update:carteRng="handleCarteRng"/>

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
let userId = sessionStorage.getItem("id");
console.log(userId);


const router = useRouter();

const props = defineProps({
  id: { // id_deck
    type: [Number, String],
    required: true,
  }
});
onMounted(() => {
  console.log("Valeur de l'id reçue :", props.id);
  console.log("Valeur de l'id_createur reçue :", props.id_createur);
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

const formData = reactive({});

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
    idCrea: props.id_createur,
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
  justify-content: center;
  align-items: stretch;
  gap: 10px;
}

label {
  font-weight: bold;
}

input,
textarea,
button {
  width: 100%;
  padding: 8px;
  font-size: 14px;
}

.carte-details {
  margin-top: 20px;
  margin-bottom: 10px;
  padding: 20px;
  background-color: #007bff17;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.carte-details h2 {
  text-align: center;
  color: #555;
}

.carte-details p {
  text-align: center;
  color: #555;
  font-size: 16px;
}

.choice {
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.choice p {
  color: #555;
  font-size: 14px;
}
</style>