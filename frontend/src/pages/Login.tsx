import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Users, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/api/client";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  username: z.string().min(1, "Username é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

type LoginForm = z.infer<typeof schema>;

export default function Login() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      const res = await authApi.login(data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify({ username: res.data.username, nome: res.data.nome }));
      navigate("/");
    } catch {
      toast({ title: "Credenciais inválidas", description: "Verifique username e senha.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shadow-[0_0_32px_rgba(34,197,94,0.2)]">
            <Users size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold">ClienteHub</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de clientes com Spring Boot + React</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="admin"
                autoComplete="username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPwd(!showPwd)}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                <span className="flex items-center gap-2"><Lock size={16} /> Entrar</span>
              )}
            </Button>
          </form>

          <div className="mt-4 p-3 rounded-md bg-muted/40 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              Credenciais padrão: <code className="text-foreground font-mono">admin</code> / <code className="text-foreground font-mono">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
