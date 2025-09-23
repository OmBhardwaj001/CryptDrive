import React,{useState,useEffect} from 'react'
import {useNavigate,Link} from 'react-router-dom'
import {useDispatch,useSelector} from 'react-redux'
import {
  loginFailure,
  loginStart,
  loginSuccess,
  updateRegistrationField,} from '../../feature/auth/authSlice'

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {isLoading, error} = useSelector((state) => state.auth);
  const registrationData = useSelector((state)=> state.auth.registrationData)

  const [showPassword , setShowPassword] = useState(false);
  
  const handleInputChange=(field,value)=>{
    dispatch(updateRegistrationField({field,value}))
  }

  const handleSubmit=async (e)=>{
    e.preventDefault();

    if(!registrationData.email.trim()){
      dispatch(loginFailure('Email is required'))
    }

    if(!registrationData.password){
      dispatch(loginFailure('password is required'))
    }

    if(registrationData.password.length < 6){
      dispatch(loginFailure('password must be atleast 6 character'))
    }

    dispatch(loginStart())

    try {
       const response = await fetch('http://localhost:8000/api/v1/auth/login',{
        method:'POST',
        headers:{
          "content-Type":"application/json",
        },
        credentials:"include",
        body:JSON.stringify({
          email:registrationData.email.trim(),
          password:registrationData.password
        })
       });

       const data = await response.json();

       if(data.statusCode === 200){
        dispatch(loginSuccess());
        navigate('/dashboard')
       }
    } catch (error) {
      dispatch(loginFailure(error.message))
    }
  }


  return (
   <div  className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
     <div className="sm:mx-auto sm:w-full sm:max-w-md">
       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
         Login your account
       </h2>
     </div>

     <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
       <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
         {error && (
           <div className="mb-4 text-red-600 text-sm font-medium">{error}</div>
         )}

         <form onSubmit={handleSubmit} className="space-y-6">
           {/* Email */}
           <div>
             <label
               htmlFor="email"
               className="block text-sm font-medium text-gray-700"
             >
               Email address *
             </label>
             <div className="mt-1">
               <input
                 id="email"
                 name="email"
                 type="email"
                 autoComplete="email"
                 required
                 value={registrationData.email}
                 onChange={(e) => handleInputChange("email", e.target.value)}
                 placeholder="Enter your email"
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 
                  rounded-md shadow-sm placeholder-gray-400 focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               />
             </div>
           </div>

           {/* Password */}
           <div>
             <label
               htmlFor="password"
               className="block font-medium text-gray-700 text-sm"
             >
               Password *
             </label>
             <div className="mt-1 flex">
               <input
                 id="password"
                 name="password"
                 type={showPassword ? "text" : "password"}
                 autoComplete="new-password"
                 required
                 value={registrationData.password}
                 onChange={(e) => handleInputChange("password", e.target.value)}
                 placeholder="Minimum 6 characters"
                 className="appearance-none block w-full px-3 py-2 border border-gray-300 
                  rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none 
                  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
               />
               <button
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 className="px-3 py-2 border border-gray-300 bg-gray-100 rounded-r-md text-sm text-gray-700 hover:bg-gray-200"
               >
                 {showPassword ? "Hide" : "Show"}
               </button>
             </div>
           </div>
           {/* Submit Button */}
           <div>
             <button
               type="submit"
               disabled={isLoading}
               className="w-full flex justify-center item-center px-4 py-2 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
             >
               {isLoading ? (
                 <>
                   <svg
                     className="animate-spin h-5 w-5 text-white mr-2"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 24 24"
                   >
                     <circle
                       className="opacity-25"
                       cx="12"
                       cy="12"
                       r="10"
                       stroke="currentColor"
                       strokeWidth="4"
                     />
                     <path
                       className="opacity-75"
                       fill="currentColor"
                       d="M4 12a8 8 0 018-8v8H4z"
                     />
                   </svg>
                   Logging in ...
                 </>
               ) : (
                 "Login"
               )}
             </button>
           </div>
         </form>

         {/* Footer */}
         <div className="mt-6">
           <div className="relative">
             <div className="absolute inset-0 flex items-center">
               <div className="w-full border-t border-gray-300" />
             </div>
             <div className="relative flex justify-center text-sm">
               <span className="px-2 bg-white text-gray-500">
                 Dont't have an account?
               </span>
             </div>
           </div>

           <div className="mt-6 text-center">
             <Link
               to="/register"
               className="font-medium text-indigo-600 hover:text-indigo-500"
             >
               Register here
             </Link>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
  
}

export default Login