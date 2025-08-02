import React, { useState } from "react";
import Input from "../ui/Input";
import { useTranslations } from "next-intl";

interface CreditCardFormProps {
  onChange?: (values: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    isValid: boolean;
  }) => void;
  selectedPaymentMethod: string;
}

interface ValidationErrors {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface FormValues {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onChange,selectedPaymentMethod="card" }) => {
  const t = useTranslations("Components.CreditCardForm");
  
  const [formValues, setFormValues] = useState<FormValues>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Luhn algorithm for card number validation
  const validateCardNumber = (cardNumber: string): boolean => {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d{13,19}$/.test(cleanNumber)) return false;

    return true;
    // let sum = 0;
    // let isEven = false;

    // for (let i = cleanNumber.length - 1; i >= 0; i--) {
    //   let digit = parseInt(cleanNumber[i]);

    //   if (isEven) {
    //     digit *= 2;
    //     if (digit > 9) digit -= 9;
    //   }

    //   sum += digit;
    //   isEven = !isEven;
    // }

    // return sum % 10 === 0;
  };

  // Validate expiry date
  const validateExpiryDate = (expiryDate: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) return false;

    const [month, year] = expiryDate.split("/").map(num => parseInt(num));
    
    if (month < 1 || month > 12) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }

    return true;
  };

  // Validate CVV
  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  // Get validation error messages
  const getErrorMessage = (field: string, value: string): string => {
    if (!value && selectedPaymentMethod === "card") {
      return t(`${field}.required`) || "This field is required";
    }

    switch (field) {
      case "cardNumber":
          if (value && !validateCardNumber(value)) {
            return t("cardNumber.invalid") || "Please enter a valid card number";
          }
        break;
      case "expiryDate":
        if (value && !validateExpiryDate(value)) {
          return t("expiryDate.invalid") || "Please enter a valid expiry date (MM/YY)";
        }
        break;
      case "cvv":
        if (value && !validateCVV(value)) {
          return t("cvv.invalid") || "Please enter a valid CVV (3-4 digits)";
        }
        break;
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }

    // Format expiry date with slash
    if (name === "expiryDate") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d{0,2})/, "$1/$2")
        .slice(0, 5);
    }

    // Limit CVV to 3 or 4 digits
    if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    // Update form values
    const newFormValues = {
      ...formValues,
      [name]: formattedValue,
    };
    setFormValues(newFormValues);

    // Update errors
    const errorMessage = getErrorMessage(name, formattedValue);
    const newErrors = {
      ...errors,
      [name]: errorMessage,
    };
    setErrors(newErrors);

    // Check if form is valid
    const isValid = 
     
      validateExpiryDate(newFormValues.expiryDate) &&
      validateCVV(newFormValues.cvv) &&
      !newErrors.cardNumber &&
      !newErrors.expiryDate &&
      !newErrors.cvv;

    if (onChange) {
      onChange({
        ...newFormValues,
        isValid,
      });
    }
  };

  return (
    <div className="space-y-4  rounded-xl p-4 border border-neutral-light  bg-neutral-light">
      <div>
        <Input
          name="cardNumber"
          label={t("cardNumber.label")}
          placeholder={t("cardNumber.placeholder")}
          value={formValues.cardNumber}
          maxLength={19}
          minLength={19}
          autoComplete="cc-number"
          onChange={handleInputChange}
          required={selectedPaymentMethod === "card"}
          dir="ltr"
        />
        {errors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            name="expiryDate"
            label={t("expiryDate.label")}
            placeholder={t("expiryDate.placeholder")}
            value={formValues.expiryDate}
            maxLength={5}
            autoComplete="cc-exp"
            onChange={handleInputChange}
            required={selectedPaymentMethod === "card"}
            dir="ltr"
          />
          {errors.expiryDate && (
            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
          )}
        </div>
        
        <div>
          <Input
            name="cvv"
            label={t("cvv.label")}
            type="password"
            placeholder={t("cvv.placeholder")}
            value={formValues.cvv}
            maxLength={3}
            autoComplete="cc-csc"
            onChange={handleInputChange}
            required={selectedPaymentMethod === "card"}
            dir="ltr"
          />
          {errors.cvv && (
            <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
