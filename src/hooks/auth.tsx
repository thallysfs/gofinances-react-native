import React, { createContext, ReactNode, useContext } from 'react';
import * as AuthSession from 'expo-auth-session';


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
}

const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps ){
    const user = {
        id: '21285162',
        name: 'Thallys Freitas',
        email: 'thallys@hotmail.com'
    }

    //função para acessar a conta do google
    async function signInWithGoogle() {
        try {
            const CLIENT_ID = '65773108324-8oi7ik1hmoj0o181fefch9mdnribivpv.apps.googleusercontent.com';
            const REDIRECT_URI = 'https://auth.expo.io/@thallysfs/gofinances';
            const RESPONSE_TYPE = 'token'; 
            // a função do encoded é para tratar o espaço entre "profile email" para não dar zig na url do endpoint
            const SCOPE = encodeURI('profile email');

            // endpoint google + parâmetros
            const authUrl= `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope${SCOPE}`;

            const response = await AuthSession.startAsync({ authUrl});
            console.log(response);


        } catch (error) {
            throw new Error(error as string);
        }


    } 

    return (
        <AuthContext.Provider value={{ 
            user,
            signInWithGoogle 
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
