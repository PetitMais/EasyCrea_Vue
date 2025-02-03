<template>
    <div>
      <a :href="apkLink" download>
        <button class="btn-download">Download DeckOuvert</button>
      </a>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
         apkLink: "/application-25c56845-3aec-4620-9f8e-f595086892f6.apk"
      };
    }
  }
  </script>