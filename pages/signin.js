import { Auth, ThemeSupa } from '@supabase/auth-ui-react'
import { useRouter } from "next/router"
import Header from "../components/Header";
import Footer from "../components/Footer";
import SignIn from "../components/SignIn";
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
import { useKeenSlider } from "keen-slider/react";
import { Magic } from 'magic-sdk';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';




const animation = { duration: 5000, easing: t => 1 + --t * t * t * t * t * t * t * t * t * t * t}



function signin() {
  //const { authenticate, isAuthenticated, authError, isAuthenticating , logout, Moralis, isInitialized, ...rest} = useMoralis()
  const [isDesktop, setIsDesktop] = useState(false)
  const [haveNewMessages, setHaveNewMessages] = useState(false)
  const [userId, setUserId] = useState('')
  const router = useRouter()
  const [resultss, setResultss] = useState(undefined);
  const [email, setEmail] = useState('');
  const session = useSession()
  const supabase = useSupabaseClient()

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 768px)'
  })

  const reRoute = () => {
    router.push({
                    pathname: '/shoppingTrips',
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




  const handleCustomLogin = async () => {
    // Enabling the debug mode flag is useful during implementation,
    // but it's recommended you remove it for production
    mixpanel.init('ecfbebd0dee663b9febeb60279292c37', {debug: true});
    mixpanel.track('Sign up or Login');

    await authenticate({
      provider: "magicLink",
      email: email,
      apiKey: "pk_live_9398FF11A9A7BC50",
      network: "goerli",
    })


    .then(
      async (signInObj) => {
        console.log("signInObj", signInObj)
        /*
        const m = new Magic('pk_live_FCB9E5A10B0BA86D');
        ////const idToken = await m.user.getIdToken();
        const metadata = await m.user.getMetadata()
        ////console.log("idToken", idToken)
        console.log("email", metadata.email)
        //console.log("signInObj from Moralis", signInObj)
        //console.log("signInObj email from Moralis", signInObj.attributes.email)

        if (metadata.email && signInObj.attributes.email==null){
          //console.log("bind email")
          signInObj.set("email", metadata.email);
          await signInObj.save();
        }
        //const params = {test: "test"}
        //const results = await Moralis.Cloud.run("sendEmailToUser", params)
        */
        reRoute()

      }
    );
  };

  const keySubmit=(event)=> {
        if (event.keyCode === 13) {
            handleCustomLogin()
        }
    }

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    drag: false,
    created(s) {
      s.moveToIdx(1, true, animation)
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 1, true, animation)
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 1, true, animation)
    },
  })

  return (
    <div>
        <Head>
          <title>Sign In | Splitsharing</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <meta name="facebook-domain-verification" content="iun8qoad7tghv5om468gsn4gojwwnw" />
        </Head>
        <Header/>
        <div className="flex flex-col items-center pt-[120px]">
        
              {!session ? (
        <div className="row">
          <div className="col-6 auth-widget">
            <Auth
               supabaseClient={supabase}
               appearance={{
                 theme: ThemeSupa,
                 variables: {
                   default: {
                     colors: {
                       brand: '#F1592A',
                       brandAccent: '#F1592A',
                     },
                   },
                 },
               }}
            />
          </div>
        </div>
      ) : (
        <>
          <h3>Signed In Successfully</h3>
          
        </>
      )}
        </div>
    </div>
  )
}

export default signin
