import React,{useRef, useCallback} from "react";
import { Alert, Image, KeyboardAvoidingView, ScrollView, Platform, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/Feather"
import { useNavigation } from "@react-navigation/native"
import { Form } from '@unform/mobile'
import {FormHandles} from '@unform/core'
import * as Yup from 'yup';

import Button from "../../components/Button";
import Input from "../../components/Input";
import logoImg from '../../assets/lg/logo.png';
import getValidationErrors from "../../util/getValidationErrors";

import {
  Container,
  Title,
  BackToLogin,
  BackToLoginText
} from "./styles";

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const Cadastro: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const handleSignUp = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .email('Digite um e-mail válido')
          .required('E-mail obrigatório'),
        password: Yup.string().min(6, 'No mínimo 6 dígitos'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      // await api.post('/users', data);

      // history.push('/');
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);

        return;
      }

      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao fazer cadastro, tente novamente.',
      );
    }
  }, []);
  const emailInputRef=useRef<TextInput>(null)
  const passwordInputRef=useRef<TextInput>(null)
  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1, }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} />

            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form ref={formRef} onSubmit={handleSignUp}>

              <Input
                autoCapitalize="words"
                name="nome"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                onSubmitEditing={()=>{
                  emailInputRef.current?.focus()
                }}

              />
              <Input
                ref={emailInputRef}
                keyboardType="email-address"
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={()=> passwordInputRef.current?.focus()}

              />
              <Input
                ref={passwordInputRef}
                secureTextEntry
                name="pasword"
                icon="key"
                placeholder="Senha"
                textContentType="newPassword"
                returnKeyType="send"
                onSubmitEditing={()=> formRef.current?.submitForm()}

              />
              <Button onPress={() => formRef.current?.submitForm()} >Cadastrar</Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToLogin onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} style={{ color: '#fff' }} />
        <BackToLoginText>Voltar ao login</BackToLoginText>
      </BackToLogin>


    </>
  );
};

export default Cadastro;
