import { BsFillQuestionCircleFill } from "react-icons/bs";
import { IoIosArrowUp } from "react-icons/io";
import styles from '@/pages/faq/style.module.scss'
import { useState } from "react";

const FaqCard = (props) => {
    const [collapsed, setCollapsed] = useState(true)

    return ( 
        <div className={styles.card} onClick={()=>{setCollapsed(prev=>!prev)}}>
            <BsFillQuestionCircleFill/>
            <div id={collapsed?styles.active:''} className={styles.content}>
                <div className={styles.questionContainer}>
                    <h4>{ props.question }</h4>
                </div>
                <h5>{ props.answer }</h5>
            </div>
            <IoIosArrowUp style={{rotate:collapsed?'180deg':'0deg'}} className={styles.collapseIcon} />
        </div>
     );
}
 
export default FaqCard;