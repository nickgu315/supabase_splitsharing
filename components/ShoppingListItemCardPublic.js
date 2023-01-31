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

function ShoppingListItemCardPublic({alertMessageData, itemsInlist, userId, displayName, expectedCost, city, zipCode}) {
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

    const text1 = "'s Shopping List"



    const handleAlertMessage = async (msg) => {
      alertMessageData(msg)
    }

    useEffect(() => {

      if(!isAuthenticated){
        console.log("not logged in")
        setThisUserId(null)

      }

      const user = Moralis.User.current()
      setShoppingListCreator(userId)
      if (user){
      setThisUserId(user.id)}
    }, []);


    const checkProfile = ()=>{
      if(!isAuthenticated){
        ()=>{onOpen}
        handleAlertMessage("Please Login to contact user!")
        return
      }
      const theUser = Moralis.User.current()
      console.log("theUser.attributes.phoneNumber.length:", theUser.attributes.phoneNumber.length)

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
      <>
        <div className="rounded-xl w-[45vw] lg:w-[300px]  bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300">

          <div className="pb-[35px] lg:pb-[50px] w-[45vw] lg:w-[300px]  rounded-xl flex flex-col item-center relative">
              <div className="flex flex-col items-center bg-white border-4 border-[#edeef2] rounded-xl shadow-inner pl-[15vw] lg:pl-[5vw] py-[5px]">
                {itemsInlist[0] && <img layout="responsive" src={itemsInlist[0] && itemsInlist[0].attributes.itemImage} className="w-[15vw] h-[11.5vw] lg:w-[146px] lg:h-[80px] object-contain pt-[1.5px]"/>}
                {itemsInlist[1] && <img layout="responsive" src={itemsInlist[1] && itemsInlist[1].attributes.itemImage} className="w-[15vw] h-[11.5vw] lg:w-[146px] lg:h-[80px] object-contain pt-[1.5px]"/>}
                {itemsInlist[2] && <img layout="responsive" src={itemsInlist[2] && itemsInlist[2].attributes.itemImage} className="w-[15vw] h-[11.5vw] lg:w-[146px] lg:h-[80px] object-contain pt-[1.5px]"/>}
                {itemsInlist[3] && <img layout="responsive" src={itemsInlist[3] && itemsInlist[3].attributes.itemImage} className="w-[15vw] h-[11.5vw] lg:w-[146px] lg:h-[80px] object-contain pt-[1.5px]"/>}
              </div>

              <div className="pl-[7px] flex flex-col items-left">
                  <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                      <p className="text-[10px] md:text-[10px] lg:text-[12px] xl:text-[15px] text-black">{displayName && displayName}<span className="text-[8px] md:text-[8px] lg:text-[10px] xl:text-[13px] text-gray-500">{text1}</span></p>
                  </div>

                  <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                      <p className="text-[10px] md:text-[10px] lg:text-[12px] xl:text-[15px] text-black">{displayName && displayName}<span className="text-[8px] md:text-[8px] lg:text-[10px] xl:text-[13px] text-gray-500"> needs someone to share with <br />or shop for her.</span></p>
                  </div>


                  <div className="pt-[15px] lg:pt-[15px]">
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Shipping Zip Code:
                        <span className="text-black font-bold text-[9px] lg:text-[13px]"> {zipCode} </span>
                      </div>
                  </div>

                  <div className="pt-[5px] lg:pt-[15px]">
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Expected Cost for Entire List:
                        <span className="text-black font-bold text-[11px] lg:text-[15px] text-[red]"> ${expectedCost} </span>
                      </div>
                  </div>
              </div>


              <div className="lg:hidden pt-2 absolute left-[10px] top-[0px]">
                <button className={styles.connectButton2} type="button"
                onClick={()=>{
                  if (!checkProfile()){
                    console.log("no phone no.")
                    return}
                  console.log("thisUserId on click", thisUserId)
                  console.log("shoppingListCreator on click", shoppingListCreator)
                  var thisShoppingListCreator = shoppingListCreator
                  if(thisUserId != shoppingListCreator){

                  router.push({
                      pathname: '/chatBox',
                      query: { sharerId: thisShoppingListCreator,
                              }
                  })
                }else if(thisUserId == shoppingListCreator){
                  handleAlertMessage("You are the creator of this shopping list!")
                  //alert("You are the creator of this item!")
                }


                }}
                >
                  Contact
                </button>
              </div>

              <div className="pt-2 absolute left-[8px] bottom-[8px] hidden lg:flex">
                <button className={styles.connectButton} type="button"
                onClick={()=>{
                  if (!checkProfile()){
                    console.log("no phone no.")
                    return}
                  console.log("thisUserId on click", thisUserId)
                  console.log("shoppingListCreator on click", shoppingListCreator)
                  var thisShoppingListCreator = shoppingListCreator
                  if(thisUserId != shoppingListCreator){

                  router.push({
                      pathname: '/chatBox',
                      query: { sharerId: thisShoppingListCreator,
                              }
                  })
                }else if(thisUserId == shoppingListCreator){
                  handleAlertMessage("You are the creator of this shopping list!")
                  //alert("You are the creator of this item!")
                }


                }}
                >
                  Contact Shopping List Creator
                </button>
              </div>

              <div className="pt-2 absolute right-[8px] bottom-[5px] md:bottom-[8px] ">
                <button className={styles.connectButtonBlue} type="button"
                onClick={()=>{
                  /*
                  if (!checkProfile()){
                    console.log("no phone no.")
                    return}*/
                  console.log("thisUserId on click", thisUserId)
                  console.log("shoppingListCreator on click", shoppingListCreator)
                  var thisShoppingListCreator = shoppingListCreator
                  if(thisUserId != shoppingListCreator){

                  router.push({
                      pathname: '/shoppingListDetails',
                      query: { shoppingListId: thisShoppingListCreator,
                              }


                  })
                }else if(thisUserId == shoppingListCreator){
                  handleAlertMessage("You are the creator of this shopping list!")
                  //alert("You are the creator of this item!")
                }


                }}
                >
                  See List Details
                </button>
              </div>
          </div>
        </div>

        {alertModal.length > 0 &&
          <div>
            Test
          </div>



        }

    </>
    )
}

export default ShoppingListItemCardPublic
