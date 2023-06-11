import { AiFillEye } from 'react-icons/ai';
import styles from '../style.module.scss'
import { RiPencilFill } from 'react-icons/ri';
import { MdDelete } from 'react-icons/md';
import Link from 'next/link';

const ProductCard = (props) => {
    return ( 
        <div className={styles.post}>
            <div className={styles.sec1}>
                <div className={styles.img} style={{backgroundImage:`url(${props.image})`}}></div>
                <p>{props.title}</p>
            </div>
            <div className={styles.sec2}>
                <Link href={`/premade/${props.id}`} rel="noopener noreferrer" target="_blank"><div className={styles.button} id={styles.view}><AiFillEye/></div></Link>
                <div className={styles.button} id={styles.edit} onClick={()=>props.handleEditPost(props.id)}><RiPencilFill/></div>
                <div className={styles.button} id={styles.delete} onClick={()=>props.handleDeletePost(props.id)}><MdDelete/></div>
            </div>
        </div>
     );
}
 
export default ProductCard;