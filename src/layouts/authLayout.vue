<template>
    <div v-if="auth.isLoggedIn"  class="flex min-h-screen">
        <div class="flex flex-col flex-grow bg-white dark:bg-gray-900">
            <the-header />
            <div class="mb-auto flex">
                <div class="w-full rounded-3xl">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import TheHeader from '@/components/layouts/TheHeader.vue'
import { authStore } from '@/stores/auth.store'
const auth = authStore();
</script>
