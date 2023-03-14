import { defineStore } from 'pinia'

interface Todo { text: string, id: number, isFinished: boolean }
type FilterType = 'all' | 'finished' | 'unfinished';

export const useTodos = defineStore('todos', {
  state: () => {
    return {
      todos: [] as Todo[],
      filter: 'all' as FilterType,
      nextId: 0,
    }
  },
  getters: {
    finishedTodos(state) {
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    filteredTodos(state): Todo[] {
      if (this.filter === 'finished') {
        // 调用其他带有自动补全的 getters ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    addTodo(text: string) {
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
