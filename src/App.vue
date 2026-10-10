<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTodoStore, type Todo } from './stores/todo' 

const todoStore = useTodoStore()
const newTodoTitle = ref('')

onMounted(() => {
  todoStore.fetchTodos()
})

const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return
  await todoStore.addTodo(newTodoTitle.value)
  newTodoTitle.value = ''
}


const toggleComplete = (todo: Todo) => {
  todoStore.updateTodo(todo.id, { isCompleted: !todo.isCompleted })
}

const handleDelete = (id: number) => {
  todoStore.deleteTodo(id)
}
</script>

<template>
  <main class="container">
    <h1>My Todo App</h1>

    <!-- ฟอร์มเพิ่มรายการ -->
    <form @submit.prevent="handleAddTodo" class="input-form">
      <input
        v-model="newTodoTitle"
        type="text"
        placeholder="เพิ่มรายการใหม่ที่ต้องทำ..."
      />
      <button type="submit">เพิ่ม</button>
    </form>

    <!-- สถานะ Loading และ Error -->
    <p v-if="todoStore.loading">กำลังโหลดข้อมูล...</p>
    <p v-if="todoStore.error" class="error">{{ todoStore.error }}</p>

    <!-- รายการ Todo -->
    <ul v-if="!todoStore.loading" class="todo-list">
      <li v-for="todo in todoStore.todos" :key="todo.id" class="todo-item">
        <div class="todo-content">
          <input 
            type="checkbox" 
            :checked="todo.isCompleted" 
            @change="toggleComplete(todo)"
          />
          <span
            :class="{ completed: todo.isCompleted }"
            @click="toggleComplete(todo)"
          >
            {{ todo.title }}
          </span>
        </div>
        <button @click="handleDelete(todo.id)" class="delete-btn">ลบ</button>
      </li>
    </ul>
  </main>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.input-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 16px;
  font-size: 16px;
  background-color: #4cae50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-item span {
  cursor: pointer;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.todo-content input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.completed {
  text-decoration: line-through;
  color: #888;
}

.delete-btn {
  background-color: #f44336;
}

.error {
  color: red;
}
</style>