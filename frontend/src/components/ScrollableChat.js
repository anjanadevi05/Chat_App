import React from "react";
import { Avatar } from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
  } from "../config/ChatLogics";
import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
//tooltip is to display the avatar with the label containing the user name
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {
            (isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) &&
               (
              <Tooltip label={m.sender.name} placement="top-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#F9D5A0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
//span to change the colour of the messages for the user and sender