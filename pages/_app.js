import '@/styles/index.scss'
import Layout from '@/components/Layout'
import i18next from 'i18next';
import { initReactI18next, useTranslation } from 'react-i18next';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import LoadingBar from 'react-top-loading-bar'
import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Favicon from '@/public/images/favicon.png'

import { NextSeo } from 'next-seo';
import firebase from 'firebase/app';
import 'firebase/analytics';

i18next.use(initReactI18next)
i18next.use(I18nextBrowserLanguageDetector)
i18next.use(HttpApi)
i18next.init({
  supportedLngs: ['en', 'fr'],
  fallbackLng: 'fr',
  detection: {
    order: ['cookie', 'localStorage', 'path', 'htmlTag'],
    caches: ['cookie'],
  },
  backend: {
    loadPath: '/assets/locals/{{lng}}/translation.json'
  },
  react: { useSuspense: false },
  warn: false,
});

function App({ Component, pageProps }) {
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  
  useEffect(()=>{    
    router.events.on('routeChangeStart', ()=>{setProgress(30)})
    router.events.on('routeChangeComplete', ()=>{setProgress(100)})
  }, [])


  /////////////// GOOGLE ANALYTICS TRACKERS start ///////////////
  useEffect(() => {
    // Track user engagement event when the user hovers over an element
    const handleHover = (event) => {
      firebase.analytics().logEvent('user_engagement', {
        engagement_time_msec: event.target.dataset.engagementTime,
      });
    };

    // Attach event listener to track hover events
    const elements = document.querySelectorAll('[data-engagement-time]');
    elements.forEach((element) => {
      element.addEventListener('mouseover', handleHover);
    });

    return () => {
      // Clean up event listener
      elements.forEach((element) => {
        element.removeEventListener('mouseover', handleHover);
      });
    };
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      firebase.analytics().setCurrentScreen(url);
      firebase.analytics().logEvent('page_view');
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);


  useEffect(() => {
    // Track all click events
    const handleEvent = (event) => {
      firebase.analytics().logEvent('event', {
        eventName: event.type,
        elementId: event.target.id,
      });
    };

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    };
  }, []);
  /////////////// GOOGLE ANALYTICS TRACKERS end ///////////////


  return (
    <>
    <NextSeo 
        title='Tapisserie De Rêve'
        description="Vous recherchez des services d'experts en rembourrage? Découvrez le talent artistique d'un Tapissier qualifié. Transformez vos meubles avec précision et créativité. Contactez-nous dès aujourd'hui pour des solutions de rembourrage personnalisées qui rehaussent votre espace de vie."
        themeColor='light'
        additionalMetaTags={[{
          property: 'author',
          content: 'Tapisserie De Rêve'
        }, {
          name: 'application-name',
          content: 'Tapisserie De Rêve'
        }]}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: Favicon.src,
          }
        ]}
      
      />
    <LoadingBar
                color='#d12675'
                progress={progress}
                waitingTime={500}
                onLoaderFinished={() => setProgress(0)}
            />        
    <Layout>
      <Component {...pageProps} />
      <ToastContainer />
    </Layout>
    </>
  )
}

export default App;