<!-- <template>
    <section id="deckContainer">
        <article v-for="(element, index) in data" :key="index" class="deck">
            <h2>{{ element.titre_deck }}</h2>
            <p><strong>Description :</strong> {{ element.body_deck }}</p>
            <p><strong>Date de début :</strong> {{ element.date_debut_deck }}</p>
            <p><strong>Date de fin :</strong> {{ element.date_fin_deck }}</p>
            <p><strong>Nombre de cartes :</strong> {{ element.nb_cartes }}</p>
            <router-link :to="{ name: 'carteAdd', params: { id: element.id_deck } }">
                <button>Participer au deck</button>
            </router-link>
            <router-link :to="{ name: 'deckParticipation', params: { id: element.id_deck } }">
                <button>Afficher votre participation</button>
            </router-link>
        </article>
    </section>
</template>

<script>
export default {
    data() {
        return {
            data: [] // Stocke les données récupérées depuis l'API
        };
    },
    async mounted() {
        // Appel API pour récupérer les decks
        const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck";
        const options = { method: "GET" };

        try {
            const response = await fetch(url, options);
            this.data = await response.json(); // Met à jour les données
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
    background-color: #32265e;
}

button {
    cursor: pointer;
    padding: 8px 12px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
}

button:hover {
    background-color: #0056b3;
}
</style> -->
<template>
    <section id="deckContainer">
        <article v-for="(element, index) in data" :key="index" class="deck">
            <h2>{{ element.titre_deck }}</h2>
            <p><strong>Description :</strong> {{ element.body_deck }}</p>
            <p><strong>Date de début :</strong> {{ element.date_debut_deck }}</p>
            <p><strong>Date de fin :</strong> {{ element.date_fin_deck }}</p>
            <p><strong>Nombre de cartes :</strong> {{ element.nb_cartes }}</p>

            <router-link :to="{ name: 'carteAdd', params: { id: element.id_deck } }">
                <button>Participer au deck</button>
            </router-link>
            <router-link :to="{ name: 'deckParticipation', params: { id: element.id_deck } }">
                <button>Afficher votre participation</button>
            </router-link>
        </article>
    </section>
</template>

<script>
export default {
    data() {
        return {
            data: [] // Stocke les decks récupérés
        };
    },
    async mounted() {
        const userId = sessionStorage.getItem("id");
        const userRank = sessionStorage.getItem("userRank");

        let url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck";
        let options = { method: "GET" };

        // Si l'utilisateur est admin, on change l'URL et la méthode en POST
        if (userRank === "admin") {
            url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/participation/admin";
            options = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId })
            };
        }

        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

            this.data = await response.json(); // Met à jour les decks
            console.log(this.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    }
};
</script>


