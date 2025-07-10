import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  Eye,
  Trash,
  NotepadText,
  Edit,
  } from 'lucide-react';
import DynamicTable, { TableColumn, TableAction, TableData, SortConfig } from '@/components/ui/DynamicTable';

interface Customer {
  name: string;
  phone: string;
  avatar?: string;
}

interface Order {
  id: string;
  customer: Customer;
  products: string;
  price: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  date: string;
  plantDetails?: string;
}

interface OrdersApiData {
  orders: Order[];
  totalOrders: number;
  currentPage: number;
  totalPages: number;
}

// Mock API function - replace with actual API call
const fetchOrdersData = async (page: number = 1, perPage: number = 6): Promise<OrdersApiData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const allOrders: Order[] = [
    {
      id: "#2859",
      customer: {
        name: "نورة الحربي",
        phone: "+966 55 123 4567",
        avatar: "/images/avatars/user1.png"
      },
      products: "هدية زهور (5)،",
      price: "750",
      status: "new",
      date: "23 يونيو 2025"
    },
    {
      id: "#2858", 
      customer: {
        name: "فهد العتيبي",
        phone: "+966 55 234 5678",
        avatar: "/images/avatars/user2.png"
      },
      products: "أشجار نخيل (2)، نباتات صبار (5)",
      price: "920",
      status: "processing",
      date: "22 يونيو 2025"
    },
    {
      id: "#2857",
      customer: {
        name: "سارة القحطاني", 
        phone: "+966 55 345 6789",
        avatar: "/images/avatars/user3.png"
      },
      products: "شتلات زهور (5)، أشجار فاكهة",
      price: "1,250",
      status: "processing",
      date: "21 يونيو 2025"
    },
    {
      id: "#2856",
      customer: {
        name: "احمد القحطاني",
        phone: "+966 55 345 6789", 
        avatar: "/images/avatars/user4.png"
      },
      products: "هدية نخيل (2)، نباتات صبار (5)",
      price: "1,800",
      status: "completed",
      date: "20 يونيو 2025"
    },
    {
      id: "#2855",
      customer: {
        name: "منيرة الدوسري",
        phone: "+966 55 567 8901",
        avatar: "/images/avatars/user5.png"
      },
      products: "شتلات خضروات (15)، أسمدة",
      price: "520", 
      status: "cancelled",
      date: "19 يونيو 2025"
    },
    {
      id: "#2854",
      customer: {
        name: "احمد القحطاني",
        phone: "+966 55 345 6789",
        avatar: "/images/avatars/user6.png"
      },
      products: "أشجار نخيل (2)، نباتات صبار (5)",
      price: "1,800",
      status: "completed", 
      date: "18 يونيو 2025"
    },
    {
      id: "#2853",
      customer: {
        name: "خالد المطيري",
        phone: "+966 55 678 9012",
        avatar: "/images/avatars/user7.png"
      },
      products: "نباتات زينة (8)، أحواض",
      price: "650", 
      status: "new",
      date: "17 يونيو 2025"
    },
    {
      id: "#2852",
      customer: {
        name: "فاطمة الزهراني",
        phone: "+966 55 789 0123",
        avatar: "/images/avatars/user8.png"
      },
      products: "بذور خضروات (10)، تربة",
      price: "420", 
      status: "processing",
      date: "16 يونيو 2025"
    },
  ];

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const orders = allOrders.slice(startIndex, endIndex);

  return {
    orders,
    totalOrders: allOrders.length,
    currentPage: page,
    totalPages: Math.ceil(allOrders.length / perPage)
  };
};

