"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import {
  Search,
  Calendar,
  Home,
  CreditCard,
  AlertTriangle,
  Clock,
  Bell,
  Eye,
  RefreshCw,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Notification,
  NotificationFilters,
  NotificationStats,
} from "@/types/notifications";
import {
  fetchNotifications,
  markNotificationAsRead,
} from "@/mock/notificationsMockData";

export default function NotificationsPage() {
  const t = useTranslations("Dashboard.notifications");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const [filters, setFilters] = useState<NotificationFilters>({
    type: "all",
    status: "all",
    priority: "all",
    date: "",
    searchTerm: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadNotifications();
  }, [currentPage, filters]);

  useEffect(() => {
    // Update select all state based on selected notifications
    const allCurrentNotificationsSelected =
      notifications.length > 0 &&
      notifications.every((notification) =>
        selectedNotifications.has(notification.id)
      );
    setSelectAll(allCurrentNotificationsSelected);
  }, [selectedNotifications, notifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetchNotifications(
        currentPage,
        itemsPerPage,
        filters
      );
      setNotifications(response.notifications);
      setStats(response.stats);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalItems);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    key: keyof NotificationFilters,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
    setSelectedNotifications(new Set());
  };

  const resetFilters = () => {
    setFilters({
      type: "all",
      status: "all",
      priority: "all",
      date: "",
      searchTerm: "",
    });
    setCurrentPage(1);
    setSelectedNotifications(new Set());
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedNotifications(new Set());
    } else {
      const allIds = new Set(notifications.map((n) => n.id));
      setSelectedNotifications(allIds);
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(notificationId)) {
      newSelected.delete(notificationId);
    } else {
      newSelected.add(notificationId);
    }
    setSelectedNotifications(newSelected);
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Mark all unread notifications as read
      const unreadNotifications = notifications.filter(
        (n) => n.status === "unread"
      );

      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id);
      }

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, status: "read" as const }))
      );

      if (stats) {
        setStats((prev) => (prev ? { ...prev, unread: 0 } : null));
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleMarkSelectedAsRead = async () => {
    try {
      const selectedIds = Array.from(selectedNotifications);

      for (const id of selectedIds) {
        await markNotificationAsRead(id);
      }

      setNotifications((prev) =>
        prev.map((n) =>
          selectedIds.includes(n.id) ? { ...n, status: "read" as const } : n
        )
      );

      setSelectedNotifications(new Set());

      // Update stats
      if (stats) {
        const unreadCount = selectedIds.filter(
          (id) => notifications.find((n) => n.id === id)?.status === "unread"
        ).length;
        setStats((prev) =>
          prev
            ? { ...prev, unread: Math.max(0, prev.unread - unreadCount) }
            : null
        );
      }
    } catch (error) {
      console.error("Error marking selected as read:", error);
    }
  };

  const handleDeleteSelected = () => {
    // In a real app, this would call an API to delete notifications
    const selectedIds = Array.from(selectedNotifications);
    setNotifications((prev) => prev.filter((n) => !selectedIds.includes(n.id)));
    setSelectedNotifications(new Set());
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === "unread") {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, status: "read" as const } : n
        )
      );
      if (stats) {
        setStats((prev) =>
          prev ? { ...prev, unread: Math.max(0, prev.unread - 1) } : null
        );
      }
    }
  };

  const getNotificationIcon = (
    type: Notification["type"],
    priority: Notification["priority"]
  ) => {
    const iconClass = `w-5 h-5 ${
      priority === "urgent"
        ? "text-red-500"
        : priority === "high"
        ? "text-orange-500"
        : priority === "medium"
        ? "text-yellow-500"
        : "text-blue-500"
    }`;

    switch (type) {
      case "booking":
        return <Calendar className={iconClass} />;
      case "entry":
        return <Home className={iconClass} />;
      case "exit":
        return <AlertTriangle className={iconClass} />;
      case "payment":
        return <CreditCard className={iconClass} />;
      case "reminder":
        return <Clock className={iconClass} />;
      default:
        return <Bell className={iconClass} />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - notificationTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return t("timeAgo.now");
    if (diffInMinutes < 60)
      return `${t("timeAgo.ago")} ${diffInMinutes} ${
        diffInMinutes === 1 ? t("timeAgo.minute") : t("timeAgo.minutes")
      }`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${t("timeAgo.ago")} ${diffInHours} ${
        diffInHours === 1 ? t("timeAgo.hour") : t("timeAgo.hours")
      }`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${t("timeAgo.ago")} ${diffInDays} ${
      diffInDays === 1 ? t("timeAgo.day") : t("timeAgo.days")
    }`;
  };

  const getNotificationBgColor = (
    type: Notification["type"],
    status: Notification["status"]
  ) => {
    const baseClasses = status === "unread" ? "border-r-4" : "";

    switch (type) {
      case "booking":
        return `bg-blue-50 ${baseClasses} border-r-blue-500`;
      case "entry":
        return `bg-green-50 ${baseClasses} border-r-green-500`;
      case "exit":
        return `bg-red-50 ${baseClasses} border-r-red-500`;
      case "payment":
        return `bg-purple-50 ${baseClasses} border-r-purple-500`;
      case "system":
        return `bg-gray-50 ${baseClasses} border-r-gray-500`;
      case "reminder":
        return `bg-yellow-50 ${baseClasses} border-r-yellow-500`;
      default:
        return `bg-white ${baseClasses} border-r-blue-500`;
    }
  };

  const getServiceTypeOptions = () => [
    { value: "all", label: t("types.all") },
    { value: "rest", label: "الاستراحات" },
    { value: "nursery", label: "المشتل" },
    { value: "training", label: "التدريب" },
    // { value: 'booking', label: t('types.booking') },
    // { value: 'payment', label: t('types.payment') },
    // { value: 'system', label: t('types.system') },
    // { value: 'reminder', label: t('types.reminder') }
  ];

  const getPaginationPages = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div
      className="w-full min-h-screen bg-gray-50 p-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {t("title")}
          </h1>

          {/* Enhanced Filters Section */}
          <div className="bg-gray-50 rounded-lg p-5 space-y-4">
            {/* Top Row - Search and Actions */}
            <div className="flex flex-col lg:flex-row items-end justify-between gap-4">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                    isRTL ? "right-3" : "left-3"
                  }`}
                />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) =>
                    handleFilterChange("searchTerm", e.target.value)
                  }
                  placeholder={t("filters.searchPlaceholder")}
                  className={`w-full h-11 rounded-lg bg-white border border-gray-200 text-sm placeholder:text-gray-400 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                    isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                  }`}
                  style={{ direction: isRTL ? "rtl" : "ltr" }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Type Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    نوع الخدمة
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange("type", e.target.value)}
                    className="w-full h-11 rounded-lg bg-white border border-gray-200 px-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {getServiceTypeOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date From */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    {" "}
                    تاريخ
                  </label>
                  <div className="relative">
                    <Calendar
                      className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                        isRTL ? "right-3" : "left-3"
                      }`}
                    />
                    <input
                      type="date"
                      value={filters.date}
                      onChange={(e) =>
                        handleFilterChange("date", e.target.value)
                      }
                      className={`w-full h-11 rounded-lg bg-white border border-gray-200 text-sm focus:ring-2 focus:ring-primary focus:border-transparent ${
                        isRTL ? "pr-10 pl-4" : "pl-10 pr-4"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                {" "}
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  تعيين الكل كمقروء
                </button>
              </div>
            </div>

            {/* Bottom Row - Filter Controls */}
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Status Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => handleFilterChange("status", "all")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  filters.status === "all"
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                الكل ({stats?.total || 0})
              </button>
              <button
                onClick={() => handleFilterChange("status", "unread")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors relative ${
                  filters.status === "unread"
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                جديدة ({stats?.unread || 0})
                {(stats?.unread || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats?.unread}
                  </span>
                )}
              </button>
              <button
                onClick={() => handleFilterChange("status", "read")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  filters.status === "read"
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                مقروءة
              </button>
            </div>
          </div>

          {/* Selection Controls */}
          {selectedNotifications.size > 0 && (
            <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-blue-800 font-medium">
                  تم تحديد {selectedNotifications.size} إشعار
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleMarkSelectedAsRead}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  تعيين كمقروء
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors"
                >
                  حذف المحدد
                </button>
              </div>
            </div>
          )}

          {/* List Header with Select All */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">تحديد الكل</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  قائمة الإشعارات ({totalItems})
                </h3>
              </div>
              <div className="text-sm text-gray-500">
                {t("pagination.showing")}{" "}
                {notifications.length > 0
                  ? (currentPage - 1) * itemsPerPage + 1
                  : 0}{" "}
                {t("pagination.to")}{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)}{" "}
                {t("pagination.of")} {totalItems} {t("pagination.notification")}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t("dropdown.noNotifications")}</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${getNotificationBgColor(
                    notification.type,
                    notification.status
                  )}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectNotification(notification.id);
                        }}
                        className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                      />
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(
                        notification.type,
                        notification.priority
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h4
                            className={`text-base font-medium text-gray-900 ${
                              notification.status === "unread"
                                ? "font-semibold"
                                : ""
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {notification.status === "unread" && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle view action
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            notification.type === "booking"
                              ? "bg-blue-100 text-blue-800"
                              : notification.type === "entry"
                              ? "bg-green-100 text-green-800"
                              : notification.type === "exit"
                              ? "bg-red-100 text-red-800"
                              : notification.type === "payment"
                              ? "bg-purple-100 text-purple-800"
                              : notification.type === "system"
                              ? "bg-gray-100 text-gray-800"
                              : notification.type === "reminder"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {t(`types.${notification.type}`)}
                        </span>
                        {notification.relatedId && (
                          <span className="text-xs text-gray-500">
                            #{notification.relatedId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                {/* Left - Previous Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  السابق
                </button>

                {/* Center - Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPaginationPages().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-sm text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => setCurrentPage(page as number)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-yellow-500 text-white shadow-sm"
                              : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Right - Next Button */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  التالي
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
