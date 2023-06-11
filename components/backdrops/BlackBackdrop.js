import styles from './style.module.scss'

const BlackBackdrop = (props) => {
    const closeBackdrop = ()=>{
        props.onClick ? props.handleClick() : null
    }

    return ( 
    <div>
        <div className={styles.content}>{props.Children}</div>
        <div className={styles.blackBackdrop} onClick={closeBackdrop}></div>
    </div>
    );
}
 
export default BlackBackdrop;