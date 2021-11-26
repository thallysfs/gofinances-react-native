import React, {useState} from 'react'
import { Button } from '../../Components/Form/Button'

import { Input } from '../../Components/Form/Input'
import { TransactionTypeButton } from '../../Components/Form/TransactionTypeButton'
import { CategorySelect } from '../../Components/Form/CategorySelect'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes 
} from './styles'

export function Register(){
  const [transactionType, setTransactionType] = useState('');

  function handleTransactionTypeSelect(type: 'up' | 'down' ){
    setTransactionType(type);
  }

  return(
    <Container>
      <Header>
          <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input 
            placeholder="Nome"
          />
          <Input 
            placeholder="Preço"
          />

          <TransactionsTypes>
            <TransactionTypeButton 
              type='up'
              title='Income'
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />          
            <TransactionTypeButton 
              type='down'
              title='Outcome'
              onPress={ () => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </TransactionsTypes>

          <CategorySelect title="Categoria" />
        </Fields>

        <Button title="Enviar" />
      </Form>
      
    </Container>
  )
}
