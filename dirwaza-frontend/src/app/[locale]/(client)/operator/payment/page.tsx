"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/TextArea";
import PaymentMethodCard from "@/components/payment/PaymentMethodCard";
import CreditCardForm from "@/components/payment/CreditCardForm";
import Button from "@/components/ui/Button";
import Maps from "@/components/operator/Maps";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";



const PaymentPage = () => {
  const router = useRouter();
  const t = useTranslations("PaymentPage");
  const [selectedAmount, setSelectedAmount] = useState<"full" | "partial">(
    "full"
  );
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: {
      district: "",
      city: "",
      streetName: "",
      addressDetails: "",
    },
    delivery: {
      time: "",
      date: "",
    },
    cardDetails: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const [mapPosition, setMapPosition] = useState({ lat: 24.7136, lng: 46.6753 });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleDeliveryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [name]: value,
      },
    }));
  };

  // Reverse geocoding function
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await res.json();
      
      if (data && data.address) {
        const address = data.address;
        
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            city: address.city || address.town || address.village || prev.address.city,
            district: address.suburb || address.neighbourhood || prev.address.district,
            streetName: address.road || prev.address.streetName,
            addressDetails: data.display_name || prev.address.addressDetails,
          },
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  // Handle map click
  const handleMapClick = async (latlng: { lat: number; lng: number }) => {
    setMapPosition({ lat: latlng.lat, lng: latlng.lng });
    await reverseGeocode(latlng.lat, latlng.lng);
  };

  // Forward geocoding function
  const forwardGeocode = useCallback(async (addressString: string) => {
    if (!addressString || addressString.length < 3) return;
    
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(addressString)}&limit=1`
      );
      const data = await res.json();
      
      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const newPosition = {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0]
        };
        setMapPosition(newPosition);
      }
    } catch (error) {
      console.error('Error forward geocoding:', error);
    }
  }, []);

  // Memoize the full address string
  const fullAddress = useMemo(() => {
    const { city, district, streetName } = formData.address;
    const addressParts = [];
    if (streetName && streetName.length > 0) addressParts.push(streetName);
    if (district && district.length > 0) addressParts.push(district);
    if (city && city.length > 0) addressParts.push(city);
    return addressParts.join(', ');
  }, [formData.address.city, formData.address.district, formData.address.streetName]);

  // Watch for address changes and update map
  useEffect(() => {
    // Only geocode if we have enough information
    if (fullAddress.length > 5) {
      const timeoutId = setTimeout(() => {
        forwardGeocode(fullAddress);
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [fullAddress, forwardGeocode]);

  const handleCardDetailsChange = (values: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      cardDetails: {
        ...prev.cardDetails,
        ...values,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Payment data:", {
      ...formData,
      coordinates: mapPosition,
      delivery: formData.delivery,
      paymentAmount: selectedAmount,
    });
    router.push("/operator/payment/result");
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-8">{t("title")}</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white rounded-2xl p-4 shadow"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("userInfo.title")}</h2>
          <Input
            name="fullName"
            label={t("userInfo.fullName")}
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
          <Input
            name="email"
            type="email"
            label={t("userInfo.email")}
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            name="phone"
            type="tel"
            label={t("userInfo.phone")}
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("deliveryAddress.title")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
              name="city"
              label={t("deliveryAddress.city")}
              value={formData.address.city}
              onChange={handleAddressChange}
              required
            />
              <Input
              name="district"
              label={t("deliveryAddress.district")}
              value={formData.address.district}
              onChange={handleAddressChange}
              required
            />
            
          </div>
          
          <Input
            name="streetName"
            label={t("deliveryAddress.streetName")}
            value={formData.address.streetName}
            onChange={handleAddressChange}
            required
          />
          
          <TextArea
            name="addressDetails"
            label={t("deliveryAddress.addressDetails")}
            placeholder={t("deliveryAddress.addressPlaceholder")}
            value={formData.address.addressDetails}
            onChange={handleAddressChange}
            rows={3}
          />

          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium">{t("deliveryAddress.mapLocation")}</label>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-300">
              <Maps
                position={mapPosition}
                onPositionChange={setMapPosition}
                address=""
                onAddressChange={() => {}}
                onMapClick={handleMapClick}
              />
            </div>
            <p className="text-sm text-gray-500">{t("deliveryAddress.mapInstruction")}</p>
          </div>
        </div>

                <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("deliverySchedule.title")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
             <div className="space-y-2">
               <label className="text-gray-700 text-sm font-medium">{t("deliverySchedule.date")}</label>
               <input
                 type="date"
                 name="date"
                 value={formData.delivery.date}
                 onChange={handleDeliveryChange}
                 className="w-full px-4 py-3 border border-lime-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-lime-300"
                 required
                 min={new Date().toISOString().split('T')[0]}
               />
             </div>
            <div className="space-y-2">
              <label className="text-gray-700 text-sm font-medium">{t("deliverySchedule.time")}</label>
              <select
                name="time"
                value={formData.delivery.time}
                onChange={handleDeliveryChange}
                className="w-full px-4 py-3 border border-lime-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-lime-300 text-right"
                required
              >
                <option value="">{t("deliverySchedule.selectTime")}</option>
                <option value="morning">{t("deliverySchedule.timeSlots.morning")}</option>
                <option value="afternoon">{t("deliverySchedule.timeSlots.afternoon")}</option>
                <option value="evening">{t("deliverySchedule.timeSlots.evening")}</option>
              </select>
            </div>
            
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">{t("paymentMethod.title")}</h2>

          <CreditCardForm onChange={handleCardDetailsChange} />
          <PaymentMethodCard
            icon={"/icons/apple-pay.svg"}
            label={t("paymentMethod.applePay")}
            onClick={() => setSelectedAmount("partial")}
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("summary.totalAmount")}:</span>
            <span className="font-bold text-lg">
              {selectedAmount === "full" ? "1,299" : "649.50"}{" "}
              {t("summary.currency")}
            </span>
          </div>
          <Button variant="primary" size="lg" type="submit" className="w-full">
            {t("summary.completePayment")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentPage;
