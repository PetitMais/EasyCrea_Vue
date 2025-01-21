<!-- <script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

async function handleSubmit(event) {
  event.preventDefault();

  // Déterminer l'URL de la requête en fonction du rôle
  const choiceRank = sessionStorage.getItem('choiceRank');
  let apiUrl = '';

  if (choiceRank === 'admin') {
    apiUrl = 'https://mdubois.alwaysdata.net/apiReigns/v3/reigns/administrateur/check';
  } else if (choiceRank === 'créateur') {
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

    const data = await response.json();
     
    console.log(data);
    console.log(data.check);

    if (data.check == true) {
      // Redirection vers la page "Deck"
      router.push('/deck');
      sessionStorage.removeItem("choiceRank");
      sessionStorage.setItem("userRank", choiceRank);
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
  <button>inscription</button>
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
</style> -->
<script setup>
import BlueButton from '@/components/BlueButton.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const choiceRank = ref('');

// Charger `choiceRank` depuis `sessionStorage` lors du montage du composant
onMounted(() => {
  choiceRank.value = sessionStorage.getItem('choiceRank') || '';
});

async function handleSubmit(event) {
  event.preventDefault();

  // Déterminer l'URL de la requête en fonction du rôle
  let apiUrl = '';

  if (choiceRank.value === 'admin') {
    apiUrl = 'https://mdubois.alwaysdata.net/apiReigns/v3/reigns/administrateur/check';
  } else if (choiceRank.value === 'créateur') {
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

    const data = await response.json();
    console.log(data.id);
    
    if (data.check === true) {
      // Redirection vers la page "Deck"
      router.push('/deck');
      sessionStorage.removeItem("choiceRank");
      sessionStorage.setItem("userRank", choiceRank.value);
      sessionStorage.setItem("id", data.id);
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
  <section>
    <h1 class="titre__view">Connexion</h1>
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
      <!-- Bouton affiché uniquement si choiceRank est 'créateur' -->
      <RouterLink to="/inscription" v-if="choiceRank === 'créateur'">Inscription</RouterLink>
      <!-- Bouton retour -->
      <RouterLink to="/" id="back">Retour</RouterLink>
  </section>



</template>

<style scoped>
  section{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 25px;

    h1{
    font-size: xxx-large;
    font-style: italic;
    text-decoration: underline;   
    }
  }

.connexion{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;

  label{
    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 5px;
  }
  
  label>input{
    width: 250px;
    height: 30px;
  }
}

/* Ajout de styles pour le bouton */
button {
  width: 150px;
  margin-top: 10px;
  padding: 16px;
  background-color: #42b983;
  color: white;
  font-weight: bold;
  font-size: medium;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369f76;
}

.error {
  color: red;
  margin-top: 10px;
}
#back{
  color: red;
}
#back:hover{
  background-color: rgba(255, 0, 0, 0.236);
}
</style>
