<script setup>
import ChoiceHome from './../components/ChoiceHome.vue';
</script>

<template>
  <section>
    <h1>EasyCrea</h1>
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
    gap: 50px;
  }

  section>div{
    display: flex;
    align-items: center;
    justify-content: center;
    
  }

  h1{
    font-size: xxx-large;
    font-style: italic;
    text-decoration: underline;
    
  }
</style>
