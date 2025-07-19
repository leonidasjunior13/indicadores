import { ToastContainer, Bounce } from "react-toastify";
import { UserContextProvider } from "./context/userContext";
import MyRoutes from "./routes";

import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <UserContextProvider>
      <MyRoutes />
      <ToastContainer
        position='top-left'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
        transition={Bounce}
      />
    </UserContextProvider>
  );
}

export default App;
