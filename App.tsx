import React from 'react';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components'

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import theme from './src/global/styles/theme'
import { Register } from './src/screens/Register';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  })

  //se as fonts não estiverem carregadas, a tela de splah continua sendo exibida
  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <Register />
    </ThemeProvider>
  )
}
