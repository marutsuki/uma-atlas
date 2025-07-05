import type { FC } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAppDispatch } from "../../store";
import { Link, useNavigate } from "react-router";
import { register } from "@/store/slices/auth.slice";

const registerInputSchema = z.object({
    username: z.string().min(3, "Required"),
    email: z.string().min(3, "Required"),
    password: z.string().min(4, "Required"),
});

const RegisterPage: FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        register: zRegister,
        handleSubmit,
        formState: { errors },
    } = useForm<z.infer<typeof registerInputSchema>>({
        resolver: zodResolver(registerInputSchema),
    });

    const onSubmit = (data: z.infer<typeof registerInputSchema>) => {
        dispatch(register(data))
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
                className="flex flex-col gap-4 w-64 max-w-md p-8 bg-[rgba(255,255,255,0.2)] backdrop-blur-2xl rounded-lg shadow"
            >
                <h1 className="text-center text-xl my-4">Account Creation</h1>
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
                        {...zRegister("username")}
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
                        {...zRegister("email")}
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
                        {...zRegister("password")}
                    />
                </div>

                <input
                    className="p-2 bg-primary text-primary-fg rounded cursor-pointer bg-primary-bg hover:bg-primary-dark"
                    type="submit"
                    value="Register"
                />
                <div>
                    Have an account already? <Link className="underline" to="/auth/register">Login</Link>
                </div>
            </form>
        </div>
    );
};

export default RegisterPage;