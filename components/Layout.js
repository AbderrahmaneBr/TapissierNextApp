import Navbar from "./Navbar";
import Footer from "./Footer";
import { useRouter } from "next/router";

const Layout = ({ children }) => {
    const router = useRouter()
    const exceptionalPath = ['/admin', '/admin/panel']
    const shouldDisplayLayout = !exceptionalPath.includes(router.pathname);

    if (!shouldDisplayLayout) {
        return <div>{children}</div>;
    }
    

    return ( 
        <>
            <Navbar/>
                { children }
            <Footer/>
        </>
     );
}
 
export default Layout;