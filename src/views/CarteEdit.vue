<template>
    <div class="container">
        <h1>Modifier une carte au deck</h1>
        <DeckInfo :id="Number(id)" @update:nbCartes="handleNbCartes" />
        <div class="container">
            <CarteInfo :id="Number(id)"></CarteInfo>
        </div>
    </div>
    <RouterLink to="/deck" id="back">Retour</RouterLink>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import DeckInfo from '@/components/DeckInfo.vue';
import CarteInfo from '@/components/CarteInfo.vue';

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
    if (!userId) {
        router.replace('/');
    }
    console.log("Valeur de l'id reçue :", props.id);
});

const carteInfo = ref(null);
const nbCartes = ref(null);

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
.container {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    gap: 15px;
}

.switch_container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

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
.pagination  {
    margin: 1rem;
    cursor: pointer;
}
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.carte-details {
    margin-top: 20px;
    margin-bottom: 10px;
    padding: 20px;
    background-color: #007bff17;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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