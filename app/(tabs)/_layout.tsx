import { Tabs } from "expo-router";
import { Coffee, FolderHeart, House, User } from 'lucide-react-native';
import React from 'react';
import { View } from "react-native";


export default function Screen_Layout() {
    // const segments = useSegments();
    // const currentTab = segments[1];
    // const shouldShowHeader = currentTab !== 'profile';

    return (
        <>
            {/* {shouldShowHeader && <Header />} */}
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#0EA5E9',
                    tabBarInactiveTintColor: '#6B7280',
                    tabBarActiveBackgroundColor: 'transparent',
                    tabBarInactiveBackgroundColor: 'transparent',
                    tabBarShowLabel: false,
                    tabBarItemStyle: {
                        borderRadius: 999,
                        paddingVertical: 4,
                        marginVertical: 16,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'transparent',
                    },
                    tabBarStyle: {
                        backgroundColor: '#020617',
                        marginBottom: -24,
                        height: 96,
                        position: 'absolute',
                        overflow: 'hidden',
                        borderTopWidth: 0,
                        elevation: 12,
                        shadowOpacity: 0.35,
                        paddingHorizontal: 16,
                    },
                }}
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        headerShown: false,
                        title: "Home",
                        tabBarLabel: "Home",
                        tabBarIcon: ({ focused, color }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? '#020617' : 'transparent',
                                    borderRadius: 999,
                                    paddingHorizontal: 18,
                                    paddingVertical: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <House color={focused ? '#0EA5E9' : color} />
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="menu"
                    options={{
                        headerShown: false,
                        title: "menu",
                        tabBarLabel: "Menu",
                        tabBarIcon: ({ focused, color }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? '#020617' : 'transparent',
                                    borderRadius: 999,
                                    paddingHorizontal: 18,
                                    paddingVertical: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Coffee color={focused ? '#0EA5E9' : color} size={26} />
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="favorite"
                    options={{
                        headerShown: false,
                        title: "Favorite",
                        tabBarLabel: "Favorite",
                        tabBarIcon: ({ focused, color }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? '#020617' : 'transparent',
                                    borderRadius: 999,
                                    paddingHorizontal: 18,
                                    paddingVertical: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <FolderHeart color={focused ? '#0EA5E9' : color} />
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="profile"
                    options={{
                        headerShown: false,
                        title: "Profile",
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ focused, color }) => (
                            <View
                                style={{
                                    backgroundColor: focused ? '#020617' : 'transparent',
                                    borderRadius: 999,
                                    paddingHorizontal: 18,
                                    paddingVertical: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <User color={focused ? '#0EA5E9' : color} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
        </>
    );
}