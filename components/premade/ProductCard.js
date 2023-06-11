import styles from '../../pages/premade/style.module.scss'
import Link from 'next/link';
import noImage from '@/public/images/no-image.jpg'


const ProductCard = (props) => {
    

    return ( 
        <Link href={`/premade/${props.id}`}>
        <div className={styles.product}>
            <div className={styles.imgContainer}>
                <img className={styles.img} src={props.img?props.img:noImage.src} />
            </div>
            <div className={styles.info}>
                <h1>{props.title}</h1>
                <p>{props.desc}</p>
            </div>
        </div>
        </Link>
     );
}
 
export default ProductCard;