import { useEffect, useState } from 'react';
import styles from '../style.module.scss'
import { db } from '@/components/firebase';
import { capitalizeFirstLetter } from '@/components/functions';
import SimpleLoading from '@/components/loadings/SimpleLoading';
import Link from 'next/link';
import { HiOutlineExternalLink } from 'react-icons/hi';

const InfoCardBuild = (props) => {
    const [buildData, setBuildData] = useState()

    useEffect(() => {
        db.collection('build')
        .where('id', '==', props.target)
        .get()
        .then((querySnapchot) => {
            let arr = []
            querySnapchot.forEach(e => {
                arr.push(e.data())
            })
            setBuildData(prev=>arr[0])
        })
    }, [])

    return ( 
        <div className={styles.card}>
            <h2>Object To Build Details</h2>
            <hr/>
            { buildData ? 
            <form onSubmit={(e) => {e.preventDefault()}}>
                <label>Status</label>
                <input value={buildData.completed?'Completed':'Pending'} id={buildData.completed?styles.completed:styles.pending} disabled='true' />
                <hr/>
                <label>Context</label>
                <input value={buildData.context} disabled='true' />
                <label>Description</label>
                <textarea value={capitalizeFirstLetter(buildData.description)} disabled='true' rows={7}/>
                <label>Length</label>
                <input value={buildData.length} disabled='true' />
                <label>Width</label>
                <input value={buildData.width} disabled='true' />
                <label>Height</label>
                <input value={buildData.height} disabled='true' />
                <label>Weight</label>
                <input value={buildData.weight} disabled='true' />
                <label>Volume</label>
                <input value={buildData.volume} disabled='true' />
                <label>Diameter</label>
                <input value={buildData.diameter} disabled='true' />
                <label>Thickness</label>
                <input value={buildData.thickness} disabled='true' />
                <label>Material #1</label>
                <input value={buildData.material1} disabled='true' />
                <label>Material #2</label>
                <input value={buildData.material2} disabled='true' />
                <label>Material #3</label>
                <input value={buildData.material3} disabled='true' />
                <label>Material #4</label>
                <input value={buildData.material4} disabled='true' />
                <label>Detail #1</label>
                <input value={buildData.detail1} disabled='true' />
                <label>Detail #2</label>
                <input value={buildData.detail2} disabled='true' />
                <label>Detail #3</label>
                <input value={buildData.detail3} disabled='true' />
                <label>Detail #4</label>
                <input value={buildData.detail4} disabled='true' />
                <label>Budget</label>
                <input value={buildData.budget} disabled='true' />
                <label>Username</label>
                <input value={capitalizeFirstLetter(buildData.username)} disabled='true' />
                <label>E-mail</label>
                <input value={capitalizeFirstLetter(buildData.email)} disabled='true' />
                <label>Phone Number</label>
                <input value={buildData.phonenumber} disabled='true' />
                <label>Date</label>
                <input value={(buildData.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'))} disabled='true' />
            </form> 
            : 
            <SimpleLoading color='admin' size='small' />
            }
           
        </div>
     );
}
 
export default InfoCardBuild;