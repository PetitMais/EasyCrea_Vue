<template>
    <section>
      <h1>Ajouter une carte au deck</h1>
      <DeckInfo :id="Number(id)" @update:nbCartes="handleNbCartes" />

      <AleaCheck :id_createur="userId" :id_deck="Number(id)" @update:carteRng="handleCarteRng" />

      <CartePrint v-if="idCarte" :id_carte="idCarte" @update:carteInfo="handleCarteInfo" />

      <div class="global_container">
        <div v-if="carteInfo" class="rc_container">
          <div class="rc_container_title">
            <h2>Une carte aléatoire vous a été attribuée :</h2>
            <p style="color: black;">Il s'agit de la carte n°{{ carteInfo.ordre_soumission }} sur {{ nbCartes }}.</p>
          </div>
          <div class="card-details">
            <div class="rc_text">
              <strong>Texte :</strong>
                  <p style="color: black; word-wrap: break-word;">{{ carteInfo.texte_carte }}</p>
            </div>
            <div class="detail_choice">
              <div class="choice">
                <strong>Choix 1 :</strong>
                <p style="color: black;"><strong>Population :</strong> {{ carteInfo.valeurs_choix1_pop }}</p>
                <p style="color: black;"><strong>Finance :</strong> {{ carteInfo.valeurs_choix1_fin }}</p>
              </div>

              <div class="choice">
                <strong>Choix 2 :</strong>
                <p style="color: black;"><strong>Population :</strong> {{ carteInfo.valeurs_choix2_pop }}</p>
                <p style="color: black;"><strong>Finance :</strong> {{ carteInfo.valeurs_choix2_fin }}</p>
              </div>
            </div>

          </div>
        </div>
        
      <form @submit.prevent="submitForm">
        <div>
          <label for="texte">Texte : *</label>
          <textarea v-model="formData.texte" id="texte" minlength="50" maxlength="280" required></textarea>
        </div>
        <div>
          <div>
            <label for="choice1">Choix n°1 : *</label>
            <input v-model="formData.population1" type="number" placeholder="Population" required />
            <input v-model="formData.finance1" type="number" placeholder="Finance" required />
          </div>
          <div>
            <label for="choice2">Choix n°2 : *</label>
            <input v-model="formData.population2" type="number" placeholder="Population" required />
            <input v-model="formData.finance2" type="number" placeholder="Finance" required />
          </div>

        </div>

        <p>Les données marquées d'une astérisque sont obligatoires.</p>
        <button type="submit">Ajouter la carte</button>
        </form>
        <RouterLink to="/deck" id="back">Retour</RouterLink>
      </div>
    </section>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DeckInfo from '@/components/DeckInfo.vue';
import AleaCheck from '@/components/AleaCheck.vue';
import CartePrint from '@/components/CartePrint.vue';

let userId = sessionStorage.getItem("id");


onMounted(() => {
  if (!userId) {
    router.replace('/');
  }
});

const router = useRouter();
if (sessionStorage.getItem("id")==null||sessionStorage.getItem("id")==undefined){
  router.push('/');
}
const props = defineProps({
  id: { 
    type: [Number, String],
    required: true,
  }
});


const idCarte = ref(null);
const carteInfo = ref(null);
const nbCartes = ref(null);

const handleCarteRng = (id_carte_rng) => {
  idCarte.value = id_carte_rng;
};

const handleCarteInfo = (info) => {
  carteInfo.value = info;
};

const handleNbCartes = (count) => {

  nbCartes.value = count;
};

const formData = reactive({});

const submitForm = async () => {

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
    idCrea: userId
  };


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
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;

}

h1 {
  font-size: xxx-large;
  font-style: italic;
  text-decoration: underline;
  text-align: center;
  margin-bottom: 20px;
}

.global_container {
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  padding: 20px;
  max-width: 600px;
  width: 100%;
  color: black;
}

.rc_container {
  background: white;
  color: black;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
  color: black;
}

.rc_container_title {
  margin-bottom: 10px;
}

.card-details {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
  color: black;
}

.rc_text {
  margin-bottom: 15px;
}

.detail_choice {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.choice {
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  flex: 1;
  margin: 0 5px;
  text-align: center;
}

form {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
  margin-top: 20px;
  color: black;
}

form div {
  margin-bottom: 15px;
}

label {
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
}

textarea, input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 2px solid #4a90e2;
  border-radius: 5px;
  font-size: 14px;
  margin-top: 5px;
}
textarea{
  height: 150px;
}

button {
  background-color: #1db954; 
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #17a74a; 
}

p {
  font-size: 12px;
}


</style>