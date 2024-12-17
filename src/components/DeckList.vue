<template>
    <!-- Affiche dynamiquement les decks ici -->
    <section id="deckContainer">
        <article v-for="(element, index) in data" :key="index" class="deck">
            <h2>{{ element.titre_deck }}</h2>
            <p><strong>Description :</strong> {{ element.body_deck }}</p>
            <p><strong>Date de début :</strong> {{ element.date_debut_deck }}</p>
            <p><strong>Date de fin :</strong> {{ element.date_fin_deck }}</p>
            <p><strong>Nombre de cartes :</strong> {{ element.nb_cartes }}</p>
            <button>Participer au deck</button>
        </article>
    </section>
</template>

<script>
export default {
    data() {
        return {
            data: []
        };
    },
    async mounted() {
        const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck";
        const options = { method: "GET" };

        try {
            const response = await fetch(url, options);
            this.data = await response.json();
            console.log(this.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }
};
</script>

<style scoped>
.deck {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin: 10px 0;
    background-color: #3a3b72;
}
</style>