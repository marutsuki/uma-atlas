import { Navigate } from "react-router";
import { me, useMaybeCurrentUser } from "../store/slices/auth.slice";
import { useEffect, useState, type FC, type ReactNode } from "react";
import { useAppDispatch } from "@/store";

export const AuthSuspense: FC<{ children: ReactNode }> = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(me()).then(() => setLoading(false));
    }, [dispatch]);

    if (loading) {
        return <>Seeing if you're logged in already</>;
    }

    return children;
};

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const user = useMaybeCurrentUser();

    if (!user) {
        console.error("Unauthorized access, redirecting to login...");
        const searchParams = new URLSearchParams();
        const redirectTo =
            searchParams.get("redirectTo") || window.location.pathname;
        const location = "/login?redirectTo=" + encodeURIComponent(redirectTo);
        return <Navigate to={location} replace />;
    }

    return <AuthSuspense>
        {children}
    </AuthSuspense>
};