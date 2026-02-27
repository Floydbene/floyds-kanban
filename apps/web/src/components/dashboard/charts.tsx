import {
  AreaChart,
  Area,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useThroughput,
  useCycleTime,
  usePriorityDistribution,
  useLabelDistribution,
} from '@/hooks/queries/use-dashboard'

const priorityColors = ['#ef4444', '#f97316', '#eab308', '#3b82f6']

function ChartTooltipContent({ active, payload, label, valueLabel }: {
  active?: boolean
  payload?: { value: number }[]
  label?: string
  valueLabel?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold">
        {valueLabel ?? 'Value'}: {payload[0].value}
      </p>
    </div>
  )
}

export function ThroughputChart({ projectId }: { projectId?: string }) {
  const { data, isLoading } = useThroughput(projectId)

  if (isLoading) return <ChartSkeleton title="Throughput" />

  const chartData = data?.map((d) => ({
    ...d,
    label: format(new Date(d.date), 'MMM d'),
  })) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Throughput</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="throughputGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" allowDecimals={false} />
            <Tooltip content={<ChartTooltipContent valueLabel="Completed" />} />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#throughputGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function CycleTimeChart({ projectId }: { projectId?: string }) {
  const { data, isLoading } = useCycleTime(projectId)

  if (isLoading) return <ChartSkeleton title="Cycle Time" />

  const chartData = data?.map((d) => ({
    ...d,
    label: format(new Date(d.date), 'MMM d'),
  })) ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cycle Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" unit="d" />
            <Tooltip content={<ChartTooltipContent valueLabel="Avg Days" />} />
            <Line type="monotone" dataKey="avgDays" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function PriorityDistributionChart({ projectId }: { projectId?: string }) {
  const { data, isLoading } = usePriorityDistribution(projectId)

  if (isLoading) return <ChartSkeleton title="Priority Distribution" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Priority Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data ?? []}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
            >
              {(data ?? []).map((entry, i) => (
                <Cell key={entry.name} fill={entry.color || priorityColors[i % priorityColors.length]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload as { name: string; value: number }
                return (
                  <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-muted-foreground">{d.value} tasks</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3">
          {(data ?? []).map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5 text-xs">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color || priorityColors[i % priorityColors.length] }}
              />
              {item.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function LabelDistributionChart({ projectId }: { projectId?: string }) {
  const { data, isLoading } = useLabelDistribution(projectId)

  if (isLoading) return <ChartSkeleton title="Label Distribution" />

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Label Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data ?? []} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" allowDecimals={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" width={80} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const d = payload[0].payload as { name: string; value: number }
                return (
                  <div className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md">
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-muted-foreground">{d.value} tasks</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {(data ?? []).map((entry) => (
                <Cell key={entry.name} fill={entry.color || '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

function ChartSkeleton({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-60 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}
