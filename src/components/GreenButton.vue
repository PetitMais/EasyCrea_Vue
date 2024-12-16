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
    background-color:#44DB36;
    
} 
</style>