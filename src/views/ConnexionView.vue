
<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const choiceRank = ref('');


onMounted(() => {
  choiceRank.value = sessionStorage.getItem('choiceRank') || '';
});

async function handleSubmit(event) {
  event.preventDefault();

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
 
    
    if (data.check === true) {
      router.push('/deck');
      sessionStorage.removeItem("choiceRank");
      sessionStorage.setItem("userRank", choiceRank.value);
      sessionStorage.setItem("id", data.id);
    } else {
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
    <h1 class="titre__view">Connexion {{ choiceRank }}</h1>
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
     <RouterLink to="/inscription" v-if="choiceRank === 'créateur'">Inscription</RouterLink>
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

button {
  width: 150px;
  margin-top: 10px;
  padding: 16px;
  background-color: #44db36;
  color: white;
  font-weight: bold;
  font-size: medium;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #44db3676;
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
