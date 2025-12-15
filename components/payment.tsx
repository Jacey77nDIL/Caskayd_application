"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { PaystackButton } from "react-paystack";
import { X, Loader2 } from "lucide-react"; 
import { getCurrentUser } from "@/utils/api"; // Ensure this function exists in api.ts

const schema = z.object({
  email: z.string().email("Invalid email address"),
  amount: z.coerce
    .number()
    .min(100, "Minimum amount is 100 NGN")
    .max(1000000, "Maximum amount is 1,000,000 NGN"),
});

type FormData = z.infer<typeof schema>;

export default function PayStackPayment({ onClose }: { onClose: () => void }) {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";
  
  // 1. Fix "window is not defined" error
  const [isMounted, setIsMounted] = useState(false);
  
  // 2. Loading state for the email fetch
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const {
    register,
    setValue, // Used to programmatically fill the input
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "", // Starts empty, will be filled by API
      amount: undefined,
    },
  });

  // 3. FETCH AND FILL EMAIL AUTOMATICALLY
  useEffect(() => {
    setIsMounted(true); // Mark component as mounted in browser

    async function fetchUserEmail() {
      setIsLoadingUser(true);
      try {
        // Call the API to get current user details
        const res = await getCurrentUser();
        
        if (res.success && res.data?.email) {
          // AUTOMATICALLY FILL THE INPUT
          setValue("email", res.data.email, { 
            shouldValidate: true, // Make it valid immediately
            shouldDirty: true 
          });
        }
      } catch (error) {
        console.error("Failed to fetch user email", error);
        toast.error("Could not load user details");
      } finally {
        setIsLoadingUser(false);
      }
    }

    fetchUserEmail();
  }, [setValue]);

  const email = watch("email");
  const amount = watch("amount");

  const paystackConfig = {
    email: email, // Sends the API-fetched email to Paystack
    amount: (amount || 0) * 100, // Paystack takes amount in kobo
    publicKey,
    currency: "NGN",
    metadata: {
      custom_fields: [
        { display_name: "Email", variable_name: "email", value: email },
        { display_name: "Amount", variable_name: "amount", value: String(amount) },
      ],
    },
    onSuccess: () => {
      toast.success("Payment successful!");
      onClose();
    },
    onClose: () => toast.info("Transaction cancelled"),
  };

  const inputStyles = {
    label: "text-gray-500/70",
    input: ["text-black/90", "placeholder:text-gray-400"],
    inputWrapper: [
      "bg-transparent",
      "border-2",
      "border-gray-200",
      "hover:border-gray-400",
      "transition-all",
      "duration-300",
      "h-14",
      "group-data-[focus=true]:h-16",
      "group-data-[focus=true]:border-black",
    ],
  };

  // Prevent rendering on server to stop "window is not defined"
  if (!isMounted) return null;

  return (
    <Card className="w-full max-w-md shadow-2xl bg-white p-6 relative">
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition z-10"
      >
        <X className="w-5 h-5 text-gray-500" />
      </button>

      <CardHeader className="text-center py-6 justify-center">
        <h2 className="text-2xl font-bold text-gray-800">Pay with Paystack</h2>
      </CardHeader>
      
      <CardBody>
        <form className="flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Email Input - LOCKED */}
          <div className="flex flex-col gap-1 h-20">
            <Input
              {...register("email")}
              placeholder="Fetched your email"
              type="email"
              variant="faded"
              labelPlacement="inside"
              size="lg"
              isReadOnly={true} // <--- THIS LOCKS THE INPUT
              isRequired
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              classNames={{
                ...inputStyles,
                // Add gray background to show it's disabled
                inputWrapper: [...inputStyles.inputWrapper, "bg-gray-100 opacity-80 cursor-not-allowed"] 
              }}
              endContent={
                isLoadingUser ? <Loader2 className="animate-spin w-4 h-4 text-[#823A5E]" /> : null
              }
            />
          </div>

          {/* Amount Input - User Enters This */}
          <div className="flex flex-col gap-1 h-20">
            <Input
              {...register("amount")}
              placeholder="Amount (NGN)"
              type="number"
              variant="bordered"
              labelPlacement="inside"
              size="lg"
              isRequired
              isInvalid={!!errors.amount}
              errorMessage={errors.amount?.message}
              classNames={inputStyles}
            />
          </div>

          {/* Pay Button */}
          {isValid && amount && (
            <div className="mt-2 animate-fade-in">
              <PaystackButton
                {...paystackConfig}
                text={`Pay ₦${Number(amount).toLocaleString()}`}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-transform active:scale-95 shadow-md"
              />
            </div>
          )}

          {!publicKey && (
            <p className="text-center text-xs text-red-500">
              Developer Error: Paystack Public Key is missing.
            </p>
          )}
        </form>
      </CardBody>
    </Card>
  );
}