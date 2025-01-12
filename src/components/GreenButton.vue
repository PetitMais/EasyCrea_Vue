<script setup>
    defineProps({
    msg: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    }
    })
</script>

<template>
    <a :href="url">{{ msg }}</a>
</template>

<style scoped>
button {
    background-color:#44DB36;
} 
</style>