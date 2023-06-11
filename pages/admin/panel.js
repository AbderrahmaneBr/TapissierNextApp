import { IoReorderThreeSharp, IoSearchOutline } from 'react-icons/io5';
import styles from './style.module.scss'
import { AiFillEye, AiOutlineDashboard } from 'react-icons/ai';
import { VscSettingsGear } from 'react-icons/vsc';
import { BsBoxSeam, BsCheckLg } from 'react-icons/bs';
import { BiSquare, BiTask } from 'react-icons/bi';
import { RiLogoutBoxRLine, RiPencilFill } from 'react-icons/ri'
import { FiDatabase, FiLogOut, FiPlus, FiSettings } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { MdDelete, MdLogout, MdOutlineFileDownload, MdUpload } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { HiPlus } from 'react-icons/hi';
import BlurBackdrop from '@/components/backdrops/BlurBackdrop';
import DropFileInput from '@/components/drop-file-input/DropFileInput';
import Link from 'next/link';
import { auth, db } from '@/components/firebase';
import EditPost from '../../components/admin/components/EditPost';
import SimpleLoading from '@/components/loadings/SimpleLoading';
import { capitalizeFirstLetter, deleteDocumentById, deleteFileByUrl, getImageOf } from '@/components/functions';
import { toast } from 'react-toastify';
import AddPost from '../../components/admin/components/AddPost';
import ProductCard from '../../components/admin/components/ProductCard';
import NormalCard from '../../components/admin/components/NormalCard';
import InfoCard from '../../components/admin/components/InfoCard';
import InfoCardRestore from '../../components/admin/components/InfoCardRestore';
import InfoCardBuild from '../../components/admin/components/InfoCardBuild';

import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import InfoCardFeedback from '../../components/admin/components/InfoCardFeedback';
import { useRouter } from 'next/router';

