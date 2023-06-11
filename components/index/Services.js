import styles from '@/pages/index.module.scss';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { IoSparkles, IoHammerSharp } from 'react-icons/io5';
import { FaCouch } from 'react-icons/fa';
import { motion, useInView } from "framer-motion";
import { useRef } from 'react';


const Services = (props) => {
    const { t } = useTranslation()
    const servicesAll = useRef(null)

    const isInView = useInView(servicesAll, { once: true });

    const variants = {
      visible: { opacity: 1, y: 0, scale: 1 },
      hidden: { opacity: 0, y: 100, scale: .9 },
    };


    return ( 
        <motion.section id={props.id} ref={servicesAll} className={styles.sec2}
          animate={isInView ? "visible" : "hidden"}
          variants={variants}
          transition={{duration: .25, ease: 'easeOut'}}
        >
        <h1 className={styles.title}>{t('services-title')}</h1>
        <p style={{opacity: props.ctaClicked?1:0}}>{t('service-choice')}</p>
        <div className={styles.cards}>

        <Link href='/premade'>
        <div className={styles.cardContainer}>
            <div className={`${styles.card}`}>
              <FaCouch />
            </div>
            <div className={styles.info}>
              <h1>{t('service-1')}</h1>
            </div>
        </div>
        </Link>

        <Link href='/restore'>
        <div className={styles.cardContainer}>
            <div className={`${styles.card}`}>
              <IoSparkles />
            </div>
            <div className={styles.info}>
              <h1>{t('service-2')}</h1>
            </div>
        </div>
        </Link>

        <Link href='/build'>
        <div className={styles.cardContainer}>
            <div className={`${styles.card}`}>
              <IoHammerSharp />
            </div>
            <div className={styles.info}>
              <h1>{t('service-3')}</h1>
            </div>
        </div>
        </Link>

        </div>
      </motion.section>
     );
}
 
export default Services;