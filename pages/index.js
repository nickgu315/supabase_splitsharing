// import Link from "next/link"
import { useRouter } from "next/router"
// import useTranslation from 'next-translate/useTranslation'

import Header from "../components/Header";
//import NftSection from "../components/NftSection";
//import HeroSection from "../components/HeroSection";
//import GameSection from "../components/GameSection";
//import MarketPlaceSection from "../components/MarketPlaceSection";
//import TeamSection from "../components/TeamSection";
//import SubscribeNewsLetterSection from "../components/SubscribeNewsLetterSection";
import Footer from "../components/Footer";
//import ScrollAnimationSection from "../components/ScrollAnimationSection";
//import RoadmapSection from "../components/RoadmapSection";
//import ScrollAnimationSectionMobile from "../components/ScrollAnimationSectionMobile";
//import RoadMapMobile from "../components/RoadMapMobile";
//import Login from "../components/Login";
import SignIn from "../components/SignIn";
import LandingList from "../components/LandingList";
//import SignOut from "../components/SignOut";
import { useMediaQuery } from 'react-responsive'
import Head from "next/head";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import SharingListPublic_SignedIn from "../components/SharingListPublic_SignedIn";
import {MoralisProvider} from "react-moralis"
import mixpanel from 'mixpanel-browser';
import CookieConsent from "react-cookie-consent";


// function Home() {
//   const router = useRouter()

//   const { t } = useTranslation()
//   return (
//     <div>

//       <div className="p-20 bg-blue-900 space-y-5 flex flex-col items-center justify-center">
//         <h1
//           className="heading_sm"
//         >
//           {t('common:greet')}
//         </h1>
//         <h1
//           className="heading_md"
//         >
//           {t('common:greet')}
//         </h1>

//         <Button />
//       </div>

//       <ul className="flex flex-col gap-4">
//         {router.locales.map(locale => (
//           <Link href={router.asPath} locale={locale} >
//             <a>{locale}</a>
//           </Link>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default Home

function Home() {
  const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis} = useMoralis()
  const [isDesktop, setIsDesktop] = useState(false)
  const [haveNewMessages, setHaveNewMessages] = useState(false)
  const [userId, setUserId] = useState('')
  const router = useRouter()
  const [resultss, setResultss] = useState(undefined);

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  })

  const reRoute = () => {
    router.push({
                    pathname: '/sharingListPublic',
                });
    return
  }

  useEffect(() => {
    setIsDesktop(isDesktopOrLaptop)
  }, [isDesktopOrLaptop])

  const onClickTracking = () => {
  mixpanel.init('ecfbebd0dee663b9febeb60279292c37', {debug: true});
  mixpanel.track('Landing - See More Items');
  }

  return (
    <div>
        <Head>
          <title>Splitsharing</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <meta name="facebook-domain-verification" content="iun8qoad7tghv5om468gsn4gojwwnw" />
        </Head>
        <Header/>
        <div className="flex flex-col items-center">

            <div>
              <SignIn/>
            </div>

            <div className="pt-[100vw] lg:pt-0">
              <div className="text-[20px] lg:text-[35px] font-Quicksand font-bold text-center text-[#F1592A] pt-[20px] lg:pt-[80px] pb-[20px]">
                Why Use Split Sharing?
              </div>

              <div className="grid grid-cols-2 gap-[3vw] lg:gap-[3vw] lg:grid-cols-2 xl:grid-cols-4 lg:w-auto  content-center pt-[10px] pb-[10px] lg:pt-[30px] lg:pb-[80px]">
                <div>
                  <div className=" w-[45vw] h-[54vw] lg:w-[300px] lg:h-[350px] rounded-xl bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300
                  bg-[url('/img/saveMoney_02.png')]
                  bg-cover
                  ">

                  </div>
                  <div className="w-[45vw] lg:w-[300px] text-[12px] lg:text-[20px] font-Quicksand font-bold text-center text-[#F1592A] py-[5px]">
                    Save Money and <br/> Free Up Cash Flow
                  </div>
                </div>

                <div>
                  <div className=" w-[45vw] h-[54vw] lg:w-[300px] lg:h-[350px] rounded-xl bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300
                  bg-[url('/img/discountedDeals_02.png')]
                  bg-cover
                  ">
                  </div>

                  <div className="w-[45vw] lg:w-[300px] text-[12px] lg:text-[20px] font-Quicksand font-bold text-center text-[#F1592A] py-[5px]">
                    Access to <br />Discounted items
                  </div>
                </div>

                <div>
                  <div className=" w-[45vw] h-[54vw] lg:w-[300px] lg:h-[350px] rounded-xl bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300
                  bg-[url('/img/avoidWasting_02.png')]
                  bg-cover
                  ">

                  </div>

                  <div className="w-[45vw] lg:w-[300px] text-[12px] lg:text-[20px] font-Quicksand font-bold text-center text-[#F1592A] py-[5px]">
                    Avoid Wasting goods that <br /> might not be consumed
                  </div>

                </div>

                <div>
                  <div className=" w-[45vw] h-[54vw] lg:w-[300px] lg:h-[350px] rounded-xl bg-[#edeef2] flex flex-col items-center shadow-lg lg:shawdow-2xl shadow-slate-300
                  bg-[url('/img/enjoyVariety_02.png')]
                  bg-cover
                  ">

                  </div>

                  <div className="w-[45vw] lg:w-[300px] text-[12px] lg:text-[20px] font-Quicksand font-bold text-center text-[#F1592A] py-[5px]">
                    Enjoy a wider variety of <br />  household items with <br /> similar budget
                  </div>
                </div>
              </div>
            </div>


            <div className="relative bg-[#f5f6f8] w-full">
              <div className="pt-[20px] pb-[100px] lg:pt-0 flex flex-col items-center">
                <div className="text-[20px] lg:text-[35px] font-Quicksand font-bold text-center text-[#F1592A] pt-[20px] lg:pt-[110px] pb-[20px]">
                  Items Others are Sharing:
                </div>



                <LandingList />

                <div className="flex flex-col items-center w-80 pt-[40px] lg:pt-[80px] px-6">
                  <Link href="/sharingListPublic">
                    <button className={styles.loginButton} onClick={onClickTracking}>
                      See More Items
                    </button>
                  </Link>
                </div>

              </div>
            </div>


        </div>
        <Footer/>
        <CookieConsent
          enableDeclineButton="true"
          location="bottom"
          buttonText="I understand"
          declineButtonText = "Decline"
          cookieName="SplitSharingCookie"
          style={{ background: "#F5F5F5",
          color: "#808080",
          "box-shadow": "0px 0 10px rgba(0, 0, 0, 0.3)",
          fontSize: "13px",
          }}
          buttonStyle={{background: "#808080", color: "white", fontSize: "12px", "border-radius": "5px"}}
          declineButtonStyle={{background: "#808080", color: "white", fontSize: "12px", "border-radius": "5px" }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.{" "}

        </CookieConsent>
    </div>
  )
}

export default Home
