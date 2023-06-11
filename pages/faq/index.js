import { useTranslation } from 'react-i18next';
import styles from './style.module.scss'
import FaqCard from '@/components/FaqCard';
import { useEffect } from 'react';

const FAQ = () => {
    const { t } = useTranslation()

    return ( 
        <main className={styles.main}>
            <h2>Frequently Asked Questions</h2>
            <h4>Here are the most asked questions and their answers.</h4>
            <div className={styles.questions}>

                <FaqCard question={ t('faq-q-1') } answer={ t('faq-a-1') } />
                <FaqCard question={ t('faq-q-2') } answer={ t('faq-a-2') } />
                <FaqCard question={ t('faq-q-3') } answer={ t('faq-a-3') } />
                <FaqCard question={ t('faq-q-4') } answer={ t('faq-a-4') } />
                <FaqCard question={ t('faq-q-5') } answer={ t('faq-a-5') } />
                <FaqCard question={ t('faq-q-6') } answer={ t('faq-a-6') } />
                
            </div>
        </main>
     );
}
 
export default FAQ;