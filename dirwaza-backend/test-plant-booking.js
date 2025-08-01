import axios from 'axios';

const testPlantBooking = async () => {
  try {
    console.log('🧪 Testing Plant Booking API...');
    
    const bookingData = {
      agreedToTerms: true,
      personalInfo: {
        fullName: "سارة أحمد محمد",
        mobileNumber: "+966501234567",
        notes: "أريد نباتات للحديقة المنزلية"
      },
      recipientPerson: {
        fullName: "سارة أحمد محمد",
        mobileNumber: "+966501234567"
      },
      deliveryAddress: {
        city: "الرياض",
        district: "النرجس",
        street: "شارع الأمير محمد بن عبدالعزيز",
        buildingNumber: "1234",
        additionalNumber: "5678"
      },
      orderData: [
        {
          plantId: "507f1f77bcf86cd799439011",
          quantity: 2,
          unitPrice: 75.5
        }
      ],
      paymentMethod: "apple_pay"
    };

    console.log('📤 Sending request with data:', JSON.stringify(bookingData, null, 2));

    const response = await axios.post('http://localhost:5001/api/bookings/plants', bookingData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Success! Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testPlantBooking();
