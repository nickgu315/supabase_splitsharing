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
import UserProfileEdit from "../components/UserProfileEdit";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";


function Home() {
  const {isAuthenticated, Moralis} = useMoralis()
  const [isDesktop, setIsDesktop] = useState(false)
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  })

  useEffect(() => {
    setIsDesktop(isDesktopOrLaptop)
  }, [isDesktopOrLaptop])

  return (
    <>
      <Header/>
      {isAuthenticated ?
      (
        <div>
          <div className="section_py flex flex-col items-center" >
            <UserProfileEdit/>
          </div>

          <div className="flex flex-col items-center" >
            <div className="flex flex-col items-center w-80 px-6">
              <Link href="/userProfile">
                <button className={styles.loginButton}>
                  Back to User Profile
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
