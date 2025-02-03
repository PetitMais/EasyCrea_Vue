<!-- <script>
import { ref, onMounted, computed } from 'vue';

export default {
  props: {
    showFinished: Boolean // Récupération de l'état du switch
  },
  setup(props) {
    const data = ref([]); // Liste des decks
    const userRank = ref(sessionStorage.getItem("userRank"));
    const userId = ref(sessionStorage.getItem("id"));

    const fetchDecks = async () => {
      let url;
      let options;

      if (userRank.value === "admin") {
        url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/participation/admin";
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId.value })
        };
      } else {
        url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck";
        options = { method: "GET" };
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        data.value = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    // Fonction pour valider un deck
    const validateDeck = async (deckId) => {
      try {
        const response = await fetch(`https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/validate/${deckId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminId: userId.value }) // Envoyer l'ID de l'admin
        });

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        // Mettre à jour l'état du deck validé
        const updatedDeck = data.value.find(deck => deck.id_deck === deckId);
        if (updatedDeck) {
          updatedDeck.valid = "yes";
        }
      } catch (error) {
        console.error("Erreur lors de la validation du deck :", error);
      }
    };

    // Filtrage des decks terminés ou en cours
    const filteredDecks = computed(() => {
      const today = new Date().toISOString().split("T")[0]; // Date actuelle au format YYYY-MM-DD
      return data.value.filter(deck =>
        props.showFinished ? deck.date_fin_deck < today : deck.date_fin_deck >= today
      );
    });

    onMounted(fetchDecks);

    return { filteredDecks, userRank, validateDeck };
  }
};
</script>

<template>
  <section id="deckContainer">
    <article v-for="(element, index) in filteredDecks" :key="index" class="deck">
      <h2>{{ element.titre_deck }}</h2>
      <p><strong>Description :</strong> {{ element.body_deck }}</p>
      <p><strong>Date de début :</strong> {{ element.date_debut_deck }}</p>
      <p><strong>Date de fin :</strong> {{ element.date_fin_deck }}</p>
      <p><strong>Nombre de cartes :</strong> {{ element.nb_cartes }}</p> -->

      <!-- Afficher le bouton "Valider" si le deck n'est pas encore validé -->
      <!-- <div v-if="userRank === 'admin'">
        <button v-if="element.valid === 'no'">Valider</button>
        <p v-else>validé ✅</p>
      </div>

      <router-link v-if="userRank === 'créateur'" :to="{ name: 'carteAdd', params: { id: element.id_deck } }">
        <button>Participer au deck</button>
      </router-link>
      <router-link v-if="userRank === 'créateur'" :to="{ name: 'deckParticipation', params: { id: element.id_deck } }">
        <button>Afficher votre participation</button>
      </router-link>
    </article>
  </section>
</template> -->
<script>
import { ref, onMounted, computed } from 'vue';

export default {
  props: {
    showFinished: Boolean // Récupération de l'état du switch
  },
  setup(props) {
    const data = ref([]); // Liste des decks
    const userRank = ref(sessionStorage.getItem("userRank"));
    const userId = ref(sessionStorage.getItem("id"));
    const nonParticipantDecks = ref(new Set()); // Ensemble des decks où l'utilisateur n'a pas participé

    // Récupère la liste des decks
    const fetchDecks = async () => {
      let url;
      let options;

      if (userRank.value === "admin") {
        url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/participation/admin";
        options = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId.value })
        };
      } else {
        url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck";
        options = { method: "GET" };
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        data.value = await response.json();
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };

    // Vérifie si l'utilisateur a participé aux decks
    const fetchNonParticipantDecks = async () => {
      try {
        const response = await fetch("https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/noparticipation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId.value })
        });

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const nonParticipants = await response.json();
        nonParticipantDecks.value = new Set(nonParticipants.map(deck => deck.id_deck));
      } catch (error) {
        console.error("Erreur lors de la récupération des non-participations :", error);
      }
    };

    // Filtrage des decks terminés ou en cours
    const filteredDecks = computed(() => {
      const today = new Date().toISOString().split("T")[0]; // Date actuelle au format YYYY-MM-DD
      return data.value.filter(deck =>
        props.showFinished ? deck.date_fin_deck < today : deck.date_fin_deck >= today
      );
    });

    onMounted(async () => {
      await fetchDecks();
      if (userRank.value === "créateur") {
        await fetchNonParticipantDecks();
      }
    });

    return { filteredDecks, userRank, nonParticipantDecks };
  }
};
</script>

<template>
  <section id="deckContainer" >
    <article v-for="(element, index) in filteredDecks" :key="index" class="deck" lang="fr">
      <h2>{{ element.titre_deck }}</h2>
      <p class="text_fictif"><strong>Description :</strong> {{ element.body_deck }}</p>
      <p class="text_fictif"><strong>Date de début :</strong> {{ element.date_debut_deck }}</p>
      <p class="text_fictif"><strong>Date de fin :</strong> {{ element.date_fin_deck }}</p>
      <p class="text_fictif"><strong>Nombre de cartes :</strong> {{ element.nb_cartes }}</p>

      <!-- ADMIN : Validation -->
      <div v-if="userRank === 'admin'">
        <template v-if="element.date_fin_deck < new Date().toISOString().split('T')[0]">
          <button v-if="element.valid === 'no'">Valider</button>
          <p v-else style="color: black;">✅ Deck validé</p>
        </template>
        <button v-else>Voir le deck</button>
      </div>

      <!-- CRÉATEUR : Participation -->
      <div v-if="userRank === 'créateur'">
          <p  v-if="element.date_fin_deck >= new Date().toISOString().split('T')[0]" style="color: black;">
            🟢 Deck en cours
          </p>

          <!-- Deck terminé -->
          <div v-else>
            <p v-if="!nonParticipantDecks.has(element.id_deck)">
              🔍 <router-link :to="{ name: 'deckParticipation', params: { id: element.id_deck } }">
                <button style="color: black;">Regarder votre participation</button>
              </router-link>
            </p>
            <p style="color: black;">
              {{ element.valid === "yes" ? "✅ Valide" : "⏳ En cours de validation" }}
            </p>
          </div>

          <!-- Deck en cours -->
          <div v-if="element.date_fin_deck >= new Date().toISOString().split('T')[0]">
            <router-link v-if="nonParticipantDecks.has(element.id_deck)" :to="{ name: 'carteAdd', params: { id: element.id_deck } }">
              <button>Participer au deck</button>
            </router-link>
            <router-link v-else :to="{ name: 'deckParticipation', params: { id: element.id_deck } }">
              <button>Regarder votre participation</button>
            </router-link>
          </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
  section{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;
  }

  .deck{
    width: 300px;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    gap: 15px;
    text-align: center;
    padding: 15px;
    border-radius: 15px;

  }
  h2{
    color: black;
    margin: 0 15px;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    width: 200px;
    
  }
  .text_fictif{
    font-size: small;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: black;
    word-break: break-all;
    margin: 0 15px;
  }
</style>


  
