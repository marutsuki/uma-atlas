import { Suspense, type FC } from "react";
import { Loader } from "@/components/ui/Loader";
import store from "../store";
import { Provider } from "react-redux";
import { AuthSuspense } from "../lib/auth.component";

type Props = {
    children: React.ReactNode;
};

export const AppProvider: FC<Props> = ({ children }) => {

    return (
        <Suspense
            fallback={
                <div className="flex h-screen w-screen items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <Provider store={store}>
                <AuthSuspense>
                    {children}
                </AuthSuspense>
            </Provider>
        </Suspense>
    );
};