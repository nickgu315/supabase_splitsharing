import Image from "next/image";
import { useMoralis } from "react-moralis";
//import styles from "../styles/Home.module.css";
import Link from "next/link";
import Router from "next/router";
import { Container, Button, Text } from "@chakra-ui/react";
import Moralis from "moralis/dist/moralis.min.js";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect } from "react";
import { withRouter } from 'next/router';





//{roomOwner, roomMember1 }
function ChatBox({router}){
//const roomId = 1
  const roomOwner = "9EjTsZgREdrnVziCadwCkCiH"
  const roomMember1 = "bxQgDLBp0bGQ6abiomaOElpA"
  const roomId = roomOwner + roomMember1
  //const userId = roomOwner


  const {isAuthenticated, Moralis} = useMoralis();
  const [textMessage, setTextMessage] = useState("");
  const [textMsgs, setTextMsgs] = useState("");
  const [userId, setUserId] = useState("");
  const [myDisplayName, setMyDisplayName] = useState("");

  useEffect(() => {
    getMyDisplayName();
    getMessages();
    subscribeMessages();
  }, []);

  const subscribeMessages = async () => {
    console.log("withinSub");
    const query = new Moralis.Query("Messages");
    query.equalTo("roomId", roomId);
    const subscription = await query.subscribe();

    // on subscription object created
    subscription.on("create", async (object) => {
      console.log("sub",object);
      //var username = await getUsername(object.attributes.userId);
      var newMessage = {
        //msgId: msgResults[i].id,
        createdAt: object.attributes.createdAt,
        userId: object.attributes.userId,
        textMessage: object.attributes.textMessage,
        displayName: object.attributes.displayName,
      };
      setTextMsgs(textMsgs => [...textMsgs, newMessage])
    });
  };

  const getMyDisplayName = async () => {
    const userObj = Moralis.User.current();
    setUserId(userObj.id)
    setMyDisplayName(userObj.attributes.displayName);
  };


  // Get textMsgs in this room
  const getMessages = async () => {
    const Message = Moralis.Object.extend("Messages");
    const message = new Moralis.Query(Message);
    message.equalTo("roomId", roomId);
    const msgResults = await message.find();

    var msgs = [];


    for (let i = 0; i < msgResults.length; i++) {
      //var username = await getUsername(msgResults[i].attributes.userId);

      var msg = {
        //msgId: msgResults[i].id,
        createdAt: msgResults[i].attributes.createdAt,
        userId: msgResults[i].attributes.userId,
        textMessage: msgResults[i].attributes.textMessage,
        displayName: msgResults[i].attributes.displayName,
      };

      msgs.push(msg);
    }

    setTextMsgs(msgs);
  };

  const getUsername = async (userId) => {
    // Query username (probably use cloud function here)
    const User = Moralis.Object.extend("User");
    const user = new Moralis.Query(User);
    user.equalTo("objectId", userId);
    const userResults = await user.find();
    console.log("user displayname", userResults[0].attributes.displayName)

    return userResults[0].attributes.displayName;
  };

  const sendMessage = (e) => {
    var newMsg = {
      textMessage: textMessage,
      userId: userId,
      roomId: roomId,
      displayName: myDisplayName,
      roomOwner: roomOwner,
      roomMember1: roomMember1,
    };

    const Message = Moralis.Object.extend("Messages");
    const message = new Message();

    message.set(newMsg);
    message.save().then(
      (msg) => {
        setTextMessage('')
        // Execute any logic that should take place after the object is saved.
        //alert("New object created with objectId: " + msg.id);
      },
      (error) => {
        // Execute any logic that should take place if the save fails.
        // error is a Moralis.Error with an error code and message.
        alert("Failed to create new object, with error code: " + error.message);
      }
    );
  };

  return (
    <Container>
      {/* react chat */}
      <div
        style={{
          height: "80vh",
        }}
      >
        <Button onClick={() => console.log(textMsgs)}>get textMsgs</Button>
        <MainContainer style={{ border: "0" }}>
          <ChatContainer>
            <MessageList>
              <MessageList.Content>
                {textMsgs &&
                  textMsgs.map((data, key) => {
                    return (
                      <div key={"0." + key}>
                        <Text
                          key={"1." + key}
                          align={data.userId === userId ? "right" : "left"}
                          fontSize="12"
                        >
                          {data.displayName}
                        </Text>
                        <Message
                          model={{
                            message: data.textMessage,
                            direction:
                              data.userId === userId ? "outgoing" : "incoming",
                            sentTime: "just now",
                            sender: "Joe",
                          }}
                          key={"2." + key}
                        />
                      </div>
                    );
                  })}
              </MessageList.Content>
            </MessageList>
            <MessageInput
              value={textMessage}
              placeholder="Type message here"
              attachButton={false}
              onChange={(text) => {
                setTextMessage(text);
              }}
              onSend={sendMessage}
            />
          </ChatContainer>
        </MainContainer>
      </div>
    </Container>
  );
};

export default withRouter(ChatBox)
