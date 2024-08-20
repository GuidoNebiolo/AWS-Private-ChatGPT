<template>
  <div class="chat-container">
    <header>
      <h1>AI Chat</h1>
      <select v-model="selectedModelId" @change="setModel">
        <option v-for="model in models" :key="model.modelId" :value="model.modelId">
          {{ model.providerName }} - {{ model.modelName }}
        </option>
      </select>
    </header>
    <main>
      <div class="message-list">
        <div v-for="(message, index) in messages" :key="index" :class="['message', message.role]">
          {{ message.content[0].text }}
        </div>
      </div>
    </main>
    <footer>
      <form @submit.prevent="sendMessage">
        <input v-model="userInput" type="text" placeholder="Type your message...">
        <button type="submit" :disabled="isLoading || !selectedModelId">Send</button>
        <button type="button" :disabled="isLoading || messages.length <= 0" @click="clearChat">Clear</button>
      </form>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from "./stores/user";
const userStore = useUserStore()

import { useChatStore } from './stores/chat'
const chatStore = useChatStore()

import { ListFoundationModelsCommand } from '@aws-sdk/client-bedrock'

const models = ref([])

const userInput = ref('')
const messages = computed(() => chatStore.messages)
const isLoading = computed(() => chatStore.isLoading)
const selectedModelId = computed(() => chatStore.selectedModelId)

const sendMessage = async () => {
  if (!userInput.value.trim()) return
  await chatStore.sendMessage(userInput.value)
  userInput.value = ''
}

const clearChat = async (event) => {
  chatStore.clearChat()
}

const setModel = async (event) => {
  chatStore.setModel(models.value.find(e => e.modelId === event.target.value))
}

onMounted(async () => {
  console.log('App.vue onMounted')
  try {
    models.value = (await (await userStore.getBedrockClient()).send(new ListFoundationModelsCommand({ byInferenceType: "ON_DEMAND", byOutputModality: "TEXT" }))).modelSummaries
  } catch (e) {
    console.error(e)
    return
  }
})
</script>

<style scoped>
.chat-container {
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}

header {
  text-align: center;
}

.message-list {
  overflow-y: auto;
  padding: 1rem;
}

footer form {
  display: flex;
  gap: 0.5rem;
}

input {
  flex-grow: 1;
  padding: 0.5rem;
}

button {
  padding: 0.5rem 1rem;
}

.message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.user {
  background-color: #e0f0ff;
  align-self: flex-end;
}

.assistant {
  background-color: #f0f0f0;
  align-self: flex-start;
}

.error {
  background-color: #ffe0e0;
  color: #ff0000;
}

select {
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>
