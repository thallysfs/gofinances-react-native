import styled, { css } from 'styled-components/native'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { RFValue } from 'react-native-responsive-fontsize';

interface IconsProps {
    type: 'up' | 'down';
}

interface ContainerProps {
    isActive: boolean;
    type: 'up' | 'down';
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
    width: 48%;

    flex-direction: row;
    align-items: center;
    justify-content: center;

    border-color: ${({theme}) => theme.colors.text};
    border-width: ${({ isActive}) => isActive ? 0 : 1.5}px;
    border-style: solid;
    border-radius: 5px;

    padding: 16px;

    ${({ isActive, type}) => isActive && type === 'up' && css`
        background: ${({theme}) => theme.colors.succes_ligth};;
    `}

    ${({ isActive, type}) => isActive && type === 'down' && css`
        background: ${({theme}) => theme.colors.attention_ligth};;
    `}


`;

export const Icon = styled(Feather)<IconsProps>`
    font-size: ${RFValue(24)}px;
    margin-right: 12px;

    color: ${({ theme, type})=>
        type === 'up' ? theme.colors.success : theme.colors.attention
    }
`;

export const Title = styled.Text`
    font-family: ${({theme}) => theme.fonts.regular};
    font-size: ${RFValue(20)}px;
`;
