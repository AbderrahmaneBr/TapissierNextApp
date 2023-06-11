import styles from '@/pages/restore/style.module.scss'
import { Field } from 'formik';
import { useState } from 'react';

const MultipleInput = (props) => {
    const [option1, setOption1] = useState(["", true])
    const [option2, setOption2] = useState(["", false])
    const [option3, setOption3] = useState(["", false])
    const [option4, setOption4] = useState(["", false])

    const addOption = () => {
        if(option1[1] && !option2[1]){
            setOption2(prev=>[prev[0], true])
        } else if (option1[1] && option2[1] && !option3[1]){
            setOption3(prev=>[prev[0], true])
        } else if (option1[1] && option2[1] && option3[1] && !option4[1]){
            setOption4(prev=>[prev[0], true])
        }
    }

    const removeOption = () => {
        if(option1[1] && option2[1] && !option3[1] && !option4[1]){
            setOption2(prev=>[prev[0], false])
        } else if (option1[1] && option2[1] && option3[1] && !option4[1]){
            setOption3(prev=>[prev[0], false])
        } else if (option1[1] && option2[1] && option3[1] && option4[1]){
            setOption4(prev=>[prev[0], false])
        }
    }


    return ( 
        <>
            { option1[1] && <Field name={`${props.name}1`} placeholder={`${props.ph} #1`} />}
            { option2[1] && <Field name={`${props.name}2`} placeholder={`${props.ph} #2`} />}
            { option3[1] && <Field name={`${props.name}3`} placeholder={`${props.ph} #3`} />}
            { option4[1] && <Field name={`${props.name}4`} placeholder={`${props.ph} #4`} />}
            { !option4[1] && <span className={styles.optHypertext} onClick={()=>addOption()}>+ {props.add}</span>}
            { option2[1] && <span className={styles.optHypertext} onClick={()=>removeOption()}>- {props.remove}</span>}
        </>
     );
}
 
export default MultipleInput;