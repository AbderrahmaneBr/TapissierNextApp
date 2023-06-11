import styles from '@/pages/index.module.scss';
import { useTranslation } from "react-i18next";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from 'react';


const Services = (props) => {
    const { t } = useTranslation()
    const workshopAll = useRef(null)

    const isInView = useInView(workshopAll, { once: true });

    const variants = {
      visible: { opacity: 1, y: 0, scale: 1 },
      hidden: { opacity: 0, y: 100, scale: .8 },
    };
    const variants2 = {
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: 100 },
    };
    const variants3 = {
      visible: { opacity: 1, x: 0 },
      hidden: { opacity: 0, x: -100 },
    };

    return ( 
    <motion.section ref={workshopAll} className={styles.sec3}
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
    >
        <h1 className={styles.title}>{t('workshop-title')}</h1>
        <div className={styles.workshopContainer}>

          <motion.div className={styles.Container}
            animate={isInView ? "visible" : "hidden"}
            variants={variants2}
            transition={{delay: .15, ease: 'easeOut'}}

          >
            <p>{t('workshop-text-1')}</p>
            <div className={styles.img} style={{backgroundImage:`url(${props.img1})`}} ></div>
          </motion.div>

          <motion.div className={styles.Container}
            animate={isInView ? "visible" : "hidden"}
            variants={variants3}
            transition={{ease: 'easeOut'}}
          >
            <p>{t('workshop-text-2')}</p>
            <div className={styles.img} style={{backgroundImage:`url(${props.img2})`}}></div>
          </motion.div>

        </div> 
      </motion.section>
     );
}
 
export default Services;
