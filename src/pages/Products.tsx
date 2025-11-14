import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function Products() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const serviceUnavailable = {
    title: 'Serviço indisponível',
    description: 'Tente novamente mais tarde',
  }
  const { toast } = useToast();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    description: ''
  });

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(`${apiBaseUrl}/product/seller`, { withCredentials: true })
      .then((resp) => {
        setProducts(resp.data)
      })
      .catch((error) => {
        toast(serviceUnavailable);
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (editingProduct) {
      try {
        await axios.put(
          `${apiBaseUrl}/product`,
          { ...formData, price: parseFloat(formData.price), id: editingProduct.id },
          { withCredentials: true }
        )

        setProducts(prev => prev.map(p =>
          p.id === editingProduct.id
            ? { ...p, ...formData, price: parseFloat(formData.price) }
            : p
        ));
        toast({
          title: 'Produto atualizado!',
          description: 'As alterações foram salvas com sucesso.',
        });
      } catch (error) {
        toast(serviceUnavailable);
      }
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
      };

      try {
        await axios.post(
          `${apiBaseUrl}/product`,
          newProduct,
          { withCredentials: true }
        )
        setProducts(prev => [...prev, newProduct]);
        toast({
          title: 'Produto criado!',
          description: 'Novo produto adicionado com sucesso.',
        });
      } catch (error) {
        toast(serviceUnavailable);
      }
    }
    setIsLoading(false);
    setIsOpen(false);
    setFormData({ id: '', name: '', price: '', description: '' });
    setEditingProduct(null);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description
    });
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);

    try {
      await axios.delete(`${apiBaseUrl}/product/${id}`, { withCredentials: true })
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Produto removido',
        description: 'O produto foi excluído com sucesso.',
      });
    } catch (error) {
      toast(serviceUnavailable);
    } finally {
      setIsLoading(false);
    }

  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setEditingProduct(null);
      setFormData({ id: '', name: '', price: '', description: '' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Meus Produtos</h1>
            <p className="text-muted-foreground">
              Gerencie seu catálogo de produtos disponíveis
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild className='w-full md:w-auto'>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
                <DialogDescription>
                  {editingProduct
                    ? 'Altere as informações do produto'
                    : 'Adicione um novo produto ao seu catálogo'
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Botijão P13 - 13kg"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Descrição do produto"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    placeholder="95.00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      editingProduct ? 'Salvar Alterações' : 'Criar Produto'
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{product.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Preço</span>
                    <span className="text-lg font-bold text-primary">
                      R$ {product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhum produto cadastrado ainda
              </p>
              <Button onClick={() => setIsOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
