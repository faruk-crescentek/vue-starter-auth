import axios from '@axios';
import { defineStore } from 'pinia';

export const useCategoryStore = defineStore('CategoryStore', {
  actions: {
    // 👉 Fetch categories data
    fetchCategories(params) { return axios.get('/categories', { params }) },

    // 👉 Add Category
    addCategory(data) {
      return new Promise((resolve, reject) => {
        axios.post('/categories', {
          name: data.name
        })
        .then(response => resolve(response))
        .catch(error => reject(error))
      })
    },

    // 👉 fetch single Category
    fetchCategory(id) {
      return new Promise((resolve, reject) => {
        axios.get(`/categories/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },

    // 👉 update single category
    updateCategory(id, data) {
        return new Promise((resolve, reject) => {
            axios.put(`/categories/${id}`, {
                name: data.name
            })
            .then(response => resolve(response))
            .catch(error => reject(error))
        })
    },

    // 👉 Delete Category
    deleteCategory(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/categories/${id}`).then(response => resolve(response)).catch(error => reject(error))
      })
    },
  },
})
