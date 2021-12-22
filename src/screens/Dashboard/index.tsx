import React, { useEffect, useState, useCallback } from 'react'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useFocusEffect } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth';

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
  lastTransaction: string;

}

interface HighlightData {
  entries: HighLigthProps;
  expensives: HighLigthProps;
  total: HighLigthProps;


}

export function Dashboard(){
  const [transactions, setTransactions] = useState<DataListProps[]>();
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const { signOut, user } = useAuth();

  function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){

    // filtrando a coleção pelo mesmo tipo recebido pelo parâmetro da função
    const collectionFilttered = collection
      .filter(transaction => transaction.type === type);

      if(collectionFilttered.length === 0){
        return 0;
      }

    //pegando a data da última transação
    //filtrando somente entradas e percorrendo para prgar somente a data
    //Math.max usado para ver o número maior, pois ocnverto a data em número, número maior = data mais recente
    const lastTransaction = new Date(
        Math.max.apply(Math, collectionFilttered
        .map(transaction => new Date(transaction.date).getTime()))
      )
      
      //formatando para exibir o mês escrito
      return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleDateString('pt-BR',{ month: 'long'})}`;
  }

  async function loadTransactions(){
    const dataKey = `@gofinance:transactions_user:${user.id}`;
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


    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = lastTransactionExpensives === 0 ? 'Não há transações' : `01 a ${lastTransactionExpensives}`;
   

    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0 ? 'Não há transações' 
          : `Última entrada dia ${lastTransactionEntries}`
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0 ? 'Não há transações' 
          :`Última saída dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }

    });

    setTransactions(transactionsFormatted);


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
          <Photo source={{ uri: user.photo }} 
          />
          <User>
            <UserGreeting>Olá</UserGreeting>
            <UserName>{user.name}</UserName>
          </User>
        </UserInfo>
        
        <LogoutButton onPress={signOut}>
          <Icon name="power" />
        </LogoutButton>
        </UserWrapper>  
      </Header>

      <HighLightCards> 
        <HighLightCard 
          title="Entradas" 
          amount={highlightData?.entries?.amount}
          lastTransaction={highlightData?.entries?.lastTransaction}
          type="up"
        />
        <HighLightCard 
          title="Saídas" 
          amount={highlightData?.expensives?.amount}
          lastTransaction={highlightData?.expensives?.lastTransaction}
          type="down"
        /> 
        <HighLightCard 
          title="Total" 
          amount={highlightData?.total?.amount} 
          lastTransaction={highlightData?.total?.lastTransaction}
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
