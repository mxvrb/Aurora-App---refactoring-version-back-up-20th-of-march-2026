import React, { useState } from 'react';
import { Clock, MapPin, RefreshCw, Save, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

export const BookingSettings: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Booking Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage availability, locations, and integrations.</p>
        </div>

        <Tabs defaultValue="hours" className="w-full">
          <TabsList className="mb-6 w-full justify-start bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 h-auto">
            <TabsTrigger value="hours" className="px-6 py-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <Clock className="w-4 h-4 mr-2" /> Opening Hours
            </TabsTrigger>
            <TabsTrigger value="locations" className="px-6 py-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <MapPin className="w-4 h-4 mr-2" /> Locations
            </TabsTrigger>
            <TabsTrigger value="sync" className="px-6 py-2 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <RefreshCw className="w-4 h-4 mr-2" /> Integrations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hours">
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>Set your standard operating hours for reservations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <div className="w-32 font-medium">{day}</div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue="09:00" className="w-32" />
                        <span>to</span>
                        <Input type="time" defaultValue="22:00" className="w-32" />
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Switch defaultChecked />
                        <span className="text-sm text-gray-500">Open</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Locations</CardTitle>
                    <CardDescription>Manage multiple restaurant or venue locations.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="w-4 h-4" /> Add Location
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Downtown Branch', address: '123 Main St, New York, NY' },
                  { name: 'Seaside Deck', address: '45 Ocean Dr, Miami, FL' }
                ].map((loc, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{loc.name}</h4>
                      <p className="text-sm text-gray-500">{loc.address}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync">
            <Card>
              <CardHeader>
                <CardTitle>Platform Sync</CardTitle>
                <CardDescription>Bidirectional synchronization with external booking platforms.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { name: 'OpenTable', connected: true, lastSync: '2 mins ago' },
                  { name: 'Resy', connected: false, lastSync: '-' },
                  { name: 'SevenRooms', connected: false, lastSync: '-' },
                  { name: 'TripAdvisor', connected: true, lastSync: '1 hour ago' }
                ].map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${platform.connected ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{platform.name}</h4>
                        <p className="text-xs text-gray-500">
                          {platform.connected ? `Last synced: ${platform.lastSync}` : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{platform.connected ? 'Active' : 'Inactive'}</span>
                      <Switch checked={platform.connected} />
                    </div>
                  </div>
                ))}
                
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex items-start gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 text-sm">Real-time Sync</h5>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        When enabled, reservations made on external platforms will appear on your Aces AI calendar instantly.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
