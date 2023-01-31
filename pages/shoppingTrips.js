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
import ShoppingTrips from "../components/ShoppingTrips";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Popup from 'reactjs-popup';
import CreatableSelect from 'react-select/creatable';

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();
  const [isUCLA, setIsUCLA] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [isPartners, setIsPartners] = useState(false);
  const [partnerSelection, setPartnerSelection] = useState(undefined);
  const [partnerInputValue, setPartnerInputValue] = useState(undefined);
  const [partnerSelectedValues, setPartnerSelectedValues] = useState('');


  const router = useRouter()

  const closeModal = () => {
  setOpen(false)
  setAlertMessage('')}

  const alertMessageData = (arg) => {
    setAlertMessage(arg)
    setOpen(true)

  };

  const partnersHandleInputChange = (value) => {
    setPartnerInputValue(value);
    //console.log("hourHandleInputChange value", value)
  };

  const partnerHandleOnChange = (e) => {


    setPartnerSelectedValues(e.value);
    console.log("partnerHandleOnChange e.value", e.value)

    if (e.value == "Eddy Co-Living"){
      console.log("setIsPartners t")
      setIsPartners(true)
    }
  };

  useEffect(() => {
    let thePartnerSelection=[]
    thePartnerSelection.push({ value: "Eddy Co-Living", label: "Eddy Co-Living" })
    setPartnerSelection(thePartnerSelection)
      setTimeout(() => {
      checkIsUCLA();
    }, 200);
  }, []);


  async function checkIsUCLA() {
      const user = Moralis.User.current()
      if (user){
        const params = {userId: user.id}
        const results = await Moralis.Cloud.run("checkIsUCLA", params)
        if (results){
          setIsUCLA(true)
        }
      }
      setLoading(false)
  }

  async function handleAddNewTrip(){

    if (!isAuthenticated){
      alertMessageData("Please Login to Initiate a Trip!")
      return
    }
    if (!isUCLA && !isPartners) {
      //alert
      alertMessageData("This feature is currently only available to selected partners or UCLA students/ affiliates.")
    } else if (isUCLA || isPartners){
      router.push({
                      pathname: '/addTrip',
                  });
    }
  }


  return (
    <>
      <Head>
        <title>Splitsharing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>

      <Popup
        open={open}
        closeOnDocumentClick
        onClose={closeModal}
      >
      {close => (
        <div className="rounded-xl border-2 border-black bg-white flex flex-col items-center w-[90vw] md:w-[500px]">



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

          {alertMessage == "Please Login to Initiate a Trip!"  &&

          <div className="flex flex-col items-center pt-[15px] text-[[#F1592A]] w-[200px]">
            <button
              className={styles.loginButton}
              onClick={() => {
                router.push({
                                pathname: '/signin',
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

      {(false) ?

        <div>
          Loading
        </div>

        : (true) ?
        <div className="pt-[50px] md:pt-[80px] flex flex-col items-center">

          <div className="text-black text-center pt-[15px] w-[300px] lg:w-[600px]">
            <span className='font-bold text-[16px]'> Shopping Trips: </span>
            <br />
            <br />
            This feature is currently only available to selected partners <br /> or UCLA students/ affiliates.
            <br />
          </div>
          <div className="py-[30px] flex flex-col items-center">
          Select Below if you are associated with:
          <CreatableSelect
            className="text-[11px] lg:text-[12px] w-[150px]"
            options={partnerSelection}
            onChange={partnerHandleOnChange}
            isSearchable={false}
            onInputChange={partnersHandleInputChange}
            inputValue={partnerInputValue}
            value={partnerSelectedValues.selected}
            placeholder = {"Select Partner"}
            controlShouldRenderValue={true}
          />
          </div>

          <div className="flex flex-col items-center w-80 px-6 pt-[10px]">
              <button className={styles.loginButton1}
                onClick={() => {
                  handleAddNewTrip()
                }}
              >
                <div className='flex flex-col items-center'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="#fff" strokeLinecap="round" strokeWidth="4" d="M2 12h20M12 2v20"/>
                  </svg>
                </div>
              </button>
          </div>

          <div>
            <ShoppingTrips isPartners = {isPartners}/>
          </div>


          <div className="flex flex-col items-center pt-8 pb-8" >
            <div className="flex flex-col items-center w-80 px-6">
              <Link href="/shoppingTrips">
                <button className={styles.loginButton}>
                  Back to Top
                </button>
              </Link>
            </div>
          </div>
        </div>
       : (false) ?
         <div className="flex flex-col items-center pt-[80px] pb-8 px-[12px]" >
           This feature is currently only available to selected partners or UCLA students/ affiliates.
           <br />
           If you are a UCLA student, please Sign Up with your
           <br />@ucla.edu or @g.ucla.edu email.
         </div>
       : (false) &&
       <div className="flex flex-col items-center pt-[80px] pb-8" >
         <div className="flex flex-col items-center w-80 px-6">
           <Link href="/">
             <button className={styles.loginButton}>
               Please Login to See More!
             </button>
           </Link>
         </div>
       </div>
      }

    </>
  )
}

export default Home
