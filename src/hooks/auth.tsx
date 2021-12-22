import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import { Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage'

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface AuthProviderProps {
    children: ReactNode
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface AuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;

}

interface AuthorizationResponse {
    params: {
        access_token: string;
    },
    type: string; 
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps ){
    const [user, setUser] = useState<User>({} as User);
    const [userStorageLoading, setUserStorageLoading] = useState(true);


    const userStorageKey = '@gofinances:user';

    //função para acessar a conta do google
    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = 'token'; 
            // a função do encoded é para tratar o espaço entre "profile email" para não dar zig na url do endpoint
            const SCOPE = encodeURI('profile email');

            // endpoint google + parâmetros
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
            
            const { type, params } = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;

            console.log(type, params)
            
            if(type === 'success'){
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();

                setUser({
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                })
                //await AsyncStorage.setItem(userStorageKey, JSON.stringify());
            }
            

        } catch (error) {
            throw new Error(error as string);
        }


    } 

    //função para acessar a conta apple
    async function signInWithApple(){
        try {
            const credencial = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });

            if(credencial){
                //const userLogged
                const name = credencial.fullName?.givenName!;
                //api para gerar imagem a partir da inicial do nome
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

                const userLogged = {
                    id: String(credencial.user),
                    email: credencial.email!,
                    name,
                    photo
                }
                setUser(userLogged);
                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
            }

            
        } catch (error) {
            throw new Error(error as string);
            
        }
    }

    // função de logout
    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(userStorageKey);

            if(userStorage){
                const userLoged = JSON.parse(userStorage) as User;
                setUser(userLoged);
            }

            setUserStorageLoading(false);
        }

        loadUserStorageData();
    }, [])

    return (
        <AuthContext.Provider value={{ 
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading 
        }}>
            { children }
        </AuthContext.Provider>
    )
}

function useAuth(){
    const context = useContext(AuthContext)

    return context;
}

export { AuthProvider, useAuth}
