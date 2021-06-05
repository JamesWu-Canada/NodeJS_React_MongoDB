import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// function Home() {
//   const history = useHistory();
//   return (
//     <div className="Home">
//       <div className="title">
//         <div>Student Painting</div>
//         <button
//           className="home_login_button"
//           onClick={() => history.push("/login")}
//         >
//           Login
//         </button>
//         <button
//           className="home_orderdisplay_button"
//           onClick={() => history.push("/display")}
//         >
//           Order Display
//         </button>
//         <button
//           className="home_neworder_button"
//           onClick={() => history.push("/neworder")}
//         >
//           New order
//         </button>
//       </div>
//       <div className="introduction">
//         Summer painting service run by students
//       </div>
//     </div>
//   );
// }

// export default Home;

class Home extends React.Component {
  constructor(props) {
    super(props);
    // this.state = { date: new Date() };
  }

  render() {
    return (
      <div className="Home">
        <div className="title">
          <div>Student Painting</div>

          <Link to={"/login"}>
            <div className="home_login_button">Login</div>
          </Link>

          <Link to={"/display"}>
            <div className="home_orderdisplay_button">Order Display</div>
          </Link>

          <Link to={"/neworder"}>
            <div className="home_neworder_button">New order</div>
          </Link>
          <Link to={"/contact"}>
            <div className="home_contact_button">Contact</div>
          </Link>
        </div>
        <div className="introduction">
          Summer painting service run by students
        </div>
      </div>
    );
  }
}

export default Home;
