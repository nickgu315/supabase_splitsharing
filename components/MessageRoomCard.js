import Image from "next/image";
import styles from "../styles/Home.module.css";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";

function MessageRoomCard({roomId1, roomId2, theOtherId, newMsg}) {
    const {isAuthenticated, Moralis} = useMoralis();
    const itemNumber = 1
    const itemNameTest = "Paper Towels"
    const itemBrandTest = "Costco"
    const itemImageTest = "https://i.picsum.photos/id/588/200/300.jpg?hmac=Bb5mvfvSw-sKhocAA4Mfdb78ysl5ktbClTt-Lc0IyWk"
    const [messageModal, setMessageModal] = useState(false);
    const [theOtherName, setTheOtherName] = useState('');

    const router = useRouter()


    useEffect(() => {
      getUsername();
    }, []);


    const getUsername = async () => {
      //console.log("theOtherId", theOtherId)
      const params={id: theOtherId}
      const results = await Moralis.Cloud.run("returnUserDisplayName", params)
      //console.log("user displayname", results)
      setTheOtherName(results)
    };

    return (
      <>
      <div className="pt-3 pb-3 w-80 mx-6 border-2 border-[#F1592A] rounded-xl rounded mt-3 mb-3">
        <div className="flex flex-col item-center">

        </div>
          <div className="w-[300px] h-20 rounded bg-white px-6 pt-4 pb-4 flex flex-col item-center relative">
              <div>
                <p className="block text-blue-600/50 text-xs font-bold">
                  Contact:
                </p>
              </div>

              <div className="pt-1">
                <p className="block text-blue-600/100 text-lg font-bold">
                {theOtherName}</p>
              </div>

              <div className="pt-2 absolute right-2 bottom-2">
                <button className={styles.connectButton} type="button"
                onClick={()=>{
                  console.log("in message card theOtherId:", theOtherId)
                  router.push({
                      pathname: '/chatBox',
                      query: { sharerId: theOtherId }
                  })
                }}
                >
                  Check Messages
                </button>
              </div>

              <div className="pt-2 absolute right-2 top-1">
                <p className="block text-gray-700/100 text-sm font-bold text-[#F1592A] ">
                  {newMsg && "New Message!"}
                </p>
              </div>
          </div>
        </div>


        {messageModal && (
          <div>
            <div>
              <div>
                <ChatBox />
              </div>
            </div>
          </div>
        )}

    </>
    )
}

export default MessageRoomCard
