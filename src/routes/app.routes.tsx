import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from 'styled-components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume'

import {} from 'react-native-gesture-handler'

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes(){
    //acessando o nosso tema de cores e fonts
    const theme = useTheme();

    return(
        <Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.secondary,
                tabBarInactiveTintColor: theme.colors.text,
                tabBarLabelPosition: 'beside-icon',
                tabBarStyle: {
                    height: 88,
                    paddingVertical: Platform.OS === 'ios' ? 20 : 0
                }
            }}
        >
            <Screen 
                name="Listagem"
                component={Dashboard}
                //essa desestruturação de size e color é para pegar dinamicamente a cor para o ícone.
                // se selecionado é uma cor, senão outra. Se eu definir uma cor, ela ficará fixa independente da seleção
                options={{
                    tabBarIcon: (({ size, color }) => 
                        <MaterialIcons 
                            name="format-list-bulleted"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />        
            <Screen 
                name="Cadastrar"
                component={Register}
                options={{
                    tabBarIcon: (({ size, color }) => 
                        <MaterialIcons 
                            name="attach-money"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />            
            <Screen 
                name="Resumo"
                component={Resume}
                options={{
                    tabBarIcon: (({ size, color }) => 
                        <MaterialIcons 
                            name="pie-chart"
                            size={size}
                            color={color}
                        />
                    )
                }}
            />
        </Navigator>
    )
}
