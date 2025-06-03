import NavBar from "@/components/NavBar";
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