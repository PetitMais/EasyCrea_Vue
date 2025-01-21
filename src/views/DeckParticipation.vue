<template>
      <LogoutButton></LogoutButton>
  <div>
    <h1>Ta carte rng et ta participation</h1>
    <h2>Ne fonctionne que pour id crea = 20 (lapin), à modif</h2>
    <DeckInfo :id="Number(id)" @update:nbCartes="handleNbCartes" />
    <AleaCheck :id_createur="id_crea" :id_deck="Number(id)" @update:carteRng="handleCarteRng" />
    <!-- id_createur !!! -->
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

    <div v-if="carteInfoUser" class="carte-details">
      <h2>Voici votre contribution</h2>
      <p>Il s'agit de la carte n°{{ carteInfoUser.ordre_soumission }} sur {{ nbCartes }}.</p>
      <div>
        <p><strong>Texte :</strong> {{ carteInfoUser.texte_carte }}</p>
      </div>

      <div class="choice">
        <strong>Choix 1 :</strong>
        <p><strong>Population :</strong> {{ carteInfoUser.valeurs_choix1_pop }}</p>
        <p><strong>Finance :</strong> {{ carteInfoUser.valeurs_choix1_fin }}</p>
      </div>

      <div class="choice">
        <strong>Choix 2 :</strong>
        <p><strong>Population :</strong> {{ carteInfoUser.valeurs_choix2_pop }}</p>
        <p><strong>Finance :</strong> {{ carteInfoUser.valeurs_choix2_fin }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DeckInfo from '@/components/DeckInfo.vue';
import AleaCheck from '@/components/AleaCheck.vue';
import CartePrint from '@/components/CartePrint.vue';
import LogoutButton from '@/components/LogoutButton.vue';

const router = useRouter();

const props = defineProps({
  id: { // id_deck
    type: [Number, String],
    required: true,
  },
});

let id_crea = null;

onMounted(() => {
  id_crea = Number(sessionStorage.getItem("id")); // = 21
  console.log("id_crea récupéré de sessionStorage:", id_crea);
});

const idCarte = ref(null);
const carteInfo = ref(null);
const carteInfoUser = ref(null);
const nbCartes = ref(null);

const handleCarteRng = (id_carte_rng) => {
  console.log('Valeur de carteRng reçue depuis le composant:', id_carte_rng);
  idCarte.value = id_carte_rng;
};

const handleCarteInfo = (info) => {
  console.log('Informations de la carte reçues :', info);
  carteInfo.value = info;
};

const handleNbCartes = async (count) => {
  console.log('Nombre de cartes reçu du composant DeckInfo:', count);
  nbCartes.value = count;

  if (id_crea) {
    carteInfoUser.value = await fetchParticipationUser();
  }
};

const fetchParticipationUser = async () => {
  const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte/deck/id";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(props.id) }),
  };

  try {
    const response = await fetch(url, options);
    const jsonData = await response.json();

    const participationData = jsonData.find(element => element.id_createur == id_crea); // id_createur !!!

    if (participationData) {
      [participationData.valeurs_choix1_pop, participationData.valeurs_choix1_fin] = participationData.valeurs_choix1.split('/');
      [participationData.valeurs_choix2_pop, participationData.valeurs_choix2_fin] = participationData.valeurs_choix2.split('/');
    }

    return participationData;
  } catch (error) {
    console.error("Erreur lors de la récupération de la participation", error);
  }
}
</script>


<style scoped>

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

