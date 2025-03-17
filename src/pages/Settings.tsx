
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AccountSettings from '@/components/settings/AccountSettings';
import PrivacySettings from '@/components/settings/PrivacySettings';
import MatchPreferences from '@/components/settings/MatchPreferences';
import CommunicationSettings from '@/components/settings/CommunicationSettings';
import AICompanionSettings from '@/components/settings/AICompanionSettings';
import AccessibilitySettings from '@/components/settings/AccessibilitySettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AppCustomization from '@/components/settings/AppCustomization';
import FeedbackSupport from '@/components/settings/FeedbackSupport';
import { useSettings } from '@/context/SettingsContext';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const { settings, isLoading, saveAllSettings } = useSettings();

  const handleBack = () => {
    navigate('/profile');
  };

  const handleSaveAll = async () => {
    await saveAllSettings();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-love animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark">
      <div className="page-container hide-scrollbar">
        <header className="container max-w-xl mx-auto px-4 pt-4 mb-4 flex items-center justify-between">
          <button onClick={handleBack} className="text-white">
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-gradient">Settings</h1>
          <div className="w-12"></div> {/* For balance */}
        </header>

        <main className="container max-w-xl mx-auto px-4">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            {/* Account Tab Group */}
            <TabsContent value="account" className="space-y-4">
              <AccountSettings />
              <PrivacySettings />
              <SecuritySettings />
            </TabsContent>

            {/* Preferences Tab Group */}
            <TabsContent value="preferences" className="space-y-4">
              <MatchPreferences />
              <CommunicationSettings />
              <AppCustomization />
            </TabsContent>

            {/* Advanced Tab Group */}
            <TabsContent value="advanced" className="space-y-4">
              <AICompanionSettings />
              <AccessibilitySettings />
              <FeedbackSupport />
            </TabsContent>
          </Tabs>

          <div className="sticky bottom-[80px] left-0 right-0 p-4 bg-gradient-to-t from-island-dark to-transparent">
            <Button 
              onClick={handleSaveAll}
              className="w-full bg-love hover:bg-love/90"
            >
              Save All Changes
            </Button>
          </div>
        </main>
      </div>

      <Navbar />
    </div>
  );
};

export default Settings;
