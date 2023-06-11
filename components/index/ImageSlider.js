import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from '@/pages/index.module.scss';

const ImageSlider = (props) => {
    const { t } = useTranslation()
    const [imgInd, setImgInd] = useState(0)
    const imgs = props.imgs

    const handleClick = () => {
      props.activateCta()
    };

    useEffect(
        () => {
            const time = setInterval(()=>{imgInd<4?setImgInd(prev=>prev+1):setImgInd(0)}, 7000);
            return () => clearInterval(time);
        },
        [imgInd]
    );

    return ( 
    <section className={styles.sec1}>
        <div className={styles.content}>
          <h1>{ t('hero-title') }</h1>
          <h2>{t('hero-sub-title')}</h2>
          <button className="button-light" onClick={handleClick}>{t('hero-cta-button')}</button>
        </div>
        <div className={styles.imgSlider}>
          <div className={styles.overlay}></div>
          <div className={styles.img} style={{backgroundImage: `url(${imgs[imgInd]})`}}></div>
        </div>
        <div className={styles.slider}>
          <div className={`${styles.tog} ${imgInd==0?styles.active:''}`} onClick={()=>setImgInd(0)}></div>
          <div className={`${styles.tog} ${imgInd==1?styles.active:''}`} onClick={()=>setImgInd(1)}></div>
          <div className={`${styles.tog} ${imgInd==2?styles.active:''}`} onClick={()=>setImgInd(2)}></div>
          <div className={`${styles.tog} ${imgInd==3?styles.active:''}`} onClick={()=>setImgInd(3)}></div>
          <div className={`${styles.tog} ${imgInd==4?styles.active:''}`} onClick={()=>setImgInd(4)}></div>
        </div>
      </section>
     );
}
 
export default ImageSlider;