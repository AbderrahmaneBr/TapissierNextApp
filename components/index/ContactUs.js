import { useState } from "react"
import { useTranslation } from "react-i18next"
import { IoMdSend } from 'react-icons/io';
import styles from '@/pages/index.module.scss';
import Required from "../input/Required";
import * as Yup from 'yup'
import { Formik, Form, ErrorMessage, Field } from "formik"
import BlackBackdrop from "../backdrops/BlackBackdrop";
import SimpleLoading from "../loadings/SimpleLoading";
import { toast } from "react-toastify";
import { addData } from "../functions";

import firebase from 'firebase/app';
import 'firebase/firestore';


const ContactUs = (props) => {
    const { t } = useTranslation()
    const { Timestamp } = firebase.firestore;

    const [isLoading, setIsLoading] = useState(false)

    // Functions
    const handleSubmit = (values, { resetForm })=>{
        // Showing Loading Page
        setIsLoading(prev=>!prev)

        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('en-GB');

        const data = {
          username: values.username,
          email: values.email,
          message: values.message,
          date: Timestamp.fromDate(new Date())
        }

        try {
          
          addData('contactus', data)
            //resetField
            resetForm()
            setIsLoading(prev=>!prev)
            // Sweet Alert Pop up :P SUCCESS
            toast.success(t("feedback-message"), {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
            return
        }
        catch (err) {
          setIsLoading(prev=>!prev)
            // Sweet Alert Pop up :( ERROR
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
        }
    }

    const initialValues = {
      username: '',
      email: '',
      message: ''
    }
    const validationSchema = Yup.object().shape({
      username: Yup.string(),
      email: Yup.string().required(t('field-required')).email(t('email-type-error')),
      message: Yup.string().required(t('field-required'))
    })


    return ( 
    // <section className={props.isPage?styles.sec7alt:styles.sec7}></section>
    <section className={styles.sec7}>
      { isLoading && <BlackBackdrop Children={
                <div>
                    <SimpleLoading />
                </div>
            } onClick={false} />}
        <h1 className={styles.title}>{t('contact-us-title')}</h1>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <Form className={styles.form}>
                      <div className={styles.container}>
                        <label>{t('name-ph')}</label>
                        <Field name='username' placeholder={t('name-ph')} />
                          <ErrorMessage name="username" className={styles.error} component="span"/>
                      </div>
                      <div className={styles.container}>
                        <label>{t('address-ph')}<Required/></label>
                        <Field name='email' placeholder={t('address-ph')} />
                          <ErrorMessage name="email" className={styles.error} component="span"/>
                      </div>
                      <div className={styles.container}>
                        <label>{t('message-lb')}<Required/></label>
                        <Field as='textarea' name='message' rows='10' placeholder={t('message-lb')} />
                          <ErrorMessage name="message" className={styles.error} component="span"/>
                      </div>
                      <button type='submit'>
                        <IoMdSend />
                        <span>{t('send-button')}</span>
                      </button>
                    </Form>
                )}
          </Formik>
      </section>
     );
}
 
export default ContactUs;