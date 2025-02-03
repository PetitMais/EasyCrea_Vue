<script>
import { ref, onMounted, computed } from "vue";

export default {
  props: {
    showFinished: Boolean // Récupération de l'état du switch
  },
  setup(props) {
    const data = ref([]);
    const userRank = ref(sessionStorage.getItem("userRank"));
    const userId = ref(sessionStorage.getItem("id"));
    const nonParticipantDecks = ref(new Set());

    /**
     * Récupère la liste des decks
     * @returns {Promise<void>}
     */ 
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

    /**
     * Vérifie si l'utilisateur a participé aux decks
     * @returns {Promise<void>}
     */
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

    /**
     * Détermine si un deck est terminé ou en cours
     * @param deck
     * @returns {string} 
     */
    const getDeckStatus = (deck) => {
      const today = new Date().toISOString().split("T")[0];
      return deck.date_fin_deck <= today || deck.count === deck.nb_cartes ? "Terminé" : "En cours";
    };

    /**
     * Filtrage des decks terminés ou en cours
     * @type {ComputedRef<[]>}
     * @returns {ComputedRef<[]>}
     */
    const filteredDecks = computed(() => {
      return data.value.filter(deck => props.showFinished ? getDeckStatus(deck) === "Terminé" : getDeckStatus(deck) === "En cours");
    });

    /**
     * affiche la liste des decks en fonction du rôle de l'utilisateur et de leur état (en cours ou terminé).
     * @returns {{filteredDecks: ComputedRef<[]>, userRank: Ref<null|string>, nonParticipantDecks: Ref<Set<unknown>>, getDeckStatus: (function(*): string)}}
     */
    onMounted(async () => {
      await fetchDecks();
      if (userRank.value === "créateur") {
        await fetchNonParticipantDecks();
      }
    });

    return { filteredDecks, userRank, nonParticipantDecks, getDeckStatus };
  }
};
</script>

<template>
  <section id="deckContainer">
    <article v-for="(element, index) in filteredDecks" :key="index" class="deck" lang="fr">
      <h2>{{ element.titre_deck }}</h2>
      <p class="text_fictif"><strong>Description :</strong> {{ element.body_deck }}</p>
      <p class="text_fictif"><strong>Date de début :</strong> {{ element.date_debut_deck }}</p>
      <p class="text_fictif"><strong>Date de fin :</strong> {{ element.date_fin_deck }}</p>
      <p class="text_fictif"><strong>Nombre de cartes :</strong> {{ element.count }} / {{ element.nb_cartes }}  </p>

      <!-- ADMIN : Validation -->
      <div v-if="userRank === 'admin'">
        <template v-if="getDeckStatus(element) === 'Terminé'">
          <router-link v-if="element.valid === 'no'" :to="{ name: 'carteEdit', params: { id: element.id_deck } }">
            <button>Valider le deck</button>
          </router-link>
          <p v-else style="color: black;">✅ Deck validé</p>
        </template>
      </div>

      <!-- CRÉATEUR : Participation -->
      <div v-if="userRank === 'créateur'">
        <p v-if="getDeckStatus(element) === 'En cours'" style="color: black;"> Deck en cours</p>
        <p v-else style="color: black;">🟢 Deck terminé</p>

        <!-- Deck terminé -->
        <div v-if="getDeckStatus(element) === 'Terminé'">
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
        <div v-if="getDeckStatus(element) === 'En cours'">
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


  
