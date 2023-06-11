import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './index.module.scss';
import hero1 from '../public/images/hero-1.jpg'
import hero2 from '../public/images/hero-2.jpg'
import hero3 from '../public/images/hero-3.jpg'
import hero4 from '../public/images/hero-4.jpg'
import hero5 from '../public/images/hero-5.jpg'

import workshop1 from '../public/images/workshop-1.jpg'
import workshop2 from '../public/images/workshop-2.jpg'
import work1 from '../public/images/work-1.jpg'
import work2 from '../public/images/work-2.jpg'
import work3 from '../public/images/work-3.jpg'
import ceo from '../public/images/ceo.jpg'
import worker1 from '../public/images/worker-1.jpg'
import worker2 from '../public/images/worker-2.jpg'
import worker3 from '../public/images/worker-3.jpg'
import worker4 from '../public/images/worker-4.jpg'
import worker5 from '../public/images/worker-5.jpg'
import worker6 from '../public/images/worker-6.jpg'
import ImageSlider from '@/components/index/ImageSlider';
import Services from '@/components/index/Services';
import Workshop from '@/components/index/Workshop'
import WorksSlider from '@/components/index/WorksSlider'
import CEOnWorkers from '@/components/index/CEOnWorkers';
import MapCard from '@/components/index/MapCard';
import ContactUs from '@/components/index/ContactUs';

const Home = () => {
  const { t } = useTranslation()
  const [ctaClicked, setCtaClicked] = useState(false)

  const activateCta = ()=>{
    setCtaClicked(prev=>true)
    document.getElementById('services').scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }
  const imgsHero = [hero1.src, hero2.src, hero3.src, hero4.src, hero5.src]
  const imgsWorkshop = [workshop1.src, workshop2.src]
  const imgsWorksSlider = [work1.src, work2.src, work3.src]
  const imgCEO = [ceo.src]
  const imgsWorkers = [worker1.src, worker2.src, worker3.src, worker4.src, worker5.src, worker6.src]

  useEffect(()=>{
    // console.log("updated")
  }, [ctaClicked])

  return ( 
    <main className={styles.main}>
      <ImageSlider activateCta={activateCta} imgs={imgsHero} />
      <Services id="services" ctaClicked={ctaClicked} />
      <WorksSlider imgs={imgsWorksSlider} />
      <Workshop img1={imgsWorkshop[0]} img2={imgsWorkshop[1]} />
      {/* <CEOnWorkers imgCEO={imgCEO} imgsWorkers={imgsWorkers} /> */}
      <MapCard />
      <ContactUs isPage={false} />
    </main>
   );
}
 
export default Home;