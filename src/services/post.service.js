import axiosApiInstance from '@/plugins/api'

export const getAllPosts = async () => {
    return await axiosApiInstance.get('/posts/popular')
}
