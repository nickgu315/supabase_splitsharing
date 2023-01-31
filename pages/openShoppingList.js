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
import OpenShoppingList_SignedIn from "../components/OpenShoppingList_SignedIn";
import {useMoralis} from "react-moralis";
import { useMediaQuery } from 'react-responsive'
import dynamic from 'next/dynamic'
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";

function Home() {
  const {isAuthenticated, Moralis} = useMoralis();


  return (
    <>
      <Head>
        <title>Splitsharing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <Header/>

      {true ?
        <div className="pt-[50px] md:pt-[80px]">

          <div>
            <OpenShoppingList_SignedIn/>
          </div>

          <div className="flex flex-col items-center pt-8 pb-8" >
            <div className="flex flex-col items-center w-80 px-6">
              <Link href="/openShoppingList">
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
               Please Login to See More!
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
