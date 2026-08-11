import { DarkTheme, DefaultTheme, ThemeProvider, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Platform, View } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedSplashOverlay } from '../components/animated-icon';

import { AuthProvider } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#59123B',
          tabBarInactiveTintColor: '#A0849A',
          tabBarStyle: {
            backgroundColor: '#FAF5EF',
            borderTopWidth: 1,
            borderTopColor: '#EFE0CB',
            height: Platform.OS === 'ios' ? 84 : 62,
            paddingBottom: Platform.OS === 'ios' ? 24 : 8,
            paddingTop: 6,
            shadowColor: '#59123B',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={21} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'search' : 'search-outline'} size={21} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="interests"
          options={{
            title: 'Interests',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'heart-circle' : 'heart-circle-outline'} size={21} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Messages',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'} size={21} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="filters"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="upgrade"
          options={{
            title: 'Upgrade',
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome5 name="crown" size={17} color={color} />
              </View>
            ),
          }}
        />
        {/* Hide welcome and profile from tab bar */}
        <Tabs.Screen
          name="welcome"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{ href: null }}
        />
        <Tabs.Screen
          name="view-profile"
          options={{ href: null }}
        />
      </Tabs>
      </ThemeProvider>
    </AuthProvider>
  );
}

