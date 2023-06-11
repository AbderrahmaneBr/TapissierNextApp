import { useTranslation } from 'react-i18next';
import styles from './style.module.scss'
import img1 from '@/public/images/work-3.jpg'
import img2 from '@/public/images/work-2.jpg'
import mat1 from '@/public/images/mat-1.jpg'
import mat2 from '@/public/images/mat-2.jpg'
import mat3 from '@/public/images/mat-3.jpg'
import mat4 from '@/public/images/mat-4.jpg'
import mat5 from '@/public/images/mat-5.jpg'
import mat6 from '@/public/images/mat-6.jpg'
import tol1 from '@/public/images/tol-1.jpg'
import tol2 from '@/public/images/tol-2.jpg'
import tol3 from '@/public/images/tol-3.jpg'
import b1 from '@/public/images/b-1.jpg'
import b2 from '@/public/images/b-2.jpg'
import b3 from '@/public/images/b-3.jpg'
import a1 from '@/public/images/a-1.jpg'
import a2 from '@/public/images/a-2.jpg'
import a3 from '@/public/images/a-3.jpg'
import Image from 'next/image';


const Portfolio = () => {
    const { t } = useTranslation()

    return ( 
        <main className={styles.main}>
            <div className={styles.title}>
                <h1>{t('gallerie-title-1')}</h1>
                <div className={styles.line}></div>
            </div>

            <div className={styles.container1}>
                <div className={styles.textContainer}>
                    <h4>{t('gallerie-quality-title')}</h4>
                    <p>{t('gallerie-quality-text')}</p>
                </div>
                <div className={styles.imgContainer}>
                    <div className={styles.img1} style={{backgroundImage:`url(${img1.src})`}}></div>
                    <div className={styles.img2} style={{backgroundImage:`url(${img2.src})`}}></div>
                </div>
            </div>

            <div className={styles.container2}>
                <div className={styles.imgContainer}>
                    <div style={{backgroundImage:`url(${mat5.src})`}}></div>
                    <div style={{backgroundImage:`url(${mat1.src})`}}></div>
                    <div style={{backgroundImage:`url(${mat4.src})`}}></div>
                    <div style={{backgroundImage:`url(${mat6.src})`}}></div>
                    <div style={{backgroundImage:`url(${mat3.src})`}}></div>
                    <div style={{backgroundImage:`url(${mat2.src})`}}></div>
                </div>
                <div className={styles.textContainer}>
                    <h4>{t('gallerie-material-title')}</h4>
                    <p>{t('gallerie-material-text')}</p>
                </div>
            </div>

            <div className={styles.container3}>
                <h4>{t('gallerie-tol-title')}</h4>
                <div className={styles.container}>
                    <div>
                        <div className={styles.img} style={{backgroundImage:`url(${tol1.src})`}}></div>
                        <p>{t('gallerie-tol-text-1')}</p>
                    </div>
                    <div>
                        <div className={styles.img} style={{backgroundImage:`url(${tol2.src})`}}></div>
                        <p>{t('gallerie-tol-text-2')}</p>
                    </div>
                    <div>
                        <div className={styles.img} style={{backgroundImage:`url(${tol3.src})`}}></div>
                        <p>{t('gallerie-tol-text-3')}</p>
                    </div>
                </div>
            </div>
            
            <div className={styles.title}>
                <h1>{t('gallerie-title-2')}</h1>
                <div className={styles.line}></div>
            </div>

            <div className={styles.container4}>
                <div className={styles.container1}>
                    <h2 className={styles.subtitle}>{t('gallerie-before-title')}</h2>
                    <div className={styles.img} style={{backgroundImage:`url(${b1.src})`}}></div>
                    <div className={styles.img} style={{backgroundImage:`url(${b2.src})`}}></div>
                    <div className={styles.img} style={{backgroundImage:`url(${b3.src})`}}></div>
                </div>
                <div className={styles.container2}>
                    <div className={styles.img} style={{backgroundImage:`url(${a1.src})`}}></div>
                    <div className={styles.img} style={{backgroundImage:`url(${a2.src})`}}></div>
                    <div className={styles.img} style={{backgroundImage:`url(${a3.src})`}}></div>
                    <h2 className={styles.subtitle}>{t('gallerie-after-title')}</h2>
                </div>
            </div>


        </main>
     );
}
 
export default Portfolio;