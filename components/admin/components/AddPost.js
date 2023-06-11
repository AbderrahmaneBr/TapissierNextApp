import DropFileInput from '@/components/drop-file-input/DropFileInput';
import styles from '@/pages/admin/style.module.scss'
import { useEffect, useState } from 'react';
import { MdUpload } from 'react-icons/md';
import { addData, base64ToUint8Array, compressImage, deleteFileByUrl, generateId } from '@/components/functions';
import { toast } from 'react-toastify';
import { db, storage } from '@/components/firebase';
import { v4 } from 'uuid';

import firebase from 'firebase/app';
import 'firebase/firestore';

const AddPost = (props) => {

    const { Timestamp } = firebase.firestore;

    const [data, setData] = useState({
        title: '',
        category: '',
        description: '',
        tags: '',
        material: '',
    })

    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        if (e.target.name == 'title'){ 
            setData(prev=>({
                ...prev,
                title: e.target.value
            }))
         } else if (e.target.name == 'category'){ 
            setData(prev=>({
                ...prev,
                category: e.target.value
            }))
         } else if (e.target.name == 'description'){ 
            setData(prev=>({
                ...prev,
                description: e.target.value
            }))
         } else if (e.target.name == 'tags'){ 
            setData(prev=>({
                ...prev,
                tags: e.target.value
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

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(prev=>true)
        
        let imgUrls = []

        if(props.fileList.length==0){
            // When no images
            let dataArr = {...data,
                title: String(data.title).toLowerCase().split(' '),
                description: String(data.description).toLowerCase().split(' '),
                tags: String(data.tags).toLowerCase().split(','),
                material: String(data.material).toLowerCase().split(','),
                category: String(data.category).toLowerCase(),
                date: Timestamp.fromDate(new Date())
            }
            // Adding Data 
            try {
                generateId('products').then(generatedId => {
                    dataArr = {...dataArr,
                                id: generatedId}
                })
                .then(()=>{
                    const docRef = db.collection('products').doc();
                    docRef.set(dataArr);
                    // Sweet Alert Pop up :P SUCCESS
                    toast.success("Post Uploaded Successfully!", {
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
                    props.clearFileList();
                                            
                    // Re-Fetch Data
                    setTimeout(()=>{
                        //Re-fetch Data
                        props.fetchData()
                    }, 1000)
        
                    props.closeAddBox()
                })
                    
    
                
            } catch (error) {
                toast.error("An Error Has Occurred While Uploading The Post!", {
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
        props.fileList.forEach((e, i) => {
            compressImage(e, 100)
                .then((res)=>{
                    // Uploading Bytes Image
                    const imageBytes = base64ToUint8Array(res)
                    const imageBlob = new Blob([imageBytes], { type: 'image/jpeg' });
                    const storageRef = storage.ref();
                    let imagePath = `products/${e.name + v4()}`
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
                            // Sweet Alert Pop up :( ERROR
                            console.log(error)
                            toast.error("An Error Has Occurred While Uploading Images!", {
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
                                if(props.fileList.length==imgUrls.length){
                                    
                                    // Adding Data 
                                    // Adjusting Data
                                    let dataArr = {...data,
                                        title: String(data.title).toLowerCase().split(' '),
                                        description: String(data.description).toLowerCase().split(' '),
                                        tags: String(data.tags).toLowerCase().split(','),
                                        material: String(data.material).toLowerCase().split(','),
                                        category: String(data.category).toLowerCase(),
                                        date: Timestamp.fromDate(new Date()),
                                    }

                                    imgUrls[0]?dataArr.img1=imgUrls[0]:''
                                    imgUrls[1]?dataArr.img2=imgUrls[1]:''
                                    imgUrls[2]?dataArr.img3=imgUrls[2]:''
                                    imgUrls[3]?dataArr.img4=imgUrls[3]:''

                                    try {
                                        generateId('products')
                                        .then((generatedId) => {
                                            dataArr = {...dataArr, 
                                                        id: generatedId}
                                        })
                                        .then(() => {
                                            const docRef = db.collection('products').doc();
                                            docRef.set(dataArr);
                                            // Sweet Alert Pop up :P SUCCESS
                                            toast.success("Post Uploaded Successfully!", {
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
                                            props.clearFileList();
                                            
                                            // Re-Fetch Data
                                            setTimeout(()=>{
                                                //Re-fetch Data
                                                props.fetchData()
                                            }, 1000)
    
                                            props.closeAddBox()
                                        })

                                    } catch (error) {
                                        toast.error("An Error Has Occurred While Uploading The Post!", {
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
                            });
                        }
                        );
                }).catch((error)=>{
                    // console.log(error)
                    // Sweet Alert Pop up :( ERROR
                    toast.error("An Error Has Occurred While Uploading The Post!", {
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


    useEffect(() => {
        props.clearFileList()
    }, [])

    return ( 
        <div className={styles.card}>
            <h2>Create New Post</h2>
            <hr/>
            { data && <form onSubmit={handleSubmit}>
                { loading && <div className={styles.loadingOverlay}></div>}
                <label>Informations</label>
                    <input name='title' placeholder='Title' value={data.title} onChange={handleChange}/>
                    <input name='category' placeholder='Category' value={data.category} onChange={handleChange}/>
                    <textarea name='description' placeholder='Description' rows='6' value={data.description} onChange={handleChange}/>
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
                <DropFileInput fileList={props.fileList} setFileList={props.setFileListHandler} onFileChange={(files) => setFileListHandler(files)} />
                <hr/>
                <button type='submit'>
                    <MdUpload/>
                    <span>Upload</span>
                </button>
            </form>}
        </div>
     );
}
 
export default AddPost;