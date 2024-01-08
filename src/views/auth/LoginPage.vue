<template>
    <section class="bg-gray-50 dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img
                    class="w-8 h-8 mr-2"
                    src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                    alt="logo"
                />
                Flowbite
            </a>
            <div
                class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
            >
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1
                        class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
                    >
                        Sign in to your account
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Your email</label
                            >
                            <input
                                type="email"
                                name="email"
                                id="email"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com"
                                required=""
                                v-model="email"
                            />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Password</label
                            >
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required=""
                                v-model="password"
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input
                                        id="remember"
                                        aria-describedby="remember"
                                        type="checkbox"
                                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                                    />
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 dark:text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a
                                href="#"
                                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                                >Forgot password?</a
                            >
                        </div>
                        <button
                            @click="onLogin"
                            type="submit"
                            class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Sign in
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don’t have an account yet?
                            <router-link to="register" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</router-link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authStore } from '@/stores/auth.store'
import { loginApi, loginGGApi } from '@/services/auth.service'
import { useNotification } from '@kyvg/vue3-notification'
const notification = useNotification()
const router = useRouter()
const email = ref('')
const password = ref('')
const googleLoginBtn = ref()
const auth = authStore()
// onMounted(() => {
//     console.log('onBeforeMount')
//     const gClientId = '539910609167-67i01tcoja47s71qshaeodhcc69d5u99.apps.googleusercontent.com'
//     window.google.accounts.id.initialize({
//         client_id: gClientId,
//         scope: 'user profile openid',
//         callback: handleCredentialResponse,
//         auto_select: true,
//     })
//     window.google.accounts.id.renderButton(googleLoginBtn.value, { theme: 'outline', size: 'large', width: '400' })
//     window.google.accounts.id.prompt()
// })
const handleCredentialResponse = async (res) => {
    try {
        await loginGGApi({ credential: res.credential }).then((res) => {
            const data = res.data
            console.log('data', res.data)
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
        })
        await auth.initAuthStore()
        router.push('/')
    } catch (error) {
        notification.notify({
            type: 'error',
            title: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập',
            text: error.response.data.message,
        })
    }
}
const onLogin = async () => {
    try {
        await loginApi({ email: email.value, password: password.value }).then((res) => {
            const data = res.data;
            console.log('data', data)
            localStorage.setItem('access_token', data.accessToken)
            localStorage.setItem('refresh_token', data.refreshToken)
        })
        await auth.initAuthStore()
        router.push({ name: 'dashboard' })
    } catch (error) {
        notification.notify({
            type: 'error',
            title: 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin đăng nhập',
            text: 'hihiii',
        })
        console.log(error)
    }
}
</script>
<style lang="scss" scoped></style>
