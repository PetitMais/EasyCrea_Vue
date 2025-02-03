<template>
  <section class="container">
    
    <h1>Liste des decks</h1>
    <LogoutButton/>
     <div class="switch_container">
        <label class="switch">
          <input type="checkbox" v-model="showFinished">
          <span class="slider round"></span>
        </label>
        <span>{{ showFinished ? "Terminés" : "En cours" }}</span>
     </div>

    <button v-if="userRank === 'admin'" @click="$router.push('/deck/add')">Ajouter un deck</button>

    <DeckList :showFinished="showFinished" />
  </section>
</template>

<script>
import { ref } from 'vue';
import DeckList from '@/components/DeckList.vue';
import LogoutButton from '@/components/LogoutButton.vue';

const userRank = sessionStorage.getItem("userRank");
export default {
  components: { DeckList, LogoutButton},
  setup() {
    const userRank = ref(sessionStorage.getItem("userRank"));
    const showFinished = ref(false); 

    return { userRank, showFinished };
  }
};
</script>

<style scoped>
  .container{
    display: flex;
    flex-direction: column;
    justify-content:start;
    align-items: center;
    gap: 15px;
  }
  .switch_container{
    display: flex;
    flex-direction: column;
    justify-content: center;
      align-items: center;
  }
</style>

<style>
button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}
*/
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #3644DB;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
input{
  opacity: 0;
}

input:checked+.slider {
  background-color: #44DB36;
}

input:focus+.slider {
  box-shadow: 0 0 1px #44DB36;
}

input:checked+.slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
