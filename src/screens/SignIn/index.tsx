import React from 'react'
import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  Footer,
  SignInTitle
} from './styles'

import AppleSvg from '../../assets/apple.svg'
import GoogleeSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { RFValue } from 'react-native-responsive-fontsize'

export function SignIn(){
  return(
    <Container>
    <Header>
      <TitleWrapper>
        <LogoSvg
          width={RFValue(200)}
          height={RFValue(200)}
        />
        <Title>
          Controle suas 
          finanças de forma
          muito simples
        </Title>
      </TitleWrapper>
      <SignInTitle>
        Faça o seu login com
        uma das contas abaixo
      </SignInTitle>
    </Header>

    <Footer>

    </Footer>
        
    </Container>
  )
}
