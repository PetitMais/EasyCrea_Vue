<template>
  <h1>Connexion</h1>
  <form action="" class="connexion">
    <label>
      Adresse mail :
      <input type="email" required>
    </label>
    <label>
      Mot de passe :
      <input type="password" required>
    </label>
    <button type="submit">Se connecter</button>
  </form>
</template>

<style>
@media (min-width: 1024px) {
  .connexion {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
