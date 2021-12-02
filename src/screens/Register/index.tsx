import React, {useState} from 'react'
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert 
} from 'react-native'

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { useForm } from 'react-hook-form'

import { Button } from '../../Components/Form/Button'
import { Input } from '../../Components/Form/Input'
import { InputForm } from '../../Components/Form/InputForm'
import { TransactionTypeButton } from '../../Components/Form/TransactionTypeButton'
import { CategorySelectButton } from '../../Components/Form/CategorySelectButton'

import { CategorySelect } from '../CategorySelect'

import { 
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionsTypes 
} from './styles'

//interface que vai tipar os itens recebidos no form
interface FormData {
  name: string;
  amount: string;
}

//criar schema que servirá para validação do fomr
const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatório'),
  amount: Yup
    .number()
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('Valor é obrigatório')
})


export function Register(){
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'up' | 'down' ){
    setTransactionType(type);
  }
  
  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }
  
  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  function handleRegister(form: FormData){
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação');
    
    if(category.key === 'category')
      return Alert.alert('Selecione a categoria');


    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }
    console.log(data);
  }

  return(
    /* serve para fechar o teclado ao clicar fora na tela, necessário colocar a função do
     keyboar.dismiss no onPress desse cara
    */ 
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control} 
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              //verifico se existe erro do name, se existir eu passou a mensagem por atributo que será exibida no
              //componente
              error={errors.name && errors.name.message}
            />
            <InputForm 
              name="amount"
              control={control} 
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
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

            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal} 
            />
          </Fields>

          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)} 
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
