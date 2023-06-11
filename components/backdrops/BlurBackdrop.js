import styles from './style.module.scss'

const BlurBackdrop = (props) => {
    const closeBackdrop = ()=>{
        props.onClick ? props.handleClick() : null
    }

    return ( 
    <div>
        <div className={styles.content}>{props.Children}</div>
        <div className={styles.blurBackdrop} onClick={closeBackdrop}></div>
    </div>
    );
}
 
export default BlurBackdrop;