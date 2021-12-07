import React, {useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native'
import { RFValue } from 'react-native-responsive-fontsize';
import { addMonths, subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useTheme } from 'styled-components'

import { HistoryCard } from '../../Components/HistoryCard'
import { categories } from '../../utils/categories';

import { 
    Container,
    Header,
    Title,
    Content,
    ChartContainer,
    MonthSelect,
    MonthSelectButton,
    MonthSelectIcon,
    Month 
} from './styles'

interface TransactionData {
    type: 'positive' | 'negative';
    name: string;
    amount: string;
    category: string;
    date: string;
}

interface CategoryData {
    key: string;
    name: string;
    total: number;
    totalFormatted: string;
    color: string;
    percent: string;
}

export function Resume(){
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);

    const theme = useTheme();

    //função para o filtro da data
    function handleDateChange(action: 'next' | 'prev'){
        if(action === 'next'){
            // addMonth é da biblioteca e essa função adiciona mês em uma data. No caso 1 mês
            setSelectedDate(addMonths(selectedDate,1));
        }else {
            setSelectedDate(subMonths(selectedDate,1));
        }
    }

    async function loadData(){
        const dataKey = '@gofinance:transections';
        const response = await AsyncStorage.getItem(dataKey);
        const responseFormatted = response ? JSON.parse(response) : [];

        //pegando somente as despesas
        const expensives = responseFormatted
        .filter((expensive: TransactionData) => 
            expensive.type === 'negative' &&
            new Date(expensive.date).getMonth() === selectedDate.getMonth() && 
            new Date(expensive.date).getFullYear() === selectedDate.getFullYear() 
        );




        const expensivesTotal = expensives
        .reduce((acumulator: number, expensive: TransactionData) => {
           return acumulator + Number(expensive.amount); 
        }, 0);

        const totalByCategory: CategoryData[] = [];

        //percorro as categorias e somo se a categoria da despesa for as mesma percorrida.
        // assim terei o total de todas as categorias
        categories.forEach(category => {
            let categorySum = 0;

            expensives.forEach((expensive: TransactionData) => {
                if(expensive.category === category.key){
                    categorySum += Number(expensive.amount);
                }
            });

            //armazeno o total dessa categoria juntamente com o nome se houver valor
            if(categorySum > 0){
                const totalFormatted = categorySum
                .toLocaleString('pt-BR',{
                    style:'currency',
                    currency: 'BRL'
                })

                // o fixed fixa sem casas decimais
                const percent = `${(categorySum / expensivesTotal *100).toFixed(0)}%`

                totalByCategory.push({
                    key: category.key,
                    name: category.name,
                    color: category.color,
                    total: categorySum,
                    totalFormatted,
                    percent
                })
            }

        });

        setTotalByCategories(totalByCategory);
    }
    
    useEffect(()=>{
        loadData();
    },[selectedDate])

    return(
    <Container>
        <Header>
            <Title>Resumo por categoria</Title>
        </Header>

        <Content
           showsVerticalScrollIndicator={false}
           contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight()
           }} 
        >

            <MonthSelect>
                <MonthSelectButton onPress={() => handleDateChange('prev')}>
                    <MonthSelectIcon name="chevron-left" />
                </MonthSelectButton>

                <Month>
                    { format(selectedDate, 'MMMM, yyyy', {locale: ptBR}) }
                </Month>

                <MonthSelectButton onPress={() => handleDateChange('next')}>
                    <MonthSelectIcon name="chevron-right" />
                </MonthSelectButton>
            </MonthSelect>


            <ChartContainer>
                <VictoryPie 
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                    labels: { 
                        fontSize: RFValue(18),
                        fontWeight: 'bold',
                        fill: theme.colors.shape
                    }
                }}
                labelRadius={50}
                x="percent"
                y="total"
                />
            </ChartContainer>
            {
                totalByCategories.map(item => (
                    <HistoryCard
                    key={item.key} 
                    title={item.name}
                    amount={item.totalFormatted}
                    color={item.color}
                    />
                ))
            }
        </Content>
    </Container>
  )
}
