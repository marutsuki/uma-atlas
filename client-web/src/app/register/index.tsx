import type { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { login } from "../../store/slices/auth.slice";
import { useNavigate } from "react-router";

const loginInputSchema = z.object({
    username: z.string().min(3, "Required"),
    email: z.string().min(3, "Required"),
    password: z.string().min(4, "Required"),
});

const RegisterPage: FC = () => {
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
            .then(() => {
                navigate("/");
            })
            .catch((error) => {
                // TODO: better error handling
                console.error(error);
            });
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-4 w-64 max-w-md p-8 bg-[rgba(255,255,255,0.2)] backdrop-blur-2xl rounded-lg shadow"
            >
                <img
                    src="/uma-atlas-logo.png"
                    alt="Logo"
                    className="mb-4 h-32 w-32 place-self-center"
                />

                <div>
                    {errors.username && (
                        <small className="text-error-fg">
                            {errors.username.message}
                        </small>
                    )}
                    <input
                        className="p-2 border rounded text-primary-fg border-border"
                        type="text"
                        placeholder="Username"
                        {...register("username")}
                    />
                </div>

                <div>
                    {errors.email && (
                        <small className="text-error-fg">
                            {errors.email.message}
                        </small>
                    )}
                    <input
                        className="p-2 border rounded text-primary-fg border-border"
                        type="text"
                        placeholder="Email"
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
                    className="p-2 bg-primary text-primary-fg rounded cursor-pointer bg-primary-bg hover:bg-primary-dark"
                    type="submit"
                    value="Register"
                />
            </form>
        </div>
    );
};

export default RegisterPage;