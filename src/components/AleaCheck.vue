<template>
    <div v-if="data.inexistant">
    </div>
    <div v-if="data.num_carte">
    </div>
    <div v-else>
        <span>Chargement des informations de la carte aléatoire...</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['update:carteRng']);

const props = defineProps({
    id_createur: {
        type: [Number, String],
        required: true,
    },
    id_deck: {
        type: [Number, String],
        required: true,
    }
});

const data = ref({});

const fetchRngInfo = async () => {
    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte/alea/search";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_createur: Number(props.id_createur), id_deck: Number(props.id_deck) }),
    };
    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        data.value = jsonData;

        if (data.value.inexistant === true) {
            await createCarte();
        } else if (typeof data.value.num_carte !== 'undefined') {
            emit('update:carteRng', data.value.num_carte);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
};

const createCarte = async () => {
    const url2 = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte/alea/create";
    const options2 = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_createur: Number(props.id_createur), id_deck: Number(props.id_deck) }),
    };
    try {
        const response = await fetch(url2, options2);
        if (response.ok) {
            fetchRngInfo();
        } else {
            console.error("Erreur lors de la création de la carte");
        }
    } catch (error) {
        console.error("Erreur lors de la création de la carte :", error);
    }
};

onMounted(() => {
    fetchRngInfo();
});
</script>


<style scoped>
h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

p {
    margin: 5px 0;
}
</style>