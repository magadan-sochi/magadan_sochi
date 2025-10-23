import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Укажите здесь имя вашего репозитория на GitHub.
  // Например, если ваш репозиторий https://github.com/user/my-app,
  // то base должен быть '/my-app/'.
  // Судя по контексту, ваш репозиторий называется magadan_sochi.
  base: '/magadan_sochi/',
})
