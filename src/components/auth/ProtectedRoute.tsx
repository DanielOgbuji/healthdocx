import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { Navigate } from "react-router";
import { type ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = useSelector((state: RootState) => state.auth.token);
    return token ? children : <Navigate to="/sign-in" />;
}
