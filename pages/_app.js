import 'swiper/css';
import "swiper/css/bundle";
import 'swiper/css/pagination';
import '../styles/globals.css'
import {MoralisProvider} from "react-moralis"
import { gsap } from 'gsap';
import { GoogleAnalytics, usePageViews } from "nextjs-google-analytics";
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'


const ScrollTrigger = require('gsap/dist/ScrollTrigger')
gsap.registerPlugin(ScrollTrigger)




function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  useEffect(() => {
    import('react-facebook-pixel')
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init(process.env.NEXT_PUBLIC_FB_PIXEL) // facebookPixelId
        ReactPixel.pageView()

        router.events.on('routeChangeComplete', () => {
          ReactPixel.pageView()
        })
      })
  }, [router.events])


  return (
    <SessionContextProvider
    supabaseClient={supabaseClient}
    initialSession={pageProps.initialSession}
    >
  
      <MoralisProvider
        appId = {process.env.NEXT_PUBLIC_MORALIS_APP_ID}
        serverUrl = {process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}>
          { <>
            <GoogleAnalytics />
            <Component {...pageProps} />
            </>
          }
      </MoralisProvider>
    </SessionContextProvider>
    )
}

export default MyApp
