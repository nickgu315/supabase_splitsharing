import Image from "next/image";
import { useMoralis } from "react-moralis";
import Head from "next/head"
import Link from "next/link";
import { Container, Button, Text } from "@chakra-ui/react";
//import Moralis from "moralis/dist/moralis.min.js";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useState, useEffect } from "react";
import Router from "next/router";
import { withRouter } from 'next/router';
import Header from "../components/Header";





//{roomOwner, roomMember1 }
function ChatBox({router}){

  //const roomOwner = "9EjTsZgREdrnVziCadwCkCiH"
  //const roomMember1 = "bxQgDLBp0bGQ6abiomaOElpA"

  //const userId = roomOwner


  const {isAuthenticated, Moralis} = useMoralis();
  const [roomOwner, setRoomOwner] = useState("");
  const [roomMember1, setRoomMember1] = useState("");
  const [roomId, setRoomId] = useState("");
  const [textMessage, setTextMessage] = useState("");
  const [textMsgs, setTextMsgs] = useState("");
  const [userId, setUserId] = useState("");
  const [myDisplayName, setMyDisplayName] = useState("");

  useEffect(() => {
    console.log("router.query.sharerId", router.query.sharerId)

    setTimeout(() => {
      const userObj = Moralis.User.current();
      if (!userObj){
        console.log("not logged in")
        return
      }
      setUserId(userObj.id)
      setMyDisplayName(userObj.attributes.displayName);
      /*
      if (!router.query.sharerId){
        alert("Error: Sharer ID not found!")
        return "Error: Sharer ID not found!"
      }*/
      const thisRoomId = userObj.id + router.query.sharerId
      setRoomId(thisRoomId);
      setRoomOwner(userObj.id)
      setRoomMember1(router.query.sharerId)
      sendItemMsg(thisRoomId);
      getMessages();
      subscribeMessages();
    }, 500);




  }, []);


  const sendItemMsg =  (theRoomId) => {
    const userObj = Moralis.User.current();
    var productMsg
    if (router.query.itemId && !router.query.multiItems){

      productMsg = {
        userId: userObj.id,
        roomId: theRoomId,
        lastReadId: userObj.id,
        textMessage: "Hi! I am interested in sharing this item that you have listed: \xa0" + router.query.itemBrand + "\xa0" + router.query.itemName,
        displayName: userObj.attributes.displayName,
        image: router.query.itemImage,
      };



    } else if (router.query.multiItems){
      console.log("multiItems")
      productMsg = {
        userId: userObj.id,
        roomId: theRoomId,
        lastReadId: userObj.id,
        textMessage: router.query.combinedText,
        displayName: userObj.attributes.displayName,
        //image: router.query.itemImage,
      };



    }
    if (!productMsg){
      return
    }
    const Message_product = Moralis.Object.extend("Messages");
    const message_product = new Message_product();

    //const msgDataACL1 = new Moralis.ACL();
    //msgDataACL1.setReadAccess(userObj.id, true);

    //const msgDataACL2 = new Moralis.ACL();
    //msgDataACL2.setReadAccess(router.query.sharerId, true);
    //console.log("msgDataACL2", msgDataACL2)

    //message_product.setACL(msgDataACL1);
    //message_product.setACL(msgDataACL2);

    message_product.setACL({
        [userObj.id]: {
            "read": true,
            "write": true
        },
        [router.query.sharerId]: {
            "read": true,
            "write": true
        }
    });



    message_product.set(productMsg);
    message_product.save();
  }

  const subscribeMessages = async () => {
    const userObj = Moralis.User.current();
    console.log("router.query.sharerId at Sub", router.query.sharerId);
    const roomId1 = router.query.sharerId + userObj.id;
    const roomId2 = userObj.id + router.query.sharerId;

    const query = new Moralis.Query("Messages");
    query.containedIn("roomId", [roomId1, roomId2]);
    const subscription = await query.subscribe();

    // on subscription object created
    subscription.on("create", async (object) => {
      console.log("sub",object);
      console.log("sub lastReadId",object.attributes.lastReadId);
      if (object.attributes.userId !=  userObj.id && object.attributes.lastReadId != userObj.id){
        console.log("saved last read")
        object.set({lastReadId: userObj.id})
        object.save()
      }
      //var username = await getUsername(object.attributes.userId);
      var newMessage = {
        //msgId: msgResults[i].id,
        createdAt: object.attributes.createdAt,
        userId: object.attributes.userId,
        textMessage: object.attributes.textMessage,
        displayName: object.attributes.displayName,
        image: object.attributes.image,
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
    const userObj = Moralis.User.current();
    console.log("router.query.sharerId at get", router.query.sharerId);
    var roomId1 = userObj.id + router.query.sharerId;
    var roomId2 = router.query.sharerId + userObj.id;



    const ChatRoom = Moralis.Object.extend("ChatRooms");
    const chatRoom = new Moralis.Query(ChatRoom);
    chatRoom.containedIn("roomId", [roomId1, roomId2]);
    const chatRoomResults = await chatRoom.find();
    console.log("chatRoomResults length", chatRoomResults.length)

    //double check 1
    const ChatRoom_01 = Moralis.Object.extend("ChatRooms");
    const chatRoom_01 = new Moralis.Query(ChatRoom_01);
    chatRoom_01.equalTo("roomOwner", userObj.id);
    chatRoom_01.equalTo("roomMember1", router.query.sharerId);
    const resultChatRoom_01 = await chatRoom_01.find()
    console.log("resultChatRoom_01", resultChatRoom_01)
    console.log("resultChatRoom_01 length", resultChatRoom_01.length)

    const ChatRoom_02 = Moralis.Object.extend("ChatRooms");
    const chatRoom_02 = new Moralis.Query(ChatRoom_02);
    chatRoom_02.equalTo("roomOwner", router.query.sharerId);
    chatRoom_02.equalTo("roomMember1", userObj.id);
    const resultChatRoom_02 = await chatRoom_02.find()
    console.log("resultChatRoom_02", resultChatRoom_02)
    console.log("resultChatRoom_02 length", resultChatRoom_02.length)




    if(chatRoomResults.length == 0 && resultChatRoom_01.length == 0 && resultChatRoom_02.length ==0){
      const ChatRoom0 = Moralis.Object.extend("ChatRooms");
      const chatRoom0 = new ChatRoom0();
      var newChatRoom = {
        roomId: roomId1,
        roomOwner: userObj.id,
        roomMember1: router.query.sharerId,
      };

      chatRoom0.set(newChatRoom);
      chatRoom0.save().then(
        (newChatRoomResults) => {
          // Execute any logic that should take place after the object is saved.
          //alert("New object created with objectId: " + msg.id);
        },
        (error) => {
          // Execute any logic that should take place if the save fails.
          // error is a Moralis.Error with an error code and message.
          alert("Failed to create new ChatRoom, with error code: " + error.message);
        }
      );
    }

    const Message = Moralis.Object.extend("Messages");
    const message = new Moralis.Query(Message);
    message.containedIn("roomId", [roomId1, roomId2]);
    const msgResults = await message.find();
    console.log("all msgResults", msgResults)
    message.descending("createdAt");
    const lastMsgResults = await message.first();
    console.log("last msgResults", lastMsgResults)

    if (lastMsgResults && lastMsgResults.attributes.userId !=  userObj.id && lastMsgResults.attributes.lastReadId !=  userObj.id){
      lastMsgResults.set({lastReadId: userObj.id})
      lastMsgResults.save()

    }





    var msgs = [];

    //get item info


    for (let i = 0; i < msgResults.length; i++) {
      //var username = await getUsername(msgResults[i].attributes.userId);
      var msg = {
        //msgId: msgResults[i].id,
        createdAt: msgResults[i].attributes.createdAt,
        userId: msgResults[i].attributes.userId,
        textMessage: msgResults[i].attributes.textMessage,
        displayName: msgResults[i].attributes.displayName,
        image: msgResults[i].attributes.image,
      };

      msgs.push(msg);
    }

    setTextMsgs(msgs);
  };

  const setMsgACL = async (theMsg, userId1, userId2) => {
  console.log("userId1", userId1)
  console.log("userId2", userId2)
  const params = {msg: theMsg.id, roomOwner: userId1, roomMember1: userId2}
  const resultsSetMsgACL = await Moralis.Cloud.run("setMsgACL", params)
  console.log("resultsSetMsgACL", resultsSetMsgACL)
  }

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
      lastReadId: userId,
      image: null,
    };

    const Message = Moralis.Object.extend("Messages");
    const message = new Message();



    message.setACL({
        [roomOwner]: {
            "read": true,
            "write": true
        },
        [roomMember1]: {
            "read": true,
            "write": true
        }
    });
    //message.setACL(msgDataACL2);



    message.set(newMsg);
    message.save().then(
      (msg) => {
        //console.log("roomOwner", roomOwner)

        //setMsgACL(msg, roomOwner, roomMember1)

        /*
        const DataACL1 = new Moralis.ACL();
        DataACL1.setReadAccess(userResults, true);
        DataACL1.setWriteAccess(userResults, true);
        message.setACL(DataACL1)

        const DataACL2 = new Moralis.ACL();
        DataACL2.setReadAccess(roomMember1, true);
        DataACL2.setWriteAccess(roomMember1, true);
        message.setACL(DataACL2)
        */



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
    <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    </Head>
    <Header/>
    {isAuthenticated ?
    (
    <div className="flex flex-col items-center w-full h-full">

    <Container className="w-[90vw] md:w-[40vw] pt-[60px] md:h-full md:pt-[80px] pb-10">
      {/* react chat */}
      <div
        style={{
          height: "75vh",
        }}
      >
        <MainContainer style={{ border: "0" }}>
          <ChatContainer>
            <MessageList style={{ background: "#F2F2F2" }}>
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
                        {data.image &&
                        <Message type="image" model={{
                            direction: data.userId === userId ? "outgoing" : "incoming",
                            payload: {
                              src: data.image,
                              width: "100px"
                            }
                          }}
                          key={"3." + key}
                          />}
                      </div>
                    );
                  })}
              </MessageList.Content>
            </MessageList>
            <MessageInput
              style={{ background: "#F2F2F2" }}
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
    </div>
    ) : (
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-80 px-6">
          <Link href="/">
            <button className={styles.loginButton}>
              Please Login to Start Messaging!
            </button>
          </Link>
        </div>
      </div>

    )}

    </>
  );
};

export default withRouter(ChatBox)
