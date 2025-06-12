import NavBar from "@/components/navigation/NavBar";
import { Outlet } from "react-router";

const WorkSpace = () => {
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default WorkSpace;