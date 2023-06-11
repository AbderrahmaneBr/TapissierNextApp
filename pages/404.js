import { useTranslation } from 'react-i18next';
import styles from './404.module.scss'
import Link from 'next/link';

const NotFound = () => {
    const { t } = useTranslation()

    return ( 
        <main className={styles.notfoundmain}>
            <section>
                <h1>404</h1>
                <p>{t('404-message')}</p>
                <Link href='/'><button>{t('404-button')}</button></Link>
            </section>
        </main>
     );
}
 
export default NotFound;