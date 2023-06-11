import styles from './styles.module.scss'

const SimpleLoading = (props) => {
    return ( 
        <div id={props.color=='black'?`${styles.black}`:(props.color=='admin'?`${styles.admin}`:'')} className={`${styles.ldsRing} ${props.size=='small'?styles.small:''}`}><div></div><div></div><div></div><div></div></div>
     );
}
 
export default SimpleLoading;