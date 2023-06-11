import { useTranslation } from 'react-i18next'
import styles from './style.module.scss'
import { FiSearch } from 'react-icons/fi'
import { MdCheckBoxOutlineBlank, MdCheckBox, MdOutlineSearchOff } from 'react-icons/md'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/premade/ProductCard'
import { addData, capitalizeFirstLetter } from '@/components/functions'
import { db } from '@/components/firebase'
import SimpleLoading from '@/components/loadings/SimpleLoading'
import { BiErrorCircle } from 'react-icons/bi'
import { useRouter } from 'next/router'
import { RxCaretRight } from 'react-icons/rx'
import { BsBoxes, BsHouseDoorFill } from 'react-icons/bs'


const Premade = () => {
    const { t } = useTranslation()
    const router = useRouter()

    const [search, setSearch] = useState('')
    // const [categories, setCategories] = useState({
    //     all: 1,
    //     cat1: 0,
    //     cat2: 0,
    //     cat3: 0
    // })
    // const [categoryList, setCategoryList] = useState([])
    
    const [products, setProducts] = useState([])
    const [startInd, setStartInd] = useState(0)
    const [endInd, setEndInd] = useState(12)
    const [productsSize, setProductsSize] = useState(0)
    const loadingRef = useRef(null)
    const searchRef = useRef(null)

    const [errorLoading, setErrorLoading] = useState(false)
    const [noData, setNoData] = useState(false)

    const handleSearch = (e) => {
      setSearch(e.target.value)
      // Reset Values
      // setStartInd(0)
      setEndInd(prev=>12)
      setProducts(prev=>[])

    }

    // For Search
    useEffect(() => {

        const collectionRef = db.collection('products').orderBy('date', 'desc').startAt('').limit(endInd);
        let queries = [collectionRef];
      
        // If search isn't empty
        if (search) {
          const searchLower = search.toLowerCase();
          const titleQuery = collectionRef.where('title', 'array-contains-any', searchLower.split(' '))
          const descriptionQuery = collectionRef.where('description', 'array-contains-any', searchLower.split(' '))
          const tagsQuery = collectionRef.where('tags', 'array-contains-any', searchLower.split(' '));
          const materialQuery = collectionRef.where('material', 'array-contains-any', searchLower.split(' '));
          queries = [titleQuery, descriptionQuery, tagsQuery, materialQuery];
          
        }

        Promise.all(queries.map(q => q.get()))
          .then((querySnapshots) => {
            const newProducts = [];
            const idSet = new Set();
            querySnapshots.forEach((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (!idSet.has(doc.id)) {
                  newProducts.push(data);
                  idSet.add(doc.id);
                }
              });
            });
            setProducts(newProducts);
            setProductsSize(newProducts.length)
          })
          .catch((error) => {
            // console.log(error)
            setErrorLoading(true)
            setProducts(prev=>[]);
          });
      }, [startInd, endInd, search]);

      useEffect(()=>{
        const collectionRef = db.collection('products').orderBy('date', 'desc');
        let queries = [collectionRef];
      
        // If search isn't empty
        if (search) {
          // Resetting Indices
          // setStartInd(0)
          const searchLower = search.toLowerCase();
          const titleQuery = collectionRef.where('title', 'array-contains-any', searchLower.split(' '))
          const descriptionQuery = collectionRef.where('description', 'array-contains-any', searchLower.split(' '))
          const tagsQuery = collectionRef.where('tags', 'array-contains-any', searchLower.split(' '));
          const materialQuery = collectionRef.where('material', 'array-contains-any', searchLower.split(' '));
          queries = [titleQuery, descriptionQuery, tagsQuery, materialQuery];
          // .startAt('').limit(endInd)
          
        }
        // Calculate Search Results
        Promise.all(queries.map(q => q.get()))
        .then((querySnapshots) => {
          const newProducts = [];
          const idSet = new Set();
          querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              if (!idSet.has(doc.id)) {
                newProducts.push(data);
                idSet.add(doc.id);
              }
            });
          });
          
          setProductsSize(newProducts.length)
          newProducts.length==0 ? setNoData(true) : setNoData(false)
        })
        .catch((error) => {
          setProducts(prev=>[]);
          setErrorLoading(true)
        });
      }, [search])


      // For Loading More Data
      useEffect(() => {
        // Getting Size of Products
        const collectionRef = db.collection('products');
        collectionRef.get().then((querySnapshot) => {
          const count = querySnapshot.size;
          setProductsSize(count)
          // let data = []
          // querySnapshot.forEach(e=>{
          //   data.push(e.data())
          // })
          // setProducts(prev=>data)
          count==0 ? setNoData(true) : setNoData(false)
        })
      
        const interv = setInterval(() => {
          try {
            if (loadingRef.current && window.pageYOffset >= window.pageYOffset + loadingRef.current.getBoundingClientRect().top - 1000) {
              // Increment startInd and endInd
              // setStartInd(prev => prev);
              setEndInd(prev => prev + 12);
            }
          } catch(err) {
            clearInterval(interv);
          }
        }, 2000);
        
        // Clear interval on unmount
        return () => clearInterval(interv);
      }, []);
            

    return ( 
        <>
        <ul className={styles.nav}>
              <li>
                  <BsHouseDoorFill/>
                  <Link href={'/'}>{t('home')}</Link>
              </li>
              <RxCaretRight className={styles.caret} />
              <li>
                  <BsBoxes/>
                  <Link href={'/premade'}>{t('premade')}</Link>
              </li>
          </ul>
        <main className={styles.main}>
            <div className={styles.searchContainer}>
                <input ref={searchRef} name='search' placeholder={ t('write-something') } onChange={handleSearch} />
                <FiSearch/>
            </div>
            <hr/>
            <div className={styles.content}>
                {/* <div className={styles.categories}>
                    <h1 className={styles.title}>Categories</h1>
                    <div className={styles.categoryContainer}>
                        <div className={styles.category} onClick={()=>handleCategories("all")}>
                            { categories.all ? <MdCheckBox id={styles.checked} /> : <MdCheckBoxOutlineBlank />}
                            <p>{t('all-cat')}</p>
                        </div>
                        <hr/>
                        {
                            categoryList.forEach((e) => {
                                <div className={styles.category} onClick={()=>handleCategories("cat1")}>
                                    { categories.cat1 ? <MdCheckBox id={styles.checked} /> : <MdCheckBoxOutlineBlank/>}
                                    <p>{`${e.value} (${e.count})`}</p>
                                </div>
                            })
                        }
                       
                    </div>
                </div> */}
                <div className={styles.products} style={{position: 'relative'}}>
                  { noData && <div className={styles.errorLoadingData}>
                    <MdOutlineSearchOff />
                    <p>{ t('no-product-found') }</p>
                    <button onClick={()=>{searchRef.current.value="";setSearch("");}}>{ t('show-all-button') }</button>
                  </div>}
                  { errorLoading && <div className={styles.errorLoadingData}>
                    <BiErrorCircle />
                    <p>{ t('error-loading') }</p>
                    <button onClick={()=>{router.reload()}}>{ t('reload-button') }</button>
                  </div>}
                        <div className={styles.productsContainer}>
                            { products.map((e, i)=> (
                                <ProductCard id={e.id} img={e.img1} title={capitalizeFirstLetter(e.title.join(' '))} desc={capitalizeFirstLetter(e.description.join(' '))} />
                            )) }
                            { !(endInd>=productsSize) && <div ref={loadingRef} style={{position: 'absolute', bottom: '-5em', left: '50%', transform: 'translateX(-50%)'}}>
                                <SimpleLoading size={'small'} color={'black'} />
                            </div>}
                        </div>
                        {!products.length && !errorLoading && !noData && <div className={styles.productsLoading}>
                            <div className={styles.square}></div>
                            <div className={styles.square}></div>
                            <div className={styles.square}></div>
                            <div className={styles.square}></div>
                            <div className={styles.square}></div>
                            <div className={styles.square}></div>
                        </div>}
                </div>  
            </div>
        </main>
        </>
     );
}
 
export default Premade;