import { useTranslation } from 'react-i18next';
import styles from './style.module.scss'
import { BsBoxes, BsCart, BsHouseDoorFill } from 'react-icons/bs'
import { RxCaretRight, RxCaretLeft } from 'react-icons/rx'
import { useState, useRef, useEffect } from 'react';
import ProductCard from '@/components/premade/productCard';
import BlurBackdrop from '@/components/backdrops/blurBackdrop';
import BlackBackdrop from '@/components/backdrops/blackBackdrop';
import { IoMdSend } from 'react-icons/io';
import { useRouter } from 'next/router';
import * as Yup from 'yup'
import { Formik, Form, ErrorMessage, Field } from "formik"
import { db } from '@/components/firebase';
import { addData, capitalizeFirstLetter } from '@/components/functions';
import noImage from '@/public/images/no-image.jpg'
import { toast } from 'react-toastify';
import Link from 'next/link';

import firebase from 'firebase/app';
import 'firebase/firestore';

const Product = () => {
    const { t } = useTranslation()
    const otherProducts = useRef(null)
    const leftButton = useRef(null)
    const rightButton= useRef(null)
    const images = [
        'https://source.unsplash.com/random/?Furniture&18',
        'https://source.unsplash.com/random/?Furniture&1',
        'https://source.unsplash.com/random/?Furniture&8',
        'https://source.unsplash.com/random/?Furniture&7'
    ]

    const [productData, setProductData] = useState()
    const [moreProductsData, setMoreProductsData] = useState([])
    
    const [mainImage, setMainImage] = useState("")
    const [leftIsActive, setLeftIsActive] = useState(false)
    const [rightIsActive, setRightIsActive] = useState(true)
    const [orderClicked, setOrderClicked] = useState(false)
    
    const router = useRouter();

    const handleSubmit = (e, { resetForm })=>{
        const { Timestamp } = firebase.firestore;
        
        const data = {
            productId: router.query.id,
            username: e.username,
            email: e.email,
            phonenumber: e.phonenumber,
            message: e.message,
            completed: Number(0),
            date: Timestamp.fromDate(new Date())
        }

        try {
            // Adding Data
            addData('orders', data)
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
            setOrderClicked(prev=>false)
            return
        } catch (err) {
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
            setOrderClicked(prev=>false)
        }

        
    }
    const initialValues = {
        username: '',
        email: '',
        phonenumber: '',
        message: ''
      }
    const validationSchema = Yup.object().shape({
        username: Yup.string(),
        email: Yup.string().required(t('field-required')).email(t('email-type-error')),
        phonenumber: Yup.string().required(t('field-required')),
        message: Yup.string(),
    })

    // Changing Data Based on URL ID
    useEffect(() => {
        // Get ID from URL
        let id = router.query.id;
    
        if (id) {
            db.collection('products')
              .where('id', '==', id)
              .get()
              .then((querySnapshot) => {
                if (querySnapshot.size > 0) {
                  querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    setProductData(data);
                  });
                } else {
                  router.push('/404');
                }
              })
              .catch((error) => {
                // console.log('Error fetching product data:', error);
                toast.error('Error Occured while Fetching data!', {
                    position: "bottom-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
              });
        }
      }, [router.query.id]);     
      
    
    const toggleBackdrop = () => {
        setOrderClicked(prev=>!prev)
    }

    const scrollToLeft = () => {
        otherProducts.current.scrollLeft -= 200
    }
    const scrollToRight = () => {
        otherProducts.current.scrollLeft += 200
    }

    
    
    useEffect(()=>{
        otherProducts.current.addEventListener("scroll", (e)=>{
            let maxScroll = otherProducts.current.scrollWidth - otherProducts.current.clientWidth
            setLeftIsActive(!(otherProducts.current.scrollLeft<=50))
            setRightIsActive(!(otherProducts.current.scrollLeft>=maxScroll-20))
        })
    }, [])
    

    // More Products Query
    useEffect(()=>{
        // Generate 10 by 10 related products by tag and title
        let arr = []

        db.collection('products')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(e=>{
                arr.push(e.data())
            })
        })
        .catch(err => {
            // console.log(err)
            toast.error('Error Occured, please try again!', {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        })

       setMoreProductsData(prev=>arr)


    }, [])

   



    return ( 
        <main className={styles.article}>
            { productData && 
            <ul className={styles.nav}>
                <li>
                    <BsHouseDoorFill/>
                    <Link href={'/'}>{t('home')}</Link>
                </li>
                <RxCaretRight className={styles.caret} />
                <li>
                    <BsBoxes/>
                    <Link href={'/premade'}>{t('premade')}</Link>
                </li>
                <RxCaretRight className={styles.caret} />
                <li>
                    {productData && productData.title && <span>{capitalizeFirstLetter(productData.title.join(' '))}</span>}
                </li>
            </ul>}
            
            { orderClicked && 
                <BlurBackdrop Children={
                    <div className={styles.followUp}>
                    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
                        {({ errors, touched }) => (
                            <Form className={styles.container}>
                            <h1>{t('product-order-page-title')}</h1>
                            <div className={styles.inpContainer}>
                                <Field name='username' placeholder={t('name-ph')} />
                                    <ErrorMessage name="username" className={styles.error} component="span"/>
                                <Field as='textarea' rows='10' name='message' placeholder={t('message-lb')} />
                                    <ErrorMessage name="message" className={styles.error} component="span"/>
                                <Field name='email' placeholder={t('address-ph')} />
                                    <ErrorMessage name="email" className={styles.error} component="span"/>
                                <Field name='phonenumber' placeholder={t('phone-number-ph')} />
                                    <ErrorMessage name="phonenumber" className={styles.error} component="span"/>
                            </div>
                            <button type='submit'>
                                <IoMdSend/>
                                <span>{t('send-button')}</span>
                            </button>
                            </Form>
                        )}
                    </Formik>
                    </div>

                } handleClick={ toggleBackdrop } onClick={true} />
            }
            
            <div className={styles.sec1}>
                <div className={styles.images}>
                    <div className={styles.all}>
                        {productData ? 
                        <>
                            {productData.img1 && <div id={mainImage==""||mainImage==productData.img1?styles.selected:''} style={{backgroundImage: `url(${productData.img1?productData.img1:''})`}} className={styles.img} onClick={()=>{setMainImage(productData.img1)}}>
                            </div>}
                            {productData.img2 && <div id={mainImage==productData.img2?styles.selected:''} style={{backgroundImage: `url(${productData.img2})`}} className={styles.img} onClick={()=>{setMainImage(productData.img2)}}>
                            </div>}
                            {productData.img3 && <div id={mainImage==productData.img3?styles.selected:''} style={{backgroundImage: `url(${productData.img3})`}} className={styles.img} onClick={()=>{setMainImage(productData.img3)}}>
                            </div>}
                            {productData.img4 && <div id={mainImage==productData.img4?styles.selected:''} style={{backgroundImage: `url(${productData.img4})`}} className={styles.img} onClick={()=>{setMainImage(productData.img4)}}>
                            </div>}
                        </> : 
                        <>
                            <div className={styles.loadingImg}></div>
                            <div className={styles.loadingImg}></div>
                            <div className={styles.loadingImg}></div>
                            <div className={styles.loadingImg}></div>
                        </>
                        }

                    </div>
                    {productData ? 
                    <>
                        {<div style={{backgroundImage: `url(${mainImage?mainImage:(productData.img1?productData.img1:noImage.src)})`}} className={styles.main}></div>}
                    </> :
                    <>
                        <div className={styles.loadingMain}></div>
                    </>
                    }
                </div>

                <div className={styles.content}>
                { productData ? 
                    <>
                        <h1>{capitalizeFirstLetter(productData.title.join(' '))}</h1>
                        <h3>{capitalizeFirstLetter(productData.category)}</h3>
                        <p>{capitalizeFirstLetter(productData.description.join(' '))}</p>
                        <button onClick={()=>{setOrderClicked(prev=>!prev)}}>
                            <BsCart />
                            <span>{t('product-order-button')}</span>
                        </button>
                        {productData && productData.date && <p className={styles.date}>{`${t('posted')} ${productData.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}`}</p>}
                    </>
                 : 
                    <>
                        <div className={styles.loadingTitle}></div>
                        <div className={styles.loadingCat}></div>
                        <div className={styles.loadingDesc}></div>
                        <div className={styles.loadingButton}></div>
                    </>
                }
                </div>
                
            </div>
            <div className={styles.sec2}>
                <h2 className={styles.title}>{t('product-details-title')}</h2>
                <table className={styles.table}>
                    <tr>
                        <td>{t('length')}</td>
                        <td>{productData && productData.length ? productData.length : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('width')}</td>
                        <td>{productData && productData.width ? productData.width : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('height')}</td>
                        <td>{productData && productData.height ? productData.height : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('weight')}</td>
                        <td>{productData && productData.weight ? productData.weight : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('volume')}</td>
                        <td>{productData && productData.volume ? productData.volume : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('diameter')}</td>
                        <td>{productData && productData.diameter ? productData.diameter : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('thickness')}</td>
                        <td>{productData && productData.thickness ? productData.thickness : '--'}</td>
                    </tr>
                    <tr>
                        <td>{t('material')}</td>
                        <td>{productData && productData.material ? capitalizeFirstLetter(productData.material.join(', ')) : '--'}</td>
                    </tr>
                </table>
            </div>
            <div className={styles.sec3}>
                <h2 className={styles.title}>{t('product-mpp')}</h2>
                { moreProductsData.length!=0 && 
                <>
                    {leftIsActive && <div id={styles.L} ref={leftButton} className={styles.button} onClick={()=>{scrollToLeft()}}>
                        <RxCaretLeft/>
                    </div>}
                    {rightIsActive && <div id={styles.R} ref={rightButton} className={styles.button} onClick={()=>{scrollToRight()}}>
                        <RxCaretRight/>
                    </div>}
                </>
                }
                <div ref={otherProducts} className={styles.moreProducts}>
                    <div className={styles.overlay}></div>
                    {moreProductsData.length!=0 ? moreProductsData.map((e, i)=>(
                        <ProductCard id={e.id} img={e.img1} title={capitalizeFirstLetter(e.title.join(' '))} desc={capitalizeFirstLetter(e.description.join(' '))} />
                    ))
                
                        :
                    <p>
                        { t('no-product-found') }
                    </p>
                }
                </div>
            </div>
        </main>
     );
}
 
export default Product;