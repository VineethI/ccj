import { StarBorderOutlined } from "@material-ui/icons";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectRoomId } from "../features/appSlice";
import ChatInput from "./ChatInput";
import { db } from "../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import CryptoJS from "crypto-js";

function Chat() {
  const chatRef = useRef(null);

  const roomId = useSelector(selectRoomId);

  const [roomDetails] = useCollection(
    roomId && db.collection("rooms").doc(roomId)
  );

  const [roomMessages, loading] = useCollection(
    roomId &&
      db
        .collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
  );

  useEffect(() => {
    chatRef?.current?.scrollIntoView();
  }, [roomId, loading]);

  return (
    <ChatContainer>
      {roomDetails && roomMessages && (
        <>
          <Header>
            <HeaderLeft>
              <h4>
                <strong>#{roomDetails?.data().name}</strong>
              </h4>
              <StarBorderOutlined />
            </HeaderLeft>
            <HeaderRight>
              <p>
                <InfoOutlinedIcon />
                Details
              </p>
            </HeaderRight>
          </Header>
          <ChatMessages>
            {roomMessages?.docs.map((doc) => {
              const { message, timestamp, user, userImage } = doc.data();
              console.log(message, "message")
              const encrypted = CryptoJS.enc.Base64.parse(
                message
              );

              console.log(encrypted)

              const salt_len = 16
              const iv_len = 16;

              const salt = CryptoJS.lib.WordArray.create(
                encrypted.words.slice(0, salt_len / 4)
              );
              const iv = CryptoJS.lib.WordArray.create(
                encrypted.words.slice(0 + salt_len / 4, (salt_len + iv_len) / 4)
              );

              const key = CryptoJS.PBKDF2("secret message", salt, {
                keySize: 256 / 32,
                iterations: 10000,
                hasher: CryptoJS.algo.SHA256,
              });

              const decrypted = CryptoJS.AES.decrypt(
                {
                  ciphertext: CryptoJS.lib.WordArray.create(
                    encrypted.words.slice((salt_len + iv_len) / 4)
                  ),
                },
                key,
                { iv: iv }
              );
              console.log(decrypted.toString(CryptoJS.enc.Utf8));
              return (
                <Message
                  key={doc.id}
                  message={decrypted.toString(CryptoJS.enc.Utf8)}
                  timestamp={timestamp}
                  user={user}
                  userImage={userImage}
                />
              );
            })}
            <ChatBottom ref={chatRef} />
          </ChatMessages>
          <ChatInput
            chatRef={chatRef}
            channelName={roomDetails?.data().name}
            channelId={roomId}
          />
        </>
      )}
    </ChatContainer>
  );
}

export default Chat;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid lightgray;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  > h4 {
    display: flex;
    text-transform: lowercase;
    margin-right: 10px;
  }
  > h4 > .MuiSvgIcon-root {
    margin-left: 10px;
    font-size: 18px;
  }
`;

const HeaderRight = styled.div`
  > p {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
`;

const ChatContainer = styled.div`
  flex: 0.7;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 60px;
`;

const ChatMessages = styled.div``;

const ChatBottom = styled.div``;
