import ContactUs from '@/components/index/ContactUs';
import styles from '@/pages/index.module.scss';

const Contact = () => {
    return (
        <main className={`${styles.main} margin`}>
            <ContactUs isPage={true} />
        </main>
     );
}
 
export default Contact;