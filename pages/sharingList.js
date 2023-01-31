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
import SharingList from "../components/SharingList";
import SharingListUnlisted from "../components/SharingListUnlisted";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();
  const [toRefreshListed, setToRefreshListed] = useState(false);
  const [toRefreshUnlisted, setToRefreshUnlisted] = useState(false);


  const refreshUnlisted = (arg) => {
    setToRefreshUnlisted(value=>!value)
    };

  const refreshListed = (arg) => {
    setToRefreshListed(value=>!value)
    };

  return (
    <>
      <Head>
        <title>My Lists</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>
      {isAuthenticated ?
      <div>
        <div className="pt-[80px] flex flex-col items-center" >
          <div className="rounded px-6 pt-2 pb-2 mb-2 flex flex-col items-center w-80">
            <Link href="/shoppingList">
              <button className={styles.ButtonSharingShopping}>
                Go to Shopping List
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center">
          Or
        </div>

        <div className="pt-[10px] flex flex-col items-center" >
          <div className="rounded px-6 pt-2 pb-2 mb-2 flex flex-col items-center w-80">
            <Link href="/listYourItem">
              <button className={styles.loginButton}>
                List an item to Share
              </button>
            </Link>
          </div>
        </div>

        <div>
          <SharingList {...{refreshUnlisted: refreshUnlisted, toRefreshListed: toRefreshListed}}/>
        </div>

        <div className="flex flex-col items-center pt-8 pb-8" >
          <div className="flex flex-col items-center w-80 px-6">
            <Link href="/sharingListUnlisted">
              <button className={styles.loginButton}>
                See Unlisted Items
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center pt-8 pb-8" >
          <div className="flex flex-col items-center w-80 px-6">
            <Link href="/sharingList">
              <button className={styles.loginButton}>
                Back to Top
              </button>
            </Link>
          </div>
        </div>
      </div>
      :
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-80 px-6">
          <Link href="/">
            <button className={styles.loginButton}>
              Please Login to Start Listing and Sharing!
            </button>
          </Link>
        </div>
      </div>
     }
     <Footer/>
    </>
  )
}

export default Home
