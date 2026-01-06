import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h2>Welcome to JobApp 🚀</h2>
      <p>Select a section:</p>
      <ul>
        <li><Link to="/companies">Companies</Link></li>
        <li><Link to="/candidates">Candidates</Link></li>
        <li><Link to="/interviews">Interviews</Link></li>
        <li><Link to="/jobs">Jobs</Link></li>   
        <li><Link to="/applications">Applications</Link></li> 
        <li><Link to="/positions">Positions</Link></li>
      </ul>
    </div>
  );
}

export default HomePage;