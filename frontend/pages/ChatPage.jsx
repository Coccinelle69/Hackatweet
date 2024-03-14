"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import "stream-chat-react/dist/css/v2/index.css";

function ChatPage() {
  const user = useSelector((state) => state.users.value);
  const dispatch = useDispatch();
  let channel;
  useEffect(() => {
    if (user) {
      const apiKey = "jrr296k673rc";
      const userToken = user.token;
      const chatClient = new StreamChat(apiKey);
      const streamUser = {
        id: user.user._id,
        name: user.username,
        image: user.user.image,
      };

      chatClient.connectUser(streamUser, userToken);

      channel = chatClient.channel("messaging", "custom_channel_id", {
        // add as many custom fields as you'd like
        image: "https://www.drupal.org/files/project-images/react.png",
        name: "Talk about React",
        members: [user.user._id],
      });

      // Dispatch any necessary actions
      // For example:
      // dispatch(someAction());
    }
  }, [user, dispatch]);

  return (
    <div>
      {/* {user && (
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      )} */}
      ChatApp
    </div>
  );
}

export default ChatPage;
