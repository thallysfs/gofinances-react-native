import React from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper';

import { HighLightCard }   from '../../Components/HighLightCard'
import { TransactionCard, TransactionCardProps } from '../../Components/TransactionCard'


import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighLightCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton

} from './styles'

// herdando o tipo e acrescentando o 'id'
export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard(){
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: "Desenv de Sites",
      amount: "R$ 12.000,00",
      category: {
        name: 'vendas',
        icon: 'dollar-sign'
      },
      date: "13/04/2021"
    },
    {
      id: '2',
      type: 'negative',
      title: "Humburguer Piz",
      amount: "R$ 59,00",
      category: {
        name: 'alimentação',
        icon: 'coffee'
      },
      date: "13/04/2021"
    },
    {
      id: '3',
      type: 'negative',
      title: "Aluguel do AP",
      amount: "R$ 1.200,00",
      category: {
        name: 'casa',
        icon: 'shopping-bag'
      },
      date: "10/04/2021"
    }
];

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
        
        <LogoutButton onPress={() => {}}>
          <Icon name="power" />
        </LogoutButton>
        </UserWrapper>  
      </Header>

      <HighLightCards> 
        <HighLightCard 
          title="Entradas" 
          amount="R$ 17.400,00" 
          lastTransaction="Última entrada de 13 de abril"
          type="up"
        />
        <HighLightCard 
          title="Saídas" 
          amount="R$ 1.259,00" 
          lastTransaction="Última entrada de 3 de abril "
          type="down"
        /> 
        <HighLightCard 
          title="Total" 
          amount="R$ 16.141,00" 
          lastTransaction="01 a 16 de Abril"
          type="total"
        />
      </HighLightCards>

      <Transactions>
        <Title>Listagem</Title>

         <TransactionList 
          data={data}
          keyExtractor={ item => item.id}
          renderItem={({ item })=> <TransactionCard data={item} /> }
        />

      </Transactions>  

    </Container>
  )
}
