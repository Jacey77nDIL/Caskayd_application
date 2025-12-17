"use client";

import { useEffect, useState, useMemo } from "react"; // Added useMemo for efficiency
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { toast } from "react-toastify";
import { PaystackButton } from "react-paystack";
import { X, Loader2 } from "lucide-react"; 
import { getCurrentUser } from "@/utils/api"; 

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
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const {
    register,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      email: "",
      amount: undefined,
    },
  });

  useEffect(() => {
    setIsMounted(true);
    async function fetchUserEmail() {
      setIsLoadingUser(true);
      try {
        const res = await getCurrentUser();
        if (res.success && res.data?.email) {
          setValue("email", res.data.email, { 
            shouldValidate: true, 
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

  // --- NEW LOGIC START ---
// Calculate 10% fee and Total
  const { fee, total } = useMemo(() => {
    // FIX: Force conversion to Number() here to prevent string concatenation
    const validAmount = Number(amount) || 0; 
    
    const calculatedFee = validAmount * 0.10; // 10%
    return {
      fee: calculatedFee,
      total: validAmount + calculatedFee
    };
  }, [amount]);
  // --- NEW LOGIC END ---

  const paystackConfig = {
    email: email,
    // CRITICAL: We now charge the TOTAL amount (converted to Kobo)
    amount: Math.ceil(total * 100), 
    publicKey,
    currency: "NGN",
    metadata: {
      custom_fields: [
        { display_name: "Email", variable_name: "email", value: email },
        { display_name: "Original Amount", variable_name: "original_amount", value: String(amount) },
        { display_name: "Fee", variable_name: "fee", value: String(fee) },
      ],
    },
    reference: (new Date()).getTime().toString(), // Generate unique ref
    onSuccess: async (referenceObj: any) => {
      // referenceObj looks like { message: "Approved", reference: "12345..." }
      
      toast.info("Verifying payment...");

      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: referenceObj.reference }),
        });
        const data = await res.json();
        if (data.success) {
          toast.success("Payment Verified & Completed!");
          onClose(); // Close modal
        } else {
          toast.error("Payment verification failed. Please contact support.");
        }
      } catch (error) {
        console.log(error);
        toast.error("Network error verifying payment.");
      }
    },
    onClose: () => toast.info("Transaction cancelled"),
  };

  const inputStyles = {
    label: "text-gray-500/70",
    input: ["text-black/90", "placeholder:text-gray-400"],
    inputWrapper: [
      "bg-transparent", "border-2", "border-gray-200", "hover:border-gray-400",
      "transition-all", "duration-300", "h-14",
      "group-data-[focus=true]:h-16", "group-data-[focus=true]:border-black",
    ],
  };

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
          
          {/* Email Input */}

          <Input
  {...register("email")}
  // Use the 'value' prop to force it to display the watched value
  value={email || ""} 
  variant="faded"
  isReadOnly // <--- key prop
  labelPlacement="inside"
  size="lg"
  classNames={{
    ...inputStyles,
    inputWrapper: "bg-gray-100 border-gray-300 cursor-not-allowed", // Grey it out visually
  }}
/>
          

          {/* Amount Input */}
          <div className="flex flex-col gap-1">
            <Input
              {...register("amount")}
              placeholder="Enter Amount (NGN)"
              type="number"
              variant="bordered"
              labelPlacement="inside"
              size="lg"
              isRequired
              isInvalid={!!errors.amount}
              errorMessage={errors.amount?.message}
              classNames={inputStyles}
            />
            
            {/* --- NEW DISPLAY SECTION START --- */}
            {amount && !errors.amount && (
              <div className="mt-2 bg-gray-50 p-3 rounded-md text-sm text-gray-600 flex flex-col gap-1 animate-fade-in">
                <div className="flex justify-between">
                  <span>Entry:</span>
                  <span>₦{Number(amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange-600">
                  <span>Service Fee (10%):</span>
                  <span>+ ₦{fee.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 my-1"></div>
                <div className="flex justify-between font-bold text-black text-base">
                  <span>Total to Pay:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            )}
            {/* --- NEW DISPLAY SECTION END --- */}
          </div>

          {/* Pay Button */}
          {isValid && amount && (
            <div className="mt-2 animate-fade-in">
              <PaystackButton
                {...paystackConfig}
                // Updated button text to show the TOTAL
                text={`Pay ₦${total.toLocaleString()}`}
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