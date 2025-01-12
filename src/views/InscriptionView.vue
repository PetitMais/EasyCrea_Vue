<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Champs du formulaire
const name = ref('');
const mail = ref('');
const password = ref('');
const sexe = ref('');
const date = ref('');
const errorMessage = ref('');

// Calculer la date maximale pour la naissance (aujourd'hui)
const maxDate = new Date().toISOString().split('T')[0];

// Fonction pour gérer l'inscription
async function handleInscription(event) {
  event.preventDefault();

  // Vérification côté client de la date de naissance
  if (date.value > maxDate) {
    errorMessage.value = 'La date de naissance ne peut pas être dans le futur.';
    return;
  }

  const bodyData = {
    name: name.value,
    mail: mail.value,
    password: password.value,
    sexe: sexe.value,
    date: date.value,
  };

  try {
    const response = await fetch('https://mdubois.alwaysdata.net/apiReigns/v3/reigns/createur', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    });

    // Assurez-vous que la réponse est correcte
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Attendez que la réponse soit convertie en JSON
    const data = await response.json();
    console.log(data); // Vérifiez ce que l'API retourne

    if (data.success === true) {
      // Si l'inscription réussit, redirigez l'utilisateur vers la page '/deck'
      router.push('/deck');
      sessionStorage.removeItem("choiceRank");
      sessionStorage.setItem("userRank", choiceRank.value);
    } else {
      // Sinon, affichez le message d'erreur
      console.log(data);
      document.getElementById("mail").style.borderColor = "red";
      errorMessage.value = data.message || "L'email est déjà utilisé";
    }
  } catch (error) {
    console.error('Erreur lors de l’inscription :', error);
    errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.';
  }
}
</script>

<template>
  <h1>Inscription</h1>
  <form @submit="handleInscription" class="form-inscription">
    <label>
      Nom :
      <input type="text" v-model="name" required />
    </label>
    <label>
      Email :
      <input type="email" v-model="mail" id="mail" required />
    </label>
    <label>
      Mot de passe :
      <input type="password" v-model="password" required />
    </label>
    <label>
      Sexe :
      <select v-model="sexe" required>
        <option value="F">Féminin</option>
        <option value="M">Masculin</option>
      </select>
    </label>
    <label>
      Date de naissance :
      <input type="date" v-model="date" :max="maxDate" required />
    </label>
    <button type="submit">S'inscrire</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.form-inscription {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: bold;
}

button {
  background-color: #3644db;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
}

button:hover {
  background-color: #2c37b3;
}

.error {
  color: red;
  font-size: 14px;
}
</style>
