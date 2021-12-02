import React from 'react'
import { TextInputProps } from 'react-native'
import { Control, Controller } from 'react-hook-form'

import { Input } from '../Input'

import { Container, Error } from './styles'

interface Props extends TextInputProps {
    control: Control;
    name: string;
    error: string;
}

export function InputForm({ control, name, error, ...rest}: Props){
  return(
    <Container>
        <Controller
            // control é o atributo que informa qual o form que controla esse input
            control={control}
            // render - qual input será realizado
            render={({ field: { onChange, value }}) => (
                <Input 
                    onChangeText={onChange}
                    value={value}
                    {...rest}
                />
            )}
            name={name}
        />
        { error && <Error>{error}</Error> }
    </Container>
  )
}
