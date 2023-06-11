import { FaLock, FaUser } from 'react-icons/fa';
import styles from './style.module.scss'
import { useEffect, useState } from 'react';
import { auth } from '@/components/firebase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const AdminLogin = () => {

    const router = useRouter();

    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [usernameFocus, setUsernameFocus] = useState(false)
    const [passwordFocus, setPasswordFocus] = useState(false)

    const handleChange = (e) => {
        if (e.target.name == 'username'){
            setUsername(prev=>e.target.value)
        } else if (e.target.name == 'password'){
            setPassword(prev=>e.target.value)
        }
    }

    const checkUserCredentials = (email, password) => {
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Email and password are correct
            const user = userCredential.user;
            router.push('/admin/panel');
            // Perform any further actions
          })
          .catch((error) => {
            // Handle incorrect credentials or other sign-in errors
            const errorCode = error.code;
            const errorMessage = error.message;
            toast.error('Wrong Informations!', {
                position: "bottom-right",
                autoClose: 7000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
          });
      };

    const handleSubmit = (e) => {
        e.preventDefault()
        checkUserCredentials(username, password);
    }
    
    

    useEffect(()=>{
        // Check user auth
        auth.onAuthStateChanged((user) => {
            if (user) {
                // User is signed in
                //Clear user session
                router.push('/admin/panel');
            } else {
              // User is signed out
              
            }
        });

          
    }, [])

    return ( 
    <div className={styles.all}>
    <div className={styles.loginContainer}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <div className={styles.field} id={usernameFocus?styles.focus:''}>
                <FaUser id={usernameFocus?styles.colored:''}/>
                <input value={username} onFocus={()=>setUsernameFocus(prev=>true)} onBlur={()=>{setUsernameFocus(prev=>false)}} name='username' onChange={handleChange} placeholder='Username' />
            </div>
            <div className={styles.field} id={passwordFocus?styles.focus:''}>
                <FaLock id={passwordFocus?styles.colored:''}/>
                <input value={password} onFocus={()=>setPasswordFocus(prev=>true)} onBlur={()=>{setPasswordFocus(prev=>false)}} name='password' onChange={handleChange} placeholder='Password' type='password' />
            </div>
            <button>LOGIN</button>
        </form>
    </div> 
    </div>
    );
}
 
export default AdminLogin;