import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkip = () => {
    router.replace('/');
  };

  const handleCreateAccount = () => {
    router.push('/explore');
  };

  const handleLoginSubmit = async () => {
    if (!emailOrPhone.trim()) {
      Alert.alert('Required', 'Please enter your email or mobile number.');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Required', 'Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login({ username: emailOrPhone.trim(), password });
      setShowLoginModal(false);
      router.replace('/');
    } catch (err: any) {
      Alert.alert('Login Failed', err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    Alert.alert('Social Authentication', `Continue with ${provider}`);
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#350524" />

      <View style={styles.fullScreenContainer}>
        {/* Exact 100% Visual Screen Background Screenshot Asset */}
        <Image
          source={require('../../assets/images/welcome_exact_mockup.png')}
          style={styles.fullMockupImage}
          resizeMode={Platform.OS === 'web' ? 'stretch' : 'cover'}
        />

        {/* ─── INTERACTIVE TRANSPARENT TOUCH OVERLAYS ─── */}

        {/* Top Left: Skip Button */}
        <TouchableOpacity
          style={styles.overlaySkip}
          onPress={handleSkip}
          activeOpacity={0.5}
        />

        {/* Button 1: CREATE AN ACCOUNT */}
        <TouchableOpacity
          style={styles.overlayCreateAccount}
          onPress={handleCreateAccount}
          activeOpacity={0.6}
        />

        {/* Button 2: LOG IN */}
        <TouchableOpacity
          style={styles.overlayLogIn}
          onPress={() => setShowLoginModal(true)}
          activeOpacity={0.6}
        />

        {/* Link 3: Forgot Password */}
        <TouchableOpacity
          style={styles.overlayForgotPassword}
          onPress={() => Alert.alert('Forgot Password', 'Redirecting to password recovery...')}
          activeOpacity={0.5}
        />

        {/* Link 4: Terms & Privacy Policy */}
        <TouchableOpacity
          style={styles.overlayTermsPrivacy}
          onPress={() => Alert.alert('Legal Information', 'Opening Terms of Use and Privacy Policy...')}
          activeOpacity={0.5}
        />

        {/* Social Icons Overlay Row */}
        <View style={styles.socialOverlayRow}>
          <TouchableOpacity
            style={styles.socialOverlayItem}
            onPress={() => handleSocialAuth('Apple')}
            activeOpacity={0.6}
          />
          <TouchableOpacity
            style={styles.socialOverlayItem}
            onPress={() => handleSocialAuth('Google')}
            activeOpacity={0.6}
          />
          <TouchableOpacity
            style={styles.socialOverlayItem}
            onPress={() => handleSocialAuth('Facebook')}
            activeOpacity={0.6}
          />
          <TouchableOpacity
            style={styles.socialOverlayItem}
            onPress={() => handleSocialAuth('Microsoft')}
            activeOpacity={0.6}
          />
          <TouchableOpacity
            style={styles.socialOverlayItem}
            onPress={() => handleSocialAuth('Play Store')}
            activeOpacity={0.6}
          />
        </View>

        {/* Interactive Login Modal Sheet */}
        <Modal
          visible={showLoginModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowLoginModal(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Sign In to Rajput Alliances</Text>
                <TouchableOpacity onPress={() => setShowLoginModal(false)} style={styles.modalCloseBtn}>
                  <Ionicons name="close" size={20} color="#3B0626" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputFieldGroup}>
                <Text style={styles.inputLabel}>Email or Mobile Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={16} color="#3B0626" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                    placeholder="Enter email or mobile"
                    placeholderTextColor="#998894"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputFieldGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={16} color="#3B0626" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••"
                    placeholderTextColor="#998894"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconBtn}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#3B0626" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleLoginSubmit}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                <Text style={styles.modalSubmitBtnText}>
                  {isSubmitting ? 'SIGNING IN...' : 'CONFIRM & LOG IN'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#350524',
  },
  fullScreenContainer: {
    flex: 1,
    width: '100%',
    height: Platform.OS === 'web' ? ('100vh' as any) : '100%',
    backgroundColor: '#350524',
    position: 'relative',
    overflow: 'hidden',
  },
  fullMockupImage: {
    width: '100%',
    height: '100%',
  },

  /* ── TRANSPARENT OVERLAY TOUCH TARGETS ── */
  overlaySkip: {
    position: 'absolute',
    top: '2%',
    left: '4%',
    width: '22%',
    height: '5%',
    zIndex: 50,
  },
  overlayCreateAccount: {
    position: 'absolute',
    top: '63.2%',
    left: '7.5%',
    width: '85%',
    height: '6.2%',
    borderRadius: 30,
    zIndex: 50,
  },
  overlayLogIn: {
    position: 'absolute',
    top: '70.8%',
    left: '7.5%',
    width: '85%',
    height: '6.2%',
    borderRadius: 30,
    zIndex: 50,
  },
  overlayForgotPassword: {
    position: 'absolute',
    top: '78.2%',
    left: '20%',
    width: '60%',
    height: '3.5%',
    zIndex: 50,
  },
  overlayTermsPrivacy: {
    position: 'absolute',
    top: '82.2%',
    left: '8%',
    width: '84%',
    height: '3.5%',
    zIndex: 50,
  },
  socialOverlayRow: {
    position: 'absolute',
    top: '88.5%',
    left: '7.5%',
    width: '85%',
    height: '6.5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 50,
  },
  socialOverlayItem: {
    width: '17%',
    height: '100%',
    borderRadius: 20,
  },

  /* Modal Styling */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(35, 3, 25, 0.75)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FAF6F0',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE0D4',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3B0626',
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputFieldGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#3B0626',
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0D4C4',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#333333',
    height: '100%',
  },
  eyeIconBtn: {
    padding: 4,
  },
  modalSubmitBtn: {
    backgroundColor: '#470831',
    height: 46,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
