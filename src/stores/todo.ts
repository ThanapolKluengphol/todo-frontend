import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'http://localhost:3333/api/todos'

export interface Todo {
  id: number
  title: string
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    // ดึงรายการ Todo ทั้งหมด
    async fetchTodos() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get(API_URL)
        this.todos = response.data
      } catch (err) {
        this.error = 'ไม่สามารถดึงข้อมูลรายการ Todo ได้'
      } finally {
        this.loading = false
      }
    },

    // เพิ่ม Todo ใหม่
    async addTodo(title: string) {
      if (!title.trim()) return
      try {
        const response = await axios.post(API_URL, { title })
        this.todos.push(response.data)
      } catch (err) {
        this.error = 'ไม่สามารถเพิ่มรายการ Todo ได้'
      }
    },

    // อัปเดตสถานะ หรือชื่อ Todo
    async updateTodo(id: number, payload: Partial<{ title: string; isCompleted: boolean }>) {
      try {
        const response = await axios.put(`${API_URL}/${id}`, payload)
        const index = this.todos.findIndex(t => t.id === id)
        if (index !== -1) {
          this.todos[index] = response.data
        }
      } catch (err) {
        this.error = 'ไม่สามารถอัปเดตรายการ Todo ได้'
      }
    },

    // ลบ Todo
    async deleteTodo(id: number) {
      try {
        await axios.delete(`${API_URL}/${id}`)
        this.todos = this.todos.filter(t => t.id !== id)
      } catch (err) {
        this.error = 'ไม่สามารถลบรายการ Todo ได้'
      }
    }
  }
})