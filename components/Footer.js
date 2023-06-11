import { useTranslation } from 'react-i18next';
import styles from './footer.module.scss';
import Link from 'next/link';
import { HiLocationMarker } from 'react-icons/hi';
import { BsFacebook, BsInstagram, BsWhatsapp } from 'react-icons/bs'
import { useState } from 'react';
import * as Yup from 'yup'
import { Formik, Form, ErrorMessage, Field } from "formik"
import { addData } from '@/components/functions';
import { db } from './firebase';

import firebase from 'firebase/app';
import 'firebase/firestore';

const Footer = () => {
    const { t } = useTranslation();
    const { Timestamp } = firebase.firestore;

    const [isRegistered, setIsRegistered] = useState(false)

    const handleSubmit = (values, { resetForm })=>{
        // Checking if email already exists
        const collectionRef = db.collection('newsletter')
        const query = collectionRef.where('email', '==', values.email);
        query.get().then((querySnapshot) => {
        if (querySnapshot.size > 0) {
            // Email Already Exists
            resetForm()
            setIsRegistered(true)
            setTimeout(()=>{
                setIsRegistered(false)
            }, 5000)
        } else {
            // Email Doesn't Exist => Inserting
            const data = {
                email: values.email,
                date: Timestamp.fromDate(new Date())
            }
            // Add data
            addData('newsletter', data)
            // Reset Fields
            resetForm()
            setIsRegistered(true)
            setTimeout(()=>{
                setIsRegistered(false)
            }, 5000)
        }
        }).catch((error) => {
            toast.error(t('error-upload'), {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        });

    }
    const initialValues = {
        email: '',
        date: '',
    }
    const validationSchema = Yup.object().shape({
        email: Yup.string().required(t('field-required')).email(t('email-type-error')),
    })
  

    return ( 
        <footer className={styles.footer}>
            <span className={styles.cc}>© 2022-2023 Tapisserie de Rêve, All rights reserved.</span>
            <div className={styles.container}>
            <ul className={styles.sec0}>
                <li><h3>{t('newsletter-title')}</h3></li>
                <li><p>{t('newsletter-parag')}</p></li>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <Form className={styles.form}>
                        { isRegistered && <span className={styles.success}>{t('newsletter-subbed')}</span> }
                        <Field name='email' placeholder={t('address-ph')}/>
                            {/* <ErrorMessage name="email" className={styles.error} component="span"/> */}
                        <button className='button-light' type='submit'>
                            <span>{t('subscribe-button')}</span>
                        </button>
                    </Form>
                )}
                </Formik>
            </ul>
            <ul className={styles.sec1}>
                <li><h3>{t('footer-navigation-title')}</h3></li>
                <li><Link href='/'>{t('home')}</Link></li>
                {/* <li><Link href='/premade'>{t('premade')}</Link></li> */}
                <li><Link href='/gallerie'>{t('gallerie')}</Link></li>
                <li><Link href='/contact'>{t('contact-us')}</Link></li>
                <li><Link href='/faq'>FAQ</Link></li>
            </ul>
            <ul className={styles.sec2}>
                <li><h3>{t('footer-location-title')}</h3></li>
                <li className={styles.location}>
                    <HiLocationMarker/>
                    <Link href="https://goo.gl/maps/7Tk1SbDptoNwLDkq8" rel="noopener noreferrer" target="_blank"><span>{t('location-address')}</span></Link>
                </li>
            </ul>
            <ul className={styles.sec3}>
                <li><h3>{t('footer-contact-title')}</h3></li>
                <li>Tapissier.marrakech@gmail.com</li>
                <li>{t('phone-number')}</li>
                <ul className={styles.social}>
                    <li><Link href="https://www.facebook.com/tapissier.marrakech/" rel="noopener noreferrer" target="_blank"><BsFacebook/></Link></li>
                    <li><Link href="https://www.instagram.com/tapissier.marrakech/" rel="noopener noreferrer" target="_blank"><BsInstagram/></Link></li>
                    <li><Link href="https://wa.me/+212628525448" rel="noopener noreferrer" target="_blank"><BsWhatsapp/></Link></li>
                </ul>
            </ul>
            </div>
        </footer>
     );
}
 
export default Footer;