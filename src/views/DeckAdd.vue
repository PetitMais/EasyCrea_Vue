<template>

    <div>
        <h1>Ajouter un deck</h1>

        <form @submit.prevent="submitForm">
            <label for="title">Titre :*</label>
            <input v-model="formData.title" id="title" type="text" minlength="3" maxlength="100" required>

            <label for="texte">Texte :*</label>
            <textarea v-model="formData.texte" id="texte" maxlength="150" required></textarea>

            <label for="date">Date de fin :*</label>
            <input v-model="formData.date" id="date" type="date" required />

            <label for="nbCartes">Nombre de carte :*</label>
            <input v-model="formData.nbCartes" id="nbCartes" type="number" min="1" required />

            <br>
            <h2>Ajouter la première carte</h2>
            <label for="texteCarte">Texte :*</label>
            <textarea v-model="formData.texteCarte" id="texteCarte" type="text" minlength="50" maxlength="280"
                required></textarea>

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

            <br>
            <p>Les données marquées d'une astérisque sont obligatoires.</p>
            <button type="submit">Ajouter un deck et sa première carte</button>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const data = ref({});
const idDeck = ref(0);


const formData = reactive({
});

const submitForm = async () => {
    console.log("Données du formulaire :", formData);

    const formattedData = {
        titre: formData.title,
        body: formData.texte,
        date_debut: dateFormatted(),
        date_fin: formData.date,
        nb_cartes: formData.nbCartes,
        nb_jaime: 0,
        id_administrateur: 1
    };

    console.log("Données formatées :", formattedData);

    await sendDeckInfo(formattedData);
    await lastIdDeck();

    const valChoix1 = `${formData.population1}/${formData.finance1}`;
    const valChoix2 = `${formData.population2}/${formData.finance2}`;

    const formattedDataCarte = {
        texte: formData.texteCarte,
        valChoix1,
        valChoix2,
        date: dateFormatted(),
        ordre: 1,
        idDeck: idDeck.value,
        idAdmin: 1,
        idCrea: null,
    };

    console.log("Données formatées Carte:", formattedDataCarte);
    console.log("Objet idDeck:", idDeck);
    console.log("Valeur idDeck:", idDeck.value);

    await sendCarteInfo(formattedDataCarte);

    router.push('/deck');
};

const dateFormatted = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    console.log(formattedDate);
    return formattedDate;

}

const sendDeckInfo = async (formattedData) => {
    console.log(formattedData);

    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
    };
    try {
        await fetch(url, options);
        console.log("Deck envoyé");

    } catch (error) {
        console.error("Erreur lors de l'envoie des données :", error);
    }
};
const lastIdDeck = async () => {

    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/lastadd";
    const options = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };
    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        data.value = jsonData;
        return idDeck.value = data.value.id_deck;

    } catch (error) {
        console.error("Erreur lors de l'envoie des données :", error);
    }
};
const sendCarteInfo = async (formattedDataCarte) => {
    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedDataCarte),
    };
    try {
        await fetch(url, options);
        console.log('Succès envoie info carte vers BDD');

    } catch (error) {
        console.error("Erreur lors de l'envoie des données :", error);
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

.carte-details>h2 {
    text-align: center;
}

.choice p {
    text-indent: 1rem;
}
</style>