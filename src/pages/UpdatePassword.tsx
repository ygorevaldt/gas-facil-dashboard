import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function UpdatePassword() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    new_password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.put(
        `${apiBaseUrl}/seller`,
        {
          id: user.id,
          password: formData.new_password
        },
        {
          withCredentials: true,
        });

      toast({
        title: "Senha atualizada!",
        description: "Sua nova senha foi salva com sucesso.",
      });

      setFormData({
        email: user?.email || "",
        new_password: "",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar senha",
        description: "Não foi possível atualizar sua senha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md ">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Atualizar Senha</h1>
          <p className="text-muted-foreground">
            Altere sua senha de acesso à plataforma.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Nova Senha</CardTitle>
              <CardDescription>
                Informe seu e-mail e a nova senha desejada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">Nova Senha</Label>
                <Input
                  id="new_password"
                  name="new_password"
                  type="password"
                  value={formData.new_password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar Senha"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