const OrdersTable: React.FC = () => {
  const t = useTranslations("NurseryOrders");
  const [tableData, setTableData] = useState<TableData<Order>>({
    items: [],
    totalItems: 0,
    currentPage: 1,
    totalPages: 1,
    loading: true,
    error: null
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 6;

  // Event Handlers
  const handleViewOrder = (order: Order) => {
    console.log("View order:", order.id);
  };

  const handleEditOrder = (order: Order) => {
    console.log("Edit order:", order.id);
  };

  const handleMoreActions = (order: Order) => {
    console.log("More actions for order:", order.id);
  };

  const handlePlantDetails = (order: Order) => {
    console.log("Plant details for order:", order.id);
  };

  // Load orders data
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setTableData(prev => ({ ...prev, loading: true, error: null }));
        const data = await fetchOrdersData(currentPage, ordersPerPage);
        setTableData({
          items: data.orders,
          totalItems: data.totalOrders,
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          loading: false,
          error: null
        });
      } catch (err) {
        setTableData(prev => ({
          ...prev,
          loading: false,
          error: "فشل في تحميل الطلبات"
        }));
        console.error("Error loading orders:", err);
      }
    };

    loadOrders();
  }, [currentPage]);

  // Status Badge Component
  const StatusBadge: React.FC<{ status: Order['status'] }> = ({ status }) => {
    const statusConfig = {
      new: { 
        text: t("new"), 
        bgColor: 'bg-powderblue-100', 
        textColor: 'text-black' 
      },
      processing: { 
        text: t("processing"), 
        bgColor: 'bg-khaki-100', 
        textColor: 'text-black' 
      },
      completed: { 
        text: t("completed"), 
        bgColor: 'bg-powderblue-200', 
        textColor: 'text-darkslategray-200' 
      },
      cancelled: { 
        text: t("cancelled"), 
        bgColor: 'bg-antiquewhite', 
        textColor: 'text-black' 
      }
    };

    const config = statusConfig[status] || statusConfig.new;
    
    return (
      <div className={`inline-flex rounded-full ${config.bgColor} h-7 items-center justify-center py-1 px-3 box-border`}>
        <div className={`relative leading-[1.125rem] font-medium text-xs ${config.textColor}`}>
          {config.text}
        </div>
      </div>
    );
  };

  // Customer Cell Component
  const CustomerCell: React.FC<{ customer: Customer }> = ({ customer }) => {
    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
      <div className="flex flex-row items-center justify-start gap-3">
           <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
          {customer.avatar ? (
            <Image
              className="w-full h-full object-cover"
              alt={customer.name}
              src={customer.avatar}
              width={32}
              height={32}
            />
          ) : (
            getInitials(customer.name)
          )}
        </div>
          <div className="flex flex-col items-start justify-start">
          <div className="relative leading-5 font-medium text-sm text-gray-200 font-ibm-plex-sans-arabic">
            {customer.name}
          </div>
          <div className="relative leading-4 text-xs text-slategray font-ibm-plex-sans">
            {customer.phone}
          </div>
        </div>
     
      </div>
    );
  };

  // Table Columns Configuration
  const columns: TableColumn<Order>[] = [
    {
      id: 'orderNumber',
      label: t("orderNumber"),
      labelEn: 'Order Number',
      key: 'id',
      width: '6.488rem',
      sortable: true,
      align: 'right',
      responsive: {
        priority: 1
      },
      render: (order: Order) => (
        <div className="relative leading-5 font-medium text-sm text-gray-200 font-ibm-plex-sans-arabic">
          {order.id}
        </div>
      )
    },
    {
      id: 'customer',
      label: t("customer"),
      labelEn: 'Customer',
      key: 'customer',
      width: '11.394rem',
      searchable: true,
      align: 'right',
      responsive: {
        priority: 2
      },
      render: (order: Order) => (
        <CustomerCell customer={order.customer} />
      )
    },
    {
      id: 'products',
      label: t("products"),
      labelEn: 'Products',
      key: 'products',
      width: '14.025rem',
      searchable: true,
      align: 'right',
      responsive: {
        priority: 3
      },
      render: (order: Order) => (
        <div className="relative leading-5 text-sm text-gray-200 font-ibm-plex-sans line-clamp-2 text-right">
          {order.products}
        </div>
      )
    },
    {
      id: 'price',
      label: t("price"),
      labelEn: 'Price',
      key: 'price',
      width: '6.8rem',
      sortable: true,
      align: 'right',
      responsive: {
        hidden: ['sm'],
        priority: 4
      },
      render: (order: Order) => (
        <div className="relative leading-5 text-sm text-gray-200 font-roboto">
          {order.price} {t("currency")}
        </div>
      )
    },
    {
      id: 'status',
      label: t("status"),
      labelEn: 'Status',
      key: 'status',
      width: '8.25rem',
      sortable: true,
      align: 'center',
      responsive: {
        priority: 5
      },
      render: (order: Order) => (
        <StatusBadge status={order.status} />
      )
    },
    {
      id: 'date',
      label: t("orderDate"),
      labelEn: 'Order Date',
      key: 'date',
      width: '8.031rem',
      sortable: true,
      align: 'right',
      responsive: {
        hidden: ['sm', 'md'],
        priority: 6
      },
      render: (order: Order) => (
        <div className="relative leading-5 text-sm text-gray-200 font-ibm-plex-sans">
          {order.date}
        </div>
      )
    },
    {
      id: 'plantDetails',
      label: t("plantDetails"),
      labelEn: 'Plant Details',
      key: 'plantDetails',
      width: '7.763rem',
      align: 'center',
      responsive: {
        hidden: ['sm', 'md'],
        priority: 7
      },
      render: (order: Order) => (
        <button
          onClick={() => handlePlantDetails(order)}
          className="w-5 h-5 hover:opacity-75 transition-opacity cursor-pointer"
        >
         <NotepadText className="w-5 h-5" />
        </button>
      )
    }
  ];

  // Table Actions Configuration
  const actions: TableAction<Order>[] = [
    {
      id: 'view',
      label: 'عرض',
      labelEn: 'View',
      icon: <Eye className="w-4 h-4" />,
      onClick: handleViewOrder,
      color: 'primary'
    },
    {
      id: 'edit',
      label: 'تعديل',
      labelEn: 'Edit',
      icon: <Edit className="w-4 h-4 text-orange-500" />,
      onClick: handleEditOrder,
      color: 'secondary'
    },
    {
      id: 'delete',
      label: 'حذف',
      labelEn: 'Delete',
      icon: <Trash className="w-4 h-4 text-red-500" />,
      onClick: handleMoreActions,
      color: 'primary'
    }
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSort = (sortConfig: SortConfig) => {
    console.log("Sort config:", sortConfig);
    // Implement sorting logic here
  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    // Reload data
  };

  return (
    <DynamicTable<Order>
      data={tableData}
      columns={columns}
      actions={actions}
      onPageChange={handlePageChange}
      onSort={handleSort}
      onSearch={handleSearch}
      onRefresh={handleRefresh}
      searchPlaceholder={t("searchPlaceholder")}
      emptyMessage="لا توجد طلبات للعرض"
      itemsPerPage={ordersPerPage}
      className="shadow-[0px_4px_1px_rgba(0,_0,_0,_0.06)] rounded-2xl"
      rtl={true}
      striped={false}
      bordered={true}
      hoverable={true}
      responsive={true}
      stickyHeader={false}
      showSearch={false}
      showPagination={true}
      showItemsCount={true}
      variant="default"
    />
  );
};

export default OrdersTable; 