const AdminPanel = () => {

    const router = useRouter();

    const [showAll, setShowAll] = useState(false)

    const [collapse, setCollapse] = useState(true)
    const [activeOption, setActiveOption] = useState(1)
    
    const [fileList, setFileList] = useState([])

    const [mobileScreen, setMobileScreen] = useState(false)
    
    // FOR POSTS/PRODUCTS MANAGEMENT : START
    const [searchPosts, setSearchPosts] = useState('')
    const [searchFocus, setSearchFocus] = useState(false)
    
    const [addPost, setAddPost] = useState(false)
    const [editPost, setEditPost] = useState(false)
    const [editTarget, setEditTarget] = useState()
    
    const [products, setProducts] = useState()
    
    const [ordersCategory, setOrdersCategory] = useState('all')
    const [restoreCategory, setRestoreCategory] = useState('all')
    const [buildCategory, setBuildCategory] = useState('all')
    // FOR POSTS/PRODUCTS MANAGEMENT : END

    // FOR ORDERS : START
    const [ordersData, setOrdersData] = useState()
    const [showOrder, setShowOrder] = useState(false)
    const [orderTarget, setOrderTarget] = useState()
    // FOR ORDERS : END

    // FOR RESTORE : START
    const [toRestoreData, setToRestoreData] = useState()
    const [restoreTarget, setRestoreTarget] = useState()
    const [showRestore, setShowRestore] = useState(false)
    // FOR RESTORE : END

    // FOR BUILD : START
    const [toBuildData, setToBuildData] = useState()
    const [buildTarget, setBuildTarget] = useState()
    const [showBuild, setShowBuild] = useState(false)
    // FOR BUILD : END

    // FOR EMAILS : START
    const emailColumns = ['N', 'E-mail', 'Date', 'Action']
    const [emails, setEmails] = useState()
    const [emailsExcel, setEmailsExcel] = useState()
    // FOR EMAILS : END

    // FOR FEEDBACKS : START
    const [feedbackColumns, setFeedbackColumns] = useState(['N', 'E-mail', 'Message', 'Date', 'Actions'])
    const [feedbacks, setFeedbacks] = useState()
    const [feedbackTarget, setFeedbackTarget] = useState()
    const [showFeedback, setShowFeedback] = useState(false)
    // FOR FEEDBACKS : END

    const handleEditPost = (id) => {
        setEditPost(prev=>true)
        setEditTarget(prev=>id)
    }

    const handleAddPost = () => {
        setAddPost(prev=>true)
    }

    const handleShowOrder = (id) => {
        setShowOrder(prev=>true)
        setOrderTarget(prev=>id)
    }

    const handleShowRestore = (id) => {
        setShowRestore(prev=>true)
        setRestoreTarget(prev=>id)
    }

    const handleShowBuild = (id) => {
        setShowBuild(prev=>true)
        setBuildTarget(prev=>id)
    }

    const handleEmailDelete = (id) => {
        try {
            deleteDocumentById('newsletter', 'id', id)

            toast.info("E-mail Removed!", {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            setTimeout(()=>{
                fetchEmailData()
            }, 800)
            
        } catch (err) {
            toast.error("An Error Has Occurred!", {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const handleFeedbackDelete = (id) => {
        try {
            deleteDocumentById('contactus', 'id', id)

            toast.info("Feedback Removed!", {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            setTimeout(()=>{
                fetchFeedbackData()
            }, 800)
            
        } catch (err) {
            toast.error("An Error Has Occurred!", {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
    }

    const handleShowFeedback = (data) => {
        setShowFeedback(prev=>true)
        setFeedbackTarget(prev=>data)
    }

    const setFileListHandler = (value) => {
        setFileList(prev=>value)
    }

    const clearFileList = () => {
        setFileList(prev=>[])
    }

    const ordersCategoryChange = (category) => {
        setOrdersCategory(prev=>category)
    }

    const restoreCategoryChange = (category) => {
        setRestoreCategory(prev=>category)
    }

    const buildCategoryChange = (category) => {
        setBuildCategory(prev=>category)
    }

    const handleCloseEditBox = () => {
        setEditPost(prev=>false)
    }

    const handleCloseAddBox = () => {
        setAddPost(prev=>false)
    }

    const handleSearchPosts = (e) => {
        setSearchPosts(prev=>e.target.value)
    }

    const deletePost = (id) => {
        // Storing Post Images
        let data
        let imgs = []
        db.collection('products')
        .where('id', '==', id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data = doc.data()
            })
            // console.log(data)
        })
        .then(()=>{
            data.img1?imgs.push(data.img1):''
            data.img2?imgs.push(data.img2):''
            data.img3?imgs.push(data.img3):''
            data.img4?imgs.push(data.img4):''
        })
        .then(async ()=>{
            // Deleting Post From Firestore
            try {
                deleteDocumentById('products', 'id', id)
            } catch (error) {
                toast.error('Error Occured while Deleting Post!', {
                    position: "bottom-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                // console.log(error)
                
                return
            }
        })
        .then(() => {
            // Deleting Post Images From Storage
            try {
                if(imgs.length!=0){
                    imgs.forEach(e => {
                        deleteFileByUrl(e)
                    })
                }

                toast.success('Post Deleted Successfully!', {
                    position: "bottom-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

                setTimeout(()=>{
                    fetchData()
                }, 100)

            } catch (error) {
                toast.error('Error Occured while Deleting Post Images!', {
                    position: "bottom-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });

            //     console.log(error)
                
                return
            }
            

        })

        return
    }

    const fetchData = () => {
        setProducts()
        const collectionRef = db.collection('products')
        let query = collectionRef;
      
        // If search isn't empty
        if (searchPosts) {
          const searchLower = searchPosts.toLowerCase();
          query = collectionRef.where('title', 'array-contains-any', searchLower.split(' '))
        }

        query.get().then((querySnapshot) => {
            const data = [];
            querySnapshot.forEach((doc) => {
                // Get the document data
                const docData = doc.data();
                // Push the document data to the array
                data.push(docData);
            });
            setProducts(prev=>data)
        })
        .catch((error) => {
            // Sweet Alert Pop up :P SUCCESS
            toast.error('Error Occured while Loading Data!', {
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

    const fetchOrdersData = () => {
        setOrdersData()
        let query = db.collection('orders')
        if(ordersCategory=='completed'){
            query = query.where('completed', '==', 1)
        } else if (ordersCategory=='pending'){
            query = query.where('completed', '==', 0)
        }
        query.get()
        .then((querySnapshot) => {
            let data = []
            querySnapshot.forEach(e => {
                data.push(e.data())
            })
            
            setOrdersData(prev=>data)
        })
    }

    const fetchRestoreData = () => {
        setToRestoreData()
        let query = db.collection('restore')
        if(restoreCategory=='completed'){
            query = query.where('completed', '==', 1)
        } else if (restoreCategory=='pending'){
            query = query.where('completed', '==', 0)
        }
        query.get()
        .then((querySnapshot) => {
            let data = []
            querySnapshot.forEach(e => {
                data.push(e.data())
            })
            
            setToRestoreData(prev=>data)
        })
    }

    const fetchBuildData = () => {
        setToBuildData()
        let query = db.collection('build')
        if(buildCategory=='completed'){
            query = query.where('completed', '==', 1)
        } else if (buildCategory=='pending'){
            query = query.where('completed', '==', 0)
        }
        query.get()
        .then((querySnapshot) => {
            let data = []
            querySnapshot.forEach(e => {
                data.push(e.data())
            })
            
            setToBuildData(prev=>data)
        })
    }

    const fetchEmailData = () => {
        let data = []
        let dataExcel = []
        db.collection('newsletter')
        .get()
        .then((querySnapshot) => {
            let i = 0
            querySnapshot.forEach(e => {
                i++
                let id = e.data().id
                let email = e.data().email
                let date = e.data().date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                data.push({id: id, email: email, date: date})
                dataExcel.push({id: i.toString(), email: email, date: date})
            })
        })
        .then(() => {
            setEmails(prev=>data)
            setEmailsExcel(prev=>dataExcel)
        })
    }

    const fetchFeedbackData = () => {
        let data = []
        db.collection('contactus')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach(e => {
                let id = e.data().id
                let username = e.data().username
                let email = e.data().email
                let message = e.data().message
                let date = e.data().date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')
                data.push({id: id, username: username, email: email, message: message,date: date})
            })
        })
        .then(() => {
            setFeedbacks(prev=>data)
        })
    }


    const clearAllData = () => {
        setOrdersData()
        setProducts()
        setToRestoreData()
        setToBuildData()
    }

    const generateExcelData = (data) => {      
        const workbook = utils.book_new();
        const worksheet = utils.json_to_sheet(data);
        utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
      
        return workbook;
    };

    const getDownloadFile = (data) => {
        const workbook = generateExcelData(data);

        // Convert workbook to a binary string
        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });

        // Create a Blob from the buffer
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Save the file using FileSaver.js
        saveAs(excelBlob, 'EmailsData.xlsx');
    };

    const clearUserSession = () => {
        auth.signOut()
          .then(() => {
            // User sign-out successful
            toast.info('Logged Out!', {
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
          .catch((error) => {
            // Handle error during sign-out
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    };

    const handleSignOut = () => {
        clearUserSession()
        router.push('/admin')
    }


    useEffect(()=>{
        if(activeOption==1){
            fetchData()
            fetchOrdersData()
            fetchRestoreData()
            fetchBuildData()
            fetchEmailData()
            fetchFeedbackData()
        }
    }, [activeOption])

    // --Optimizing calls
    useEffect(()=>{
        if(activeOption==1 || activeOption==2){
            //If active option is MANAGEMENT 
            fetchData()
        }
        
    }, [activeOption, searchPosts])

    useEffect(()=>{
        if(activeOption==1 || activeOption==3){
            fetchOrdersData()
        }
    }, [activeOption, ordersCategory])

    useEffect(()=>{
        if(activeOption==1 || activeOption==4 || activeOption==6){
            fetchRestoreData()
        }
    }, [activeOption, restoreCategory])

    useEffect(()=>{
        if(activeOption==1 || activeOption==4 || activeOption==7){
            fetchBuildData()
        }
    }, [activeOption, buildCategory])

    useEffect(()=>{
        if(activeOption==1 || activeOption==5 || activeOption==8){
            fetchEmailData()
        }
        if(activeOption==1 || activeOption==5 || activeOption==9){
            fetchFeedbackData()
        }
    }, [activeOption])

    useEffect(()=>{
        window.addEventListener('resize', (e)=>{
            if(e.srcElement.innerWidth<=700){
                setMobileScreen(prev=>true)
                setFeedbackColumns(prev=>['E-mail', 'Message', 'Date', 'Actions'])
            } else {
                setMobileScreen(prev=>false)
                setFeedbackColumns(prev=>['N', 'E-mail', 'Message', 'Date', 'Actions'])
            }
        })

        // Check user auth
        auth.onAuthStateChanged((user) => {
            if (user) {
              // User is signed in
              setShowAll(true)
            } else {
              // User is signed out
              router.push('/admin')
            }
        });

    }, [])


    return ( 
    <>
    { editPost && <BlurBackdrop Children={
        (<EditPost target={editTarget} editTarget={editTarget} fileList={fileList} closeEditBox={handleCloseEditBox} setFileListHandler={setFileListHandler} clearFileList={clearFileList} fetchData={fetchData} />)
    } handleClick={ setEditPost } onClick={true}  />}

    { addPost && <BlurBackdrop Children={
        (<AddPost fileList={fileList} closeAddBox={handleCloseAddBox} setFileListHandler={setFileListHandler} clearFileList={clearFileList} fetchData={fetchData} />)
    } handleClick={ setAddPost } onClick={true} />}

    { showOrder && <BlurBackdrop Children={
        (<InfoCard target={orderTarget} />)
    } handleClick={ setShowOrder } onClick={true} />}

    { showRestore && <BlurBackdrop Children={
        (<InfoCardRestore target={restoreTarget} />)
    } handleClick={ setShowRestore } onClick={true} />}

    { showBuild && <BlurBackdrop Children={
        (<InfoCardBuild target={buildTarget} />)
    } handleClick={ setShowBuild } onClick={true} />}

    { showFeedback && <BlurBackdrop Children={
        (<InfoCardFeedback data={feedbackTarget} />)
    } handleClick={ setShowFeedback } onClick={true} />}


    { showAll && <div className={styles.panelContainer}>
        <div className={collapse?styles.sideClosed:styles.side}>
            <IoReorderThreeSharp className={styles.collapse} onClick={()=>{setCollapse(prev=>!prev)}} />
            <ul className={styles.options}>
                <li id={activeOption==1?styles.selected:''} onClick={()=>{setActiveOption(1);setCollapse(true)}}>
                    <AiOutlineDashboard />
                    <span>Dashboard</span>
                </li>
                <li id={activeOption==2?styles.selected:''} onClick={()=>{setActiveOption(2);setCollapse(true)}}>
                    <FiSettings />
                    <span>Management</span>
                </li>
                <li id={activeOption==3?styles.selected:''} onClick={()=>{setActiveOption(3);setCollapse(true)}}>
                    <BiSquare />
                    <span>Orders</span>
                </li>
                <li className={styles.dropdown} >
                    <div id={activeOption==4?styles.selected:''} onClick={()=>{setActiveOption(4);setCollapse(true)}} className={styles.main}>
                        <BiTask />
                        <span>Requests</span>
                    </div>
                    <ul className={styles.sub}>
                        <li id={activeOption==6?styles.selected:''} onClick={()=>{setActiveOption(6);setCollapse(true)}}>To Restore</li>
                        <li id={activeOption==7?styles.selected:''} onClick={()=>{setActiveOption(7);setCollapse(true)}}>To Build</li>
                    </ul>
                </li>
                <li className={styles.dropdown}>
                    <div id={activeOption==5?styles.selected:''} onClick={()=>{setActiveOption(5);setCollapse(true)}} className={styles.main}>
                        <FiDatabase />
                        <span>User Informations</span>
                    </div>
                    <ul className={styles.sub}>
                        <li id={activeOption==8?styles.selected:''} onClick={()=>{setActiveOption(8);setCollapse(true)}}>E-mails</li>
                        <li id={activeOption==9?styles.selected:''} onClick={()=>{setActiveOption(9);setCollapse(true)}}>Feedbacks</li>
                    </ul>
                </li>
            </ul>
            <button onClick={handleSignOut} className={styles.disconnect}>
                <MdLogout />
                <span>Disconnect</span>
            </button>
        </div>

        <div className={styles.view}>

            {/*activeOption==1 && <div className={styles.container} id={styles.dashboard}>
                <h1 className={styles.title}>Dashboard</h1>
                
            </div>
            */}

            {(activeOption==1 || activeOption==2) && <div className={styles.container} id={styles.management}>
                <h1 className={styles.title}>Management</h1>
                <div className={styles.content}>
                    <div className={styles.searchContainer}>
                        <div className={styles.search} id={searchFocus?styles.focus:''}>
                            <IoSearchOutline />
                            <input name='search' placeholder='Search...' onFocus={()=>setSearchFocus(prev=>true)} onBlur={()=>setSearchFocus(prev=>false)} onChange={handleSearchPosts}/>
                        </div>
                        <button className={styles.primary} onClick={()=>handleAddPost()}><HiPlus/></button>
                    </div>
                    <hr />
                    <div className={styles.result}>
                        { products ? 
                            products.map((e, i)=>(
                                <ProductCard handleEditPost={handleEditPost} handleDeletePost={deletePost} id={e.id} title={capitalizeFirstLetter(e.title.join(' '))} image={e.img1?e.img1:''} />
                            ))
                            : 
                            <SimpleLoading color='admin' size='small' />}
                            {products && products.length==0 && <span className={styles.noData}>No Data.</span>}
                    </div>
                </div>
            </div>}

            {(activeOption==1 || activeOption==3) && <div className={styles.container} id={styles.orders}>
                <h1 className={styles.title}>Orders</h1>
                <div className={styles.content}>
                <div className={styles.categories}>
                    <button id={ordersCategory=='all'?styles.selected:''} onClick={()=>{ordersCategoryChange('all')}}>All</button>
                    <button id={ordersCategory=='completed'?styles.selected:''} onClick={()=>{ordersCategoryChange('completed')}}>Completed</button>
                    <button id={ordersCategory=='pending'?styles.selected:''} onClick={()=>{ordersCategoryChange('pending')}}>Pending</button>
                </div>
                    <div className={styles.result}>
                        {ordersData ? 
                            ordersData.map(e => (
                            <NormalCard clearData={clearAllData} for="orders" fetchData={fetchOrdersData} flushData={setOrdersData} data={e} handleShowCard={handleShowOrder} id={e.id} title={e.phonenumber} description={capitalizeFirstLetter(e.message)} productId={e.productId} />
                        ))
                        :
                        <SimpleLoading color='admin' size='small' />}
                        {ordersData && ordersData.length==0 && <span className={styles.noData}>No Data.</span>}
                    </div>
                </div>
            </div>}

            {(activeOption==1 || activeOption==4 || activeOption==6 || activeOption==7) && <div className={styles.container} id={styles.requests}>
                <h1 className={styles.title}>Requests</h1>
                {(activeOption==1 || activeOption==6 || activeOption==4) && 
                <div className={styles.content}>
                    <h1 className={styles.title2}>To Restore</h1>
                    <hr/>
                    <div className={styles.categories}>
                        <button id={restoreCategory=='all'?styles.selected:''} onClick={()=>{restoreCategoryChange('all')}}>All</button>
                        <button id={restoreCategory=='completed'?styles.selected:''} onClick={()=>{restoreCategoryChange('completed')}}>Completed</button>
                        <button id={restoreCategory=='pending'?styles.selected:''} onClick={()=>{restoreCategoryChange('pending')}}>Pending</button>
                    </div>
                    <div className={styles.result}>
                        {toRestoreData ? toRestoreData.map(e => (
                            <NormalCard clearData={clearAllData} for='restore' fetchData={fetchRestoreData} flushData={setToRestoreData} data={e} handleShowCard={handleShowRestore} id={e.id} title={capitalizeFirstLetter(e.description)} description={e.phonenumber} />
                        )): 
                        <SimpleLoading color='admin' size='small' />}
                        {toRestoreData && toRestoreData.length==0 && <span className={styles.noData}>No Data.</span>}
                    </div>
                </div>
                }
                {(activeOption==1 || activeOption==7 || activeOption==4) && <div className={styles.content}>
                    <h1 className={styles.title2}>To Build</h1>
                    <hr/>
                    <div className={styles.categories}>
                        <button id={buildCategory=='all'?styles.selected:''} onClick={()=>{buildCategoryChange('all')}}>All</button>
                        <button id={buildCategory=='completed'?styles.selected:''} onClick={()=>{buildCategoryChange('completed')}}>Completed</button>
                        <button id={buildCategory=='pending'?styles.selected:''} onClick={()=>{buildCategoryChange('pending')}}>Pending</button>
                    </div>
                    <div className={styles.result}>
                        {toBuildData ? toBuildData.map(e => (
                            <NormalCard clearData={clearAllData} for='build' fetchData={fetchBuildData} flushData={setToBuildData} data={e} handleShowCard={handleShowBuild} id={e.id} title={capitalizeFirstLetter(e.context)} description={e.description} />
                        )):
                        <SimpleLoading color='admin' size='small' />}
                        {toBuildData && toBuildData.length==0 && <span className={styles.noData}>No Data.</span>}
                    </div>
                </div>
                }
            </div>}

            {(activeOption==1 || activeOption==5 || activeOption==8 || activeOption==9) && <div className={styles.container} id={styles.requests}>
                <h1 className={styles.title}>User Informations</h1>
                {(activeOption==1 || activeOption === 8 || activeOption === 5) && (
                <div className={styles.content}>
                    <h1 className={styles.title2}>E-mails</h1>
                    <hr/>
                    <table className={styles.emailTable}>
                    <thead>
                        <tr>
                        {emailColumns.map((e, i) => (
                            <th key={i}>{e}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {emails ? (
                        emails.map((e, i) => (
                            <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{e.email}</td>
                            <td>{e.date}</td>
                            <td>
                                <MdDelete
                                className={styles.delete}
                                onClick={() => {
                                    handleEmailDelete(e.id);
                                }}
                                />
                            </td>
                            </tr>
                        ))
                        ) : (
                        <tr>
                            <td colSpan={emailColumns.length}>
                            <SimpleLoading color='admin' size='small' />
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                    <div className={styles.dataManagementTools}>
                    <button type='button' onClick={() => { getDownloadFile(emailsExcel) }}>
                        <MdOutlineFileDownload />
                        <span>Download</span>
                    </button>
                    </div>
                </div>
                )}
                {(activeOption==1 || activeOption === 9 || activeOption === 5) && (
                <div className={styles.content}>
                    <h1 className={styles.title2}>Feedbacks</h1>
                    <hr/>
                    <table className={styles.feedbackTable}>
                    <thead>
                        <tr>
                        {feedbackColumns.map((e, i) => (
                            <th key={i}>{e}</th>
                        ))}
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks ? feedbacks.map((e, i) => (
                        <tr key={i} >
                            {!mobileScreen && <td>{i + 1}</td>}
                            <td>{e.email}</td>
                            <td>
                            <span className={styles.description}>{e.message}</span>
                            </td>
                            <td>{e.date}</td>
                            <td className={styles.actions}>
                            <i id={styles.view}><AiFillEye onClick={()=>{handleShowFeedback(e)}} /></i>
                            <i id={styles.delete}><MdDelete onClick={()=>{handleFeedbackDelete(e.id)}} /></i>
                            </td>
                        </tr>
                        )) : (
                            <tr>
                                <td colSpan={emailColumns.length}>
                                <SimpleLoading color='admin' size='small' />
                                </td>
                            </tr>
                            )}
                    </tbody>
                    </table>
                </div>
                )}


            </div>}

        </div>
    </div> }
    </>
    );
}
 
export default AdminPanel;