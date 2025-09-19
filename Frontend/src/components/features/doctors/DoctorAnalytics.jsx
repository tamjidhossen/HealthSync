import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Calendar,
  Users,
  TrendingUp,
  Heart,
  Clock,
  Star,
  UserPlus,
  Activity,
} from "lucide-react";
import doctorData from "@/data/doctor-data";

const DoctorAnalytics = () => {
  const { analytics } = doctorData;
  const { dailyStats, weeklyStats, monthlyTrends, conditionBreakdown } =
    analytics;

  const COLORS = [
    "#53a2e3",
    "#a5ccff",
    "#e1eeff",
    "#82ca9d",
    "#ffc658",
    "#ff7c7c",
  ];

  return (
    <div className="space-y-6">
      {/* Daily Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Total</p>
                <p className="text-2xl font-bold text-primary">
                  {dailyStats.totalAppointments}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {dailyStats.completedAppointments}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-blue-600">
                  {dailyStats.pendingAppointments}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Patients</p>
                <p className="text-2xl font-bold text-orange-600">
                  {dailyStats.newPatients}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Follow-ups</p>
                <p className="text-2xl font-bold text-purple-600">
                  {dailyStats.followUps}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {weeklyStats.patientSatisfaction}
                </p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">
                {weeklyStats.appointmentsThisWeek}
              </p>
              <p className="text-sm text-muted-foreground">
                Total Appointments
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {weeklyStats.avgPatientsPerDay}
              </p>
              <p className="text-sm text-muted-foreground">Avg Patients/Day</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-600">
                {weeklyStats.mostCommonCondition}
              </p>
              <p className="text-sm text-muted-foreground">Most Common</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {weeklyStats.patientSatisfaction}⭐
              </p>
              <p className="text-sm text-muted-foreground">Satisfaction</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke="#53a2e3"
                  strokeWidth={2}
                  name="Appointments"
                />
                <Line
                  type="monotone"
                  dataKey="newPatients"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="New Patients"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Condition Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Condition Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={conditionBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ condition, percentage }) =>
                    `${condition}: ${percentage}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {conditionBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Appointment Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointment Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="appointments" fill="#53a2e3" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Condition Details */}
        <Card>
          <CardHeader>
            <CardTitle>Top Conditions Treated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conditionBreakdown.slice(0, 5).map((condition, index) => (
                <div
                  key={condition.condition}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="font-medium">{condition.condition}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{condition.count} patients</Badge>
                    <span className="text-sm text-muted-foreground">
                      {condition.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="mb-2">
                <Users className="h-12 w-12 mx-auto text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Total Patients</h3>
              <p className="text-3xl font-bold text-primary">245</p>
              <p className="text-sm text-muted-foreground">
                Lifetime patients treated
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <Star className="h-12 w-12 mx-auto text-yellow-500" />
              </div>
              <h3 className="font-semibold text-lg">Patient Rating</h3>
              <p className="text-3xl font-bold text-yellow-500">4.8/5.0</p>
              <p className="text-sm text-muted-foreground">
                Based on 189 reviews
              </p>
            </div>

            <div className="text-center">
              <div className="mb-2">
                <TrendingUp className="h-12 w-12 mx-auto text-green-500" />
              </div>
              <h3 className="font-semibold text-lg">Success Rate</h3>
              <p className="text-3xl font-bold text-green-500">94%</p>
              <p className="text-sm text-muted-foreground">
                Treatment success rate
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAnalytics;
