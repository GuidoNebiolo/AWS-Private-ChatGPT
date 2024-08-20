import { ref } from "vue";
import { defineStore } from 'pinia'
import { ConverseCommand, ConverseStreamCommand } from "@aws-sdk/client-bedrock-runtime";
import { useLocalStorage } from '@vueuse/core'

import { useUserStore } from "./user";

export const useChatStore = defineStore('chat', () => {
    const userStore = useUserStore()

    const messages = useLocalStorage('messages', ref([]))
    const selectedModel = ref({})
    const selectedModelId = ref("")
    const isLoading = ref(false)

    async function sendMessage(content) {
        const userMessage = { role: 'user', content: [{ text: content }] }

        const bedrockRuntimeClient = await userStore.getBedrockRuntimeClient()

        this.messages.push(userMessage)

        try {
            this.isLoading = true

            const input = {
                modelId: this.selectedModel.modelId,
                messages: this.messages
            }
            let assistantResponse = ""

            if (this.selectedModel.responseStreamingSupported) {
                const response = await bedrockRuntimeClient.send(new ConverseStreamCommand(input));
                this.messages.push({ role: 'assistant', content: [{ text: assistantResponse }] })
                for await (const item of response.stream) {
                    if (item.contentBlockDelta) {
                        assistantResponse += item.contentBlockDelta.delta?.text;
                        this.messages[this.messages.length - 1] = { role: 'assistant', content: [{ text: assistantResponse }] }
                    }
                }

            } else {
                const response = await bedrockRuntimeClient.send(new ConverseCommand(input));
                assistantResponse = response.output.message.content[0].text;
                this.messages.push({ role: 'assistant', content: [{ text: assistantResponse }] })
            }

        } catch (error) {
            console.error(error);

        } finally {
            this.isLoading = false
        }

    }
    function setModel(model) {
        this.selectedModelId = model.modelId
        this.selectedModel = model
    }

    function clearChat() {
        localStorage.removeItem('messages')
        this.messages = useLocalStorage('messages', ref([]))
    }

    return { messages, selectedModel, selectedModelId, isLoading, sendMessage, setModel, clearChat }
})