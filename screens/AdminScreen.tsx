import React, { useState, useEffect } from 'react';
import { User, MenuItem, UserRole, MenuItemCategory } from '../types';
import { api, NewMenuItem, NewCategory } from '../services/mockApi';

const initialFormState: NewMenuItem = {
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    image_url: '',
    key_features: {
        // FIX: Changed 'composition' to 'ingredients' to match the MenuItem type definition.
        ingredients: [],
        allergens: [],
    },
    is_active: true,
};

export const AdminScreen: React.FC<{ currentUser: User }> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState('content');
    const [users, setUsers] = useState<User[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<MenuItemCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<NewMenuItem>(initialFormState);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    
    // FIX: Renamed state variable to match the 'ingredients' property.
    const [ingredientsStr, setIngredientsStr] = useState('');
    const [allergensStr, setAllergensStr] = useState('');

    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const [usersData, menuItemsData, categoriesData] = await Promise.all([
                api.getAllUsers(),
                api.getMenuItems(),
                api.getCategories(),
            ]);
            setUsers(usersData);
            setMenuItems(menuItemsData);
            setCategories(categoriesData);

            if (categoriesData.length > 0) {
                // Set initial category for the form
                const defaultCategoryId = categoriesData[0].id;
                setNewItem(prev => ({ ...prev, category_id: defaultCategoryId }));
                initialFormState.category_id = defaultCategoryId;
            }
            setIsLoading(false);
        }
        fetchData();
    }, []);
    
    const contentManagerRoles: UserRole[] = [
      UserRole.SUPER_ADMIN, 
      UserRole.GENERAL_MANAGER,
      UserRole.CHEF,
      UserRole.BAR_MANAGER,
      UserRole.PASTRY_CHEF,
    ];
    const canManageContent = currentUser.roles.some(role => contentManagerRoles.includes(role));
    const canManageUsers = currentUser.roles.includes(UserRole.GENERAL_MANAGER) || currentUser.roles.includes(UserRole.SUPER_ADMIN);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: name === 'price' || name === 'category_id' ? Number(value) : value }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!newItem.name || !newItem.description || newItem.price <= 0 || !newItem.category_id) {
            setFormError('Пожалуйста, заполните все обязательные поля (Название, Описание, Цена, Категория).');
            return;
        }
        setIsSubmitting(true);
        
        const finalNewItem: NewMenuItem = {
            ...newItem,
            key_features: {
                // FIX: Changed 'composition' to 'ingredients' and used the corresponding state.
                ingredients: ingredientsStr.split(',').map(s => s.trim()).filter(Boolean),
                allergens: allergensStr.split(',').map(s => s.trim()).filter(Boolean),
            }
        };

        try {
            const addedItem = await api.addMenuItem(finalNewItem);
            if (addedItem) {
                setMenuItems(prev => [addedItem, ...prev]);
                setIsModalOpen(false);
                setNewItem(initialFormState);
                // FIX: Resetting the correct state variable.
                setIngredientsStr('');
                setAllergensStr('');
            } else {
                throw new Error('Не удалось добавить позицию. Ответ от сервера пуст. Проверьте RLS политики для таблицы "menu_items".');
            }
        } catch (error: any) {
            console.error(error);
            setFormError(error.message || 'Произошла ошибка при добавлении позиции.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) {
            alert('Название категории не может быть пустым.');
            return;
        }
        setIsAddingCategory(true);
        try {
            const categoryData: NewCategory = { name: newCategoryName.trim() };
            const addedCategory = await api.addCategory(categoryData);
            if (addedCategory) {
                setCategories(prev => [...prev, addedCategory].sort((a, b) => a.name.localeCompare(b.name)));
                setNewCategoryName('');
            } else {
                throw new Error('Не удалось добавить категорию. Ответ от сервера пуст.');
            }
        } catch (error) {
            console.error(error);
            alert('Произошла ошибка при добавлении категории.');
        } finally {
            setIsAddingCategory(false);
        }
    };
    
    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center pt-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                </div>
            );
        }
        
        switch (activeTab) {
            case 'content':
                return (
                    <div>
                        {canManageContent && (
                            <div className="mb-4">
                                <button
                                    onClick={() => {
                                        setFormError(null);
                                        setIsModalOpen(true);
                                    }}
                                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                                >
                                    + Добавить позицию в меню
                                </button>
                            </div>
                        )}
                        <div className="space-y-3">
                            {menuItems.map(item => (
                                <div key={item.id} className="bg-gray-700 p-3 rounded-md flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-white">{item.name}</p>
                                        <p className="text-sm text-gray-400">{item.price} ₽</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="bg-blue-600 px-3 py-1 text-sm rounded">Edit</button>
                                        <button className="bg-red-600 px-3 py-1 text-sm rounded">Archive</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'categories':
                if (!canManageContent) return <p className="text-red-400">У вас нет прав для управления контентом.</p>;
                return (
                    <div>
                        <form onSubmit={handleCategorySubmit} className="mb-6 bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-white mb-2">Добавить новую категорию</h3>
                            <div className="flex items-center space-x-2">
                                <input 
                                    type="text" 
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Например, Горячие блюда"
                                    className="flex-grow bg-gray-800 border-gray-600 rounded-md shadow-sm text-white p-2"
                                    required
                                />
                                <button 
                                    type="submit" 
                                    disabled={isAddingCategory}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                                >
                                    {isAddingCategory ? '...' : 'Добавить'}
                                </button>
                            </div>
                        </form>
                        
                        <h3 className="text-lg font-semibold text-white mb-3">Существующие категории</h3>
                        <div className="space-y-2">
                            {categories.map(cat => (
                                <div key={cat.id} className="bg-gray-700 p-3 rounded-md flex items-center justify-between">
                                    <p className="font-semibold text-white">{cat.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'users':
                if (!canManageUsers) return <p className="text-red-400">У вас нет прав для управления пользователями.</p>;
                return (
                    <div className="space-y-3">
                        {users.map(user => (
                             <div key={user.id} className="bg-gray-700 p-3 rounded-md flex items-center justify-between">
                                <div>
                                    <p className="font-semibold text-white">{user.full_name}</p>
                                    <p className="text-sm text-gray-400">{user.roles.join(', ')}</p>
                                </div>
                                <button className="bg-gray-600 px-3 py-1 text-sm rounded">Manage</button>
                            </div>
                        ))}
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
        <div className="p-4 pb-20">
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-white mb-4">Новая позиция меню</h2>
                        
                        {formError && (
                            <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-md mb-4 text-sm">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">Название</label>
                                <input type="text" name="name" id="name" value={newItem.name} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" required />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300">Описание</label>
                                <textarea name="description" id="description" value={newItem.description} onChange={handleInputChange} rows={3} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" required />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-300">Цена (₽)</label>
                                <input type="number" name="price" id="price" value={newItem.price} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" required />
                            </div>
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">Категория</label>
                                <select name="category_id" id="category_id" value={newItem.category_id} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" required>
                                    <option value={0} disabled>Выберите категорию</option>
                                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="image_url" className="block text-sm font-medium text-gray-300">URL изображения</label>
                                <input type="text" name="image_url" id="image_url" value={newItem.image_url} onChange={handleInputChange} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" />
                            </div>
                            <div>
                                {/* FIX: Updated form field to use 'ingredients' and its corresponding state. */}
                                <label htmlFor="ingredients" className="block text-sm font-medium text-gray-300">Состав (через запятую)</label>
                                <textarea name="ingredients" id="ingredients" value={ingredientsStr} onChange={(e) => setIngredientsStr(e.target.value)} rows={2} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" />
                            </div>
                            <div>
                                <label htmlFor="allergens" className="block text-sm font-medium text-gray-300">Аллергены (через запятую)</label>
                                <textarea name="allergens" id="allergens" value={allergensStr} onChange={(e) => setAllergensStr(e.target.value)} rows={2} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2" />
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" name="is_active" id="is_active" checked={newItem.is_active} onChange={(e) => setNewItem(prev => ({...prev, is_active: e.target.checked}))} className="h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500" />
                                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-300">Позиция активна</label>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg">Отмена</button>
                                <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold text-white mb-6">Админ-панель</h1>
            <div className="flex border-b border-gray-700 mb-6">
                <button
                    onClick={() => setActiveTab('content')}
                    className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'content' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
                >
                    Контент
                </button>
                {canManageContent &&
                  <button
                      onClick={() => setActiveTab('categories')}
                      className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'categories' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
                  >
                      Категории
                  </button>
                }
                {canManageUsers &&
                  <button
                      onClick={() => setActiveTab('users')}
                      className={`px-4 py-2 font-semibold transition-colors ${activeTab === 'users' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-400'}`}
                  >
                      Пользователи
                  </button>
                }
            </div>
            {renderContent()}
        </div>
    );
};