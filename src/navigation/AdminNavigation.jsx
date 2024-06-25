import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CreateUserScreen from '../screens/Admin/CreateUserScreen';
import UserListScreen from '../screens/Admin/UserListScreen';
import ReportScreen from '../screens/Admin/ReportScreen';
import EditUserScreen from '../screens/Admin/EditUserScreen';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import AddQuestionScreen from '../screens/Admin/AddQuestionScreen';
import QuestionsListScreen from '../screens/Admin/QuestionsListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const UserStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserList" component={UserListScreen} />
    <Stack.Screen name="EditUser" component={EditUserScreen} />
  </Stack.Navigator>
);

const QuestionsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="QuestionsList" component={QuestionsListScreen} />
    {/* <Stack.Screen name="EditQuestion" component={EditQuestionScreen} /> */}
    <Stack.Screen name="AddQuestions" component={AddQuestionScreen} />
  </Stack.Navigator>
);

const AdminNavigation = ({ logout }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#E96E6E',
      }}>
      <Tab.Screen
        name="CreateUser"
        component={CreateUserScreen}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Feather name={'user-plus'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Users"
        component={UserStack}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Feather name={'users'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="AddQuestion"
        component={QuestionsStack}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <AntDesign name={'addfile'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <AntDesign name={'filetext1'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Logout"
        component={CreateUserScreen}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <MaterialIcons name={'logout'} size={size} color={color} />;
          },
          tabBarButton: (props) => (
            <TouchableOpacity {...props} onPress={logout} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigation;
