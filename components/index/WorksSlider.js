import styles from '@/pages/index.module.scss';
import { useTranslation } from "react-i18next";
import { RxCaretRight, RxCaretLeft } from 'react-icons/rx';
import { motion, useInView } from "framer-motion";
import { useState, useRef, useEffect } from 'react';


const WorksSlider = (props) => {
    const { t } = useTranslation()
    const workSliderAll = useRef(null)
    const [imgSliderImages, setImgSliderImages] = useState(props.imgs)
    const [imgInd, setImgInd] = useState(1)
    const isInView = useInView(workSliderAll, { once: true });

    const variants = {
      visible: { opacity: 1, y: 0, scale: 1 },
      hidden: { opacity: 0, y: 100, scale: .9 },
    };

    useEffect(
      () => {
        const time = setInterval(()=>{imgInd<=2?setImgInd(prev=>prev+1):setImgInd(1)}, 3000);
        return () => clearInterval(time);
      },
    [imgInd]
    );

    return ( 
    <motion.section ref={workSliderAll} className={styles.sec4}
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        transition={{duration: .25, ease: 'easeOut'}}
    >
        <h1 className={styles.title}>{t('work-title')}</h1>
        <div className={styles.imgSlider}>
          {/* <div id={styles.R} className={styles.button} onClick={()=>setImgSliderImages(e=>(e.slice(1, e.length).concat(e[0])))}>
            <RxCaretRight/>
          </div>
          <div id={styles.L} className={styles.button} onClick={()=>setImgSliderImages(e=>([e[e.length-1]].concat(e.slice(0, e.length-1))))}>
            <RxCaretLeft/>
          </div> */}
          <div className={styles.imgContainer}>
              <div className={`${styles.img}`} style={{backgroundImage:`url(${imgInd==1?imgSliderImages[0]:(imgInd==2?imgSliderImages[1]:(imgInd==3?imgSliderImages[2]:''))})`}} onClick={()=>setImgSliderImages(e=>([e[e.length-1]].concat(e.slice(0, e.length-1))))}></div>
              <div className={`${styles.img}`} style={{backgroundImage:`url(${imgInd==1?imgSliderImages[1]:(imgInd==2?imgSliderImages[2]:(imgInd==3?imgSliderImages[0]:''))})`}}></div>
              <div className={`${styles.img}`} style={{backgroundImage:`url(${imgInd==1?imgSliderImages[2]:(imgInd==2?imgSliderImages[0]:(imgInd==3?imgSliderImages[1]:''))})`}} onClick={()=>setImgSliderImages(e=>(e.slice(1, e.length).concat(e[0])))}></div>
          </div>
        </div>
      </motion.section>
     );
}
 
export default WorksSlider;