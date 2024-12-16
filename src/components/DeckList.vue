<script setup>
    defineProps({
    msg: {
        type: String,
        required: false
    }
    })
</script>

<template>
    <p>{{ msg }}</p>
</template>

<style scoped>
</style>