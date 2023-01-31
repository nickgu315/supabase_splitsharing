// import Link from "next/link"
// import { useRouter } from "next/router"
// import useTranslation from 'next-translate/useTranslation'

//import Header from "../components/Header";
//import NftSection from "../components/NftSection";
//import HeroSection from "../components/HeroSection";
//import GameSection from "../components/GameSection";
//import MarketPlaceSection from "../components/MarketPlaceSection";
//import TeamSection from "../components/TeamSection";
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection";
//import Footer from "../components/Footer";
//import ScrollAnimationSection from "../components/ScrollAnimationSection";
//import RoadmapSection from "../components/RoadmapSection";
//import ScrollAnimationSectionMobile from "../components/ScrollAnimationSectionMobile";
//import RoadMapMobile from "../components/RoadMapMobile";
//import Login from "../components/Login";
import SignIn from "../components/SignIn";
//import ChatBox from "../components/ChatBox";
//import SignOut from "../components/SignOut";
import { useMediaQuery } from 'react-responsive'
import Head from "next/head";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Link from "next/link";
import styles from "../styles/Home.module.css";


// function Home() {
//   const router = useRouter()

//   const { t } = useTranslation()
//   return (
//     <div>

//       <div className="p-20 bg-blue-900 space-y-5 flex flex-col items-center justify-center">
//         <h1
//           className="heading_sm"
//         >
//           {t('common:greet')}
//         </h1>
//         <h1
//           className="heading_md"
//         >
//           {t('common:greet')}
//         </h1>

//         <Button />
//       </div>

//       <ul className="flex flex-col gap-4">
//         {router.locales.map(locale => (
//           <Link href={router.asPath} locale={locale} >
//             <a>{locale}</a>
//           </Link>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default Home

function Home() {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis()
  const [isDesktop, setIsDesktop] = useState(false)
  const [haveNewMessages, setHaveNewMessages] = useState(false)
  const [userId, setUserId] = useState('')

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  })

  useEffect(() => {
    setIsDesktop(isDesktopOrLaptop)
  }, [isDesktopOrLaptop])

  useEffect(() => {
    if(isAuthenticated){
    Moralis.LiveQuery.close();
    getAndSetChatRooms();
    }
  }, []);

  const getAndSetChatRooms = async () => {
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
          setHaveNewMessages(true)
        } else {
          chatRooms.push({roomId1:roomId1, roomId2:roomId2, theOtherId: theOtherId_0, newMsg: false})
        }
      }
    }

  }

  return (
    <div className="section_py flex flex-col items-center">
      {!isAuthenticated ?
      (
      <div>
        <SignIn/>
      </div>
      )
      :
      (

        <div className="bg-black rounded px-6 pt-2 pb-2 w-80">

          <div className="rounded pt-2 pb-2">
            <Link href="/sharingList">
              <button className={styles.loginButton}>
                Your Sharing List
              </button>
            </Link>
          </div>

          <div className="rounded pt-2 pb-2">
            <Link href="/sharingListPublic">
              <button className={styles.loginButton}>
                See What Others are Sharing
              </button>
            </Link>
          </div>

          <div className="rounded pt-2 pb-2 relative">
            <Link href="/messageRooms">
              <button className={styles.loginButton}>
                Messages
              </button>
            </Link>
            <div className="absolute text-white text-xs top-2 right-2">
             {haveNewMessages && "New Message!"}
            </div>
          </div>

          <div className="rounded pt-2 pb-2">
            <Link href="/userProfile">
              <button className={styles.loginButton}>
                Profile
              </button>
            </Link>
          </div>

          <div className="rounded pt-2 pb-2">
            <button className={styles.loginButton} onClick={logout}>
              Sign Out
            </button>
          </div>


        </div>


      )}

    </div>
  )
}

export default Home
