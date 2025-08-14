export const verifyOtp = async (email: string, otp: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ otp, email }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  } 
};
 
export const resendOtp = async (email: string) => {
  try { 
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email }),
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
