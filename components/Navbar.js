import styles from './navbar.module.scss'
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsFacebook, BsInstagram, BsWhatsapp, BsCaretDownFill } from 'react-icons/bs'
import 'flag-icon-css/css/flag-icons.min.css'
import i18next from 'i18next';
import { useRouter } from 'next/router';
import Logo from '@/public/images/logo.png'
import { IoReorderThreeSharp } from 'react-icons/io5';
import { MdClose } from 'react-icons/md';

const Navbar = () => {
    const [navbarLogoSize, setNavbarLogoSize] = useState([45, 145])
    const { t } = useTranslation() //Translator
    const { asPath } = useRouter(); //Get current Location (choose which nav to add Underline to)
    const navRef = useRef(null)
    const navSec1Ref = useRef(null)
    const [navInd, setNavInd] = useState()
    const [selectedLanguage, setSelectedLanguage] = useState(i18next.language)
    const [flagIconClass, setFlagIconClass] = useState()
    const [selectBoxToggle, setSelectBoxToggle] = useState(false)

    const [sideNav, setSideNav] = useState(false)

    useEffect(()=>{
        let lang = selectedLanguage == 'fr' ? 'flag-icon flag-icon-fr' : 'flag-icon flag-icon-gb'
        setFlagIconClass(prev=>lang)
    }, [selectedLanguage])


    // Keep Highlighting lines depending on location whenever the location changes
    useEffect(()=>{
        setNavInd(asPath.replace('/', '').toLowerCase())

    }, [asPath])

    useEffect(()=>{
        addEventListener("scroll", () => {
            if(window.scrollY>100){
                navSec1Ref.current.style.padding = "0 .75em"
                navSec1Ref.current.style.opacity = ".95"
            } else {
                navSec1Ref.current.style.padding = "0.35em 2em"
                navSec1Ref.current.style.opacity = "1"
            }
        });
    }, [])

    return ( 
        <>
        { sideNav && <div className={styles.sideNav}>
            <MdClose onClick={()=>{setSideNav(false)}} />
            <Link onClick={()=>{setNavInd('');setSideNav(false)}} href={'/'}><p>{t('home')}</p></Link>
            <Link onClick={()=>{setNavInd('gallerie');setSideNav(false)}} href={'/gallerie'}><p>{t('gallerie')}</p></Link>
            <Link onClick={()=>{setNavInd('faq');setSideNav(false)}} href={'/faq'}><p>FAQ</p></Link>
            <Link id={styles.white} onClick={()=>{setNavInd('services');setSideNav(false)}} href={'/services'}><p>{t('services-title')}</p></Link>
        </div> }
        <header className={styles.navbar} ref={navRef}>
            <div className={styles.section1} ref={navSec1Ref}>
                <div className={styles.navTools}>
                    <IoReorderThreeSharp onClick={()=>{setSideNav(prev=>!prev)}} />
                    <Link className={styles.navTools} href={'/'}>
                        <img alt='Logo' src={Logo.src} height={navbarLogoSize[0]} width={navbarLogoSize[1]} />
                    </Link>
                </div>
                <div className={styles.subsection}>
                    <ul className={styles.lang}>
                        <li className={styles.selectboxSelected} onClick={()=>{setSelectBoxToggle(prev=>!prev)}}>
                            <p>
                                {flagIconClass && <span className={ flagIconClass }></span>}
                                <span id={styles.hide} className={styles.text}>{ t('lang-name') }</span>
                            </p>
                    
                            <BsCaretDownFill style={{transform: selectBoxToggle ? 'rotate(180deg)' : 'rotate(0)'}}/>
                        </li>
                        {selectBoxToggle && 
                        <div className={styles.selectBox}>
                            <li onClick={()=>{i18next.changeLanguage('fr');setSelectedLanguage('fr');setSelectBoxToggle(prev=>!prev);}}>
                                <span className='flag-icon flag-icon-fr'></span>
                                <span id={styles.hide}>Français</span>
                            </li>
                            <li onClick={()=>{i18next.changeLanguage('en');setSelectedLanguage('en');setSelectBoxToggle(prev=>!prev);}}>
                                <span className='flag-icon flag-icon-gb'></span>
                                <span id={styles.hide}>English</span>
                            </li>
                        </div>}
                    </ul>
                    <ul className={styles.social} id={styles.hidePhone}>
                        <li><Link href="https://www.facebook.com/tapissier.marrakech/" rel="noopener noreferrer" target="_blank"><BsFacebook/></Link></li>
                        <li><Link href="https://www.instagram.com/tapissier.marrakech/" rel="noopener noreferrer" target="_blank"><BsInstagram/></Link></li>
                        <li><Link href="https://wa.me/+212628525448" rel="noopener noreferrer" target="_blank"><BsWhatsapp/></Link></li>
                        <li id={styles.hide}>{t('phone-number')}</li>
                    </ul>
                </div>
            </div>
            <nav className={styles.section2}>
                <ul className={styles.nav}>
                    
                    <li id={navInd==''?styles.underlineHover:''}>
                    <Link onClick={()=>{setNavInd('')}} href={'/'}>
                        {/* <i className={styles.navIcon}><AiFillHome /></i> */}
                        <span>{t('home')}</span>
                    </Link>
                    </li>

                    <li id={navInd=='gallerie'?styles.underlineHover:''}>
                    <Link onClick={()=>{setNavInd('gallerie')}} href={'/gallerie'}>
                        {/* <i className={styles.navIcon}><IoMdPhotos /></i> */}
                        <span>{t('gallerie')}</span>
                    </Link>
                    </li>

                    <li id={navInd=='faq'?styles.underlineHover:''}>
                    <Link onClick={()=>{setNavInd('faq')}} href={'/faq'}>
                        {/* <i className={styles.navIcon}><AiFillQuestionCircle /></i> */}
                        <span>FAQ</span>
                    </Link>
                    </li>

                    <li className={navInd=='services'?styles.borderActive:''} id={styles.primary}>
                    <Link id={styles.white} onClick={()=>{setNavInd('services')}} href={'/services'}>
                        {/* <i className={styles.navIcon}><IoConstructSharp/></i> */}
                        <span>{t('services-title')}</span>
                    </Link>
                    </li>

                    {/* <li style={{borderColor: navInd=='products' ? 'var(--black)' : ''}}><Link onClick={()=>{setNavInd('products')}} href={'/products'}>{t('premade')}</Link></li> */}
                    
                </ul>
                
            </nav>
        </header>
        </>
     );
}
 
export default Navbar;