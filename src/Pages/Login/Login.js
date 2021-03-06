import React, { useEffect } from 'react';
import { useSendPasswordResetEmail, useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import { useForm } from "react-hook-form";
import Loading from '../Shared/Loading';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useToken from '../../Hooks/useToken';


const Login = () => {

    const navigate = useNavigate()
    const location = useLocation()
    let from = location.state?.from?.pathname || "/";

    const [signInWithGoogle, googleUser, googleLoading, googleError] = useSignInWithGoogle(auth);
    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);
    const { register, formState: { errors }, handleSubmit, getValues } = useForm();
    const [sendPasswordResetEmail, sending] = useSendPasswordResetEmail(auth);

    const token = useToken(user || googleUser)

    let signErrorMessage;

    if (loading || googleLoading) {
        return <Loading></Loading>
    }

    if (error || googleError) {
        signErrorMessage = <p className='text-red-500'>{error?.message || googleError?.message}</p>
    }



    if (token) {
        navigate(from, { replace: true });
    }


    const onSubmit = data => {
        signInWithEmailAndPassword(data.email, data.password)
    };

    const handleForgotPassword = () => {
        const email = getValues("email")
        if (!email.length || !/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email)) {
            return toast.error("Provide a valid email", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        sendPasswordResetEmail(getValues("email"))

        toast.success("Password Reset email is sent", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
        <div className='flex justify-center items-center h-screen'>
            <div className="card w-96 bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="text-center text-xl font-bold">Login</h2>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                placeholder="Your Email" className="input input-bordered w-full max-w-xs"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: 'Email is required'
                                    },
                                    pattern: {
                                        value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                                        message: 'Provide a valid email'
                                    }
                                })}
                            />
                            <label className="label">
                                {errors.email?.type === 'required' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}
                                {errors.email?.type === 'pattern' && <span className="label-text-alt text-red-500">{errors.email.message}</span>}

                            </label>
                        </div>

                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Your Password" className="input input-bordered w-full max-w-xs"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: 'Password is required'
                                    },
                                    minLength: {
                                        value: 6,
                                        message: 'Must be 6 characters or longer'
                                    }
                                })}
                            />
                            <label className="label">
                                <span className="label-text text-blue-600 cursor-pointer"><small onClick={handleForgotPassword}>Forgot Password ?</small></span>
                            </label>
                            <label className="label">
                                {errors.password?.type === 'required' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}
                                {errors.password?.type === 'minLength' && <span className="label-text-alt text-red-500">{errors.password.message}</span>}

                            </label>
                        </div>
                        {
                            signErrorMessage
                        }
                        <input className='btn w-full max-w-xl text-white' type="submit" value="Login" />
                    </form>
                    <p><small>New to Doctors portal? <Link className='text-secondary' to={'/register'}>Create new account</Link></small></p>
                    <div className='divider'>OR</div>
                    <button
                        onClick={() => signInWithGoogle()}
                        className="btn btn-outline">Continue with google</button>
                </div>
            </div>
        </div>
    );
};

export default Login;