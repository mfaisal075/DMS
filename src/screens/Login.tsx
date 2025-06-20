import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import BASE_URL from '../components/BASE_URL';
import Toast from 'react-native-toast-message';
import {BackHandler} from 'react-native';

interface LoginForm {
  email: string;
  password: string;
}

const initialLoginForm: LoginForm = {
  email: '',
  password: '',
};

const Login = ({navigation}: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);

  // Login Form Onchnage
  const loginOnChange = (field: keyof LoginForm, value: string) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Login Function
  const handleLogin = async () => {
    if (!loginForm.email.trim() || !loginForm.password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please enter both email and password.',
        visibilityTime: 1500,
      });
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/SystemUser/signIn`, {
        email: loginForm.email,
        password: loginForm.password,
      });

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
          visibilityTime: 1500,
        });
        navigation.replace('Dashboard');
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: error.response.data?.message || 'Invalid email or password.',
          visibilityTime: 1500,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2:
            error.response?.data?.message || 'An unexpected error occurred.',
          visibilityTime: 1500,
        });
      }
      console.log(error);
    }
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <ImageBackground
          source={require('../assets/login-bg.png')}
          resizeMode="cover"
          style={styles.background}
          blurRadius={15}>
          <View style={styles.overlay} />

          <View style={styles.card}>
            <View style={{alignItems: 'center', marginBottom: 24}}>
              <ImageBackground
                source={require('../assets/logo-black.png')}
                style={{width: 140, height: 110}}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#222',
                    textAlign: 'center',
                  }}>
                  Welcome Back!
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: '#666',
                    textAlign: 'center',
                  }}>
                  Please log in to your account
                </Text>
              </View>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#888"
                style={styles.textInput}
                keyboardType="email-address"
                autoCapitalize="none"
                value={loginForm.email}
                onChangeText={t => loginOnChange('email', t)}
              />
              <View style={{position: 'relative'}}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  style={styles.textInput}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={loginForm.password}
                  onChangeText={t => loginOnChange('password', t)}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={togglePasswordVisibility}>
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'} // Toggle icon
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.loginBtnContainer}
              activeOpacity={0.8}
              onPress={() => handleLogin()}>
              <Text style={styles.loginBtnText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  card: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 16,
    padding: 24,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#000',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  textInput: {
    backgroundColor: 'rgba(245, 245, 245, 0.2)',
    borderRadius: 8,
    borderColor: '#888',
    borderWidth: 0.6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
    color: '#222',
  },
  loginBtnContainer: {
    backgroundColor: 'purple',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
});
