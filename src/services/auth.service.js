import axiosApiInstance from '@/plugins/api'

export const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token')
    const data = {
        refreshToken: refresh_token,
    }
    return await axiosApiInstance.post('/auth/refresh-tokens', data)
}
export const loginApi = async (data) => {
    console.log(data)
    return await axiosApiInstance.post('/auth/login', data)
}
export const loginGGApi = async (data) => {
    return await axiosApiInstance.post('/auth/login-gg', data)
}
export const registerApi = async (data) => {
    return await axiosApiInstance.post('/users', data)
}
export const getMyInformation = async () => {
    return await axiosApiInstance.get('/users/me')
}