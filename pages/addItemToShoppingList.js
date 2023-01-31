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
import AddItemToShoppingList from "../components/AddItemToShoppingList";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import Header from "../components/Header";


function Home() {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis();
  const [isDesktop, setIsDesktop] = useState(false)
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  })



  useEffect(() => {
    setIsDesktop(isDesktopOrLaptop)
  }, [isDesktopOrLaptop])

  useEffect(() => {
    if(!isAuthenticated){
      return
    }
    const userObj = Moralis.User.current()
    if (!userObj.attributes.phoneNumber || userObj.attributes.phoneNumber.length < 4){
      alert("Your User Profile is not completed yet! Please complete first before listing items.")
      //Router.push("/userProfile")
      Router.push({
                      pathname: '/userProfile',
                  });
      return
    }
  }, [])

  return (
    <>
      <Header/>
      {isAuthenticated ?
      (
        <div>
          <div className="section_py flex flex-col items-center" >
            <div className="pt-[30px]">
              <AddItemToShoppingList/>
            </div>
          </div>



          <div className="flex flex-col items-center mb-[50px]" >
            <div className="flex flex-col items-center w-80 px-6">
              <Link href="/shoppingList">
                <button className={styles.loginButton}>
                  Back to Your Shopping List
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center pt-[80px] pb-8" >
          <div className="flex flex-col items-center w-80 px-6">
            <Link href="/">
              <button className={styles.loginButton}>
                Please Login!
              </button>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
