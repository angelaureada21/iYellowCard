import React, { useState, useCallback, useEffect } from "react";
import {
  GiftedChat,
  IMessage,
  Bubble,
  InputToolbar,
  Send,
  Composer,
  QuickReplies,
  Avatar,
} from "react-native-gifted-chat";
import { Platform, View, ImageBackground, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Chatbot() {
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "👋 Hello! I'm your **Yellow Card Assistant**. How can I help you today?",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "iYellowCard",
          avatar: require("../../../assets/images/chatboticon.png"),
        },
        quickReplies: {
          type: "radio",
          keepIt: true,
          values: [
            { title: "View Benefits", value: "benefits" },
            { title: "Contact Support", value: "support" },
          ],
        },
      },
    ]);
  }, []);

  const BACKEND_URL =
    Platform.OS === "android"
      ? "http://10.0.2.2:5000/chatbot"
      : "http://192.168.1.110:5000/chatbot";

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );

    const userMessage = newMessages[0]?.text;

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      const botMessage: IMessage = {
        _id: Math.random().toString(),
        text: data.reply || "⚠️ Sorry, I didn’t get that.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "YellowCard Bot",
          avatar: require("../../../assets/images/chatboticon.png"),
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [botMessage])
      );
    } catch (error) {
      console.error("Error fetching chatbot reply:", error);

      const errorMessage: IMessage = {
        _id: Math.random().toString(),
        text: "❌ Oops! I couldn’t connect to the YellowCard server. Please check your connection.",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "YellowCard Bot",
          avatar: require("../../../assets/images/chatboticon.png"),
        },
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [errorMessage])
      );
    }
  }, []);

  const onQuickReply = (replies: QuickReplies["values"]) => {
    if (replies && replies.length > 0) {
      const reply = replies[0];
      onSend([
        {
          _id: Math.random().toString(),
          text: reply.title,
          createdAt: new Date(),
          user: {
            _id: 1,
            name: "User",
            avatar: require("../../../assets/images/woman.png"),
          },
        },
      ]);
    }
  };

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: "#FFEFC1",
          borderRadius: 18,
          padding: 6,
          marginBottom: 8,
        },
        right: {
          backgroundColor: "#DDA231",
          borderRadius: 18,
          padding: 6,
          marginBottom: 8,
        },
      }}
      textStyle={{
        left: { color: "#000000ff", fontSize: 15, lineHeight: 20 },
        right: { color: "#fff", fontSize: 15, lineHeight: 20 },
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: "#fff",
        borderTopWidth: 3,
        borderTopColor: "#fffefeff",
        borderRadius: 25,
        marginHorizontal: 8,
        marginBottom: 3,
        paddingHorizontal: 5,
      }}
      primaryStyle={{ alignItems: "center" }}
    />
  );

  const renderComposer = (props: any) => (
    <Composer
      {...props}
      textInputStyle={{
        backgroundColor: "#ffffffff",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingTop: 6,
        paddingBottom: 4,
        marginRight: 4,
        fontSize: 15,
      }}
    />
  );

  const renderSend = (props: any) => (
    <Send {...props}>
      <View
        style={{
          width: 38,
          height: 38,
          justifyContent: "center",
          alignItems: "center",
          marginRight: 6,
          marginBottom: 4,
        }}
      >
        <Ionicons name="send" size={25} color="#DDA231" />
      </View>
    </Send>
  );

  const renderAvatar = (props: any) => (
    <Avatar
      {...props}
      imageStyle={{
        left: { borderRadius: 20 }, // bot avatar circular
        right: { borderRadius: 20 }, // user avatar circular
      }}
    />
  );

  return (
    <View style={styles.background}>
      <ImageBackground
        source={require("../../../assets/images/background.png")}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.08 }}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          onQuickReply={onQuickReply}
          user={{
            _id: 1,
            name: "User",
            avatar: require("../../../assets/images/woman.png"),
          }}
          placeholder="Type your message..."
          showUserAvatar
          alwaysShowSend
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar} 
          renderComposer={renderComposer}
          renderSend={renderSend}
          renderAvatar={renderAvatar}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFF9E4",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
});
