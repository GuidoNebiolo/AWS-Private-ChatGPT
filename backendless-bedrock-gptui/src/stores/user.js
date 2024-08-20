import { onMounted, ref } from 'vue'
import { defineStore } from 'pinia'

import { BedrockClient } from '@aws-sdk/client-bedrock'
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

import { signInWithRedirect, getCurrentUser, signOut, fetchAuthSession } from 'aws-amplify/auth'
import { Hub } from 'aws-amplify/utils'

const defaultRegion = 'us-west-2'

export const useUserStore = defineStore('user', () => {
    const user = ref()

    onMounted(async () => {
        console.log('Store onMounted')
        try {
            user.value = await getCurrentUser()
        } catch (e) {
            signInWithRedirect().catch(() => null)
            return
        }
    })

    Hub.listen('auth', async ({ payload }) => {
        switch (payload.event) {
            case 'signInWithRedirect':
                user.value = await getCurrentUser()
                break
            case 'signInWithRedirect_failure':
                // handle sign in failure
                break
            case 'customOAuthState':
                break
        }
    })

    async function getBedrockClient(region = defaultRegion) {
        const session = await fetchAuthSession()
        const client = new BedrockClient({
            region,
            credentials: session.credentials,
        })
        return client
    }

    async function getBedrockRuntimeClient(region = defaultRegion) {
        const session = await fetchAuthSession()
        const client = new BedrockRuntimeClient({
            region,
            credentials: session.credentials,
        })
        return client
    }

    const signOutUser = async () => {
        await signOut()
        localStorage.clear()
        user.value = undefined
    }

    return { user, signOutUser, fetchAuthSession, getBedrockClient, getBedrockRuntimeClient }
})