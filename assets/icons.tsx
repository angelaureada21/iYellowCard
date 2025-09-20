import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type IconProps = {
  color: string;
};

export const icons = {
  home: ({ color }: IconProps) => (
    <FontAwesome5 name="home" size={26} color={color} />
  ),

  benefits: ({ color }: IconProps) => (
    <FontAwesome6 name="table-list" size={26} color={color} />
  ),

  chatbot: ({ color }: IconProps) => (
    <Ionicons name="chatbubble-ellipses" size={26} color={color} />
  ),

  notification: ({ color }: IconProps) => (
    <Ionicons name="notifications" size={26} color={color} />
  ),

  profile: ({ color }: IconProps) => (
    <MaterialCommunityIcons name="face-man-profile" size={26} color={color} />
  ),
};
