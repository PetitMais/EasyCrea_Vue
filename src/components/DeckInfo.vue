<template>
  <div v-if="data.titre_deck">
    <span style="word-wrap: break-word;">{{ data.titre_deck }}</span>
  </div>
  <div v-else>
    <span>Chargement des informations du deck...</span>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(['update:nbCartes']);

const data = ref({});

const fetchDeckInfo = async () => {
  const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/id";
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(props.id) }),
  };
  try {
    const response = await fetch(url, options);
    const jsonData = await response.json();
    data.value = jsonData;

    emit('update:nbCartes', data.value.nb_cartes);

  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
  }
};

onMounted(() => {
  fetchDeckInfo();
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
