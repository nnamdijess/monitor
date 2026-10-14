"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SystemOverview {
  cpu_percent: number;
  ram_total_gb: number;
  ram_used_gb: number;
  ram_percent: number;
  disk_total_gb: number;
  disk_used_gb: number;
  disk_percent: number;
  uptime_seconds: number;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${days}d ${hours}h ${mins}m`;
}

export default function Dashboard() {
  const [data, setData] = useState<SystemOverview | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/system/overview");
        const json = await res.json();
        setData(json);
      } catch {
        setError(true);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Monitor</h1>
          <Badge variant={error ? "destructive" : "default"}>
            {error ? "Offline" : "Live"}
          </Badge>
        </div>

        {!data ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">CPU</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.cpu_percent}%</p>
                <Progress value={data.cpu_percent} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">RAM</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.ram_percent}%</p>
                <p className="text-gray-400 text-sm">
                  {data.ram_used_gb}GB / {data.ram_total_gb}GB
                </p>
                <Progress value={data.ram_percent} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Disk</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{data.disk_percent}%</p>
                <p className="text-gray-400 text-sm">
                  {data.disk_used_gb}GB / {data.disk_total_gb}GB
                </p>
                <Progress value={data.disk_percent} className="mt-2" />
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatUptime(data.uptime_seconds)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}