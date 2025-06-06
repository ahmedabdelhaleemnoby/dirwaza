import React from "react";
import Input from "../ui/Input";
import { useTranslations } from "next-intl";

interface CreditCardFormProps {
  onChange?: (values: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onChange }) => {
  const t = useTranslations("Components.CreditCardForm");

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
      formattedValue = value.slice(0, 4);
    }

    if (onChange) {
      onChange({
        cardNumber: name === "cardNumber" ? formattedValue : "",
        expiryDate: name === "expiryDate" ? formattedValue : "",
        cvv: name === "cvv" ? formattedValue : "",
      });
    }
  };

  return (
    <div className="space-y-4  rounded-xl p-4 border border-neutral-light  bg-neutral-light">
      <Input
        name="cardNumber"
        label={t("cardNumber.label")}
        placeholder={t("cardNumber.placeholder")}
        maxLength={19}
        onChange={handleInputChange}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="expiryDate"
          label={t("expiryDate.label")}
          placeholder={t("expiryDate.placeholder")}
          maxLength={5}
          onChange={handleInputChange}
        />
        <Input
          name="cvv"
          label={t("cvv.label")}
          type="password"
          placeholder={t("cvv.placeholder")}
          maxLength={4}
          onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CreditCardForm;
