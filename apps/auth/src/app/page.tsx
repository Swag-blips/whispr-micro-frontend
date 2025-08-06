import { AuthForm } from "./(auth)/auth/components/AuthForm";
import { GoogleAuth } from "./(auth)/auth/components/GoogleAuth";
import { Facebook } from "./components/icons";

const AuthPage = () => {
  return (
    <main className="bg-[#0A0E0F] h-screen flex items-center justify-center">
      <section className="flex   flex-col w-[537px] max-h-[550px] overflow-y-auto form-scrollbar rounded-2xl bg-[#101516]  px-4">
        <AuthForm />

        <div className="flex items-center justify-center mt-8 gap-2">
          <hr className="border-[#2D3438] border w-full" />

          <span className="text-[#A0A4A6] text-sm text-nowrap">
            OR SIGN IN WITH
          </span>

          <hr className="border-[#2D3438] border w-full " />
        </div>

        <div className="flex items-center mt-6 gap-4 mb-6 ">
          <GoogleAuth />

          <button className="rounded-lg cursor-pointer w-full flex items-center justify-center bg-[#1A1F22] h-12 text-[#C4C4C4] text-size-12 border-[1px] border-[#2D3438] ">
            <Facebook />
          </button>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
