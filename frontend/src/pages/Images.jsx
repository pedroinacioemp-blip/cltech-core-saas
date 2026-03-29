import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { Upload, Image as ImageIcon, Send, Loader2 } from 'lucide-react';

export default function ImageGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { accessToken } = useAuthStore();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/images`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setImages(res.data.images);
    } catch (err) {
      console.error('Erro ao buscar imagens:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('caption', caption);

    try {
      await axios.post(`${API_URL}/api/images/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setCaption('');
      setSelectedFile(null);
      setPreview(null);
      fetchImages();
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar />
      
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mb-2">
              Galeria de Imagens & Legendas
            </h1>
            <p className="text-gray-400">Gerencie suas mídias para envio direto via API.</p>
          </header>

          {/* Upload Section */}
          <Card className="mb-10 bg-gray-900/50 border-gray-800">
            <form onSubmit={handleUpload} className="space-y-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative group cursor-pointer border-2 border-dashed border-gray-700 hover:border-green-500 rounded-xl transition-all h-64 flex flex-col items-center justify-center bg-gray-800/30">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-500 group-hover:text-green-400 mb-4" />
                      <p className="text-gray-400 group-hover:text-green-400">Clique para selecionar imagem</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    accept="image/*"
                  />
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-300">Legenda da Imagem</label>
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Escreva a legenda que será enviada com a imagem..."
                      className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-green-500 outline-none resize-none"
                    />
                  </div>
                  <button
                    disabled={uploading || !selectedFile}
                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20"
                  >
                    {uploading ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                    {uploading ? 'Enviando...' : 'Salvar na API'}
                  </button>
                </div>
              </div>
            </form>
          </Card>

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1,2,3].map(i => <div key={i} className="h-64 bg-gray-900 rounded-xl animate-pulse" />)
            ) : images.length > 0 ? (
              images.map((img) => (
                <div key={img.id} className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-green-500/50 transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2 italic">"{img.caption || 'Sem legenda'}"</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">{new Date(img.created_at).toLocaleDateString()}</span>
                      <button className="text-xs text-green-400 hover:underline">Copiar Link API</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center text-gray-500">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Nenhuma imagem armazenada ainda.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
