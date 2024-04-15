import { Link } from 'react-router-dom';

export default function Navigation(){
    return(
        <div className='navigation-panel'>
           <Link to="/login"><button>Login</button></Link> 
           <Link to="/registration"><button>Registration</button></Link> 
           <Link to="/"><button>Main</button></Link> 
           <Link to="/profile"><button>Profile</button></Link> 
           <Link to="/maketest"><button>make test</button></Link> 
        </div>
    );
}