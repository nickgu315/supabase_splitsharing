import React, { useRef } from "react";
import styles from "../styles/Home.module.css";
//import HeaderGame from "../components/HeaderGame"
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection"
//import AnnouncementBar from "../components/AnnouncementBar";
//import Displaygameinfo from "../components/Displaygameinfo"
//import Form1 from "../components/Form1";
import Footer from "../components/Footer"
import useTranslation from "next-translate/useTranslation"
import Head from "next/head"
import { useRouter } from 'next/router'
import AddItem from "../components/AddItem";
import ItemCard from "../components/ItemCard";
import MessageRoomCard from "../components/MessageRoomCard";
import SharingListPublic from "../components/SharingListPublic";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();
  const [userId, setUserId] = useState("");
  const [chatRoomsToShow, setChatRoomsToShow] = useState([]);

  const text1 = "You Currently don't have any chat rooms."

  useEffect(() => {
    if(!isAuthenticated){
      return
    }
    Moralis.LiveQuery.close();
    getAndSetChatRooms();
  }, []);

  const getAndSetChatRooms = async () => {
    if (!isAuthenticated){
      return
    }
    const userObj = Moralis.User.current();
    setUserId(userObj.id)

    const ChatRoom = Moralis.Object.extend("ChatRooms");
    const chatRoom = new Moralis.Query(ChatRoom);
    chatRoom.equalTo("roomOwner", userObj.id);
    var chatRoomResults1 = await chatRoom.find();
    console.log("chatRoomResults1", chatRoomResults1)

    const ChatRoom_02 = Moralis.Object.extend("ChatRooms");
    const chatRoom_02 = new Moralis.Query(ChatRoom_02);
    chatRoom_02.equalTo("roomMember1", userObj.id);
    var chatRoomResults2 = await chatRoom_02.find();
    console.log("chatRoomResults2", chatRoomResults2)
    var allChatRoomResults = []
    if (chatRoomResults1.length !=0){
      for(const indiChatRoomResults1 of chatRoomResults1){
      allChatRoomResults.push(indiChatRoomResults1)
      }
    }
    if (chatRoomResults2.length !=0){
      for(const indiChatRoomResults2 of chatRoomResults2){
      allChatRoomResults.push(indiChatRoomResults2)
      }
    }
    console.log("allChatRoomResults", allChatRoomResults)
    var chatRooms = []
    if (allChatRoomResults.length != 0){
      for(const indiChatRoom of allChatRoomResults){
        const Message = Moralis.Object.extend("Messages");
        const message = new Moralis.Query(Message);
        var theOtherId_0
        if (indiChatRoom.attributes.roomOwner == userObj.id){
          theOtherId_0 = indiChatRoom.attributes.roomMember1
        }else{
          theOtherId_0 = indiChatRoom.attributes.roomOwner
        }
        const roomId1 = indiChatRoom.attributes.roomOwner + indiChatRoom.attributes.roomMember1
        const roomId2 = indiChatRoom.attributes.roomMember1 + indiChatRoom.attributes.roomOwner
        message.containedIn("roomId", [roomId1, roomId2]);
        message.descending("createdAt");
        const msgResults = await message.first();
        //const msgResults = await message.find();
        console.log("msgResults first", msgResults)
        if (msgResults && msgResults.attributes.userId == msgResults.attributes.lastReadId && msgResults.attributes.userId != userObj.id){
          chatRooms.push({roomId1:roomId1, roomId2:roomId2, theOtherId: theOtherId_0, newMsg: true})
        } else {
          chatRooms.push({roomId1:roomId1, roomId2:roomId2, theOtherId: theOtherId_0, newMsg: false})
        }
      }
    }

    console.log("chatRooms", chatRooms)
    setChatRoomsToShow(chatRooms)

  }


  return (
    <>
      <Head>
        <title>Messages Splitsharing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>
      {isAuthenticated ?
      <div>
        <div className="flex flex-col items-center">
            <div className="pt-10 flex flex-col items-center text-white" >
              Your Message Groups:
            </div>

            {chatRoomsToShow ? (
            <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {chatRoomsToShow.map((card, index) => (
                        <MessageRoomCard key={index} {...card} />
                    ))}
                </div>
            </div>

          ):
          <div>
              {text1}
          </div>


          }

        </div>
      </div>
      :
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-80 px-6">
          <Link href="/">
            <button className={styles.loginButton}>
              Please Login to Start Messaging with other Sharers/ Sharees!
            </button>
          </Link>
        </div>
      </div>
     }

    </>
  )
}

export default Home
