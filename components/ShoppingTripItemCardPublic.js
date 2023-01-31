import Image from "next/image";
import styles from "../styles/Home.module.css";
import ChatBox from "./ChatBox";
import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { useMoralis } from "react-moralis";
import { useDisclosure } from '@chakra-ui/react'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

function ShoppingTripItemCardPublic({isPartners, alertMessageData, userId, ObjId, dropOffLocation, dropOffDay, dropOffDate, dropOffTime, deadlineDate, deadlineTime, tripStore, displayName, tripId}) {
    const {isAuthenticated, Moralis} = useMoralis();
    const itemNumber = 1
    const itemNameTest = "Paper Towels"
    const itemBrandTest = "Costco"
    const [thisUserId, setThisUserId] = useState('');
    const [profileChecked, setProfileChecked] = useState(false);
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [alertModal, setAlertModal] = useState('');
    const [shoppingListCreator, setShoppingListCreator] = useState('');
    const [creatorSharemonImage, setCreatorSharemonImage] = useState(undefined);

    //const [store, setStore] = useState('Costco');

    const text1 = "'s Scheduled Trip to"



    const handleAlertMessage = async (msg) => {
      alertMessageData(msg)
    }

    const getTripCreatorSharemonImage = async () => {
      console.log("id for image", userId)
      const params = {id: userId}
      const results = await Moralis.Cloud.run("getTripCreatorSharemonImage", params)

      setCreatorSharemonImage(results)
    }

    useEffect(() => {
      console.log("isPartners at Card: ", isPartners)
      getTripCreatorSharemonImage()
      if(!isAuthenticated){
        setThisUserId(null)
        return
      }

      const user = Moralis.User.current()
      setShoppingListCreator(ObjId)
      setThisUserId(ObjId)
    }, []);


    const checkProfile = ()=>{
      if(!isAuthenticated){
        ()=>{onOpen}
        handleAlertMessage("Please Login to join Trip!")
        return
      }
      const theUser = Moralis.User.current()
      //console.log("theUser.attributes.phoneNumber.length:", theUser.attributes.phoneNumber.length)
      setProfileChecked(true)
      return true

      if (!theUser.attributes.phoneNumber || theUser.attributes.phoneNumber.length < 4){
        ()=>{onOpen}
        handleAlertMessage("Your User Profile is not completed yet! Please complete first before contacting sharers.")

        setProfileChecked(false)
        return false
      } else {
        setProfileChecked(true)
        return true
      }
    }

    return (
      <div>
        <div className="rounded-xl w-[90vw]  h-[70vw] lg:w-[300px] lg:h-[360px]  bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300 relative">

          <div className="w-[90vw] lg:w-[300px] rounded-xl flex flex-col item-center relative">
              <div className="flex flex-col items-center bg-white border-4 border-[#edeef2] rounded-xl shadow-inner pl-[15vw] lg:pl-[5vw] py-[5px] h-[30vw] lg:h-[150px]">
                <img layout="responsive" src={creatorSharemonImage} className="w-[80px] h-[80px] rounded-full lg:w-[80px] lg:h-[80px] object-contain absolute left-[20px] top-[20px]"/>
                <img layout="responsive" src={'https://amgy7tfiuiie.usemoralis.com:2053/server/files/d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO/3b8d725c259e9a84340d2d1e5c3bb8df_costcoLogo.png'} className="w-[38vw] h-[28vw] lg:w-[180px] lg:h-[180px] object-contain absolute right-[20px] md:right-[5px]"/>
              </div>

              <div className="pl-[7px] flex flex-col items-left">
                  <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                      <p className="text-[14px] md:text-[14px] lg:text-[14px] xl:text-[17px] text-black font-bold">{displayName && displayName}
                      <span className="text-[11px] md:text-[11px] lg:text-[11px] xl:text-[13px] text-gray-500">{text1}</span>
                      <span className="text-[14px] md:text-[14px] lg:text-[14px] xl:text-[17px] font-normal text-[black]"> {tripStore}</span>
                      </p>
                  </div>

                  <div className="pt-[5px] lg:pt-[5px]">
                      <div className="text-gray-700 text-[10px] lg:text-[13px]">
                        Drop off time:
                        <span className="text-black font-bold text-[11px] lg:text-[14px] text-[red]"> {dropOffDay} {dropOffDate}, {dropOffTime} </span>
                      </div>
                  </div>


                  <div className="pt-[5px] lg:pt-[5px]">
                      <div className="text-gray-700 text-[10px] lg:text-[13px]">
                        Deadline to Join:
                        <span className="text-black font-bold text-[11px] lg:text-[14px] text-[red]"> {deadlineDate} {deadlineTime} </span>
                      </div>
                  </div>

                  <div className="pt-[5px] lg:pt-[5px]">
                      <div className="text-gray-700 text-[10px] lg:text-[13px]">
                        Drop off Location:
                        <span className="text-black font-bold text-[14px] lg:text-[15px]"> {dropOffLocation} </span>
                      </div>
                  </div>

              </div>



          </div>
          <div className="lg:hidden pt-2 absolute left-[7px] bottom-[10px]">
            <button className={styles.connectButton} type="button"
            onClick={()=>{
              if (!checkProfile()){
                console.log("no phone no.")
                return}
              console.log("thisUserId on click", thisUserId)
              console.log("shoppingListCreator on click", shoppingListCreator)
              var thisShoppingListCreator = shoppingListCreator
              if(true){
              console.log("isPartners at See Trip Details: ", isPartners)

              router.push({
                pathname: '/shoppingTrip',
                query: { tripId: tripId,
                         isPartners: isPartners,
                        }
              })
            }else if(false){
              handleAlertMessage("You are the creator of this shopping trip!")
              //alert("You are the creator of this item!")
            }


            }}
            >
              See Trip Details/ Add items
            </button>
          </div>

          <div className="pt-2 absolute left-[8px] bottom-[10px] hidden lg:flex">
            <button className={styles.connectButton} type="button"
            onClick={()=>{
              if (!checkProfile()){
                console.log("no phone no.")
                return}
              //console.log("thisUserId on click", thisUserId)
              //console.log("shoppingListCreator on click", shoppingListCreator)
              //var thisShoppingListCreator = shoppingListCreator
              console.log("isPartners at See Trip Details: ", isPartners)
              if(true){

                router.push({
                    pathname: '/shoppingTrip',
                    query: { tripId: tripId,
                              isPartners: isPartners,
                            }
                })
              }else if(false){
                handleAlertMessage("You are the creator of this shopping list!")
                //alert("You are the creator of this item!")
              }

            }}
            >
              See Trip Details/ Add items
            </button>
          </div>
        </div>

        {alertModal.length > 0 &&
          <div>
            Test
          </div>



        }

    </div>
    )
}

export default ShoppingTripItemCardPublic
