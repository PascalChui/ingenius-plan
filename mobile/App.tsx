"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import {
  Home as HomeIcon,
  Calendar as CalendarIcon,
  CheckSquare as TaskIcon,
  Settings as SettingsIcon,
} from "lucide-react-native"

// Screens
import HomeScreen from "./screens/HomeScreen"
import TasksScreen from "./screens/TasksScreen"
import CalendarScreen from "./screens/CalendarScreen"
import SettingsScreen from "./screens/SettingsScreen"
import TaskDetailScreen from "./screens/TaskDetailScreen"
import LoginScreen from "./screens/LoginScreen"
import SignupScreen from "./screens/SignupScreen"
import WorkspaceScreen from "./screens/WorkspaceScreen"

// Auth Context
import { AuthProvider, useAuth } from "./contexts/AuthContext"

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "Home":
              return <HomeIcon size={size} color={color} />
            case "Tasks":
              return <TaskIcon size={size} color={color} />
            case "Calendar":
              return <CalendarIcon size={size} color={color} />
            case "Settings":
              return <SettingsIcon size={size} color={color} />
            default:
              return null
          }
        },
        tabBarActiveTintColor: "#4a89f3",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: "Tableau de bord" }} />
      <Tab.Screen name="Tasks" component={TasksScreen} options={{ title: "Tâches" }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: "Calendrier" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: "Paramètres" }} />
    </Tab.Navigator>
  )
}

function AppNavigator() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: "Détails de la tâche" }} />
            <Stack.Screen name="Workspace" component={WorkspaceScreen} options={{ title: "Espace de travail" }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
