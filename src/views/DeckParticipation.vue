<template>
  <LogoutButton></LogoutButton>
  <div>
    <h1>Ta carte aléatoire et ta participation au deck</h1>
    <DeckInfo :id="Number(id)" @update:nbCartes="handleNbCartes" />
    <AleaCheck :id_createur="id_crea" :id_deck="Number(id)" @update:carteRng="handleCarteRng" />
    <!-- id_createur !!! -->
    <CartePrint v-if="idCarte" :id_carte="idCarte" @update:carteInfo="handleCarteInfo" />

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

    <div v-if="carteInfoUser" class="rc_container">
      <div class="rc_container_title">
        <h2>Voici votre participation :</h2>
        <p style="color: black;">Il s'agit de la carte n°{{ carteInfoUser.ordre_soumission }} sur {{ nbCartes }}.</p>
      </div>
      <div class="card-details">
        <div class="rc_text">
          <strong>Texte :</strong>
          <p style="color: black; word-wrap: break-word;">{{ carteInfoUser.texte_carte }}</p>
        </div>
        <div class="detail_choice">
          <div class="choice">
            <strong>Choix 1 :</strong>
            <p style="color: black;"><strong>Population :</strong> {{ carteInfoUser.valeurs_choix1_pop }}</p>
            <p style="color: black;"><strong>Finance :</strong> {{ carteInfoUser.valeurs_choix1_fin }}</p>
          </div>

          <div class="choice">
            <strong>Choix 2 :</strong>
            <p style="color: black;"><strong>Population :</strong> {{ carteInfoUser.valeurs_choix2_pop }}</p>
            <p style="color: black;"><strong>Finance :</strong> {{ carteInfoUser.valeurs_choix2_fin }}</p>
          </div>
        </div>

      </div>
    </div>
    <RouterLink to="/deck" id="back">Retour</RouterLink>
  </div>

</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DeckInfo from '@/components/DeckInfo.vue';
import AleaCheck from '@/components/AleaCheck.vue';
import CartePrint from '@/components/CartePrint.vue';
import LogoutButton from '@/components/LogoutButton.vue';
let userId = sessionStorage.getItem("id");

const router = useRouter();
onMounted(() => {
  if (!userId) {
    router.replace('/'); // replace empêche le retour arrière vers cette page
  }
  id_crea = Number(sessionStorage.getItem("id")); // = 21
  console.log("id_crea récupéré de sessionStorage:", id_crea);
});

const props = defineProps({
  id: { // id_deck
    type: [Number, String],
    required: true,
  },
});

let id_crea = null;


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
</style>