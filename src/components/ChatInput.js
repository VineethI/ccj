import { Button } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import firebase from "firebase";
import { db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import CryptoJS from "crypto-js";

function ChatInput({ chatRef, channelName, channelId }) {
  const [user] = useAuthState(auth);

  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (!channelId) {
      return false;
    }

    const salt = CryptoJS.lib.WordArray.random(16);
    const iv = CryptoJS.lib.WordArray.random(16);

    const key = CryptoJS.PBKDF2("secret message", salt, {
      keySize: 256 / 32,
      iterations: 10000,
      hasher: CryptoJS.algo.SHA256,
    });

    const encrypted = CryptoJS.AES.encrypt(
      input,
      key,
      { iv: iv }
    ).ciphertext;

    const concatenned = CryptoJS.lib.WordArray.create()
      .concat(salt)
      .concat(iv)
      .concat(encrypted);

    // console.log({
    //   iv: iv.toString(CryptoJS.enc.Base64),
    //   salt: salt.toString(CryptoJS.enc.Base64),
    //   encrypted: encrypted.toString(CryptoJS.enc.Base64),
    //   concatenned: concatenned.toString(CryptoJS.enc.Base64),
    // });

    db.collection("rooms").doc(channelId).collection("messages").add({
      message: concatenned.toString(CryptoJS.enc.Base64),
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      user: user.displayName,
      userImage: user.photoURL,
    });

    chatRef.current.scrollIntoView({
      behavior: "smooth",
    });

    setInput("");
  };

  return (
    <ChatInputContainer>
      <form>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${channelName}`}
        />
        <Button hidden type="submit" onClick={sendMessage}>
          SEND
        </Button>
      </form>
    </ChatInputContainer>
  );
}

export default ChatInput;

const ChatInputContainer = styled.div`
  border-radius: 20px;
  > form {
    display: flex;
    position: relative;
    justify-content: center;
  }

  > form > input {
    position: fixed;
    bottom: 30px;
    width: 60%;
    border: 1px solid gray;
    border-radius: 3px;
    padding: 20px;
    outline: none;
  }

  > form > button {
    display: none !important;
  }
`;
