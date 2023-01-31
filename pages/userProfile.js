import React, { useRef } from "react";
import styles from "../styles/Home.module.css";
//import HeaderGame from "../components/HeaderGame"
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection"
//import AnnouncementBar from "../components/AnnouncementBar";
//import Displaygameinfo from "../components/Displaygameinfo"
//import Form1 from "../components/Form1";
//import Footer from "../components/Footer"
import useTranslation from "next-translate/useTranslation"
import Head from "next/head"
import { useRouter } from 'next/router'
import AddItem from "../components/AddItem";
import ItemCard from "../components/ItemCard";
import CharacterCard from "../components/CharacterCard";
import SharingList from "../components/SharingList";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import { Magic } from 'magic-sdk';
import Router from "next/router";
import Header from "../components/Header";
import Popup from 'reactjs-popup';



/*
export const getServerSideProps = async (Moralis) => {
  const serverUrl = "https://amgy7tfiuiie.usemoralis.com:2053/server";
  const appId = "d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO";
  Moralis.start({ serverUrl, appId });
  //Moralis.initialize("d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO");
  //Moralis.serverURL = "https://amgy7tfiuiie.usemoralis.com:2053/server";
  const res = Moralis.User.current();
  console.log(res);

  //const project = await invokeWithMiddleware(getProject, {where: {id: params.projectId}}, {req, res})
  return {props: {res}}
}*/


