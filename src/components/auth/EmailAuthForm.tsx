
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2 } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailAuthFormProps = {
  onEmailSubmit: (email: string, code: string) => void;
};

const EmailAuthForm = ({ onEmailSubmit }: EmailAuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    
    try {
      // Generate a 4-digit verification code
      const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Send verification code via our custom email function
      const { error } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email: data.email, 
          code: verificationCode 
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }

      // Pass the email and code to parent component
      toast("Verification code sent", {
        description: `We've sent a verification code to ${data.email}. Please check your inbox.`,
      });
      
      onEmailSubmit(data.email, verificationCode);
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      toast("Error sending verification code", {
        description: error.message || "We couldn't send the verification code. Please try again.",
        style: { backgroundColor: "#f44336", color: "white" }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email@example.com"
                  {...field}
                  type="email"
                  autoComplete="email"
                  className="bg-island-light/20 border-island-light"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-love hover:bg-love-dark"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending verification code...
            </span>
          ) : "Send verification code"}
        </Button>
      </form>
    </Form>
  );
};

export default EmailAuthForm;
