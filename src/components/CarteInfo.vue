<template>
    <div class="card-container">
        <div class="pagination">
            <button v-for="(page, index) in totalPages" :key="page"
                :class="{ active: currentPage === page, validated: validatedCards.includes(index) }"
                @click="changePage(page)">
                {{ page }}
            </button>
        </div>
        
        <div v-if="currentCard" class="card-content">
            <p>{{ currentCard.texte_carte }}</p>
            <p>Choix 1 : {{ currentCard.valeurs_choix1 }}</p>
            <p>Choix 2 : {{ currentCard.valeurs_choix2 }}</p>
            <button class="validate-button" @click="validateCard(currentPage - 1)">
                Valider la carte
            </button>
            <button class="modify-button" @click="toggleModifyCard">
                Modifier la carte
            </button>
            <form v-if="isEditing" @submit.prevent="submitUpdatedCard">
                <textarea v-model="editableCard.texte_carte"></textarea>
                <input v-model="editableCard.valeurs_choix1" placeholder="Valeurs Choix 1" />
                <input v-model="editableCard.valeurs_choix2" placeholder="Valeurs Choix 2" />
                <button type="submit">Soumettre</button>
            </form>
        </div>
        <div v-else>
            <p>Chargement...</p>
        </div>
        <button class="final-validate-button" :disabled="!canValidateDeck" @click="validateDeck">
            Valider le deck
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router';
const router = useRouter();


const props = defineProps({
    id: { 
        type: [Number, String],
        required: true,
    },
});

const data = ref([]);
const currentPage = ref(1);
const validatedCards = ref([]);
const isEditing = ref(false);
const editableCard = ref({});

const getAllCarteFromDeck = async () => {
    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte/deck/id";
    const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: Number(props.id) }),
    };
    try {
        const response = await fetch(url, options);
        const jsonData = await response.json();
        if (response.ok) {
            data.value = jsonData;
        } else {
            console.error("Erreur lors de la récupération des cartes");
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
    }
};

const totalPages = computed(() => data.value.length);
const currentCard = computed(() => data.value[currentPage.value - 1]);
const canValidateDeck = computed(() => validatedCards.value.length === data.value.length);

const changePage = (page) => {
    currentPage.value = page;
};

const validateCard = (index) => {
    if (!validatedCards.value.includes(index)) {
        validatedCards.value.push(index);
    }
};

const toggleModifyCard = () => {
    isEditing.value = !isEditing.value;
    editableCard.value = { ...currentCard.value };

};

const submitUpdatedCard = async () => {
    editableCard.value.modified_date = new Date().toISOString().split("T")[0];
    const url = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/carte";
    const options = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: editableCard.value.id_carte,
            texte: editableCard.value.texte_carte,
            valChoix1: editableCard.value.valeurs_choix1,
            valChoix2: editableCard.value.valeurs_choix2,
            date: editableCard.value.date_soumission,
            ordre: editableCard.value.ordre_soumission,
            modified: "yes",
            modifiedDate: editableCard.value.modified_date,
            idCrea: editableCard.value.id_createur,
            idAdmin: editableCard.value.id_administrateur,
            idDeck: editableCard.value.id_deck,
        }),
    };
    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const index = data.value.findIndex((card) => card.id_carte === editableCard.value.id_carte);
            if (index !== -1) {
                data.value[index] = { ...editableCard.value };
            }
            isEditing.value = false;
        } else {
            console.error("Erreur lors de la mise à jour de la carte");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la carte :", error);
    }
};

const editDeckValid = async () => {
    const url2 = "https://mdubois.alwaysdata.net/apiReigns/v3/reigns/deck/valid";
    const options2 = {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            "id": Number(props.id),
            "valid": "yes"
        }),
    };
    try {
        const response = await fetch(url2, options2);
    } catch (error) {
        console.error("Erreur lors de la récupération des cartes :", error);
    }
};

const validateDeck = () => {
    editDeckValid();
    router.push('/deck');
};

onMounted(() => {
    getAllCarteFromDeck();
});
</script>

<style scoped>
.card-container {
    width: 65%;
    text-align: center;
    padding: 20px;
    color: white;
    border-radius: 8px;
}

.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

button {
    background-color: #1f1f4f;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
}

button.active {
    border: 2px solid #008cff;
    background-color: #34346a;
}

button.validated {
    background-color: #00a300;
}


.validate-button {
    background-color: #00a300;
    margin: 10px;
}

.modify-button {
    background-color: #ffa500;
    margin: 10px;
}

.final-validate-button {
    margin-top: 20px;
    background-color: #00a300;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.final-validate-button:disabled {
    background-color: #555555;
    cursor: not-allowed;
}

.card-content form {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

textarea,
input {
    display: block;
    width: 250px;
    height: 30px;
    margin: 5px 0;
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
}

textarea {
    height: 80px;
    }
</style>