import PropTypes from 'prop-types';
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next';
import { BiImages } from 'react-icons/bi'
import { RxCross2 } from 'react-icons/rx'
import { useRef, useState } from 'react';
import imageIcon from '@/public/images/imageIcon.png'

const DropFileInput = (props) => {
    const { t } = useTranslation()
    const wrapperRef = useRef(null)

    const fileList = props.fileList
    const setFileList = props.setFileList

    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/heic', 'image/heif']

    const onDragEnter = () => wrapperRef.current.classList.add(styles.dragover)
    const onDragLeave = () => wrapperRef.current.classList.remove(styles.dragover)
    const onDrop = () => wrapperRef.current.classList.remove(styles.dragover)
    const fileRemove = (file) => {
        const updatedList = [...fileList]
        updatedList.splice(fileList.indexOf(file), 1)
        setFileList(updatedList)

    }
    const onFileDrop = (e) => {
        const newFile = e.target.files[0];
        if (newFile) {
            //Processing new uploaded file
            if (fileList.length<4){
                if (allowedTypes.includes(newFile.type)){
                    if (newFile.size<3500000){
                        const updatedList = [...fileList, newFile]
                        setFileList(updatedList)
                
                    } else {
                        alert("Image is too large!")
                    }
                } else {
                    alert("File Type is not supported!")
                }
            } else {
                alert("You can upload up to 4 images only!")
            }
        }
    }


    return ( 
        <>
            <div ref={wrapperRef} 
                className={styles.UploaderContainer}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                >
                <div className={styles.uploader}>
                    <BiImages />
                    <p>{t('restore-images-drag')}</p>
                    <span>({t('restore-images-drag-max')})</span>
                    <span>(png, jpg, gif, heic, heif)</span>
                </div>
                <input type='file' value="" onChange={onFileDrop} />
            </div>
            {
                fileList.length > 0 ? (
                    <div className={styles.preview}>
                        <h2 className={styles.subTitle}>{t('restore-files-text')}</h2>
                        { fileList.map((item, index) => (
                         <div className={styles.file}>
                            <div className={styles.sec1}>
                                <div className={styles.img} style={{backgroundImage:`url(${imageIcon.src})`}}></div>
                                <div className={styles.info}>
                                    <p>{item.name}</p>
                                    <span>{Number(item.size)<500000?`${(Number(item.size)/8000).toFixed(2)}${t('kb')}`:`${(Number(item.size)/1048576).toFixed(2)}${t('mb')}`}</span>
                                </div>
                            </div>
                            <div className={styles.sec2}>
                                <RxCross2 onClick={()=>{fileRemove(item)}} />
                            </div>
                        </div>
                        ))
                        }
                    </div> 
                )
                : null
            }
        </>
    );
}

DropFileInput.propTypes = {
    onFileChange: PropTypes.func
}
 
export default DropFileInput;