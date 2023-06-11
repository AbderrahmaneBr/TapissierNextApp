import { useTranslation } from "react-i18next";
import styles from '@/pages/index.module.scss';
import WorkerCard from '@/components/index/WorkerCard';
import { motion, useInView } from 'framer-motion'
import { useRef } from "react";

const CEOnWorkers = (props) => {
    const { t } = useTranslation()
    const cardCeo = useRef(null)
    const cardWorkers = useRef(null)
    const isInView1 = useInView(cardCeo, { once: true });
    const isInView2 = useInView(cardWorkers, { once: true });
    
    const variants = {
      visible: { opacity: 1, y: 0, scale: 1 },
      hidden: { opacity: 0, y: 100, scale: .9 },
    };
    
    var workersCards = []
    for(let i=0;i<props.imgsWorkers.length;i++){
      workersCards.push((<WorkerCard img={props.imgsWorkers[i]} name={t(`worker-${i+1}`)} post={t(`worker-${i+1}-post`)}/>))
    }

    return ( 
        <section className={styles.sec5}>
          <h1 className={styles.title}>{t('team-title')}</h1>
          <motion.div className={styles.ceoContainer} ref={cardCeo}
            animate={isInView1 ? "visible" : "hidden"}
            variants={variants}
            transition={{duration: .25, ease: 'easeOut'}}
          >
            <div className={styles.img} style={{backgroundImage:`url(${props.imgCEO})`}}></div>
            <div className={styles.info}>
              <h1>{t('ceo-title')}</h1>
              <h3>{t('ceo-name')}</h3>
              <p>{t('ceo-description')}</p>
            </div>
          </motion.div>
          <h2 className={styles.subTitle}>{t('workers-title')}</h2>
          <motion.div className={styles.workersContainer} ref={cardWorkers}
            animate={isInView2 ? "visible" : "hidden"}
            variants={variants}
            transition={{duration: .25, delay: .1, ease: 'easeOut'}}
          >
            { workersCards }
          </motion.div>
      </section>
     );
}
 
export default CEOnWorkers;