
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";

interface PasswordFieldProps {
  value?: string;
  onChange?: (...event: any[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name: string;
  autoCompleteType?: string;
  label?: string;
  form?: UseFormReturn<any>;
}

const PasswordField = ({ 
  value, 
  onChange, 
  onBlur, 
  disabled, 
  name, 
  autoCompleteType,
  label,
  form
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If form is provided, use FormField, otherwise use direct input
  if (form) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  {...field}
                  disabled={disabled}
                  autoComplete={autoCompleteType}
                  className="bg-island-light/20 border-island-light pr-10"
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  // Original direct input implementation
  return (
    <div className="relative">
      <Input 
        type={showPassword ? "text" : "password"} 
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        name={name}
        autoComplete={autoCompleteType}
        className="bg-island-light/20 border-island-light pr-10"
      />
      <button 
        type="button"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
        onClick={togglePasswordVisibility}
        tabIndex={-1}
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
};

export default PasswordField;
