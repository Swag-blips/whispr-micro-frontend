import { AuthForm } from "./(auth)/auth/components/AuthForm";
import { GoogleAuth } from "./(auth)/auth/components/GoogleAuth";
import { Apple, Facebook } from "./components/icons";

const AuthPage = () => {
  return (
    <main className="bg-[#0A0E0F] h-screen flex items-center justify-center">
      <section className="flex   flex-col w-[537px] max-h-[550px] overflow-y-auto form-scrollbar rounded-2xl bg-[#101516]  px-4">
        <AuthForm />

        <div className="flex items-center justify-center mt-6 w-[390px] gap-2">
          <hr className="border-[#C4C4C4] border w-[117px]" />

          <span className="text-[#C4C4C4]">Or continue with</span>

          <hr className="border-[#C4C4C4] border w-[117px]" />
        </div>

        <div className="flex items-center mt-8 justify-center">
          <GoogleAuth />
          <button>
            <Facebook />
          </button>

          <button>
            <Apple />
          </button>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
