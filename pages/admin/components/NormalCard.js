import { AiFillEye } from 'react-icons/ai';
import styles from '../style.module.scss'
import { BsCheckLg } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { deleteDocumentById, getImageOf, updateDocumentByID } from '@/components/functions';
import { db } from '@/components/firebase';
import { toast } from 'react-toastify';


const NormalCard = (props) => {
    const [image, setImage] = useState('')

    const handleComplete = () => {
        try {
            if(props.for=="orders"){
                updateDocumentByID('orders', 'id', props.id, {...props.data, completed: 1})
            }
            if(props.for=="restore"){
                updateDocumentByID('restore', 'id', props.id, {...props.data, completed: 1})
            }
            if(props.for=="build"){
                updateDocumentByID('build', 'id', props.id, {...props.data, completed: 1})
            }

            toast.info("Element Moved to Completed!", {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            setTimeout(()=>{
                props.flushData()
                props.fetchData()
            }, 800)

        } catch(err) {
            toast.error("An Error Has Occurred, please try again!", {
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

    const handleRemove = () => {
        try {
            if(props.for=="orders"){
                deleteDocumentById('orders', 'id', props.id)
            }
            if(props.for=="restore"){
                deleteDocumentById('restore', 'id', props.id)
            }
            if(props.for=="build"){
                deleteDocumentById('build', 'id', props.id)
            }

            toast.info("Element Removed!", {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

            setTimeout(()=>{
                props.flushData()
                props.fetchData()
            }, 800)

        } catch(err) {
            toast.error("An Error Has Occurred, please try again!", {
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

    useEffect(()=>{
        if(props.for=='orders'){
            let arr = []
            db.collection('products')
            .where('id', '==', props.productId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((e) => {
                arr.push(e.data())
              })
            })
            .then(() => {
              arr.length>0?setImage(arr[0].img1):''
            })
        }
    }, [])


    return ( 
        <div className={styles.post}>
            <div className={styles.sec1}>
                {props.for!='build' && props.for!='restore' && <div className={styles.img} style={{backgroundImage:`url(${image})`}}></div>}
                {props.for=='restore' && <div className={styles.img} style={{backgroundImage:`url(${props.data.img1})`}}></div>}
                <div className={styles.info}>
                    <p>{props.title}</p>
                    <span>{props.description}</span>
                </div>
            </div>
            <div className={styles.sec2}>
            <div className={styles.button} id={styles.view} onClick={()=>{props.handleShowCard(props.id)}}><AiFillEye/></div>
                <div className={styles.button} id={styles.check} onClick={handleComplete}><BsCheckLg/></div>
                <div className={styles.button} id={styles.delete} onClick={handleRemove}><IoClose/></div>
            </div>
        </div>
     );
}
 
export default NormalCard;