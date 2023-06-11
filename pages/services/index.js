import Services from "@/components/index/Services";
import styles from '../index.module.scss'

const ServicesPage = () => {
    return ( 
        <main className={`${styles.main} ${styles.isPage}`}>
            <Services />
        </main>
     );
}
 
export default ServicesPage;