import SimpleLoading from '@/components/loadings/SimpleLoading';
import styles from '@/pages/admin/style.module.scss'
import { capitalizeFirstLetter } from '@/components/functions';
import { useState } from 'react';

const InfoCardFeedback = (props) => {
    const [data, setData] = useState(props.data)

    return ( 
        <div className={styles.card}>
            <h2>Feedback Details</h2>
            <hr/>
            {data ? <form onSubmit={(e) => {e.preventDefault()}}>
                <label>Username</label>
                <input value={capitalizeFirstLetter(data.username)} disabled='true' />
                <label>Message</label>
                <textarea value={capitalizeFirstLetter(data.message)} disabled='true' rows={7}/>
                <label>E-mail</label>
                <input value={capitalizeFirstLetter(data.email)} disabled='true' />
                <label>Date</label>
                <input value={data.date} disabled='true' />
            </form>
            : '' }
           
        </div>
     );
}
 
export default InfoCardFeedback;