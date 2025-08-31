//Selection page
'use client';


import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12"> 
    <div  className="w-full max-w-[1200px] h-auto md:h-[550px] bg-cover bg-center rounded-2xl shadow-xl flex flex-col items-center justify-center text-white p-6 md:p-12">
      <div className=" flex-col sm:flex-row mt-2 w-full sm:max-w-[500px] grid grid-cols-2 md:grid-cols-2 gap-4">
        {/*dummy SIGN UP BUSINESS page*/}
        <button onClick={() => router.push('/SignupCreator')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          SignupCreator
        </button>
        {/*dummy SIGN UP CREATOR page*/}
        <button onClick={() => router.push('/SignupBusiness')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          SignupBusiness
        </button>
        {/*dummy LOGIN page*/}
        <button onClick={() => router.push('/Login')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          Login
        </button>
        {/*Main sign up bussines page*/}
        <button onClick={() => router.push('/WebBusinessSignUp')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          WebBusinessSignUp
        </button>
        <button onClick={() => router.push('/WebExplore')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          WebExplore
        </button>
        <button onClick={() => router.push('/WebCreatorSignUp')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          WebCreatorSignUp
        </button>
        <button onClick={() => router.push('/WebCreatorHomeToDo')} className='w-full bg-white text-black px-6 py-3 text-lg sm:text-xl rounded-sm hover:scale-110 hover:shadow-lg transition-transform duration-300'>
          WebCreatorHomeToDo
        </button>
      </div>
    </div>  
    </main>
  );
}
