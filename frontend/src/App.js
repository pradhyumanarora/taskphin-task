import './App.css';
import Navbar from './components/Navbar';
import CandidateForm from './components/CandidateForm';
import ShowCandidates from './pages/ShowCandidates';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';


const router = createBrowserRouter([
  {
    path: "/",
    element: <ShowCandidates />,
  },
  {
    path: "add",
    element: <CandidateForm />,
  }
]);


function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
