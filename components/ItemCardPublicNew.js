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

function ItemCardPublicNew({alertMessageData, itemId, itemName, itemBrand, indexNo, itemCostBeforeTax, itemCostAfterTax, itemBasicUnitsNo, itemImage, whereBought, itemRetailPrice, itemCreator, itemShares, itemSharesAvailable}) {
    const {isAuthenticated, Moralis} = useMoralis();
    const itemNumber = 1
    const itemNameTest = "Paper Towels"
    const itemBrandTest = "Costco"
    const [thisUserId, setThisUserId] = useState('');
    const [profileChecked, setProfileChecked] = useState(false);
    const router = useRouter()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [alertModal, setAlertModal] = useState('');




    const handleAlertMessage = async (msg) => {
      alertMessageData(msg)
    }

    useEffect(() => {
      if(!isAuthenticated){
        setThisUserId(null)
        return
      }
      //checkProfile()
      //const serverUrl = "https://amgy7tfiuiie.usemoralis.com:2053/server";
      //const appId = "d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO";
      //Moralis.start({ serverUrl, appId });
      const user = Moralis.User.current()
      //itemCreator
      console.log("itemCreator", itemCreator)
      setThisUserId(user.id)
    }, []);


    const checkProfile = ()=>{
      if(!isAuthenticated){
        ()=>{onOpen}
        handleAlertMessage("Please Login to contact Sharers!")
        return
      }
      const theUser = Moralis.User.current()
      console.log("theUser.attributes.phoneNumber.length:", theUser.attributes.phoneNumber.length)

      if (!theUser.attributes.phoneNumber || theUser.attributes.phoneNumber.length < 4){
        ()=>{onOpen}
        handleAlertMessage("Your User Profile is not completed yet! Please complete first before contacting sharers.")
        //alert("Your User Profile is not completed yet! Please complete first before listing items.")
        //Router.push("/userProfile")
        /*
        router.push({
                        pathname: '/userProfile',
                    });
                    */
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
              <div className="flex flex-col items-center bg-white border-4 border-[#edeef2] rounded-xl shadow-inner pl-[15vw] lg:pl-[5vw]">
                <img layout="responsive" src={itemImage} className="w-[30vw] h-[23vw] lg:w-[292px] lg:h-[160px] object-contain pt-[3px]"/>
                <p className="text-[12px] md:text-[12px] lg:text-[12px] xl:text-[15px] text-black font-bold absolute top-[20vw] lg:top-[140px] left-[8px] lg:left-[8px] w-[15vw] lg:w-[5vw] ">{itemBrand}</p>
              </div>

              <div className="pl-[7px] flex flex-col items-left">
                <div className="flex flex-col items-left h-[6.7vw] lg:h-[2.7vw]">
                    <p className="text-[10px] md:text-[10px] lg:text-[12px] xl:text-[15px]">{itemName && itemName}</p>

                </div>


                  <div className="pt-[5px] lg:pt-[15px]">
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Entire Item Listing Price:
                        <span className="text-black font-bold text-[9px] lg:text-[13px]">{itemRetailPrice && " $" + itemRetailPrice} </span>
                      </div>
                  </div>

                  <div>
                      <div className="text-gray-700 text-[8px] lg:text-[12px]">
                        Price/Unit:
                        <span className="text-black font-bold text-[9px] lg:text-[13px] text-[red]"> {itemRetailPrice && " $" + (itemRetailPrice/itemBasicUnitsNo).toFixed(2)}</span>
                      </div>
                  </div>


                <div>
                    <div className="text-gray-700 text-[8px] lg:text-[12px]">
                      Sharer is Splitting into:
                      <span className="text-[#009dcf] font-bold text-[9px] lg:text-[13px] text-[red]">{ " " + itemShares + " shares"}</span>
                      <div className="text-[#009dcf] text-[8px] lg:text-[11px] pl-[2px]">   ({(itemBasicUnitsNo/itemShares).toFixed(0)} unit(s)/share) </div>
                    </div>
                </div>

                <div className="flex flex-col items-start">
                <div>
                    <div className="text-gray-700 text-[8px] lg:text-[12px]">
                      Price Per Share:
                      <span className="text-black font-bold text-[12px] lg:text-[16px] text-[red]"> ${(itemRetailPrice/itemShares).toFixed(2)} </span>
                    </div>
                </div>

                <div>
                    <div className="text-gray-700 text-[8px] lg:text-[12px]">
                      Available share(s):
                      <span className="text-black font-bold text-[12px] lg:text-[16px] text-[#009dcf]"> {itemSharesAvailable}</span>
                    </div>
                </div>
                </div>


              </div>


              <div className="lg:hidden pt-2 absolute left-[8px] bottom-[8px]">
                <button type="button"
                className={styles.seeMoreButton2}
                onClick={()=>{
                  if (!true){
                    console.log("no phone no.")
                    return}
                  console.log("thisUserId on click", thisUserId)
                  console.log("itemCreator on click", itemCreator)
                  var thisItemCreator = itemCreator
                  if(thisUserId != itemCreator){

                  router.push({
                      pathname: '/sharingListByUser',
                      query: { sharerId: thisItemCreator,
                              }
                  })
                }else if(thisUserId == itemCreator){
                  handleAlertMessage("You are the creator of this item!!")
                }


                }}
                >
                  See more from Sharer
                </button>
              </div>

              <div className="pt-2 absolute hidden lg:flex right-[8px] bottom-[8px]">
                <button className={styles.seeMoreButton} type="button"
                onClick={()=>{
                  if (!true){
                    console.log("no phone no.")
                    return}
                  console.log("thisUserId on click", thisUserId)
                  console.log("itemCreator on click", itemCreator)
                  var thisItemCreator = itemCreator
                  if(thisUserId != itemCreator){

                  router.push({
                      pathname: '/sharingListByUser',
                      query: { sharerId: thisItemCreator,
                              }
                  })
                }else if(thisUserId == itemCreator){
                  handleAlertMessage("You are the creator of this item!!")
                }


                }}
                >
                  See more from Sharer
                </button>
              </div>

              <div className="lg:hidden pt-2 absolute left-[10px] top-[0px]">
                <button className={styles.connectButton2} type="button"
                onClick={()=>{
                  if (!checkProfile()){
                    console.log("no phone no.")
                    return}
                  console.log("thisUserId on click", thisUserId)
                  console.log("itemCreator on click", itemCreator)
                  var thisItemCreator = itemCreator
                  if(thisUserId != itemCreator){

                  router.push({
                      pathname: '/chatBox',
                      query: { sharerId: thisItemCreator,
                                itemId: itemId,
                                itemImage: itemImage,
                                itemRetailPrice: itemRetailPrice,
                                itemName: itemName,
                                itemBrand: itemBrand,
                              }
                  })
                }else if(thisUserId == itemCreator){
                  handleAlertMessage("You are the creator of this item!")
                  //alert("You are the creator of this item!")
                }


                }}
                >
                  Contact <br />Sharer
                </button>
              </div>

              <div className="pt-2 absolute left-[8px] bottom-[8px] hidden lg:flex">
                <button className={styles.connectButton} type="button"
                onClick={()=>{
                  if (!checkProfile()){
                    console.log("no phone no.")
                    return}
                  console.log("thisUserId on click", thisUserId)
                  console.log("itemCreator on click", itemCreator)
                  var thisItemCreator = itemCreator
                  if(thisUserId != itemCreator){

                  router.push({
                      pathname: '/chatBox',
                      query: { sharerId: thisItemCreator,
                                itemId: itemId,
                                itemImage: itemImage,
                                itemRetailPrice: itemRetailPrice,
                                itemName: itemName,
                                itemBrand: itemBrand,
                              }
                  })
                }else if(thisUserId == itemCreator){
                  handleAlertMessage("You are the creator of this item!")
                  //alert("You are the creator of this item!")
                }


                }}
                >
                  Contact Sharer
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

export default ItemCardPublicNew
