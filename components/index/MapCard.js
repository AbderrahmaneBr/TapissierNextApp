import { useTranslation } from "react-i18next";
import styles from '@/pages/index.module.scss';
import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const MapCard = () => {
    const { t } = useTranslation()
    const mapAll = useRef(null)
    const isInView = useInView(mapAll, { once: true });
    
    const variants = {
      visible: { opacity: 1, y: 0, scale: 1 },
      hidden: { opacity: 0, y: 100, scale: .9 },
    };
    
    return ( 
    <motion.section ref={mapAll} className={styles.sec6}
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{duration: .25, ease: 'easeOut'}}
    >
        <h1 className={styles.title}>{t('location-title')}</h1>
        <div className={styles.mapBox}>
          <iframe className={styles.map} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d849.2583214874035!2d-8.014837530606922!3d31.632939000000036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee918f7ccced%3A0xab7eed84bc3a4494!2sTapisserie%20De%20R%C3%AAve%20(Azami%20Omar)!5e0!3m2!1sen!2sma!4v1681984614589!5m2!1sen!2sma" style={{border:0}} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          <div className={styles.textBox}>
            <h2 className={styles.address}>{t('location-address')}</h2>
            <p>Tapisserie De Rêve (Azami Omar)</p>
          </div>
        </div>
      </motion.section> );
}
 
export default MapCard;