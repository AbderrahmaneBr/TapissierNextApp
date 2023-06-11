import styles from '@/pages/index.module.scss'

const WorkerCard = (props) => {
    return ( 
            <div className={styles.workerCard}>
              <div className={styles.img} style={{backgroundImage:`url(${props.img})`}}></div>
              <div className={styles.info}>
                <h3>{props.name}</h3>
                <p>{props.post}</p>
              </div>
            </div>
     );
}
 
export default WorkerCard;