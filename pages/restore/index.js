import { useTranslation } from 'react-i18next';
import styles from './style.module.scss'
import DropFileInput from '@/components/drop-file-input/DropFileInput';
import { useEffect, useRef, useState } from 'react';
import SelectBoxInput from '@/components/input/SelectBoxInput';
import { toast } from 'react-toastify';
import Required from '@/components/input/Required';
import * as Yup from 'yup'
import { Formik, Form, ErrorMessage, Field } from "formik"

import { storage } from '@/components/firebase';

import { v4 } from "uuid"
import { compressImage, base64ToUint8Array, addData } from '@/components/functions';
import BlackBackdrop from '@/components/backdrops/BlackBackdrop';
import SimpleLoading from '@/components/loadings/SimpleLoading';

import firebase from 'firebase/app';
import 'firebase/firestore';



const Restore = () => {
    const { t } = useTranslation()
    const { Timestamp } = firebase.firestore;

    const [fileList, setFileList] = useState([])
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

    const error = useRef(null)
    //Firebase upload errors counter
    var errors = 0


    const initialValues = {
        img1: "",
        img2: "",
        img3: "",
        img4: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        volume: "",
        diameter: "",
        thickness: "",
        description: "",
        budget: "",
        username: "",
        email: "",
        phonenumber: ""
    }

    const setFileListHandler = (value) => {
        setFileList(prev=>value)
    }

    const handleSubmit = async (values, { resetForm }) => {
        // Showing Loading Page
        setIsLoading(prev=>true)

        //Scroll to top
        document.querySelector('html').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })

        if(fileList.length==0){
            // When no images
            try {

                let data = {
                    length: values.length ? values.length + units[0] : '',
                    width: values.width ? values.width + units[1] : '',
                    height: values.height ? values.height + units[2] : '',
                    weight: values.weight ? values.weight + units[3] : '',
                    volume: values.volume ? values.volume + units[4] : '',
                    diameter: values.diameter ? values.diameter + units[5] : '',
                    thickness: values.thickness ? values.thickness + units[6] : '',
                    description: values.description,
                    budget: values.budget ? values.budget + currency : '',
                    username: values.username,
                    email: values.email,
                    phonenumber: values.phonenumber,
                    completed: Number(0),
                    date: Timestamp.fromDate(new Date())
                }
                    
                addData('restore', data)

                // Hidding Loading Icon
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

                // Clearing Data
                setFileList(prev=>[]);
                resetForm();
    
                
            } catch (error) {
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
            
            return
 
        }

        // Optimizing Images
        let imgUrls = []
        fileList.forEach((e, i) => {
            compressImage(e, 60)
                .then((res)=>{
                    // Uploading Bytes Image
                    const imageBytes = base64ToUint8Array(res)
                    const imageBlob = new Blob([imageBytes], { type: 'image/jpeg' });
                    const storageRef = storage.ref();
                    let imagePath = `images/${e.name + v4()}`
                    // let imageRef = ref(storage, imagePath)
                    const uploadTask = storageRef.child(imagePath).put(imageBlob)
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            // Handle progress updates
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            // console.log('Upload is ' + progress + '% done');
                        }, 
                        (error) => {
                            // Handle errors
                            // Hidding Loading Icon
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
                        }, 
                        () => {
                            // Handle successful uploads on complete
                            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                                imgUrls.push(downloadURL)
                                
                                // Uploading Data when all images are uploaded
                                if(fileList.length==imgUrls.length){
                                    const currentDate = new Date();
                                    const formattedDate = currentDate.toLocaleString('en-GB');
                                    // Adding Data 
                                    const data = {
                                        img1: imgUrls[0] ? imgUrls[0] : '',
                                        img2: imgUrls[1] ? imgUrls[1] : '',
                                        img3: imgUrls[2] ? imgUrls[2] : '',
                                        img4: imgUrls[3] ? imgUrls[3] : '',
                                        length: values.length ? values.length + units[0] : '',
                                        width: values.width ? values.width + units[1] : '',
                                        height: values.height ? values.height + units[2] : '',
                                        weight: values.weight ? values.weight + units[3] : '',
                                        volume: values.volume ? values.volume + units[4] : '',
                                        diameter: values.diameter ? values.diameter + units[5] : '',
                                        thickness: values.thickness ? values.thickness + units[6] : '',
                                        description: values.description,
                                        budget: values.budget ? values.budget + currency : '',
                                        username: values.username,
                                        email: values.email,
                                        phonenumber: values.phonenumber,
                                        completed: Number(0),
                                        date: Timestamp.fromDate(new Date())
                                    }
                                    
                                    addData('restore', data)

                                    // Hidding Loading Icon
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

                                    // Clearing Data
                                    setFileList(prev=>[]);
                                    resetForm();
                                }
                            });
                        }
                        );
                }).catch((error)=>{
                    // Hidding Loading Icon
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
                })
        })
    }

    const validationSchema = Yup.object().shape({
            length: Yup.number().typeError(t('number-error')),
            width: Yup.number().typeError(t('number-error')),
            height: Yup.number().typeError(t('number-error')),
            weight: Yup.number().typeError(t('number-error')),
            volume: Yup.number().typeError(t('number-error')),
            diameter: Yup.number().typeError(t('number-error')),
            thickness: Yup.number().typeError(t('number-error')),
            description: Yup.string().required(t('field-required')),
            budget: Yup.string(),
            username: Yup.string(),
            email: Yup.string().email(t('email-type-error')).required(t('field-required')),
            phonenumber: Yup.string().required(t('field-required'))
            // .required(t('field-required'))
        })

    return ( 
        <main className={styles.main} >
            { isLoading && <BlackBackdrop Children={
                <div>
                    <SimpleLoading />
                </div>
            } onClick={false} />}
            <h1 className={styles.title} >{ t('restore-title') }</h1>
            <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                {({ errors, touched }) => (
                    <Form>
                    <hr/>
                    <div className={styles.container}>
                        <h3 className={styles.subTitle}>{t('restore-images-title')}</h3>
                        <DropFileInput fileList={fileList} setFileList={setFileListHandler} onFileChange={(files) => setFileListHandler(files)} />
                    </div>
                    <div className={styles.container}>
                        <h3 className={styles.subTitle}>{t('order-measures-title')}</h3>
                        <SelectBoxInput id={0} setUnits={handleUnitChange} name={'length'} placeholder={t('length')} options={['mm', 'cm', 'm','in', 'ft']} />
                            <ErrorMessage className={styles.error} name='length' component="span"/>
                        <SelectBoxInput id={1} setUnits={handleUnitChange} name={'width'} placeholder={t('width')} options={['mm', 'cm', 'm','in', 'ft']} />
                            <ErrorMessage className={styles.error} name='width' component="span"/>
                        <SelectBoxInput id={2} setUnits={handleUnitChange} name={'height'} placeholder={t('height')} options={['mm', 'cm', 'm','in', 'ft']} />
                            <ErrorMessage className={styles.error} name='height' component="span"/>
                        { moreOptions && 
                        <>
                        <SelectBoxInput id={3} setUnits={handleUnitChange} name={'weight'} placeholder={t('weight')} options={['g', 'kg', 'lbs']} />
                            <ErrorMessage className={styles.error} name='weight' component="span"/>
                        <SelectBoxInput id={4} setUnits={handleUnitChange} name={'volume'} placeholder={t('volume')} options={['m³', 'ft³']} />
                            <ErrorMessage className={styles.error} name='volume' component="span"/>
                        <SelectBoxInput id={5} setUnits={handleUnitChange} name={'diameter'} placeholder={t('diameter')} options={['m³', 'ft³']} />
                            <ErrorMessage className={styles.error} name='diameter' component="span"/>
                        <SelectBoxInput id={6} setUnits={handleUnitChange} name={'thickness'} placeholder={t('thickness')} options={['mm', 'in']} />
                            <ErrorMessage className={styles.error} name='thickness' component="span"/>
                        </>
                        }
                        { moreOptions ? 
                        <span className={styles.optHypertext} onClick={()=>setMoreOptions(false)}>{ t('show-less') }</span> :
                        <span className={styles.optHypertext} onClick={()=>setMoreOptions(true)}>{ t('show-more') }</span>
                        }
                    </div>

                    <div className={styles.container}>
                        <div className={styles.titleContainer}>
                            <h3 className={styles.subTitle}>{t('restore-description')}<Required/></h3>
                            <span>({t('restore-description-text')})</span>
                        </div>
                        <Field name='description' as='textarea' rows={7} placeholder={t('restore-description-ph')} />
                            <ErrorMessage className={styles.error} name='description' component="span"/>
                    </div>

                    <div className={styles.container}>
                        <div className={styles.titleContainer}>
                            <h3 className={styles.subTitle}>{t('order-budget-title')}</h3>
                            <span>({t('order-budget-sub-title')})</span>
                        </div>
                        <SelectBoxInput id={0} setUnits={handleCurrencyChange} name='budget' placeholder={t('order-budget-title')} options={['€', '$', 'DH']} />           
                        <span className={styles.hint}>{t('order-budget-example')}</span>     
                    </div>

                    <div className={styles.container}>
                        <h3 className={styles.subTitle}>{t('footer-contact-title')}<Required/></h3>
                        <Field name='username' placeholder={t('name-ph')} />
                        <Field name='email' placeholder={t('address-ph')} />
                            <ErrorMessage className={styles.error} name='email' component="span"/>
                        <Field name='phonenumber' placeholder={t('phone-number-ph')} />
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
 
export default Restore;