function Home() {
  const {isAuthenticated, logout, Moralis} = useMoralis()
  const [state, setState] = useState();
  const [startQ, setStartQ] = useState(true);
  const [results, setResults] = useState(undefined);
  const [editModal, setEditModal] = useState(false);
  const [displayNameEdit, setDisplayNameEdit] = useState('');
  const [firstNameEdit, setFirstNameEdit] = useState('');
  const [lastNameEdit, setLastNameEdit] = useState('');
  const [addressEdit, setAddressEdit] = useState('');
  const [cityEdit, setCityEdit] = useState('');
  const [zipCodeEdit, setZipCodeEdit] = useState('');
  const [phoneNumberEdit, setPhoneNumberEdit] = useState('');
  const [phoneNumberFrDb, setPhoneNumberFrDb] = useState('');
  const [profilePictureEdit, setProfilePictureEdit] = useState(undefined);
  const [allowContactChecked, setAllowContactChecked] = useState(true);
  const [useEffectRead, setUseEffectRead] = useState(false);
  const [profileNumberChecked, setProfileNumberChecked] = useState(false);
  const [allCharacters, setAllCharacters] = useState(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [existingProfilePicture, setExistingProfilePicture] = useState('');
  const [characterUrlRef, setCharacterUrlRef] = useState(undefined);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(false);


  const allowContactToggleChecked = () => setAllowContactChecked(value => !value);

  var controlNum = 0

  const closeModal = () => {
  setOpen(false)
  setAlertMessage('')}

  const alertMessageData = (arg) => {
    setAlertMessage(arg)
    setOpen(true)

    };

  const loadCharacters = async () => {

    const allImages = new Moralis.Query("images_public");
    allImages.equalTo("character", true);
    const allCharactersResults = await allImages.find();
    var allCharactersArray = []
    if (allCharactersResults.length > 0){
      for (const indiCharacter of allCharactersResults){
        console.log(indiCharacter.attributes.image._url)
        const params = {
          imageLink: indiCharacter.attributes.image,
          characterRef: indiCharacter.attributes.characterRef
        }
        allCharactersArray.push(params)
      }

      setAllCharacters(allCharactersArray)
    }
  }

  const userDataQuery = () => {
    setStartQ(false)
    if (controlNum==0){
      controlNum++
    _userDataQuery()}
  }

  const _userDataQuery = async () => {
    const userObj = Moralis.User.current()
    setState(userObj.attributes)

  }

  const checkProfile = ()=>{
    const theUser = Moralis.User.current()

    if (!theUser.attributes.phoneNumber || theUser.attributes.phoneNumber.length < 4){
      setProfileNumberChecked(false)
      return false
    } else {
      setProfileNumberChecked(true)
      return true
    }
  }

  const loadDataOnlyOnce = () => {
    const dataResults = Moralis.User.current()
    const data = dataResults.attributes
    console.log("set init state", data.displayName)
    setDisplayNameEdit(data.displayName)
    setFirstNameEdit(data.firstName)
    setLastNameEdit(data.lastName)
    setAddressEdit(data.address)
    setCityEdit(data.city)
    setZipCodeEdit(data.zipCode)
    if(data.phoneNumber){
      setPhoneNumberFrDb(data.phoneNumber)
    }
    setPhoneNumberEdit(data.phoneNumber)
    setProfilePictureEdit(data.profilePicture)
    setAllowContactChecked(data.allowContactChecked ? data.allowContactChecked : true)
    if (data.characterUrlRef){
      setCharacterUrlRef(data.characterUrlRef)
    }
    setUseEffectRead(true)
    setEmail(data.email)
  }

  const onSelectProfilePicture = e => {
    //console.log("e.target.files.length", e.target.files.length)
        if (!e.target.files || e.target.files.length === 0) {
            setProfilePictureEdit(undefined)
            return
        }
        //console.log("e.target.files[0]", e.target.files[0].name)
        //using the first image instead of multiple
        setExistingProfilePicture(e.target.files[0])
  }

  const handleProfileFormSubmit = async () => {
    if (displayNameEdit == '' || displayNameEdit == undefined){
      alertMessageData("Please Input Display Name!")
      return
    }
    if (zipCodeEdit == '' || zipCodeEdit == undefined){
      alertMessageData("Please Input Zip Code!")
      return
    }
    if (phoneNumberEdit.length != 10 && phoneNumberEdit != '63092905'){
      alertMessageData("Phone Number Not Valid!")
      return
    }
    if (characterUrlRef == '' || characterUrlRef == undefined){
      alertMessageData("You haven't picked your Sharemon!")
      return
    }
    const userObjReload = Moralis.User.current()
    console.log("Moralis User ReLoaded:" ,userObjReload)
    setPhoneNumberFrDb(userObjReload.attributes.phoneNumber)
    console.log('phoneNumberFrDb', phoneNumberFrDb)
    console.log('phoneNumberEdit', phoneNumberEdit)
    if(phoneNumberFrDb != phoneNumberEdit && phoneNumberEdit!=null && phoneNumberEdit!='63092905'){
    //if(phoneNumberEdit == '6267721393'){
      console.log('phone number updating...')
      const phoneNumberPlusOne = "+1" + phoneNumberEdit
      console.log("phoneNumberPlusOne", phoneNumberPlusOne)
      setPhoneNumberEdit(phoneNumberFrDb ? phoneNumberFrDb : null)

      //verify New phoneNumber
      const magicClient = new Magic('pk_live_FCB9E5A10B0BA86D');
      //const ifLoggedIn = await magicClient.user.isLoggedIn()
      if (true){
        await magicClient.user.logout()
        await magicClient.auth.loginWithSMS({
          phoneNumber: phoneNumberPlusOne,
        }).then(
          (results) => {
            alertMessageData("Phone Updated Successfully!")
          },
          (error) => {
            alertMessageData("Phone Number Not Valid!")
            return
          }
        )
        /*
        const ifLoggedIn = await magicClient.user.isLoggedIn()
        if (!ifLoggedIn){
          console.log("User phone number Not Verified!")
          return
        }*/
      }

    }


    setSubmitted(true)
    //console.log("itemImage", itemImage)
    var uploadProfilePictureResults

    if (existingProfilePicture){
    const uploadProfilePictureEdit = new Moralis.File(existingProfilePicture.name, existingProfilePicture);
    uploadProfilePictureResults = await uploadProfilePictureEdit.saveIPFS();
    console.log("uploadProfilePictureResults", uploadProfilePictureResults)
    }

    const userObj = Moralis.User.current();
    console.log("the Moralis userObj after magic phone verification", userObj)

    const TestItemData = Moralis.Object.extend("testItemData2");
    const testItemData = new TestItemData();

    var theCharacterRef
    for (const indiCharacter of allCharacters){
      if (characterUrlRef == indiCharacter.imageLink._url){
      theCharacterRef = indiCharacter.characterRef
      break
      }
    }

    const params = {
      displayName: displayNameEdit,
      firstName: firstNameEdit,
      lastName: lastNameEdit,
      address: addressEdit,
      city: cityEdit,
      zipCode: zipCodeEdit,
      phoneNumber: phoneNumberEdit,
      profilePicture: existingProfilePicture ? uploadProfilePictureResults._url : profilePictureEdit,
      allowContactChecked: allowContactChecked,
      archived: false,
      teamChecked: false,
      characterUrlRef: characterUrlRef,
      characterRef: theCharacterRef,
    }
    //console.log("params", params)

    userObj
      .save(params)
      .then(
        (results) => {
          console.log("Profile Data Submitted:", results)
          setDisplayNameEdit(params.displayName)
          setFirstNameEdit(params.firstName)
          setLastNameEdit(params.lastName)
          setAddressEdit(params.address)
          setCityEdit(params.city)
          setZipCodeEdit(params.zipCode)
          setPhoneNumberEdit(params.phoneNumber)
          setPhoneNumberFrDb(params.phoneNumber)
          setProfilePictureEdit(params.profilePicture)
          setAllowContactChecked(params.allowContactChecked)
          // The object was saved successfully.
        },
        (error) => {
          // The save failed.
          // error is a Moralis.Error with an error code and message.
        }
      )

      var es = document.forms[0].elements;

      function clearInputFile(f){
          if(f.value){
              try{
                  f.value = ''; //for IE11, latest Chrome/Firefox/Opera...
              }catch(err){
              }
              if(f.value){ //for IE5 ~ IE10
                  var form = document.createElement('form'), ref = f.nextSibling;
                  form.appendChild(f);
                  form.reset();
                  ref.parentNode.insertBefore(f,ref);
              }
          }
      }

      for (const ele of es){
        clearInputFile(ele)
      }

    alertMessageData("Submitted Successfully!")
    loadDataOnlyOnce()
    //alert("Submitted Successfully!")

    /*
    setItemName('')
    setItemBrand('')
    setItemRetailPrice('')
    setItemCostBeforeTax('')
    setItemCostAfterTax('')
    setWhereBought('')
    setItemImage(undefined)
    setItemReceipt(undefined)
    */
    setSubmitted(false)
    setEditModal(false)
  }


  /*
  useEffect(() => {
    const serverUrl = "https://amgy7tfiuiie.usemoralis.com:2053/server";
    const appId = "d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO";
    Moralis.start({ serverUrl, appId });
    const userObj = Moralis.User.current()
    console.log("user data", userObj)
    //loadDataOnlyOnce(userObj.attributes)
    //setState(state => (userObj.attributes));
    //console.log("userObj.attributes.displayName", userObj.attributes.displayName)
  }, []);*/


  useEffect(() => {
    if(!isAuthenticated){
      return
    }
    loadCharacters()
    const userObj = Moralis.User.current()
    console.log("Moralis User Loaded:" ,userObj)
    if(!userObj.attributes.phoneNumber){
      setEditModal(true)
    }

    loadDataOnlyOnce(userObj.attributes)

    checkProfile()
    //setState(state => (userObj.attributes));
    //console.log("userObj.attributes.displayName", userObj.attributes.displayName)
  }, []);


  return (

      <>
        <Head>
          <title>Account Splitsharing</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        </Head>
        <Header/>

        <Popup
          open={open}
          closeOnDocumentClick
          onClose={closeModal}
        >
        {close => (
          <div className="rounded-xl border-2 border-black bg-white flex flex-col items-center w-[300px] md:w-[300px]">



            <div className="text-[18px] px-[10px] w-[90vw] md:w-[500px] text-center">
              {alertMessage}
            </div>


            {alertMessage == "Your User Profile is not completed yet! Please complete first before contacting sharers." &&

            <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
              <button
                className={styles.loginButton}
                onClick={() => {
                  router.push({
                                  pathname: '/userProfile',
                              });
                }}
              >
                Go to User Profile
              </button>
            </div>

            }

            {alertMessage == "Please Login to join trip!" &&

            <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
              <button
                className={styles.loginButton}
                onClick={() => {
                  router.push({
                                  pathname: '/',
                              });
                }}
              >
                Login Now
              </button>
            </div>

            }


            <div className="flex flex-col items-center w-full pt-[15px]">
              <button
                className="text-[17px] text-center"
                onClick={() => {
                  setOpen(false)
                  setAlertMessage('')
                }}
              >
                close
              </button>
            </div>

          </div>
        )}
        </Popup>


        {isAuthenticated ?
        <div>
        <div className="pt-[80px] md:pt-[100px] flex flex-col items-center" >
          <div className="bg-[#F1F1F1] rounded-xl flex flex-col items-center h-120 w-[300px] md:w-[300px] pt-6 pb-6 shadow-xl">

            {characterUrlRef ?
              <div className='flex flex-col items-center'>
                <div className="font-bold pb-2">
                Your Sharemon:
                </div>
                <div>
                  <img src={characterUrlRef} className={`w-[150px] h-[150px] rounded-full`}/>
                </div>
              </div>
              :
              <div className='flex flex-col items-center'>
                <div className="font-bold pb-2 text-center">
                Edit Your Profile <br /> & Choose Your Sharemon!
                </div>
              </div>
            }

            <div className="font-bold pb-2 pt-[20px]">
            Your Profile:
            </div>
            {useEffectRead && (
              <div>
                <div className='w-[250px] rounded-xl h-[35px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  Display Name: {displayNameEdit && displayNameEdit}
                </div>
                <div className='w-[250px] rounded-xl h-[35px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  First Name: {firstNameEdit && firstNameEdit}
                </div>
                <div className='w-[250px] rounded-xl h-[35px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  Last Name: {lastNameEdit && lastNameEdit}
                </div>
                <div className='w-[250px] rounded-xl h-[70px] shadow-inner bg-white flex flex-row items-top pt-[5px] pl-[10px] mb-[10px]'>
                  Address: {addressEdit && addressEdit}
                </div>
                <div className='w-[250px] rounded-xl h-[35px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  City: {cityEdit && cityEdit}
                </div>
                <div className='w-[250px] rounded-xl h-[35px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  Zip Code: {zipCodeEdit && zipCodeEdit}
                </div>
                <div className='w-[250px] rounded-xl h-[35px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  Email: {email}
                </div>
                <div className='w-[250px] rounded-xl h-[70px] shadow-inner bg-white flex flex-row items-center pl-[10px] mb-[10px]'>
                  Phone Number: {!profileNumberChecked ? "(Not Verified)" : "(Verified)"} {phoneNumberEdit && phoneNumberEdit}
                </div>
              </div>
            )}
            {useEffectRead && (
              <div className="font-bold pt-3">
                Profile Picture:
              <img src={profilePictureEdit && profilePictureEdit} className="w-[150px] h-[150px] rounded-full" />
              </div>
            )}

          </div>

          <div className="rounded px-6 pt-6 pb-2 mb-2 flex flex-col items-center w-80">
              <button className={styles.loginButton} onClick={()=>{setEditModal(true)}}>
                Edit User Profile
              </button>
          </div>
        </div>

        <div className="flex flex-col items-center" >


          <div className="w-80 px-6 pt-2 pb-[30px]">
            <Link href="/">
              <button className={styles.loginButton} onClick={logout}>
                Sign Out
              </button>
            </Link>
          </div>
        </div>

        {editModal && (

          <div className="fixed pin z-50 overflow-auto bg-smoke-light top-0 w-full h-full">
          <div className="relative p-8 max-w-sm md:max-w-md m-auto top-4 md:top-8 flex-col flex">
            <div className="z-1 flex flex-col items-center bg-white pt-6 pb-6 flex flex-col items-center mx-200 border-2 border-[#F1592A] rounded-xl">

                {isAuthenticated && (

                  <form className="px-6">
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        *Display Name
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="displayNameEdit" type="text" value={displayNameEdit}
                      onChange={(e) => {
                        setDisplayNameEdit(e.target.value);
                      }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        First Name
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="firstNameEdit" type="text" value={firstNameEdit}
                      onChange={(e) => {
                        setFirstNameEdit(e.target.value);
                      }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Last Name
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="lastNameEdit" type="text" value={lastNameEdit}
                      onChange={(e) => {
                        setLastNameEdit(e.target.value);
                      }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Address
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="addressEdit" type="text" value={addressEdit}
                      onChange={(e) => {
                        setAddressEdit(e.target.value);
                      }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        City
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="cityEdit" type="text" value={cityEdit}
                      onChange={(e) => {
                        setCityEdit(e.target.value);
                      }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        * Zip code
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="zipCodeEdit" type="number" value={zipCodeEdit}
                      onChange={(e) => {
                        setZipCodeEdit(e.target.value);
                      }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        * Phone Number
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="phoneNumberEdit" type="string" value={phoneNumberEdit}
                      onChange={(e) => {
                        setPhoneNumberEdit(e.target.value);
                      }}
                      />
                    </div>

                    {profilePictureEdit && (
                    <div className="pt-2 pb-8">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Current Profile Picture:
                      </label>
                      <img width={120} height={120} layout="responsive" src={profilePictureEdit} />
                    </div>
                    )}

                    <div className="mb-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Select New Profile Picture:
                      </label>
                      <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="profilePicture" type='file' onChange={onSelectProfilePicture} name="profilePicture" />
                    </div>


                    <div className="mb-3 pt-3">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Choose your Sharemon:
                      </label>
                    </div>

                    {true && (
                      <div className="py-[10px] rounded-3xl bg-[#E8E8E8] flex flex-col items-center mb-[30px]">
                        <div className="grid grid-cols-4">
                            {allCharacters && allCharacters.map((card, index) => (
                              <div key={index} className="py-[3px] px-[3px]">
                                <button type="button"
                                onClick={()=>{
                                  setCharacterUrlRef(card.imageLink._url)
                                  }
                                }
                                >
                                  <img src={card.imageLink._url} className={`w-[60px] h-[60px] rounded-full ${card.imageLink._url==characterUrlRef && "border-[4px] border-[#F1592A] shadow-xl"}`}/>

                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}


                    <div className="flex items-center justify-center w-full">

                      <label htmlFor="toggleB" className="flex items-center cursor-pointer">

                        <div className="relative">

                          <input type="checkbox" id="toggleB" className="sr-only" checked={allowContactChecked} onChange={allowContactToggleChecked}/>

                          <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>

                          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                        </div>

                        <div className="ml-3 text-gray-700 font-medium">
                          Allow other users to contact you directly through Phone after matching of trip(s) or item(s).
                        </div>
                      </label>

                    </div>



                    <div className="pt-2 flex items-center justify-between">
                      {!submitted ?
                      <button className={styles.loginButton} type="button"
                      onClick={handleProfileFormSubmit}
                      >
                        Submit
                      </button> :
                      <p>Uploading Profile Data</p>}
                    </div>

                    <div className="w-full h-full">
                      <div className="absolute top-[38px] right-[38px]">
                        <button type="button" className="bg-[#F2F2F2] rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={()=>{
                          setEditModal(false)
                          loadDataOnlyOnce()
                        }}
                        >
                          <span className="sr-only">Close menu</span>
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                  </form>

              )}

            </div>
          </div>
          </div>

        )}

        </div>
        :
        <div className="flex flex-col items-center pt-[80px] pb-8" >
          <div className="flex flex-col items-center w-80 px-6">
            <Link href="/">
              <button className={styles.loginButton}>
                Please Login and Setup Your Account!
              </button>
            </Link>
          </div>
        </div>
       }


      </>
  )
}


/*
export const getServerSideProps = async () => {
  //const { Moralis} = useMoralis();
  Moralis.initialize("d1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO");
  Moralis.serverURL = "https://amgy7tfiuiie.usemoralis.com:2053/server";
  //appId = 'd1NyDnTm1DqSUnXfDO32FVF6wAfcovy901S4SBtO'
  //serverUrl = 'https://amgy7tfiuiie.usemoralis.com:2053/server'>
  //const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();
  const res = Moralis.User.current();
  console.log(res);

  //const project = await invokeWithMiddleware(getProject, {where: {id: params.projectId}}, {req, res})
  return {props: {res}}
}*/






export default Home
