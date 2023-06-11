import { useEffect, useState } from 'react';
import styles from '@/pages/admin/style.module.scss'
import { db } from '@/components/firebase';
import { capitalizeFirstLetter } from '@/components/functions';
import SimpleLoading from '@/components/loadings/SimpleLoading';
import Link from 'next/link';
import { HiOutlineExternalLink } from 'react-icons/hi';

const InfoCard = (props) => {
    const [orderData, setOrderData] = useState()

    useEffect(() => {
        db.collection('orders')
        .where('id', '==', props.target)
        .get()
        .then((querySnapchot) => {
            let arr = []
            querySnapchot.forEach(e => {
                arr.push(e.data())
            })
            setOrderData(prev=>arr[0])
        })
    }, [])

    return ( 
        <div className={styles.card}>
            <h2>Order Details</h2>
            <hr/>
            { orderData ? 
            <form onSubmit={(e) => {e.preventDefault()}}>
                <label>Status</label>
                <input value={orderData.completed?'Completed':'Pending'} id={orderData.completed?styles.completed:styles.pending} disabled='true' />
                <hr/>
                <label>Username</label>
                <input value={capitalizeFirstLetter(orderData.username)} disabled='true' />
                <label>Message</label>
                <textarea value={capitalizeFirstLetter(orderData.message)} disabled='true' rows={7}/>
                <label>E-mail</label>
                <input value={capitalizeFirstLetter(orderData.email)} disabled='true' />
                <label>Phone Number</label>
                <input value={orderData.phonenumber} disabled='true' />
                <label>Date</label>
                <input value={(orderData.date.toDate().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'))} disabled='true' />
                <hr/>
                <Link className={styles.button} href={`/premade/${orderData.productId}`} rel="noopener noreferrer" target="_blank">
                    <HiOutlineExternalLink />
                    <span>View Post</span>
                </Link>
            </form> 
            : 
            <SimpleLoading color='admin' size='small' />
            }
           
        </div>
     );
}
 
export default InfoCard;