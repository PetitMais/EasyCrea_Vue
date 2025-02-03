<script setup>
import ChoiceHome from './../components/ChoiceHome.vue';
import DownloadAPK from '@/components/DownloadAPK.vue';
</script>

<template>
  <section>
    <h1>EasyCrea</h1>
    <p>
      <span>EasyCrea</span> est une application web qui a pour objectif de créer plusieurs jeux de cartes. 
      Ces jeux de cartes serviront à alimenter le jeu <span>DeckOuvert</span>, un jeu basé sur un système de choix et de compteur.
    </p>
    <div>
      <p>Si vous voulez y jouer:</p>
      <DownloadAPK></DownloadAPK>
    </div>
    <ChoiceHome/>
  </section>
</template>

<style scoped>
  section{
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
  }

  section>div{
    display: flex;
    align-items: center;
    justify-content: center;
    
  }

  section>div:nth-child(3){
    flex-direction: column; 
    gap: 15px;  
  }
  section>div:nth-child(3)>p{
    flex-direction: column; 
    text-align: center;
    width: 100%;  
  }

  p{
    width: 50%;
    max-width: 400px;
    text-align: justify;
  }
  span{
    font-weight: bold;
  }
</style>
