import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '../screens/User/ProfileScreen';
import StartExamScreen from '../screens/User/StartExamScreen';
import UserReportScreen from '../screens/User/UserReportScreen';

const Tab = createBottomTabNavigator();

const NonAdminNavigation = ({ logout ,user}) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#E96E6E',
      }}>
      <Tab.Screen
        name="Profile"
        children={() => <ProfileScreen user={user} />}
        // component={ProfileScreen}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <FontAwesome name={'user-circle'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Start Exam"
        // component={StartExamScreen}
        children={() => <StartExamScreen userId={user.id}  />}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <Feather name={'check-square'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Report"
        children={() => <UserReportScreen userId={user.id}  />}
        // component={UserReportScreen}
        options={{
          tabBarIcon: ({ size, color }) => {
            return <AntDesign name={'filetext1'} size={size} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Logout"
        component={ProfileScreen}
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

export default NonAdminNavigation;

const styles = StyleSheet.create({});
