<template>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    id_carte: {
        type: [Number, String],
        required: true,
    }
});

const data = ref({}); // Objet vide pour stocker les données

const fetchCarteInfo = async () => {
    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte/id";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(props.id_carte) }),
    };
    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        data.value = jsonData;
        console.log("Info récupérée :", data.value);

        if (data.value.valeurs_choix1 && data.value.valeurs_choix2) {
            [data.value.valeurs_choix1_pop, data.value.valeurs_choix1_fin] = data.value.valeurs_choix1.split('/');
            [data.value.valeurs_choix2_pop, data.value.valeurs_choix2_fin] = data.value.valeurs_choix2.split('/');
        }        

        emit('update:carteInfo', data.value);
        console.log(`L'ordre de soumission est ${data.value.ordre_soumission}`);
        emit('update:ordreSoumission', data.value.ordre_soumission);
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
};

const emit = defineEmits(['update:carteInfo']);

onMounted(() => {
    fetchCarteInfo();
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
