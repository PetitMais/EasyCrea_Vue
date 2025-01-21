<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function setRank(rank) {
  sessionStorage.setItem('choiceRank', rank);
}

</script>

<template>
  <div class="account_pick">
    <h2>Sélectionner votre profil</h2>
    <div>
      <RouterLink id="admin" to="/connexion" @click="() => setRank('admin')">
          <img src="./../assets/user-svgrepo-com.svg" alt="user_image">
        Administrateur
      </RouterLink>
      <RouterLink id="createur" to="/connexion" @click="() => setRank('créateur')">
        <img src="./../assets/user-svgrepo-com.svg" alt="user_image">
        Créateur
      </RouterLink>
    </div>

  </div>


</template>

<style scoped>
  .account_pick{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 50px;
  }

  div>div{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 50px;
  }

  #createur, #admin{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    padding: 15px ;
  }
  img{
    width: 150px;
    height: auto;
    border: 3px solid white;
    border-radius: 50%;
   
  }
</style>
