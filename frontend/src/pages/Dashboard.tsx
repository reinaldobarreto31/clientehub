import { useQuery } from "@tanstack/react-query";
import { Users, UserCheck, UserMinus, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientesApi } from "@/api/client";
import type { PageResponse, Cliente } from "@/types";

interface StatCard {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export default function Dashboard() {
  const { data: ativos } = useQuery<PageResponse<Cliente>>({
    queryKey: ["clientes", "ATIVO"],
    queryFn: async () => (await clientesApi.listar({ status: "ATIVO", size: 1 })).data,
  });
  const { data: inativos } = useQuery<PageResponse<Cliente>>({
    queryKey: ["clientes", "INATIVO"],
    queryFn: async () => (await clientesApi.listar({ status: "INATIVO", size: 1 })).data,
  });
  const { data: prospectos } = useQuery<PageResponse<Cliente>>({
    queryKey: ["clientes", "PROSPECTO"],
    queryFn: async () => (await clientesApi.listar({ status: "PROSPECTO", size: 1 })).data,
  });
  const { data: todos } = useQuery<PageResponse<Cliente>>({
    queryKey: ["clientes", "todos"],
    queryFn: async () => (await clientesApi.listar({ size: 1 })).data,
  });

  const stats: StatCard[] = [
    {
      title: "Total de Clientes",
      value: todos?.totalElements ?? "—",
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      title: "Clientes Ativos",
      value: ativos?.totalElements ?? "—",
      icon: UserCheck,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      title: "Clientes Inativos",
      value: inativos?.totalElements ?? "—",
      icon: UserMinus,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
    {
      title: "Prospectos",
      value: prospectos?.totalElements ?? "—",
      icon: TrendingUp,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Visão geral da base de clientes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.title} className="border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.title}</CardTitle>
              <div className={`p-2 rounded-lg border ${s.bg}`}>
                <s.icon size={16} className={s.color} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-xl border bg-card">
        <h2 className="font-semibold mb-1">Stack técnica</h2>
        <p className="text-sm text-muted-foreground mb-4">Este projeto demonstra integração full-stack com as tecnologias abaixo.</p>
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ["Backend", "Spring Boot 3 · Spring Security · JWT · JPA/Hibernate · PostgreSQL"],
            ["API Docs", "OpenAPI 3 / Swagger UI em /swagger-ui.html"],
            ["Frontend", "React 18 · Tailwind CSS · React Query · shadcn/ui"],
            ["Infra", "Docker Compose · GitHub Actions CI"],
          ].map(([label, value]) => (
            <div key={label} className="flex gap-3 p-3 rounded-md bg-muted/30 border border-border">
              <span className="font-mono text-xs text-primary font-bold w-20 shrink-0">{label}</span>
              <span className="text-muted-foreground text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
