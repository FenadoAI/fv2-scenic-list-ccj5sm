import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Plus, Edit, Check, X } from 'lucide-react';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API = `${API_BASE}/api`;

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [editingTodo, setEditingTodo] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;
    
    try {
      const response = await axios.post(`${API}/todos`, newTodo);
      setTodos([...todos, response.data]);
      setNewTodo({ title: '', description: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const response = await axios.put(`${API}/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => todo.id === id ? response.data : todo));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTodo({ title: todo.title, description: todo.description });
  };

  const saveEdit = async () => {
    if (!editingTodo.title.trim()) return;
    
    try {
      const response = await axios.put(`${API}/todos/${editingId}`, editingTodo);
      setTodos(todos.map(todo => todo.id === editingId ? response.data : todo));
      setEditingId(null);
      setEditingTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTodo({ title: '', description: '' });
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-purple-500/20 to-pink-400/20"></div>
      <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              ✨ Todo Bliss
            </h1>
            <p className="text-white/90 text-lg drop-shadow">
              Organize your thoughts, achieve your dreams
            </p>
            {totalCount > 0 && (
              <div className="mt-4">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-lg px-4 py-2">
                  {completedCount} of {totalCount} completed
                </Badge>
              </div>
            )}
          </div>

          {/* Add Todo Button */}
          <div className="flex justify-center mb-8">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  size="lg" 
                  className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-200 shadow-xl"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Todo
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-xl border border-white/50">
                <DialogHeader>
                  <DialogTitle className="text-gray-800">Create New Todo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="What needs to be done?"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="bg-white/80 border-gray-200"
                  />
                  <Textarea
                    placeholder="Add a description (optional)"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    className="bg-white/80 border-gray-200"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addTodo} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Add Todo
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Todo List */}
          <div className="grid gap-4">
            {todos.length === 0 ? (
              <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-center py-12">
                <CardContent>
                  <p className="text-white/80 text-lg">No todos yet. Add your first todo to get started! 🎯</p>
                </CardContent>
              </Card>
            ) : (
              todos.map((todo) => (
                <Card 
                  key={todo.id} 
                  className={`bg-white/15 backdrop-blur-md border border-white/20 transition-all duration-200 hover:bg-white/20 hover:shadow-xl ${
                    todo.completed ? 'opacity-70' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                        className="mt-1 border-white/50 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
                      />
                      
                      <div className="flex-1 min-w-0">
                        {editingId === todo.id ? (
                          <div className="space-y-3">
                            <Input
                              value={editingTodo.title}
                              onChange={(e) => setEditingTodo({ ...editingTodo, title: e.target.value })}
                              className="bg-white/80 border-gray-200"
                            />
                            <Textarea
                              value={editingTodo.description}
                              onChange={(e) => setEditingTodo({ ...editingTodo, description: e.target.value })}
                              className="bg-white/80 border-gray-200"
                            />
                            <div className="flex gap-2">
                              <Button onClick={saveEdit} size="sm" className="bg-green-500 hover:bg-green-600">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button onClick={cancelEdit} size="sm" variant="outline">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <h3 className={`text-lg font-semibold text-white mb-2 ${
                              todo.completed ? 'line-through opacity-60' : ''
                            }`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className={`text-white/80 mb-3 ${
                                todo.completed ? 'line-through opacity-60' : ''
                              }`}>
                                {todo.description}
                              </p>
                            )}
                            <p className="text-white/60 text-sm">
                              Created: {new Date(todo.created_at).toLocaleDateString()}
                            </p>
                          </>
                        )}
                      </div>
                      
                      {editingId !== todo.id && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => startEdit(todo)}
                            size="sm"
                            variant="ghost"
                            className="text-white/80 hover:text-white hover:bg-white/20"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteTodo(todo.id)}
                            size="sm"
                            variant="ghost"
                            className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;