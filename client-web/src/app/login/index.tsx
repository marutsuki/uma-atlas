import type { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { login } from "../../store/slices/auth.slice";
import { Link, useNavigate } from "react-router";

const loginInputSchema = z.object({
    email: z.string().min(3, "Required"),
    password: z.string().min(4, "Required"),
});

const LoginPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof loginInputSchema>>({
        resolver: zodResolver(loginInputSchema),
    });

    const onSubmit = (data: z.infer<typeof loginInputSchema>) => {
        dispatch(login(data))
            .then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    navigate("/");
                }
            })
            .catch((error) => {
                // TODO: better error handling
                console.error(error);
            });
    };

    return (
        <div className="flex h-screen w-screen items-center justify-around">
            <img
                src="/uma-atlas-logo.png"
                alt="Logo"
                className="h-96 place-self-center"
            />

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-64 max-w-md p-8 bg-[rgba(255,255,255,0.2)] backdrop-blur-2xl rounded-lg shadow-lg"
            >
                <div>
                    {errors.email && (
                        <small className="text-error-fg">
                            {errors.email.message}
                        </small>
                    )}
                    <input
                        className="p-2 border rounded text-primary-fg border-border"
                        type="text"
                        placeholder="Email or Username"
                        {...register("email")}
                    />
                </div>

                <div>
                    {errors.password && (
                        <small className="text-error-fg">{errors.password.message}</small>
                    )}
                    <input
                        className="p-2 border rounded text-primary-fg border-border"
                        type="password"
                        placeholder="Password"
                        {...register("password")}
                    />
                </div>

                <input
                    className="p-2 bg-primary-bg rounded cursor-pointer active:bg-primary-bg-dark duration-100"
                    type="submit"
                    value="Login"
                />
                <div>
                    Don't have an account? <Link className="underline" to="/auth/register">Register</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;