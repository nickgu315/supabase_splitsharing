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

function ItemCardPublic({alertMessageData, itemId, itemName, itemBrand, indexNo, itemCostBeforeTax, itemCostAfterTax, itemImage, whereBought, itemRetailPrice, itemCreator, itemShares, itemSharesAvailable}) {
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
      //checkProfile()
      //const serverUrl = "https://amgy7tfiuiie.usemoralis.com:2053/server";
      //const appId = "d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO";
      //Moralis.start({ serverUrl, appId });
      const user = Moralis.User.current()
      //itemCreator
      console.log("itemCreator", itemCreator)
      console.log("this card user id", user.id)
      setThisUserId(user.id)
    }, []);


    const checkProfile = ()=>{
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
        <div className="pt-3 pb-3 w-80 mx-6">
          <div className="flex flex-col item-center">
            <p className="px-2 block text-gray-700 text-sm font-bold text-white">
              Item Number: {indexNo}
            </p>
          </div>

          <div className="w-80 h-80 rounded bg-white px-6 pt-4 pb-4 flex flex-col item-center relative border-2 border-[#F1592A]">
              <div>
                <p className="block text-gray-700 text-md font-bold">
                  Brand: {itemBrand}
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-bold">
                  {itemName && itemName}
                </p>
              </div>
              <div className = "pb-2">
                <p className="block text-gray-700 text-sm font-bold">
                  From: {whereBought}
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-bold">
                  Entire Item Price (Tax Included): {itemRetailPrice && "$" + itemRetailPrice}
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-bold">
                  Number of Shares Splitting Into: {itemShares}
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-bold">
                  Price Per Share: {(itemRetailPrice/itemShares).toFixed(2)}
                </p>
              </div>
              <div className="pt-2">
                <img width={120} height={120} layout="responsive" src={itemImage} />
              </div>

              <div className="pt-2 absolute right-4 bottom-4">
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
                      pathname: '/sharingListByUser',
                      query: { sharerId: thisItemCreator,
                              }
                  })
                }else if(thisUserId == itemCreator){
                  handleAlertMessage("You are the creator of this item!!")
                }


                }}
                >
                  See more Items from Sharer
                </button>
              </div>

              <div className="pt-2 absolute right-4 bottom-14">
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
                  Connect with Sharer
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

export default ItemCardPublic
