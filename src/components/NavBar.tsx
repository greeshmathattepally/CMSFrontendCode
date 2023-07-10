
import {Link, useMatch, useResolvedPath} from "react-router-dom";

function NavBar() {
 return (
   <nav className="nav">
      <Link to="/" className="title">Marshal Dashboard</Link>
      <ul>
        <li>
          <Link to="/faq">FAQs</Link>
        </li>
        <li>
          <Link to="/helpArticle">Help Articles</Link>
        </li>
      </ul>
   </nav>
 )
}
interface Props{
  to:string;
  children: React.ReactNode;
}

export default NavBar;