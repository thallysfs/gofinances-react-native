import React from 'react'
import {  } from '@expo/vector-icons'


import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName

} from './styles'

export function Dashboard(){
  return(
    <Container>
      <Header>
        <UserWrapper>
        <UserInfo>
          <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/50297870?v=4'}} 
          />
          <User>
            <UserGreeting>Olá</UserGreeting>
            <UserName>Thallys</UserName>
          </User>
        </UserInfo>
        </UserWrapper>  
      </Header>

    </Container>
  )
}
