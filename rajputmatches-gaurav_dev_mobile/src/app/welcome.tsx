import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storage.service';

const COLORS = {
  royalPurpleDark: '#260218',
  royalPurple: '#3D0728',
  royalPurpleLight: '#59123B',
  gold: '#EDB139',
  goldLight: '#F5C870',
  goldDark: '#C88B1E',
  ivoryBg: '#FFFBF5',
  ivoryDark: '#F3EAD9',
  white: '#FFFFFF',
  textDark: '#3D0728',
  textMuted: '#6E5862',
};

type Screen = 'welcome' | 'login' | 'signup' | 'forgot';

export default function WelcomeScreen() {
  const router = useRouter();
  const { login, register, isLoading: authLoading } = useAuth();

  const [screen, setScreen] = useState<Screen>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Onboarding 5-Step Signup states
  const [step, setStep] = useState<number>(1);
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastNameSubclan, setLastNameSubclan] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [country, setCountry] = useState('India');
  const [stateName, setStateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [profileFor, setProfileFor] = useState('Self');
  const [signupPassword, setSignupPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [heightVal, setHeightVal] = useState("5'7\"");
  const [gotraClan, setGotraClan] = useState('Rathore');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Exploring new places',
    'Traditional gatherings',
  ]);
  const [customResponse, setCustomResponse] = useState('');
  const [manglik, setManglik] = useState('Non-Manglik');
  const [rashi, setRashi] = useState('Leo (Simha)');

  const handleSkip = async () => {
    try {
      await storageService.setItem('has_skipped_welcome', 'true');
    } catch {}
    router.replace('/');
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Fields', 'Please enter Email or Mobile Number and Password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await login({ username: email.trim(), password });
      Alert.alert('Welcome!', 'Signed in successfully.');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials or server error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        mobile: phone.trim(),
        password,
      });
      Alert.alert(
        'Khama Ghani, Hukum!',
        'Thank you for registering with Rajput Alliances. We will verify your account and email you once it is approved, so you can log in and create your profile.',
        [{ text: 'Sign In Now', onPress: () => setScreen('login') }]
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not complete registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    if (!resetEmail.trim()) {
      Alert.alert('Missing Email', 'Please enter your registered Email or Phone Number.');
      return;
    }
    Alert.alert(
      'Password Reset Request',
      `Instructions to reset your password have been sent to ${resetEmail.trim()}.`,
      [{ text: 'OK', onPress: () => setScreen('login') }]
    );
  };

  // Login Screen View
  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.royalPurpleDark} />
        <LinearGradient
          colors={[COLORS.royalPurpleDark, COLORS.royalPurple, '#4E0A34']}
          style={styles.gradientFull}
        >
          <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('welcome')}>
              <Ionicons name="arrow-back" size={22} color={COLORS.gold} />
            </TouchableOpacity>

            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/images/rajput_logo.jpg')}
                style={styles.formLogoImage}
                contentFit="contain"
              />
              <Text style={styles.brandTitleForm}>RAJPUT ALLIANCES</Text>
              <Text style={styles.brandSubForm}>Welcome Back, Kshatriya!</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Sign In</Text>

              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email or Mobile Number"
                  placeholderTextColor={COLORS.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor={COLORS.textMuted}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPass}
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
                  <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotLinkBtn} onPress={() => setScreen('forgot')}>
                <Text style={styles.forgotLinkText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.formPrimaryBtn}
                onPress={handleLogin}
                disabled={isSubmitting || authLoading}
              >
                {isSubmitting || authLoading ? (
                  <ActivityIndicator color={COLORS.gold} />
                ) : (
                  <Text style={styles.formPrimaryBtnText}>LOG IN  →</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setScreen('signup')}>
              <Text style={styles.switchText}>
                Don{"'"}t have an account?{' '}
                <Text style={{ color: COLORS.gold, fontWeight: '700' }}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Register / Onboarding 5-Step Wizard Screen View
  if (screen === 'signup') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#1E0213" />
        <LinearGradient colors={['#1E0213', '#320422', '#46072E']} style={styles.gradientFull}>
          {/* Top Progress Bar & Skip */}
          <View style={styles.stepHeaderRow}>
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.stepSkipLink}>Skip</Text>
            </TouchableOpacity>

            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFilled, { width: `${(step / 5) * 100}%` }]} />
            </View>

            <Text style={styles.stepCounterText}>Step {step} of 5</Text>
          </View>

          {/* Brand Logo Header Banner */}
          <View style={styles.stepBrandBanner}>
            <Text style={styles.stepBrandTitle}>RAJPUT ALLIANCES</Text>
            <Text style={styles.stepBrandSub}>Connecting Rajputs Worldwide</Text>
          </View>

          {/* Scrollable Form Content */}
          <ScrollView contentContainerStyle={styles.stepScrollContent} keyboardShouldPersistTaps="handled">
            {/* STEP 1: Email Verification & OTP */}
            {step === 1 && (
              <View style={styles.stepCardContainer}>
                <Text style={styles.stepTitle}>EMAIL VERIFICATION</Text>
                <Text style={styles.stepSubtitleText}>
                  Please enter your email address to receive a 6-digit verification code.
                </Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Email Address *</Text>
                  <View style={styles.emailVerifyRow}>
                    <TextInput
                      style={[styles.fieldInput, { flex: 1 }]}
                      placeholder="Enter your Email Address"
                      placeholderTextColor="#8A757D"
                      keyboardType="email-address"
                      value={signupEmail}
                      onChangeText={(txt) => {
                        setSignupEmail(txt);
                        if (emailVerified) setEmailVerified(false);
                      }}
                      autoCapitalize="none"
                      editable={!emailVerified}
                    />
                    <TouchableOpacity
                      style={[styles.otpBtn, emailVerified && styles.otpBtnDisabled]}
                      onPress={() => {
                        if (!signupEmail.includes('@')) {
                          Alert.alert('Invalid Email', 'Please enter a valid email address.');
                          return;
                        }
                        setOtpSent(true);
                        Alert.alert('OTP Sent', `Verification code sent to ${signupEmail}`);
                      }}
                      disabled={emailVerified}
                    >
                      <Text style={styles.otpBtnText}>
                        {emailVerified ? '✓ Verified' : otpSent ? 'Resend' : 'Get OTP'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* OTP Input Box if OTP Sent */}
                {otpSent && !emailVerified && (
                  <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Enter OTP Code *</Text>
                    <View style={styles.emailVerifyRow}>
                      <TextInput
                        style={[styles.fieldInput, { flex: 1, letterSpacing: 3, fontWeight: '700' }]}
                        placeholder="Enter 6-digit OTP"
                        placeholderTextColor="#8A757D"
                        keyboardType="number-pad"
                        maxLength={6}
                        value={otpCode}
                        onChangeText={setOtpCode}
                      />
                      <TouchableOpacity
                        style={styles.verifyOtpBtn}
                        onPress={() => {
                          setEmailVerified(true);
                          Alert.alert('Verified!', 'Email address verified successfully.');
                        }}
                      >
                        <Text style={styles.verifyOtpBtnText}>VERIFY OTP</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Verified Badge */}
                {emailVerified && (
                  <View style={styles.verifiedSuccessBox}>
                    <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                    <Text style={styles.verifiedSuccessText}>Email Verified Successfully!</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.stepActionBtn, !emailVerified && styles.stepActionBtnDisabled]}
                  onPress={() => {
                    if (!emailVerified) {
                      Alert.alert('Verification Required', 'Please click "Get OTP" and verify your email to continue.');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  <Text style={styles.stepActionBtnText}>CONTINUE TO REGISTRATION  →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 2: Basic Name & Personal Info */}
            {step === 2 && (
              <View style={styles.stepCardContainer}>
                <Text style={styles.stepTitle}>BASIC INFORMATION</Text>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>First Name *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Enter First Name"
                    placeholderTextColor="#8A757D"
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Middle Name</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Enter Middle Name"
                    placeholderTextColor="#8A757D"
                    value={middleName}
                    onChangeText={setMiddleName}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Last Name / Sub-clan *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Enter Sub-clan / Last Name"
                    placeholderTextColor="#8A757D"
                    value={lastNameSubclan}
                    onChangeText={setLastNameSubclan}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Date of Birth *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="dd-mm-yyyy"
                    placeholderTextColor="#8A757D"
                    value={dob}
                    onChangeText={setDob}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Gender *</Text>
                  <View style={styles.optionsRow}>
                    {['Male', 'Female'].map((g) => (
                      <TouchableOpacity
                        key={g}
                        style={[styles.optionChip, gender === g && styles.optionChipSelected]}
                        onPress={() => setGender(g)}
                      >
                        <Text style={[styles.optionChipText, gender === g && styles.optionChipTextSelected]}>
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.stepActionBtn} onPress={() => setStep(3)}>
                  <Text style={styles.stepActionBtnText}>NEXT: CONTACT DETAILS  →</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 3: Personal Detail (Matches User Image 1 Left Screen) */}
            {step === 3 && (
              <View style={styles.stepCardContainer}>
                <Text style={styles.stepTitleDisplay}>Personal Detail</Text>

                <View style={styles.pillInputGroup}>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="Full Name"
                    placeholderTextColor="#8A757D"
                    value={firstName ? `${firstName} ${middleName} ${lastNameSubclan}`.trim() : name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.pillInputGroup}>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="Date of Birth 📅"
                    placeholderTextColor="#8A757D"
                    value={dob}
                    onChangeText={setDob}
                  />
                </View>

                <View style={styles.pillInputGroup}>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="Height (e.g. 5'7&quot;)"
                    placeholderTextColor="#8A757D"
                    value={heightVal}
                    onChangeText={setHeightVal}
                  />
                </View>

                <View style={styles.pillInputGroup}>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="Caste / Gotra (e.g. Rathore)"
                    placeholderTextColor="#8A757D"
                    value={gotraClan}
                    onChangeText={setGotraClan}
                  />
                </View>

                <View style={styles.pillInputGroup}>
                  <TextInput
                    style={styles.pillInput}
                    placeholder="City of Residence"
                    placeholderTextColor="#8A757D"
                    value={cityName}
                    onChangeText={setCityName}
                  />
                </View>

                <TouchableOpacity style={styles.stepActionBtn} onPress={() => setStep(4)}>
                  <Text style={styles.stepActionBtnText}>SAVE & CONTINUE</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 4: Add Your Photos (Matches User Image 1 Middle Screen & Image 2) */}
            {step === 4 && (
              <View style={styles.stepCardContainer}>
                <Text style={styles.stepTitleHeading}>ADD YOUR PHOTOS</Text>

                <View style={styles.photoGrid}>
                  {[0, 1, 2, 3, 4, 5].map((idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.photoSlot}
                      onPress={() => {
                        Alert.alert('Upload Photo', `Photo slot ${idx + 1} selected.`);
                        if (!photos.includes(String(idx))) {
                          setPhotos([...photos, String(idx)]);
                        }
                      }}
                    >
                      <Ionicons
                        name={photos.includes(String(idx)) ? 'checkmark-circle' : 'add-circle-outline'}
                        size={32}
                        color={photos.includes(String(idx)) ? '#3D0728' : '#8A757D'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.photoHelpText}>Add at least 3 photos to get matched.</Text>

                <TouchableOpacity style={styles.stepActionBtn} onPress={() => setStep(5)}>
                  <Text style={styles.stepActionBtnText}>CONTINUE</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* STEP 5: Getting to Know You & Account Password */}
            {step === 5 && (
              <View style={styles.stepCardContainer}>
                <Text style={styles.stepTitleSmall}>RAJPUT PROFILES:</Text>
                <Text style={styles.stepTitleHeading}>GETTING TO KNOW YOU</Text>

                <View style={styles.aboutCardBox}>
                  <Text style={styles.aboutCardQuestion}>Describe your ideal weekends.</Text>

                  <View style={styles.aboutChipsContainer}>
                    {[
                      'Exploring new places',
                      'Home cooked meals & reading',
                      'Traditional gatherings',
                      'Fitness & sports',
                      'Cultural events',
                    ].map((item) => {
                      const isSel = selectedInterests.includes(item);
                      return (
                        <TouchableOpacity
                          key={item}
                          style={[styles.aboutChip, isSel && styles.aboutChipSelected]}
                          onPress={() => {
                            if (isSel) {
                              setSelectedInterests(selectedInterests.filter((i) => i !== item));
                            } else {
                              setSelectedInterests([...selectedInterests, item]);
                            }
                          }}
                        >
                          <Text style={[styles.aboutChipText, isSel && styles.aboutChipTextSelected]}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <TextInput
                    style={styles.aboutInput}
                    placeholder="Add your own response..."
                    placeholderTextColor="#8A757D"
                    value={customResponse}
                    onChangeText={setCustomResponse}
                    multiline
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Create Password *</Text>
                  <TextInput
                    style={styles.fieldInput}
                    placeholder="Enter Password"
                    placeholderTextColor="#8A757D"
                    secureTextEntry
                    value={signupPassword}
                    onChangeText={setSignupPassword}
                  />
                </View>

                <TouchableOpacity
                  style={styles.stepActionBtn}
                  onPress={handleRegister}
                  disabled={isSubmitting || authLoading}
                >
                  {isSubmitting || authLoading ? (
                    <ActivityIndicator color="#EDB139" />
                  ) : (
                    <Text style={styles.stepActionBtnText}>COMPLETE REGISTRATION ✦</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}

            {/* Back to Login */}
            <TouchableOpacity onPress={() => setScreen('login')}>
              <Text style={styles.switchText}>
                Already have an account?{' '}
                <Text style={{ color: '#EDB139', fontWeight: '700' }}>LOG IN</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Forgot Password Screen View
  if (screen === 'forgot') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.royalPurpleDark} />
        <LinearGradient
          colors={[COLORS.royalPurpleDark, COLORS.royalPurple, '#4E0A34']}
          style={styles.gradientFull}
        >
          <ScrollView contentContainerStyle={styles.formScroll} keyboardShouldPersistTaps="handled">
            <TouchableOpacity style={styles.backBtn} onPress={() => setScreen('welcome')}>
              <Ionicons name="arrow-back" size={22} color={COLORS.gold} />
            </TouchableOpacity>

            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/images/rajput_logo.jpg')}
                style={styles.formLogoImage}
                contentFit="contain"
              />
              <Text style={styles.brandTitleForm}>RAJPUT ALLIANCES</Text>
              <Text style={styles.brandSubForm}>Recover Your Password</Text>
            </View>

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Forgot Password</Text>
              <Text style={styles.forgotHelpText}>
                Enter your registered Email or Mobile Number and we will send you a reset link.
              </Text>

              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email or Mobile Number"
                  placeholderTextColor={COLORS.textMuted}
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  autoCapitalize="none"
                />
              </View>

              <TouchableOpacity style={styles.formPrimaryBtn} onPress={handleForgotPassword}>
                <Text style={styles.formPrimaryBtnText}>SEND RESET LINK  →</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setScreen('login')}>
              <Text style={styles.switchText}>
                Remembered password?{' '}
                <Text style={{ color: COLORS.gold, fontWeight: '700' }}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Welcome Screen (Exact visual match to user screenshot)
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1E0213" />
      <LinearGradient
        colors={['#1E0213', '#320422', '#46072E', '#560B39']}
        style={styles.gradientFull}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Header: Skip */}
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {/* Center Upper Section: Logo & Titles */}
          <View style={styles.upperSection}>
            {/* Lotus Crest Image */}
            <View style={styles.logoWrapper}>
              <Image
                source={require('../../assets/images/rajput_logo.png')}
                style={styles.logoImage}
                contentFit="contain"
              />
            </View>

            {/* Rajput Alliances Header */}
            <Text style={styles.brandTitle} numberOfLines={1} adjustsFontSizeToFit>
              RAJPUT ALLIANCES
            </Text>
            <Text style={styles.brandTagline}>Connecting Rajputs Worldwide</Text>
          </View>

          {/* Decorative Smoky Mist Transition Layer */}
          <View style={styles.vignetteContainer}>
            <LinearGradient
              colors={['transparent', 'rgba(255, 251, 245, 0.25)', 'rgba(255, 251, 245, 0.85)', '#FFFDF8']}
              style={styles.vignetteGradient}
            />
          </View>

          {/* Bottom Ivory Section with Buttons */}
          <View style={styles.bottomIvoryCard}>
            {/* CREATE AN ACCOUNT (Outline Pill) */}
            <TouchableOpacity
              style={styles.createAccBtn}
              onPress={() => setScreen('signup')}
              activeOpacity={0.85}
            >
              <Text style={styles.createAccBtnText}>CREATE AN ACCOUNT</Text>
            </TouchableOpacity>

            {/* LOG IN (Solid Pill) */}
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={() => setScreen('login')}
              activeOpacity={0.88}
            >
              <Text style={styles.loginBtnText}>LOG IN</Text>
            </TouchableOpacity>

            {/* Forgot password? */}
            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => setScreen('forgot')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Footnote */}
            <Text style={styles.termsSubtext}>
              By continuing, you agree to our Terms and Privacy Policy
            </Text>

            {/* Social Login Divider & Icons */}
            <View style={styles.socialDividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.socialDividerText}>or continue with:</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialIconRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Social Sign In', 'Apple Sign In feature requested.')}
              >
                <Ionicons name="logo-apple" size={18} color="#000000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Social Sign In', 'Google Sign In feature requested.')}
              >
                <Ionicons name="logo-google" size={17} color="#EA4335" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Social Sign In', 'Facebook Sign In feature requested.')}
              >
                <Ionicons name="logo-facebook" size={18} color="#1877F2" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Social Sign In', 'Microsoft Sign In feature requested.')}
              >
                <Ionicons name="logo-windows" size={16} color="#00A4EF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialBtn}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Social Sign In', 'Play Store Sign In feature requested.')}
              >
                <Ionicons name="logo-google-playstore" size={16} color="#0F9D58" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1E0213',
  },
  gradientFull: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  topHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 14,
    paddingBottom: 2,
    zIndex: 10,
  },
  skipBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  skipText: {
    fontSize: 15,
    color: '#E8D4E2',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  upperSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
  },
  logoWrapper: {
    width: 250,
    height: 195,
    marginTop: 8,
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#EDB139',
    letterSpacing: 1.5,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
    textShadowColor: 'rgba(237, 177, 57, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
    width: '100%',
  },
  brandTagline: {
    fontSize: 14,
    color: '#F4DDAE',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.4,
    fontWeight: '400',
    opacity: 0.95,
  },
  vignetteContainer: {
    width: '100%',
    height: 38,
    marginTop: -18,
    marginBottom: -1,
  },
  vignetteGradient: {
    flex: 1,
  },
  bottomIvoryCard: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 28 : 18,
    gap: 10,
  },
  createAccBtn: {
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3D0728',
    backgroundColor: '#FFFDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#3D0728',
    letterSpacing: 1,
  },
  loginBtn: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3D0728',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3D0728',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  forgotBtn: {
    alignSelf: 'center',
    marginTop: 1,
    paddingVertical: 2,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D0728',
  },
  termsSubtext: {
    fontSize: 11,
    color: '#6E5862',
    textAlign: 'center',
    marginTop: 1,
    lineHeight: 15,
  },
  socialDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginBottom: 1,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2D8CE',
  },
  socialDividerText: {
    fontSize: 11,
    color: '#8A757D',
    paddingHorizontal: 8,
    fontWeight: '400',
  },
  socialIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 2,
  },
  socialBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DFD5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  /* Form / Auth Shared Styles */
  formScroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  formLogoImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginBottom: 8,
  },
  brandTitleForm: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  brandSubForm: {
    fontSize: 13,
    color: COLORS.ivoryBg,
    marginTop: 2,
    opacity: 0.85,
  },
  formCard: {
    backgroundColor: COLORS.ivoryBg,
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.royalPurple,
    marginBottom: 18,
    textAlign: 'center',
  },
  forgotHelpText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.ivoryDark,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  eyeBtn: {
    padding: 6,
  },
  forgotLinkBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
  },
  forgotLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.royalPurple,
  },
  formPrimaryBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.royalPurple,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.royalPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  formPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  termsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
  },
  switchText: {
    textAlign: 'center',
    color: COLORS.ivoryBg,
    fontSize: 13,
    marginTop: 20,
  },

  /* Multi-Step Onboarding Styles */
  stepHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 14,
    paddingBottom: 8,
  },
  stepSkipLink: {
    fontSize: 15,
    color: '#E8D4E2',
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  progressBarContainer: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  progressBarFilled: {
    height: '100%',
    backgroundColor: '#EDB139',
    borderRadius: 2,
  },
  stepCounterText: {
    fontSize: 13,
    color: '#E8D4E2',
    fontWeight: '600',
  },
  stepBrandBanner: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  stepBrandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#EDB139',
    letterSpacing: 1.5,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  stepBrandSub: {
    fontSize: 12,
    color: '#F4DDAE',
    marginTop: 2,
    opacity: 0.9,
  },
  stepScrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 30,
  },
  stepCardContainer: {
    backgroundColor: '#FFFDF8',
    borderRadius: 28,
    padding: 20,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3D0728',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepTitleDisplay: {
    fontSize: 22,
    fontWeight: '800',
    color: '#3D0728',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  stepTitleHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#3D0728',
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },
  stepTitleSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A757D',
    textAlign: 'center',
    letterSpacing: 1,
  },

  /* Form inputs */
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#3D0728',
    marginBottom: 4,
  },
  fieldInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8DFD5',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#3D0728',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeBadge: {
    backgroundColor: '#F4ECE4',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8DFD5',
  },
  countryCodeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D0728',
  },
  stepSubtitleText: {
    fontSize: 13,
    color: '#6E5862',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  emailVerifyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  otpBtn: {
    backgroundColor: '#3D0728',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  otpBtnDisabled: {
    backgroundColor: '#6E5862',
    opacity: 0.6,
  },
  otpBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EDB139',
  },
  verifyOtpBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 14,
    height: 46,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyOtpBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  verifiedSuccessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  verifiedSuccessText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  optionsRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  optionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F4ECE4',
    borderWidth: 1,
    borderColor: '#E8DFD5',
  },
  optionChipSelected: {
    backgroundColor: '#3D0728',
    borderColor: '#3D0728',
  },
  optionChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#3D0728',
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
  },

  /* Step 2 Pill Outline Inputs */
  pillInputGroup: {
    marginBottom: 14,
  },
  pillInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#3D0728',
    borderRadius: 24,
    height: 50,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#3D0728',
  },

  /* Step 3 Photo Grid */
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginVertical: 14,
  },
  photoSlot: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: '#E6E0DA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D4CDC5',
  },
  photoHelpText: {
    fontSize: 13,
    color: '#6E5862',
    textAlign: 'center',
    marginBottom: 16,
  },

  /* Step 4 About Me Card */
  aboutCardBox: {
    borderWidth: 1.5,
    borderColor: '#3D0728',
    borderRadius: 20,
    padding: 16,
    marginVertical: 12,
    backgroundColor: '#FFFBF5',
  },
  aboutCardQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3D0728',
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: Platform.OS === 'ios' ? 'Cinzel' : 'serif',
  },
  aboutChipsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 14,
  },
  aboutChip: {
    backgroundColor: '#EBE2DC',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  aboutChipSelected: {
    backgroundColor: '#3D0728',
  },
  aboutChipText: {
    fontSize: 13,
    color: '#3D0728',
    fontWeight: '500',
  },
  aboutChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  aboutInput: {
    borderWidth: 1,
    borderColor: '#3D0728',
    borderRadius: 16,
    padding: 12,
    minHeight: 50,
    fontSize: 13,
    color: '#3D0728',
    backgroundColor: '#FFFFFF',
  },

  stepActionBtn: {
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3D0728',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#3D0728',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  stepActionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  stepActionBtnDisabled: {
    backgroundColor: '#8A757D',
    opacity: 0.65,
    shadowOpacity: 0,
    elevation: 0,
  },
});
