'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  // Tooltip,
  ResponsiveContainer,
  // Legend,
} from 'recharts';
import { RevenueTrend } from '@/types/revenues';
import { fetchRevenueTrends } from '@/mock/revenuesMockData';

/* ───────── أنواع Props ───────── */
interface RevenueTrendsChartProps {
  data?: RevenueTrend[];     // بيانات جاهزة (إن وُجدت) تُغني عن الاستدعاء الوهمي
  loading?: boolean;         // حالة تحميل تُمرَّر خارجيًا (اختياري)
  error?: string | null;     // رسالة خطأ تُمرَّر خارجيًا (اختياري)
}

/* ───────── المكوّن الرئيسي ───────── */
export default function RevenueTrendsChart({
  data: propData,
  loading: propLoading,
  error: propError,
}: RevenueTrendsChartProps) {
  const t     = useTranslations('Revenues.charts');
  const [apiData, setApiData] = useState<RevenueTrend[] | null>(null);
  const [loading, setLoading] = useState(!propData);
  const [error,   setError]   = useState<string | null>(null);
  const [period,  setPeriod]  = useState<'yearly' | 'monthly'>('monthly');

  /* ─── جلب بيانات وهميّة إذا لم تُمرَّر من الخارج ─── */
  useEffect(() => {
    if (propData) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchRevenueTrends();
        setApiData(data);
      } catch (e) {
        console.error(e);
        setError('Failed to load revenue trends');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [propData]);

  /* ─── تجميع مصدر البيانات وحالات التحميل/الخطأ ─── */
  const dataToUse    = propData ?? apiData ?? [];
  const isLoading    = propLoading ?? loading;
  const errorMessage = propError   ?? error;

  /* ─── Tooltip مخصّص ─── */
  // const CustomTooltip = (props: { active?: boolean; payload?: Array<{ name: string; color: string; value: number }>; label?: string }) => {
  //   const { active, payload, label } = props;
  //   if (!(active && payload && payload.length)) return null;

  //   return (
  //     <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 text-sm">
  //       <p className="font-medium text-gray-900 mb-1">{label}</p>
  //       {payload.map((entry) => (
  //         <p key={entry.name} style={{ color: entry.color }}>
  //           {legendLabel(entry.name)}: {entry.value.toLocaleString()} ريال
  //         </p>
  //       ))}
  //     </div>
  //   );
  // };

  /* ─── مسمّيات الأسطورة بالعربية ─── */
  // const legendLabel = (key: string) =>
  //   ({ rest: 'الاستراحات', nursery: 'المشتل', equestrian: 'الفروسية' } as Record<string,string>)[key] || key;

  /* ─── تنسيق قيم المحور Y ─── */
  const formatYAxis = (v: number) => v.toLocaleString('ar-EG') + ' ريال';

  /* ─── شاشات التحميل / الخطأ ─── */
  if (errorMessage) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-96 flex items-center justify-center">
        <p className="text-red-600">{errorMessage}</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  /* ───────── JSX النهائي ───────── */
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 h-96 flex flex-col">
      {/* رأس المكوّن */}
      <header className="mb-4 flex items-center justify-between gap-4">
        {/* زرّا التبديل سنوي/شهري */}
        <div className="flex rounded-lg bg-gray-100 p-1 h-9">
          {(['yearly', 'monthly'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 text-sm rounded-md transition-colors ${
                period === p
                  ? p === 'monthly'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {t(p)}
            </button>
          ))}
        </div>

        <h3 className="text-lg font-bold text-gray-900">{t('revenueTrends')}</h3>
      </header>

      {/* الرسم البياني */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={dataToUse}
            margin={{ top: 10, right: 25, left: 10, bottom: 0 }}
          >
            {/* شبكة */}
            <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: '#6b7280' }}
              width={80}
              axisLine={false}
              tickLine={false}
            />

            {/* <Tooltip  /> */}

            {/* <Legend
              verticalAlign="top"
              align="right"
              iconType="plainline"
              formatter={legendLabel}
            /> */}

            {/* المساحات الشفافة (مكدَّسة) */}
            <Area key="area-equestrian" type="monotone" dataKey="equestrian" stackId="1" fill="#FEBD01" fillOpacity={0.15} stroke="none" />
            <Area key="area-nursery" type="monotone" dataKey="nursery" stackId="1" fill="#F03500" fillOpacity={0.15} stroke="none" />
            <Area key="area-rest" type="monotone" dataKey="rest" stackId="1" fill="#113218" fillOpacity={0.15} stroke="none" />

            {/* خطوط الحدّ */}
            <Line key="line-equestrian" type="monotone" dataKey="equestrian" stroke="#FEBD01" strokeWidth={3} dot={false} />
            <Line key="line-nursery" type="monotone" dataKey="nursery" stroke="#F03500" strokeWidth={3} dot={false} />
            <Line key="line-rest" type="monotone" dataKey="rest" stroke="#113218" strokeWidth={3} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
