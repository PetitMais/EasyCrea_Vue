<script setup>
    defineProps({
    msg: {
        type: String,
        required: true
    }
    })
</script>

<template>
    <button>{{ msg }}</button>
</template>

<style scoped>
button {
    background-color: #3644DB;   
} 
</style>