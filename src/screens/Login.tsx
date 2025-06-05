import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = ({navigation}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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
                style={{width: 150, height: 120}}
                resizeMode="contain"
              />
              <View>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#222',
                    textAlign: 'center',
                  }}>
                  Welcome Back!
                </Text>
                <Text
                  style={{
                    fontSize: 16,
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
              />
              <View style={{position: 'relative'}}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  style={styles.textInput}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
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
              onPress={() => navigation.navigate('Dashboard')}>
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
    fontSize: 16,
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
