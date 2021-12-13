import React, { useContext } from 'react'
import { Alert } from 'react-native'
import { 
  Container,
  Header,
  TitleWrapper,
  Title,
  Footer,
  SignInTitle,
  FooterWrapper
} from './styles'

import AppleSvg from '../../assets/apple.svg'
import GoogleeSvg from '../../assets/google.svg'
import LogoSvg from '../../assets/logo.svg'
import { RFValue } from 'react-native-responsive-fontsize'
import { SignInSocialButton } from '../../Components/SignInSocialButton'

import { useAuth } from '../../hooks/auth';

export function SignIn(){
  const { signInWithGoogle } = useAuth();

  async function handleSignInWithGoogle(){
    try {
      await signInWithGoogle();

    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível conectar a conta Google');
    }
  }


  return(
    <Container>
    <Header>
      <TitleWrapper>
        <LogoSvg
          width={RFValue(120)}
          height={RFValue(68)}
        />
        <Title>
          Controle suas {`\n`}
          finanças de forma {`\n`}
          muito simples
        </Title>
      </TitleWrapper>
      <SignInTitle>
        Faça o seu login com {`\n`}
        uma das contas abaixo
      </SignInTitle>
    </Header>

    <Footer>
      <FooterWrapper>
        <SignInSocialButton 
          title='Entrar com Google'
          svg={GoogleeSvg}
          onPress={handleSignInWithGoogle}
        />      
        
        <SignInSocialButton 
          title='Entrar com Apple'
          svg={AppleSvg}
        />
      </FooterWrapper>
    </Footer>
    </Container>
  )
}
