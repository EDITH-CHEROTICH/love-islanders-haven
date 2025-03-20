import { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smile, Frown, Users, Clock, Eye, Heart } from 'lucide-react';
import { fetchProfileStats, fetchDemographics, ProfileStats } from '@/services/profiles/analytics';

interface AgeDistribution {
  age: string;
  count: number;
}

interface LocationDistribution {
  location: string;
  count: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#F39C12'];

const ProfileInsights = () => {
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [ageDistribution, setAgeDistribution] = useState<AgeDistribution[]>([]);
  const [locationDistribution, setLocationDistribution] = useState<LocationDistribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProfileStats(timeRange)
      .then(data => setStats(data))
      .catch(error => console.error('Error fetching profile stats:', error))
      .finally(() => setIsLoading(false));
    
    fetchDemographics()
      .then(data => {
        setAgeDistribution(data.age);
        setLocationDistribution(data.location);
      })
      .catch(error => console.error('Error fetching demographics:', error));
  }, [timeRange]);

  if (isLoading && !stats) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Profile Insights</CardTitle>
          <CardDescription>Loading your profile performance data...</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-4 w-32 bg-muted rounded"></div>
            <div className="h-32 w-full bg-muted rounded"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Insights</CardTitle>
            <CardDescription>See how your profile is performing</CardDescription>
          </div>
          <div className="flex items-center">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="week" 
                onClick={() => setTimeRange('week')}
                className={timeRange === 'week' ? 'data-[state=active]:bg-love/20' : ''}
              >
                Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => setTimeRange('month')}
                className={timeRange === 'month' ? 'data-[state=active]:bg-love/20' : ''}
              >
                Month
              </TabsTrigger>
              <TabsTrigger 
                value="year" 
                onClick={() => setTimeRange('year')}
                className={timeRange === 'year' ? 'data-[state=active]:bg-love/20' : ''}
              >
                Year
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Eye className="mb-2 text-love h-5 w-5" />
                  <p className="text-sm text-muted-foreground">Profile Views</p>
                  <h3 className="text-2xl font-bold">{stats?.views || 0}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Heart className="mb-2 text-love h-5 w-5" />
                  <p className="text-sm text-muted-foreground">Likes</p>
                  <h3 className="text-2xl font-bold">{stats?.likes || 0}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Users className="mb-2 text-love h-5 w-5" />
                  <p className="text-sm text-muted-foreground">Matches</p>
                  <h3 className="text-2xl font-bold">{stats?.matches || 0}</h3>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <Clock className="mb-2 text-love h-5 w-5" />
                  <p className="text-sm text-muted-foreground">Avg. Response</p>
                  <h3 className="text-2xl font-bold">{stats?.averageResponseTime || 0}m</h3>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                <CardDescription>
                  {stats?.conversionRate ? stats.conversionRate.toFixed(1) : 0}% of likes lead to matches
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Views', value: stats?.views || 0 },
                        { name: 'Likes', value: stats?.likes || 0 },
                        { name: 'Matches', value: stats?.matches || 0 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#FF6B8B" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Age Distribution</CardTitle>
                  <CardDescription>
                    Age ranges of people who view your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ageDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="age"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {ageDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location Distribution</CardTitle>
                  <CardDescription>
                    Locations of people who view your profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={locationDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="location"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {locationDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="engagement" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Rate</CardTitle>
                <CardDescription>
                  How often you respond to messages
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <div className="relative w-32 h-32">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-2xl font-bold">{stats?.responseRate || 0}%</p>
                  </div>
                  <svg className="w-32 h-32" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#FF6B8B"
                      strokeWidth="3"
                      strokeDasharray={`${stats?.responseRate || 0}, 100`}
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="flex items-center mb-2">
                    <Smile className="text-green-500 h-10 w-10 mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Positive Responses</p>
                      <p className="text-2xl font-bold">62%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                  <div className="flex items-center mb-2">
                    <Frown className="text-rose-500 h-10 w-10 mr-2" />
                    <div>
                      <p className="text-sm text-muted-foreground">Message Ghosting</p>
                      <p className="text-2xl font-bold">23%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfileInsights;
