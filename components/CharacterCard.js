import Image from "next/image";
import styles from "../styles/Home.module.css";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";

function CharacterCard({imageLink}) {
    const {isAuthenticated, Moralis} = useMoralis();
    const itemNumber = 1
    const itemNameTest = "Paper Towels"
    const itemBrandTest = "Costco"
    const itemImageTest = "https://i.picsum.photos/id/588/200/300.jpg?hmac=Bb5mvfvSw-sKhocAA4Mfdb78ysl5ktbClTt-Lc0IyWk"
    const [messageModal, setMessageModal] = useState(false);
    const [theOtherName, setTheOtherName] = useState('');

    const router = useRouter()


    return (
      <>
        <div className="pt-2 right-2 bottom-2">
          <button type="button"
          onClick={()=>{
            console.log("in message card theOtherId:")
            }
          }
          >
            <img src={imageLink._url} className='w-[60px] h-[60px] rounded-full'/>
          </button>
        </div>
    </>
    )
}

export default CharacterCard
