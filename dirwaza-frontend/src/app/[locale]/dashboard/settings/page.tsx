'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  User,
  Clock,
  Package,
  Mountain,
  Flower,
  Calendar,
  Save,
  Loader2
} from 'lucide-react';

import { 
  SettingsSection, 
  ToggleSwitch, 
  Input,
  showNotification 
} from '@/components/ui';

import {
  fetchSettingsData,
  updateSettingsData,
  type SettingsData,
  type ServicePackage,
  type EquestrianSession,
  type PlantCategory,
} from '@/mock/settingsMockData';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  // Removed locale/isRTL as not needed after layout update

  // State management
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load settings data on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettingsData();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
        showNotification({
          type: 'error',
          title: t('error'),
          body: 'Failed to load settings data'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [t]);

  // Save settings
  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await updateSettingsData(settings);
      showNotification({
        type: 'success',
        title: t('saved'),
        body: 'All changes have been saved successfully'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      showNotification({
        type: 'error',
        title: t('error'),
        body: 'Failed to save changes'
      });
    } finally {
      setSaving(false);
    }
  };

  // Update handlers
  const updateUserInfo = (field: keyof SettingsData['userInfo'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      userInfo: {
        ...settings.userInfo,
        [field]: value
      }
    });
  };

  const updateWorkingHours = (field: keyof SettingsData['workingHours'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      workingHours: {
        ...settings.workingHours,
        [field]: value
      }
    });
  };

  const updateServicePackage = (id: string, field: keyof ServicePackage, value: string | number | boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      servicePackages: settings.servicePackages.map(pkg =>
        pkg.id === id ? { ...pkg, [field]: value } : pkg
      )
    });
  };

  const updateEquestrianSession = (id: string, field: keyof EquestrianSession, value: string | number | boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      equestrianSessions: settings.equestrianSessions.map(session =>
        session.id === id ? { ...session, [field]: value } : session
      )
    });
  };

  const updatePlantCategory = (id: string, field: keyof PlantCategory, value: string | number | boolean) => {
    if (!settings) return;
    setSettings({
      ...settings,
      plantCategories: settings.plantCategories.map(category =>
        category.id === id ? { ...category, [field]: value } : category
      )
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">{t('error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative min-h-screen flex flex-col items-end justify-start text-right text-[1.125rem] text-darkslategray-200 font-ibm-plex-sans bg-neutral">
      <div className="max-w-7xl mx-auto px-6 py-8 w-full">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary-dark mb-2">{t('title')}</h1>
        </div>

        <div className="flex flex-col gap-6">
          {/* Farm Information */}
          <div className="w-full shadow-[0px_4px_1px_rgba(0,_0,_0,_0.06)] rounded-2xl bg-white p-6">
            <div className="flex flex-row items-center justify-end gap-2 mb-4">
              <b className="text-lg leading-7 text-primary-dark">معلومات المزرعة</b>
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                type="text"
                value={settings.userInfo.fullName}
                onChange={(e) => updateUserInfo('fullName', e.target.value)}
                label="اسم المزرعة"
                placeholder="مزرعة دروازة"
                className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
              />
              <Input
                type="tel"
                value={settings.userInfo.phoneNumber}
                onChange={(e) => updateUserInfo('phoneNumber', e.target.value)}
                label="رقم الهاتف"
                placeholder="97450222581"
                className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
              />
              <Input
                type="email"
                value={settings.userInfo.email}
                onChange={(e) => updateUserInfo('email', e.target.value)}
                label="البريد الإلكتروني"
                placeholder="info@Dirwazh.com"
                className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
              />
              <Input
                type="text"
                value="قطر، الدوحة"
                onChange={() => {}}
                label="الموقع"
                placeholder="قطر، الدوحة"
                className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div className="w-full shadow-[0px_4px_1px_rgba(0,_0,_0,_0.06)] rounded-2xl bg-white p-6">
            <div className="flex flex-row items-center justify-end gap-2 mb-4">
              <b className="text-lg leading-7 text-primary-dark">ساعات العمل</b>
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-4">
              {/* Sunday - Thursday */}
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={settings.workingHours.to}
                    onChange={(e) => updateWorkingHours('to', e.target.value)}
                    label=""
                    className="w-32 px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-black">إلى</span>
                  <Input
                    type="time"
                    value={settings.workingHours.from}
                    onChange={(e) => updateWorkingHours('from', e.target.value)}
                    label=""
                    className="w-32 px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-dark font-medium">الأحد - الخميس</span>
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              {/* Friday */}
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value="21:00"
                    onChange={() => {}}
                    label=""
                    className="w-32 px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-black">إلى</span>
                  <Input
                    type="time"
                    value="09:00"
                    onChange={() => {}}
                    label=""
                    className="w-32 px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-dark font-medium">الجمعة</span>
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
              
              {/* Saturday */}
              <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value="21:00"
                    onChange={() => {}}
                    label=""
                    className="w-32 px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                  />
                  <span className="text-black">إلى</span>
                  <Input
                    type="time"
                    value="09:00"
                    onChange={() => {}}
                    label=""
                    className="w-32 px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-primary-dark font-medium">السبت</span>
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Booking Settings */}
          <div className="w-full shadow-[0px_1px_2px_rgba(0,_0,_0,_0.05)] rounded-2xl bg-white p-6">
            <div className="flex flex-row items-center justify-end gap-2 mb-4">
              <b className="text-lg leading-7 text-primary-dark">إعدادات الحجوزات</b>
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            
            {/* Rest Reservations Section */}
            <div className="mb-6">
              <div className="flex flex-row items-center justify-end mb-3">
                <div className="text-base font-semibold text-seagreen">استراحات</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  type="time"
                  value="14:00"
                  onChange={() => {}}
                  label="وقت تسجيل الدخول"
                  className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                />
                <Input
                  type="time"
                  value="12:00"
                  onChange={() => {}}
                  label="وقت تسجيل الخروج"
                  className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                />
                <Input
                  type="text"
                  value="يوم واحد"
                  onChange={() => {}}
                  label="مدة الحجز الافتراضية"
                  className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                />
                <Input
                  type="text"
                  value="24 ساعة"
                  onChange={() => {}}
                  label="فترة الإلغاء المسموحة"
                  className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Equestrian Sessions Section */}
            <div>
              <div className="flex flex-row items-center justify-end mb-3">
                <div className="text-base font-medium text-seagreen">حصص الفروسية</div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  type="text"
                  value="60 دقيقة"
                  onChange={() => {}}
                  label="مدة الحصة"
                  className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                />
                <Input
                  type="text"
                  value="يومين"
                  onChange={() => {}}
                  label="وقت الإلغاء المسموح"
                  className="w-full px-3 py-2 border border-neutral-dark rounded-lg focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Service Packages - Keep existing */}
          <SettingsSection
            title="باقات الخدمات"
            description="إدارة الخدمات المتاحة والأسعار"
            icon={Package}
          >
            <div className="space-y-4">
              {settings.servicePackages.map((pkg) => (
                <div key={pkg.id} className="bg-neutral-light border border-neutral-dark rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-primary-dark text-base">{pkg.name}</h4>
                    <ToggleSwitch
                      checked={pkg.enabled}
                      onChange={(checked) => updateServicePackage(pkg.id, 'enabled', checked)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      value={pkg.price.toString()}
                      onChange={(e) => updateServicePackage(pkg.id, 'price', parseInt(e.target.value) || 0)}
                      label={t('servicePackages.price')}
                      className="w-full px-3 py-2 text-sm border border-neutral-dark rounded-md focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                    />
                    <Input
                      type="text"
                      value={pkg.duration}
                      onChange={(e) => updateServicePackage(pkg.id, 'duration', e.target.value)}
                      label={t('servicePackages.duration')}
                      className="w-full px-3 py-2 text-sm border border-neutral-dark rounded-md focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Equestrian Sessions - Keep existing */}
          <SettingsSection
            title="خدمات تدريب الفروسية"
            description="إدارة جلسات التدريب والأسعار"
            icon={Mountain}
          >
            <div className="space-y-4">
              {settings.equestrianSessions.map((session) => (
                <div key={session.id} className="bg-neutral-light border border-neutral-dark rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-primary-dark text-base">{session.name}</h4>
                    <ToggleSwitch
                      checked={session.enabled}
                      onChange={(checked) => updateEquestrianSession(session.id, 'enabled', checked)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      type="number"
                      value={session.price.toString()}
                      onChange={(e) => updateEquestrianSession(session.id, 'price', parseInt(e.target.value) || 0)}
                      label={t('equestrianSessions.price')}
                      className="w-full px-3 py-2 text-sm border border-neutral-dark rounded-md focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                    />
                    <Input
                      type="number"
                      value={session.sessions.toString()}
                      onChange={(e) => updateEquestrianSession(session.id, 'sessions', parseInt(e.target.value) || 0)}
                      label={t('equestrianSessions.sessions')}
                      className="w-full px-3 py-2 text-sm border border-neutral-dark rounded-md focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Plant Categories - Keep existing */}
          <SettingsSection
            title="فئات النباتات المتوفرة"
            description="إدارة أنواع النباتات والأسعار"
            icon={Flower}
          >
            <div className="space-y-4">
              {settings.plantCategories.map((category) => (
                <div key={category.id} className="bg-neutral-light border border-neutral-dark rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium text-primary-dark text-base">{category.name}</h4>
                    <ToggleSwitch
                      checked={category.enabled}
                      onChange={(checked) => updatePlantCategory(category.id, 'enabled', checked)}
                    />
                  </div>
                  <div className="w-full max-w-xs">
                    <Input
                      type="number"
                      value={category.price.toString()}
                      onChange={(e) => updatePlantCategory(category.id, 'price', parseInt(e.target.value) || 0)}
                      label={t('plantCategories.price')}
                      className="w-full px-3 py-2 text-sm border border-neutral-dark rounded-md focus:ring-2 bg-neutral-light focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                </div>
              ))}
            </div>
          </SettingsSection>

          {/* Save Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center px-6 py-3 bg-primary text-white font-medium text-sm rounded-lg hover:bg-primary-dark focus:ring-4 focus:ring-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  {t('saving')}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  {t('save')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 