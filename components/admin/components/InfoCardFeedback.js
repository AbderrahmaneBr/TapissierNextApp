import SimpleLoading from '@/components/loadings/SimpleLoading';
import styles from '@/pages/admin/style.module.scss'
import { capitalizeFirstLetter } from '@/components/functions';

const InfoCardFeedback = (props) => {

    return ( 
        <div className={styles.card}>
            <h2>Feedback Details</h2>
            <hr/>
            <form onSubmit={(e) => {e.preventDefault()}}>
                <label>Username</label>
                <input value={capitalizeFirstLetter(props.data.username)} disabled='true' />
                <label>Message</label>
                <textarea value={capitalizeFirstLetter(props.data.message)} disabled='true' rows={7}/>
                <label>E-mail</label>
                <input value={capitalizeFirstLetter(props.data.email)} disabled='true' />
                <label>Date</label>
                <input value={props.data.date} disabled='true' />
            </form> 
           
        </div>
     );
}
 
export default InfoCardFeedback;