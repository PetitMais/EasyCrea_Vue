<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleSubmit(event) {
  event.preventDefault();

  // Déterminer l'URL de la requête en fonction du rôle
  const userRank = sessionStorage.getItem('userRank');
  let apiUrl = '';

  if (userRank === 'admin') {
    apiUrl = 'https://mdubois.alwaysdata.net/apiReigns/v3/reigns/administrateur/check';
  } else if (userRank === 'créateur') {
    apiUrl = 'https://mdubois.alwaysdata.net/apiReigns/v3/reigns/createur/check';
  } else {
    errorMessage.value = 'Rôle non défini.';
    return;
  }

  try {
    // Requête POST avec les identifiants
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: email.value,
        password: password.value,
      }),
    });

    const data = await response;
     
    console.log(data);

    if (data.check === 'true') {
      // Redirection vers la page "Deck"
      router.push('/deck');
    } else {
      // Afficher un message d'erreur
      errorMessage.value = 'Identifiants incorrects.';
    }
  } catch (error) {
    console.error('Erreur lors de la requête :', error);
    errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.';
  }
}
</script>

<template>
  <h1>Connexion</h1>
  <form @submit="handleSubmit" class="connexion">
    <label>
      Adresse mail :
      <input type="email" v-model="email" required>
    </label>
    <label>
      Mot de passe :
      <input type="password" v-model="password" required>
    </label>
    <button type="submit">Se connecter</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.connexion {
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  margin-bottom: 10px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  margin-top: 10px;
}

@media (min-width: 1024px) {
  .connexion {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
