import styles from '@/pages/restore/style.module.scss'
import { RxCaretDown } from 'react-icons/rx'
import { useEffect, useRef, useState } from 'react';
import { Field } from 'formik';

const SelectBoxInput = (props) => {
    const [isSelected, setIsSelected] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const [activeOption, setActiveOption] = useState(props.options[0])
    const inputRef = useRef(null)

    const { setUnits } = props

    return ( 
        <div className={styles.selectBoxInput} id={isFocused?styles.focused:''} onFocus={()=>setIsFocused(true)} onBlur={()=>setIsFocused(false)}>
            <Field ref={inputRef} name={props.name} placeholder={props.placeholder} />
            <div className={styles.dropBox}>
                <div className={styles.active} onClick={()=>{setIsSelected((prev)=>!prev)}}>
                    <span>{activeOption}</span>
                    <RxCaretDown style={{transform: isSelected?'rotate(180deg) translateY(-1px)':'rotate(0deg)'}} />
                </div>
                { isSelected && <div className={styles.options}>
                    {props.options && props.options.map((e, i)=>(
                        <span onClick={()=>{                        
                            setActiveOption(prev=>e)
                            setIsSelected((prev)=>!prev)
                            setUnits(e, props.id) //Updating Global units
                        }
                    }>{e}</span>
                    ))
                    }
                </div>}
            </div>
        </div>
     );
}
 
export default SelectBoxInput;