import { useEffect, useState } from 'react';
import styles from '@/pages/admin/style.module.scss'
import { db } from '@/components/firebase';
import { capitalizeFirstLetter } from '@/components/functions';
import SimpleLoading from '@/components/loadings/SimpleLoading';
import Link from 'next/link';
import { HiOutlineExternalLink } from 'react-icons/hi';

const InfoCardRestore = (props) => {
    const [restoreData, setRestoreData] = useState()

    useEffect(() => {
        db.collection('restore')
        .where('id', '==', props.target)
        .get()
        .then((querySnapchot) => {
            let arr = []
            querySnapchot.forEach(e => {
                arr.push(e.data())
            })
            setRestoreData(prev=>arr[0])
        })
    }, [])

    return ( 
        <div className={styles.card}>
            <h2>Object To Restore Details</h2>
            <hr/>
            { restoreData ? 
            <form onSubmit={(e) => {e.preventDefault()}}>
                <label>Status</label>
                <input value={restoreData.completed?'Completed':'Pending'} id={restoreData.completed?styles.completed:styles.pending} disabled='true' />
                <hr/>
                <label>Images</label>
                <div className={styles.imageContainer}>
                    {restoreData.img1 ?
                    <Link href={restoreData.img1} rel="noopener noreferrer" target="_blank">
                    <div className={styles.img} style={{backgroundImage: `url(${restoreData.img1})`}}></div>
                    </Link> : 
                    <div className={styles.img}></div>
                    }
                    {restoreData.img2 && 
                    <Link href={restoreData.img2} rel="noopener noreferrer" target="_blank">
                    <div className={styles.img} style={{backgroundImage: `url(${restoreData.img2})`}}></div>
                    </Link>
                    }
                    {restoreData.img3 && 
                    <Link href={restoreData.img3} rel="noopener noreferrer" target="_blank">
                    <div className={styles.img} style={{backgroundImage: `url(${restoreData.img3})`}}></div>
                    </Link>
                    }
                    {restoreData.img4 && 
                    <Link href={restoreData.img4} rel="noopener noreferrer" target="_blank">
                    <div className={styles.img} style={{backgroundImage: `url(${restoreData.img4})`}}></div>
                    </Link>
                    }
                </div>
                <hr/>
                <label>Length</label>
                <input value={restoreData.length} disabled='true' />
                <label>Width</label>
                <input value={restoreData.width} disabled='true' />
                <label>Height</label>
                <input value={restoreData.height} disabled='true' />
                <label>Weight</label>
                <input value={restoreData.weight} disabled='true' />
                <label>Volume</label>
                <input value={restoreData.volume} disabled='true' />
                <label>Diameter</label>
                <input value={restoreData.diameter} disabled='true' />
                <label>Thickness</label>
                <input value={restoreData.thickness} disabled='true' />
                <label>Budget</label>
                <input value={restoreData.budget} disabled='true' />
                <label>Description</label>
                <textarea value={capitalizeFirstLetter(restoreData.description)} disabled='true' rows={7}/>
                <label>Username</label>
                <input value={capitalizeFirstLetter(restoreData.username)} disabled='true' />
                <label>E-mail</label>
                <input value={capitalizeFirstLetter(restoreData.email)} disabled='true' />
                <label>Phone Number</label>
                <input value={restoreData.phonenumber} disabled='true' />
                <label>Date</label>
                <input value={(restoreData.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'))} disabled='true' />
            </form> 
            : 
            <SimpleLoading color='admin' size='small' />
            }
           
        </div>
     );
}
 
export default InfoCardRestore;