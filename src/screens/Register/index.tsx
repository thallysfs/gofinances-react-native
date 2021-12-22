import React, {useState } from 'react'
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert 
} from 'react-native'

import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid'

import { useForm } from 'react-hook-form'
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth';

import { Button } from '../../Components/Form/Button'
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

  const { user } = useAuth();

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const { navigate }: NavigationProp<ParamListBase> = useNavigation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative' ){
    setTransactionType(type);
  }
  
  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }
  
  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData){
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação');
    
    if(category.key === 'category')
      return Alert.alert('Selecione a categoria');


    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }
    
    try {
      const dataKey = `@gofinance:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormated = [
        ...currentData,
        newTransaction
      ]

      //salvando dados na Storage
      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormated));

      //limpando os campos
      // o reset faz parte do React Root form e ele apaga os inputs envolvidos pelo hook form
      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      //redirecionar
      navigate('Listagem');

      
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }
  }

  // useEffect(()=>{
  //   async function loadData(){
  //     const data = await AsyncStorage.getItem(dataKey);
  //     // o uso da exclamação serve para forçar o js aceitar que uma variável não virá nula
  //     console.log(JSON.parse(data!));
  //   }

  //     loadData();
  //   },[])
    
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
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />          
              <TransactionTypeButton 
                type='down'
                title='Outcome'
                onPress={ () => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
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
