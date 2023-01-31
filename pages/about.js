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
      <Header/>
      <div className="flex flex-col items-center pt-[80px] pb-8" >
        <div className="flex flex-col items-center w-[300px] md:w-[600px] px-6 py-[100px] text-[22px] md:text-[45px] font-Quicksand text-left">
            Split Sharing is a Marketplace that let people share bulk purchases or shopping trips to save money.
        </div>
      </div>

      
      <Footer/>
    </>
  )
}

export default Home
