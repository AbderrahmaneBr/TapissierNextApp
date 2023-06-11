import DropFileInput from '@/components/drop-file-input/DropFileInput';
import styles from '@/pages/admin/style.module.scss'
import { RiPencilFill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { db } from '@/components/firebase';
import { toast } from 'react-toastify';
import { addData, base64ToUint8Array, capitalizeFirstLetter, compressImage, deleteFileByUrl, updateDocumentByID } from '@/components/functions';
import SimpleLoading from '@/components/loadings/SimpleLoading';
import { storage } from '@/components/firebase';
import { v4 } from "uuid"
import LoadingBar from 'react-top-loading-bar';


const EditPost = (props) => { 

    const [data, setData] = useState()
    
    const [loading, setLoading] = useState(false)

    const [imgToDelete, setImgToDelete] = useState([])

    const handleImgDelete = (img) => {
        setImgToDelete(prev=>{
            var arr = [...prev]
            if(!arr.includes(img)){
                arr.push(img)
            }
            return arr
        })
    }

    const fetchData = () => {
        db.collection('products')
        .where('id', '==', props.target)
        .get()
        .then((querySnapshot) => {
            // let arr = []
            var docData;
            querySnapshot.forEach((doc) => {
                // Get the document data
                docData = doc.data();
                // Push the document data to the array
                // arr.push(docData);
            });
            setData(prev=>docData)
        })
        .catch((error) => {
            // console.log(error)
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

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(prev=>true)

        // console.log(imgToDelete)
        //Removing Images that user want to remove
        let dataArr = {...data}

        if(imgToDelete.includes('img1')){
            dataArr.img1 = ''
        }
        if(imgToDelete.includes('img2')){
            dataArr.img2 = ''
        }
        if(imgToDelete.includes('img3')){
            dataArr.img3 = ''
        }
        if(imgToDelete.includes('img4')){
            dataArr.img4 = ''
        }
        

        if (imgToDelete.length>0 && props.fileList.length==0) {
            //Update Data
            const collectionName = 'products';
            const idField = 'id';
            const idValue = dataArr.id;
            let updatedData = dataArr;

            if(data.img1 && imgToDelete.includes('img1')){
                deleteFileByUrl(data.img1)
            }
            if (data.img2 && imgToDelete.includes('img2')) {
                deleteFileByUrl(data.img2)
            } 
            if (data.img3 && imgToDelete.includes('img3')) {
                deleteFileByUrl(data.img3)
            } 
            if (data.img4 && imgToDelete.includes('img2')) {
                deleteFileByUrl(data.img4)
            }

            let imgs = []

            updatedData.img1 && !imgToDelete.includes('img1')?imgs.push(updatedData.img1):''
            updatedData.img2 && !imgToDelete.includes('img2')?imgs.push(updatedData.img2):''
            updatedData.img3 && !imgToDelete.includes('img3')?imgs.push(updatedData.img3):''
            updatedData.img4 && !imgToDelete.includes('img4')?imgs.push(updatedData.img4):''

            // console.log(imgs)

            if(imgs.length==0){
                updatedData = {
                    ...updatedData,
                    img1: '',
                    img2: '',
                    img3: '',
                    img4: ''
                }
            } else if(imgs.length==1){
                updatedData = {
                    ...updatedData,
                    img1: imgs[0],
                    img2: '',
                    img3: '',
                    img4: ''
                }
            } else if(imgs.length==2){
                updatedData = {
                    ...updatedData,
                    img1: imgs[0],
                    img2: imgs[1],
                    img3: '',
                    img4: ''
                }
            } else if(imgs.length==3){
                updatedData = {
                    ...updatedData,
                    img1: imgs[0],
                    img2: imgs[1],
                    img3: imgs[2],
                    img4: ''
                }
            } else if(imgs.length==4) {
                updatedData = {
                    ...updatedData,
                    img1: imgs[0],
                    img2: imgs[1],
                    img3: imgs[2],
                    img4: imgs[3]
                }
            }
            

            // console.log(updatedData)
            let updateTask = updateDocumentByID(collectionName, idField, idValue, updatedData)
            if(updateTask){
                toast.success('Updated Successfully!', {
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
                    //Re-fetch Data
                    props.fetchData()

                }, 2000)
                
                //Closing Edit Box
                props.closeEditBox()


                return
            } else {
                toast.error('An Error has occurred!', {
                    position: "bottom-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

                return
            }
        }

        //Images Total number
        let imgNumber = (dataArr.img1?1:0)+(dataArr.img2?1:0)+(dataArr.img3?1:0)+(dataArr.img4?1:0)
        
        //No Image Changes
        if (imgToDelete.length==0 && props.fileList.length==0) {
            //Update Data
            const collectionName = 'products';
            const idField = 'id';
            const idValue = dataArr.id;
            const updatedData = {
                ...data
            };
            let updateTask = updateDocumentByID(collectionName, idField, idValue, updatedData)
            if(updateTask){
                toast.success('Updated Successfully!', {
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
                    //Re-fetch Data
                    props.fetchData()
                }, 100)

                
                //Closing Edit Box
                props.closeEditBox()

                return
            } else {
                toast.error('An Error has occurred!', {
                    position: "bottom-right",
                    autoClose: 7000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });

                return
            }
        }

        //Updating
        let allImgs = []
        let imgUrls = []
        
        data.img1?allImgs.push(data.img1):''
        data.img2?allImgs.push(data.img2):''
        data.img3?allImgs.push(data.img3):''
        data.img4?allImgs.push(data.img4):''

        //Uploading & Optimizing Images
        props.fileList.forEach(e => {
            allImgs.push(e.name)
        })

        allImgs = allImgs.slice(0, 4)

        let filesToUpload = []
        props.fileList.forEach(e => {
            if(allImgs.includes(e.name)){
                filesToUpload.push(e)
            }
        })
        
        filesToUpload.forEach((e, i) => {
            compressImage(e, 100)
            .then((res) => {
                // Uploading Bytes Image
                const imageBytes = base64ToUint8Array(res)
                const imageBlob = new Blob([imageBytes], { type: 'image/jpeg' });
                const storageRef = storage.ref();
                let imagePath = `products/${e.name + v4()}`
                const uploadTask = storageRef.child(imagePath).put(imageBlob)
                uploadTask.on('state_changed', 
                (snapshot) => {
                    // Handle progress updates
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('Upload is ' + progress + '% done');
                }, 
                (error) => {
                    // Handle errors
                    // Sweet Alert Pop up :( ERROR
                    toast.error('An Error Has Occurred While Uploading Images!', {
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
                    if(filesToUpload.length==imgUrls.length){
                        const currentDate = new Date();
                        const formattedDate = currentDate.toLocaleString('en-GB');
                        
                        allImgs = allImgs.slice(0, -(imgUrls).length).concat(imgUrls)
                        
                        
                        dataArr.img1 = allImgs[0]?allImgs[0]:''
                        dataArr.img2 = allImgs[1]?allImgs[1]:''
                        dataArr.img3 = allImgs[2]?allImgs[2]:''
                        dataArr.img4 = allImgs[3]?allImgs[3]:''

                        //Update Data
                        const collectionName = 'products';
                        const idField = 'id';
                        const idValue = dataArr.id;
                        const updatedData = dataArr

                        let updateTask = updateDocumentByID(collectionName, idField, idValue, updatedData)

                        if(updateTask){
                            toast.success('Updated Successfully!', {
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
                                //Re-fetch Data
                                props.fetchData()
                            }, 100)

                            // Closing Edit Box
                            props.closeEditBox()


                            return
                            
                        } else {
                            toast.error('An Error has occurred!', {
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
                }
                    )
                }
            )})
                
        })

    }

    const handleChange = (e) => {
        if (e.target.name == 'title'){ 
            setData(prev=>({
                ...prev,
                title: e.target.value.toLowerCase().split(' ')
            }))
         } else if (e.target.name == 'category'){ 
            setData(prev=>({
                ...prev,
                category: e.target.value
            }))
         } else if (e.target.name == 'description'){ 
            setData(prev=>({
                ...prev,
                description: e.target.value.toLowerCase().split(' ')
            }))
         } else if (e.target.name == 'tags'){ 
            setData(prev=>({
                ...prev,
                tags: e.target.value.toLowerCase().split(',')
            }))
         } else if (e.target.name == 'length'){ 
            setData(prev=>({
                ...prev,
                length: e.target.value
            }))
         } else if (e.target.name == 'width'){ 
            setData(prev=>({
                ...prev,
                width: e.target.value
            }))
         } else if (e.target.name == 'height'){ 
            setData(prev=>({
                ...prev,
                height: e.target.value
            }))
         } else if (e.target.name == 'weight'){ 
            setData(prev=>({
                ...prev,
                weight: e.target.value
            }))
         } else if (e.target.name == 'volume'){ 
            setData(prev=>({
                ...prev,
                volume: e.target.value
            }))
         } else if (e.target.name == 'diameter'){ 
            setData(prev=>({
                ...prev,
                diameter: e.target.value
            }))
         } else if (e.target.name == 'thickness'){ 
            setData(prev=>({
                ...prev,
                thickness: e.target.value
            }))
         } else if (e.target.name == 'material'){ 
            setData(prev=>({
                ...prev,
                material: e.target.value.toLowerCase().split(',')
            }))
         }
    }

    
    useEffect(()=>{
        fetchData()
        
        props.clearFileList()
    }, [])

    return (
        <div className={styles.card}>
                <h2>Editing Post</h2>
                <hr/>
                { data ? <form onSubmit={handleSubmit}>
                    { loading && <div className={styles.loadingOverlay}></div>}
                    <label>Informations</label>
                        <input name='title' placeholder='Title' value={capitalizeFirstLetter(data.title.join(' '))} onChange={handleChange}/>
                        <input name='category' placeholder='Category' value={data.category} onChange={handleChange}/>
                        <textarea name='description' placeholder='Description' rows='6' value={capitalizeFirstLetter(data.description.join(' '))} onChange={handleChange}/>
                        <input name='tags' placeholder='Tags' value={data.tags} onChange={handleChange}/>
                    <hr/>
                    <label>Measurements</label>
                        <input name='length' placeholder='Length' value={data.length} onChange={handleChange}/>
                        <input name='width' placeholder='Width' value={data.width} onChange={handleChange}/>
                        <input name='height' placeholder='Height' value={data.height} onChange={handleChange}/>
                        <input name='weight' placeholder='Weight' value={data.weight} onChange={handleChange}/>
                        <input name='volume' placeholder='Volume' value={data.volume} onChange={handleChange}/>
                        <input name='diameter' placeholder='Diameter' value={data.diameter} onChange={handleChange}/>
                        <input name='thickness' placeholder='Thickness' value={data.thickness} onChange={handleChange}/>
                        <input name='material' placeholder='Material' value={data.material} onChange={handleChange}/>
                    <hr/>
                    <label>Images</label>
                    <div className={styles.existingImgsDiv}>

                        { data.img1 && !imgToDelete.includes('img1') && <div className={styles.imgContainer}>
                            <div className={styles.info}>
                                <div className={styles.img} style={{backgroundImage: `url(${data.img1})`}}></div>
                                <p className={styles.title}>Image 1</p>
                            </div>
                            <MdDelete className={styles.delete} onClick={()=>handleImgDelete('img1')} />
                        </div>}

                        { data.img2 && !imgToDelete.includes('img2') && <div className={styles.imgContainer}>
                            <div className={styles.info}>
                                <div className={styles.img} style={{backgroundImage: `url(${data.img2})`}}></div>
                                <p className={styles.title}>Image 2</p>
                            </div>
                            <MdDelete className={styles.delete} onClick={()=>handleImgDelete('img2')} />
                        </div>}

                        { data.img3 && !imgToDelete.includes('img3') && <div className={styles.imgContainer}>
                            <div className={styles.info}>
                                <div className={styles.img} style={{backgroundImage: `url(${data.img3})`}}></div>
                                <p className={styles.title}>Image 3</p>
                            </div>
                            <MdDelete className={styles.delete} onClick={()=>handleImgDelete('img3')} />
                        </div>}

                        { data.img4 && !imgToDelete.includes('img4') && <div className={styles.imgContainer}>
                            <div className={styles.info}>
                                <div className={styles.img} style={{backgroundImage: `url(${data.img4})`}}></div>
                                <p className={styles.title}>Image 4</p>
                            </div>
                            <MdDelete className={styles.delete} onClick={()=>handleImgDelete('img4')} />
                        </div>}
                        
                        <hr/>
                    </div>
                    <DropFileInput fileList={props.fileList} setFileList={props.setFileListHandler} onFileChange={(files) => setFileListHandler(files)} />
                    <hr/>
                    <button type='submit'>
                        <RiPencilFill/>
                        <span>Update</span>
                    </button>
                </form> : <SimpleLoading color='admin' size='small' />}
            </div>
    )
    }

export default EditPost;