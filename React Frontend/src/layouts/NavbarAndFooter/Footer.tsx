import { Link, NavLink } from "react-router-dom";

export const Footer = () => {
    return(
         <div className="main-color">
            <footer className="container d-flex flex-wrap justify-content-between align-items-center py-5 main-color">
                <p className="col-md-4 mb-0 text-white">© Example Library App</p>
                <ul className="nav navbar-dark col-md-4 justify-content-end">
                    <li className="nav-items">
                        <Link className="nav-link px-2 text-white" to='/home'>
                            Home
                        </Link>

                    </li>
                    <li className="nav-items">
                        <Link className="nav-link px-2 text-white" to='/search'>
                            Search Books
                        </Link>

                    </li>

                </ul>

            </footer>

         </div>
    );
}