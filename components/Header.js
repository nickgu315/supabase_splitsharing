import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AiFillFacebook } from "react-icons/ai";
import { BsTwitter } from "react-icons/bs";
import { IoMdClose } from 'react-icons/io';
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";

function Header() {
    const {isAuthenticated, Moralis} = useMoralis();
    const router = useRouter();
    const currentRoute = router.pathname;
    const [isOpenSidebar, setIsOpenSidebar] = useState(false)
    const [haveNewMessages, setHaveNewMessages] = useState(false)
    const [userId, setUserId] = useState('')
    const [creatorSharemonImage, setCreatorSharemonImage] = useState(undefined);

    const closeSidebar = () => {
        setIsOpenSidebar(false)
        document.documentElement.style.overflow = 'auto'
        document.body.style.right = '0'
        document.querySelector('#top_header').style.left = 0
    }
    const openSidebar = () => {
        setIsOpenSidebar(true)

        document.body.style.right = `${(window.innerWidth / 100) * 80}px`
        document.querySelector('#top_header').style.left = `-${(window.innerWidth / 100) * 80}px`
        document.documentElement.style.overflow = 'hidden'
    }

    const getTripCreatorSharemonImage = async () => {
      const userObj = Moralis.User.current();
      const params = {id: userObj.id}
      const results = await Moralis.Cloud.run("getTripCreatorSharemonImage", params)

      setCreatorSharemonImage(results)
    }


    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'mobile_nav_overly') {
                closeSidebar()
            }
        })
    }, [])

    useEffect(() => {
      if(isAuthenticated){
      getTripCreatorSharemonImage();
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
      //console.log("chatRoomResults1", chatRoomResults1)

      const ChatRoom_02 = Moralis.Object.extend("ChatRooms");
      const chatRoom_02 = new Moralis.Query(ChatRoom_02);
      chatRoom_02.equalTo("roomMember1", userObj.id);
      var chatRoomResults2 = await chatRoom_02.find();
      //console.log("chatRoomResults2", chatRoomResults2)
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
      //console.log("allChatRoomResults", allChatRoomResults)
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
          //console.log("msgResults first", msgResults)
          if (msgResults && msgResults.attributes.userId == msgResults.attributes.lastReadId && msgResults.attributes.userId != userObj.id){
            chatRooms.push({roomId1:roomId1, roomId2:roomId2, theOtherId: theOtherId_0, newMsg: true})
            setHaveNewMessages(true)
          } else {
            chatRooms.push({roomId1:roomId1, roomId2:roomId2, theOtherId: theOtherId_0, newMsg: false})
          }
        }
      }

    }


    /*
    {isAuthenticated ?
    ( <div className='pt-[6px]'>
        <Link href="/">
          <button>
            <Image width={75} height={42.5} src="/SpliSharing_Logo4.png"/>
          </button>
        </Link>
      </div>
    ) :
    ( <div className='pt-[5px]'>
        <Link href="/">
          <button>
            <Image width={40} height={40} src="/SpliSharing_SLogo.png"/>
          </button>
        </Link>
      </div>
    )
  }*/

    return (
        <header className="h-[50px] lg:h-[60px] bg-white flex items-center justify-between py-1 lg:py-2 pr-[18px] pl-[14px] lg:px-[60px] fixed top-0 left-0 w-full z-50 shadow-md" id="top_header" style={{ transition: '0.2s' }}>
            <div className="max-w-[165px] lg:max-w-[250px]" >
                    <div>
                      <div className='pt-[6px]'>
                        <Link href="/">
                          <button>
                            <img src="/SpliSharing_Logo4.png" className="object-contain h-[39px] w-[200px] md:h-[78px] md:w-[400px] md:translate-x-[3vw] lg:h-[78px] lg:w-[400px] lg:translate-x-[2vw] xl:translate-x-[10vw]"/>
                          </button>
                        </Link>
                      </div>
                    </div>


            </div>


            {haveNewMessages &&
            <div>
              <Link href="/messageRooms">
                <button className = "new_msg">
                  You Have New Messages!
                </button>
              </Link>
            </div>
            }

            {isAuthenticated &&
            <div>
              <div className='pl-[120px] md:hidden'>
                <img layout="responsive" src={creatorSharemonImage} className="w-[35px] h-[35px] rounded-full lg:w-[46px] lg:h-[46px] object-contain"/>
              </div>
              <div className='pl-[120px] hidden md:flex absolute right-[10px] top-[7px]'>
                <img layout="responsive" src={creatorSharemonImage} className="w-[35px] h-[35px] rounded-full lg:w-[46px] lg:h-[46px] object-contain"/>
              </div>
            </div>
            }

            <div>

                {/* Hamburger Icon --Start-- */}
                <div className="flex flex-col space-y-[5px] w-[28px] group lg:hidden" onClick={openSidebar}>
                    <span className="w-[80%] group-hover:w-full duration-100 block bg-[#F1592A] h-[2px]"></span>
                    <span className="w-full block bg-[#F1592A] h-[2px]"></span>
                    <span className="w-[65%] block group-hover:w-full duration-100 delay-75 bg-[#F1592A] h-[2px]"></span>
                </div>
                {/* Hamburger Icon --End-- */}



                <nav id="mobile_nav_overly" className={`fixed overflow-auto lg:overflow-visible top-0 left-0 w-full h-screen lg:h-auto duration-200 ${isOpenSidebar ? "bg-[#F1592A] pointer-events-auto opacity-100" : 'pointer-events-none opacity-0 lg:pointer-events-auto lg:opacity-100'} lg:static lg:bg-transparent`} >
                    <ul className={`flex flex-col lg:flex-row w-[90%] lg:w-full px-1 bg-white lg:bg-transparent ml-auto lg:ml-[unset] min-h-full lg:h-auto ${!isOpenSidebar ? "translate-x-full lg:translate-x-0" : 'translate-x-0'} duration-200`}>
                        <li className="px-5 py-3 sticky top-0 left-0 w-full z-10 bg-white flex items-center justify-between lg:hidden mb-[25px] border-b border_soft" >
                            <Link href="/">
                              <span className="nav_link2 px-0 py-0 text-[#F1592A]" >
                                <img src="/SpliSharing_Logo4.png" alt="Splitsharing" className = "w-[200px] h-[45px]"/>
                              </span>
                            </Link>
                            <span className="text-[#F1592A]" onClick={closeSidebar} >
                                <IoMdClose size={28} />
                            </span>
                        </li>

                        <li>
                            <Link href="/sharingListPublic">
                                <a
                                    className={currentRoute === "/sharingListPublic"
                                    ? "nav_linkActive"
                                    : "nav_linkNonActive"}
                                    onClick={closeSidebar}
                                    >
                                    Items for Share
                                </a>
                            </Link>
                        </li>

                        <li className="relative">
                            <Link href="/shoppingTrips">
                                <a
                                    className={currentRoute === "/shoppingTrips" ||
                                    currentRoute == "/shoppingTrip" ||
                                    currentRoute == "/addItemToShoppingTrip"

                                    ? "nav_linkActive"
                                    : "nav_linkNonActive"}
                                    onClick={closeSidebar}

                                    >
                                    Shopping Trips
                                    {currentRoute !== "/shoppingTrips" &&
                                     currentRoute !== "/shoppingTrip" &&
                                     currentRoute !== "/addItemToShoppingTrip" &&
                                    <div className={`text-[11px] absolute top-[-8px] left-[20px] text-[black] ${isOpenSidebar && "text-[8px] top-[-3px]"} `}>
                                      New!
                                    </div>}
                                </a>
                            </Link>
                        </li>

                        {isAuthenticated &&
                        <li>
                            <Link href="/mylists">
                                <a className={currentRoute === "/mylists" ||
                                currentRoute == "/listYourItem" ||
                                currentRoute == "/sharingList" ||
                                currentRoute == "/shoppingList" ||
                                currentRoute == "/addItemToShoppingList" ||
                                currentRoute == "/shoppingListUnlisted" ||
                                currentRoute == "/sharingListUnlisted"

                                ? "nav_linkActive"
                                : "nav_linkNonActive"}
                                onClick={closeSidebar}
                                >
                                    My Lists
                                </a>
                            </Link>
                        </li>
                        }

                        {isAuthenticated &&
                        <li>
                            <Link href="/messageRooms">
                                <a className={currentRoute === "/messageRooms"
                                ? "nav_linkActive"
                                : "nav_linkNonActive"}
                                onClick={closeSidebar}
                                >
                                    Messages
                                </a>
                            </Link>
                        </li>
                        }


                        <li>
                            <Link href="/10-Great-Sharable-Costco-Items-that-Could-Easily-Save-You-Over-$50-if-you-split-and-share">
                                <a className={currentRoute === "/10-Great-Sharable-Costco-Items-that-Could-Easily-Save-You-Over-$50-if-you-split-and-share"
                                ? "nav_linkActive"
                                : "nav_linkNonActive"}
                                onClick={closeSidebar}
                                >
                                    Blog
                                </a>
                            </Link>
                        </li>


                        <li>
                            <Link href="/about">
                                <a className={currentRoute === "/about"
                                ? "nav_linkActive"
                                : "nav_linkNonActive"}
                                onClick={closeSidebar}
                                >
                                    About
                                </a>
                            </Link>
                        </li>

                       {!isAuthenticated ?
                        <li>
                            <Link href="/signin">
                                <a className={currentRoute === "/signin"
                                ? "nav_linkActive"
                                : "nav_linkNonActive"}
                                onClick={closeSidebar}
                                >
                                    Sign Up / Login
                                </a>
                            </Link>
                        </li>
                        :
                        <li>
                            <Link href="/userProfile">
                                <a className={currentRoute === "/userProfile"
                                ? "nav_linkActive"
                                : "nav_linkNonActive"}
                                onClick={closeSidebar}
                                >
                                    Account
                                </a>
                            </Link>
                        </li>
                        }

                        <li className="lg:hidden px-5 w-full mt-[30vh] pt-12 bg-[#F1592A]">
                            <ul className="flex items-center gap-3 text-[#d4d4d4]" >
                                <li>
                                    <a target="_blank" rel="noreferrer" href="https://www.facebook.com/Splitsharing/">
                                        <AiFillFacebook size={25} />
                                    </a>
                                </li>

                                <li>
                                    <a target="_blank" rel="noreferrer" href="mailto:hello@splitsharing.com">
                                        <svg className="group-hover:scale-[1.1] duration-100" width="24" height="24" fill="#d4d4d4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path d="M25.87 5.42V4.9H.1v15.28c0 .4.4.78.78.78h24.35c.4 0 .78-.4.78-.78l-.14-14.76zm-2.98.77l-9.97 8.3-9.97-8.3H22.9zM1.52 19.4V7.1l10.88 8.94c.13.13.26.13.52.13s.4 0 .52-.13L24.32 7.1v12.3H1.52z"></path></svg>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="px-5 pt-5 py-10 text-xs lg:hidden text-[#d4d4d4]" >2022@ <Link href="/"><a>Splitsharing</a></Link> </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header
