import React, { useEffect, useState, useCallback } from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useFocusEffect } from '@react-navigation/native'

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

interface HighLigthProps {
  amount: string;
}

interface HighlightData {
  entries: HighLigthProps;
  expensives: HighLigthProps;
  total: HighLigthProps;


}

export function Dashboard(){
  const [transactions, setTransactions] = useState<DataListProps[]>();
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  async function loadTransactions(){
    const dataKey = '@gofinance:transections';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    //criando variável para percorrer array e formatar os dados
    const transactionsFormatted: DataListProps[] = transactions
    .map((item: DataListProps) =>{

      //Checando se é uma entrada e somando todas as entradas
      if(item.type === 'positive'){
        entriesTotal += Number(item.amount);
      } else {
        expensiveTotal += Number(item.amount);
      }

      const amount = Number(item.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      
      const date = Intl.DateTimeFormat('pt-BR',{
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return {
        id: item.id,
        name: item.name,
        amount,
        type: item.type,
        category: item.category,
        date
      }

    });

    const total = entriesTotal - expensiveTotal; 

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })
      }

    });

    setTransactions(transactionsFormatted);

    //pegando a data da última transação
    //filtrando somente entradas e percorrendo para prgar somente a data
    //Math.max usado para ver o número maior, pois ocnverto a data em número, número maior = data mais recente
    const lastTransactionsEntries = Math.max.apply(Math, transactions
      .filter( ( transaction : DataListProps)  => transaction.type === 'positive')
      .map((transaction : DataListProps) => new Date(transaction.date).getTime())  
    )



  }

  useEffect(()=>{
    loadTransactions();

  }, [])

  // o useFocsEffect faz o componente recarregar nos caso de tabnavigation onde o componente não recarregaria
  // e portanto o useEffect não surtiria efeito.
  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));

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
          amount={highlightData?.entries?.amount}
          lastTransaction="Última entrada de 13 de abril"
          type="up"
        />
        <HighLightCard 
          title="Saídas" 
          amount={highlightData?.expensives?.amount}
          lastTransaction="Última entrada de 3 de abril "
          type="down"
        /> 
        <HighLightCard 
          title="Total" 
          amount={highlightData?.total?.amount} 
          lastTransaction="01 a 16 de Abril"
          type="total"
        />
      </HighLightCards>

      <Transactions>
        <Title>Listagem</Title>

         <TransactionList 
          data={transactions}
          keyExtractor={ item => item.id}
          renderItem={({ item })=> <TransactionCard data={item} /> }
        />

      </Transactions>  

    </Container>
  )
}
