import { useTranslation } from 'react-i18next';
import styles from '../restore/style.module.scss'
import { useRef, useState } from 'react';
import SelectBoxInput from '@/components/input/SelectBoxInput';
import MultipleInput from '@/components/input/MultipleInput';
import Required from '@/components/input/Required';
import * as Yup from 'yup'
import { Formik, Form, ErrorMessage, Field } from "formik"
import { addData } from '@/components/functions';
import BlackBackdrop from '@/components/backdrops/BlackBackdrop';
import SimpleLoading from '@/components/loadings/SimpleLoading';
import { toast } from 'react-toastify';

import firebase from 'firebase/app';
import 'firebase/firestore';


const Build = () => {
    const { t } = useTranslation()
    const error = useRef(null)
    const [moreOptions, setMoreOptions] = useState(false)

    const [isLoading, setIsLoading] = useState(false)

    const [units, setUnits] = useState(['mm', 'mm', 'mm', 'g', 'm³', 'm³', 'mm'])
    const [currency, setCurrency] = useState(['€'])

    const handleUnitChange = (e, i)=>{
        setUnits(prev=>{
            let newArr = prev
            newArr[i] = e
            return newArr
        })
    }

    const handleCurrencyChange = (e, i)=>{
        setCurrency(prev=>e)
    }

    const initialValues = {
        context: "",
        description: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        volume: "",
        diameter: "",
        thickness: "",
        material1: "",
        material2: "",
        material3: "",
        material4: "",
        detail1: "",
        detail2: "",
        detail3: "",
        detail4: "",
        budget: "",
        username: "",
        email: "",
        phonenumber: ""
    }

    const handleSubmit = (values, { resetForm }) => {
        // Showing Loading Screen
        setIsLoading(prev=>true)

        // Scroll to top
        document.querySelector('html').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })

        const { Timestamp } = firebase.firestore;

        const data = {
            context: values.context,
            description: values.description,
            length: values.length,
            width: values.width,
            height: values.height,
            weight: values.weight,
            volume: values.volume,
            diameter: values.diameter,
            thickness: values.thickness,
            material1: values.material1,
            material2: values.material2,
            material3: values.material3,
            material4: values.material4,
            detail1: values.detail1,
            detail2: values.detail2,
            detail3: values.detail3,
            detail4: values.detail4,
            budget: values.budget,
            username: values.username,
            email: values.email,
            phonenumber: values.phonenumber,
            completed: Number(0),
            date: Timestamp.fromDate(new Date())
        }
        // Inserting Data
        try {
            addData('build', data)
            //resetField
            resetForm()
            setIsLoading(prev=>!prev)
            // Sweet Alert Pop up :P SUCCESS
            toast.success(t('successful-upload'), {
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
        } catch (err) {
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

    const validationSchema = Yup.object().shape({
        context: Yup.string().required(t('field-required')),
        description: Yup.string().required(t('field-required')),
        length: Yup.number().typeError(t('number-error')),
        width: Yup.number().typeError(t('number-error')),
        height: Yup.number().typeError(t('number-error')),
        weight: Yup.number().typeError(t('number-error')),
        volume: Yup.number().typeError(t('number-error')),
        diameter: Yup.number().typeError(t('number-error')),
        thickness: Yup.number().typeError(t('number-error')),
        material1: Yup.string().required(t('field-required')),
        material2: Yup.string(),
        material3: Yup.string(),
        material4: Yup.string(),
        detail1: Yup.string(),
        detail2: Yup.string(),
        detail3: Yup.string(),
        detail4: Yup.string(),
        budget: Yup.string(),
        username: Yup.string(),
        email: Yup.string().required(t('field-required')).email(t('email-type-error')),
        phonenumber: Yup.string().required(t('field-required'))
    })

    return ( 

        <main className={styles.main}>
            { isLoading && <BlackBackdrop Children={
                <div>
                    <SimpleLoading />
                </div>
            } onClick={false} />}
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <Form>
                    <h1 className={styles.title}>{ t('order-title') }</h1>
                    <hr/>
                    <div className={styles.container}>
                        <h3 className={styles.subTitle}>{t('order-context-title')}<Required/></h3>
                        <Field name="context" placeholder={t('order-obj-name-ph')} />
                            <ErrorMessage name="context" className={styles.error} component="span"/>
                        <Field name="description" as='textarea' rows={7} placeholder={t('order-obj-purpose-ph')} />
                            <ErrorMessage name="description" className={styles.error} component="span"/>
                    </div>
                    <div className={styles.container}>
                        <h3 className={styles.subTitle}>{t('order-measures-title')}</h3>
                        <SelectBoxInput id={0} setUnits={handleUnitChange} name="length" placeholder={t('length')} options={['mm', 'cm', 'm','in', 'ft']} />
                            <ErrorMessage className={styles.error} name='length' component="span"/>
                        <SelectBoxInput id={1} setUnits={handleUnitChange} name="width" placeholder={t('width')} options={['mm', 'cm', 'm','in', 'ft']} />
                            <ErrorMessage className={styles.error} name='width' component="span"/>
                        <SelectBoxInput id={2} setUnits={handleUnitChange} name="height" placeholder={t('height')} options={['mm', 'cm', 'm','in', 'ft']} />
                            <ErrorMessage className={styles.error} name='length' component="span"/>
                        { moreOptions && 
                        <>
                        <SelectBoxInput id={3} setUnits={handleUnitChange} name="weight" placeholder={t('weight')} options={['g', 'kg', 'lbs']} />
                            <ErrorMessage className={styles.error} name='weight' component="span"/>
                        <SelectBoxInput id={4} setUnits={handleUnitChange} name="volume" placeholder={t('volume')} options={['m³', 'ft³']} />
                            <ErrorMessage className={styles.error} name='volume' component="span"/>
                        <SelectBoxInput id={5} setUnits={handleUnitChange} name="diameter" placeholder={t('diameter')} options={['m³', 'ft³']} />
                            <ErrorMessage className={styles.error} name='diameter' component="span"/>
                        <SelectBoxInput id={6} setUnits={handleUnitChange} name="thickness" placeholder={t('thickness')} options={['mm', 'in']} />
                            <ErrorMessage className={styles.error} name='thickness' component="span"/>
                        </>
                        }
                        { moreOptions ? 
                        <span className={styles.optHypertext} onClick={()=>setMoreOptions(false)}>{t('show-less')}</span> :
                        <span className={styles.optHypertext} onClick={()=>setMoreOptions(true)}>{t('show-more')}</span>
                        }
                        </div>

                        <div className={styles.container}>
                            <h3 className={styles.subTitle}>{t('gallerie-material-title')}<Required/></h3>
                                <ErrorMessage name="material1" className={styles.error} component="span"/>
                            <MultipleInput name="material" ph={t('material-ph')} add={t('add-new-material')} remove={t('remove-material')} />
                        </div>

                        <div className={styles.container}>
                            <div className={styles.titleContainer}>
                                <h3 className={styles.subTitle}>{t('order-ad')}</h3>
                                <span>({t('order-ad-sub-title')})</span>
                            </div>
                            <MultipleInput name="detail" ph={t('order-ad-ph')} add={t('add-new-text')} remove={t('remove-text')} />
                        </div>

                        <div className={styles.container}>
                            <div className={styles.titleContainer}>
                                <h3 className={styles.subTitle}>{t('order-budget-title')}</h3>
                                <span>({t('order-budget-sub-title')})</span>
                            </div>
                            <SelectBoxInput id={0} setUnits={handleCurrencyChange} name="budget" placeholder={t('order-budget-title')} options={['€', '$', 'DH']} />           
                            <span className={styles.hint}>{t('order-budget-example')}</span>     
                        </div>

                        <div className={styles.container}>
                            <h3 className={styles.subTitle}>{t('footer-contact-title')}<Required/></h3>
                            <Field name="username" placeholder={t('name-ph')} />
                            <Field name="email" placeholder={t('address-ph')} />
                                <ErrorMessage className={styles.error} name='email' component="span"/>
                            <Field name="phonenumber" placeholder={t('phone-number-ph')} />
                                <ErrorMessage className={styles.error} name='phonenumber' component="span"/>
                        </div>

                        <hr/>

                        <button className={styles.button} type='submit'>
                            {t('confirm')}
                        </button>
                    </Form>
                )}
            </Formik>
        </main>
     );
}
 
export default Build;