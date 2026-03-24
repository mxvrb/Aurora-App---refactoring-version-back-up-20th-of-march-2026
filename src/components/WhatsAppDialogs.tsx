import React from 'react';
import { Check } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface WhatsAppDialogsProps {
  // Configure Name Dialog
  showConfigureNameDialog: boolean;
  setShowConfigureNameDialog: (show: boolean) => void;
  tempBusinessName: string;
  setTempBusinessName: (name: string) => void;
  handleSaveBusinessName: () => void;

  // Edit Bio Dialog
  showEditBioDialog: boolean;
  setShowEditBioDialog: (show: boolean) => void;
  tempBio: string;
  setTempBio: (bio: string) => void;
  handleSaveBio: () => void;

  // Add Website Dialog
  showAddWebsiteDialog: boolean;
  setShowAddWebsiteDialog: (show: boolean) => void;
  tempWebsite: string;
  setTempWebsite: (website: string) => void;
  handleSaveWebsite: () => void;

  // Add Email Dialog
  showAddEmailDialog: boolean;
  setShowAddEmailDialog: (show: boolean) => void;
  tempBusinessEmail: string;
  setTempBusinessEmail: (email: string) => void;
  handleSaveEmail: () => void;

  // Choose Model Dialog
  showChooseModelDialog: boolean;
  setShowChooseModelDialog: (show: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;

  // Select Timezone Dialog
  showSelectTimezoneDialog: boolean;
  setShowSelectTimezoneDialog: (show: boolean) => void;
  tempTimezone: string;
  setTempTimezone: (timezone: string) => void;
  handleSaveTimezone: () => void;
}

export function WhatsAppDialogs({
  showConfigureNameDialog,
  setShowConfigureNameDialog,
  tempBusinessName,
  setTempBusinessName,
  handleSaveBusinessName,
  showEditBioDialog,
  setShowEditBioDialog,
  tempBio,
  setTempBio,
  handleSaveBio,
  showAddWebsiteDialog,
  setShowAddWebsiteDialog,
  tempWebsite,
  setTempWebsite,
  handleSaveWebsite,
  showAddEmailDialog,
  setShowAddEmailDialog,
  tempBusinessEmail,
  setTempBusinessEmail,
  handleSaveEmail,
  showChooseModelDialog,
  setShowChooseModelDialog,
  selectedModel,
  setSelectedModel,
  showSelectTimezoneDialog,
  setShowSelectTimezoneDialog,
  tempTimezone,
  setTempTimezone,
  handleSaveTimezone,
}: WhatsAppDialogsProps) {
  return (
    <>
      {/* Configure Name - Inline fallback */}
      {showConfigureNameDialog && <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px'}}>
          <h2 style={{marginBottom: '1rem', color: 'black'}}>Configure Name</h2>
          <input 
            type="text" 
            value={tempBusinessName}
            onChange={(e) => setTempBusinessName(e.target.value)}
            style={{width: '100%', padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', color: 'black'}}
            placeholder="Enter AI name"
          />
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
            <button onClick={() => setShowConfigureNameDialog(false)} style={{padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white', cursor: 'pointer'}}>Cancel</button>
            <button onClick={handleSaveBusinessName} style={{padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>Save</button>
          </div>
        </div>
      </div>}
      <Dialog open={showConfigureNameDialog} onOpenChange={setShowConfigureNameDialog} style={{display: 'none'}}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Configure Name</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Set the name of your AI for WhatsApp
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name" className="text-gray-900 dark:text-gray-100">AI Name</Label>
              <Input
                id="business-name"
                placeholder="Enter AI name (e.g., AcesAI, Assistant, Support Bot)"
                value={tempBusinessName}
                onChange={(e) => setTempBusinessName(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowConfigureNameDialog(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveBusinessName}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Bio Dialog */}
      <Dialog open={showEditBioDialog} onOpenChange={setShowEditBioDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Edit Bio</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Add a description about your business
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-gray-900 dark:text-gray-100">Bio</Label>
              <textarea
                id="bio"
                placeholder="Enter your business bio"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowEditBioDialog(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveBio}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Website Dialog */}
      <Dialog open={showAddWebsiteDialog} onOpenChange={setShowAddWebsiteDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Add Website</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter your business website URL
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="website" className="text-gray-900 dark:text-gray-100">Website URL</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={tempWebsite}
                onChange={(e) => setTempWebsite(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddWebsiteDialog(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveWebsite}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Email Dialog */}
      <Dialog open={showAddEmailDialog} onOpenChange={setShowAddEmailDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Add Email</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter your business contact email
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-email" className="text-gray-900 dark:text-gray-100">Email Address</Label>
              <Input
                id="business-email"
                type="email"
                placeholder="contact@example.com"
                value={tempBusinessEmail}
                onChange={(e) => setTempBusinessEmail(e.target.value)}
                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddEmailDialog(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEmail}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Choose AI Model Dialog */}
      <Dialog open={showChooseModelDialog} onOpenChange={setShowChooseModelDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Choose AI Model</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Select the AI model for your chatbot
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { id: 'GPT-4o', desc: "OpenAI's latest flagship model" },
                { id: 'GPT-4o Mini', desc: "Fast & cost-effective OpenAI model" },
                { id: 'Claude 3.5 Sonnet', desc: "Anthropic's most intelligent model" },
                { id: 'Claude 3 Opus', desc: "Fast & precise Anthropic model" },
                { id: 'Gemini 1.5 Pro', desc: "Google's latest multilingual model" },
              ].map(({ id, desc }) => (
                <div 
                  key={id}
                  onClick={() => setSelectedModel(id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedModel === id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{id}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{desc}</div>
                    </div>
                    {selectedModel === id && <Check className="w-5 h-5 text-blue-500" />}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowChooseModelDialog(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  setShowChooseModelDialog(false);
                  toast.success(`AI model changed to ${selectedModel}`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Select Timezone Dialog */}
      <Dialog open={showSelectTimezoneDialog} onOpenChange={setShowSelectTimezoneDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Select Timezone</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Choose your business timezone
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-gray-900 dark:text-gray-100">Timezone</Label>
              <Select value={tempTimezone} onValueChange={setTempTimezone}>
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                  <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                  <SelectItem value="America/Phoenix">Arizona (MST)</SelectItem>
                  <SelectItem value="America/Anchorage">Alaska (AKT)</SelectItem>
                  <SelectItem value="Pacific/Honolulu">Hawaii (HST)</SelectItem>
                  <SelectItem value="Europe/London">London (GMT)</SelectItem>
                  <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  <SelectItem value="Europe/Berlin">Berlin (CET)</SelectItem>
                  <SelectItem value="Asia/Dubai">Dubai (GST)</SelectItem>
                  <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                  <SelectItem value="Australia/Sydney">Sydney (AEDT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setShowSelectTimezoneDialog(false)}
                className="border-gray-300 dark:border-gray-600"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTimezone}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
