import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientesApi } from "@/api/client";
import { toast } from "@/hooks/use-toast";
import ClienteTable from "@/components/ClienteTable";
import ClienteForm from "@/components/ClienteForm";
import type { Cliente, PageResponse, ClienteRequest } from "@/types";

export default function Clientes() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);

  const { data, isLoading, refetch } = useQuery<PageResponse<Cliente>>({
    queryKey: ["clientes-list", search, statusFilter, page],
    queryFn: async () =>
      (await clientesApi.listar({ search: search || undefined, status: statusFilter || undefined, page, size: 10 })).data,
  });

  const createMutation = useMutation({
    mutationFn: (req: ClienteRequest) => clientesApi.criar(req),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setDialogOpen(false);
      toast({ title: "Cliente criado com sucesso!" });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Erro ao criar cliente";
      toast({ title: msg, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ClienteRequest }) => clientesApi.atualizar(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      setDialogOpen(false);
      setEditing(null);
      toast({ title: "Cliente atualizado com sucesso!" });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Erro ao atualizar cliente";
      toast({ title: msg, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => clientesApi.deletar(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["clientes"] });
      toast({ title: "Cliente removido." });
    },
    onError: () => toast({ title: "Erro ao remover cliente", variant: "destructive" }),
  });

  function openCreate() { setEditing(null); setDialogOpen(true); }
  function openEdit(c: Cliente) { setEditing(c); setDialogOpen(true); }

  function handleSubmit(req: ClienteRequest) {
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: req });
    } else {
      createMutation.mutate(req);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {data ? `${data.totalElements} cliente${data.totalElements !== 1 ? "s" : ""} cadastrado${data.totalElements !== 1 ? "s" : ""}` : "Carregando..."}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus size={16} /> Novo Cliente
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todos os status</option>
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
          <option value="PROSPECTO">Prospecto</option>
        </select>
        <Button variant="outline" size="icon" onClick={() => refetch()} title="Atualizar">
          <RefreshCw size={16} />
        </Button>
      </div>

      <ClienteTable
        clientes={data?.content ?? []}
        loading={isLoading}
        onEdit={openEdit}
        onDelete={(c) => deleteMutation.mutate(c.id)}
        page={page}
        totalPages={data?.totalPages ?? 0}
        onPageChange={setPage}
      />

      <ClienteForm
        open={dialogOpen}
        onOpenChange={(v) => { setDialogOpen(v); if (!v) setEditing(null); }}
        onSubmit={handleSubmit}
        cliente={editing}
        loading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
