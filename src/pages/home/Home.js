import AuthHome from "./AuthHome";
import GuestHome from "./GuestHome";

function Home() {

    const token = localStorage.getItem("token");

    if (token) {
        return <AuthHome />;
    }

    return <GuestHome />;
}

export default Home;