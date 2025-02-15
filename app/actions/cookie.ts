"use server"
import { cookies } from 'next/headers'


export async function getAuth() {
    const cookieStore = cookies()
    const auth = (await cookieStore).get("user")
    return auth
}

export async function setAuth(token: string) {
    const cookieStore = await cookies()
    cookieStore.set('user', token)
}

export async function deleteAuth() {
    const cookieStore = await cookies()
    cookieStore.set('user', 'false' )
}




