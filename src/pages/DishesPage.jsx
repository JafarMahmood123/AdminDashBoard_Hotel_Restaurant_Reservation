import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import Table from '../components/common/Table';
import '../assets/styles/DishesPage.css';

const DishesPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [restaurantResponse, dishesResponse] = await Promise.all([
          ApiService.getRestaurantById(restaurantId),
          ApiService.getDishesByRestaurantId(restaurantId)
        ]);
        
        setRestaurantName(restaurantResponse.data.name);
        
        const dishesData = dishesResponse.data.map(dish => ({
          ...dish,
          price: `$${dish.price.toFixed(2)}` // Format price for display
        }));

        // Sort dishes alphabetically by name
        const sortedDishes = dishesData.sort((a, b) => a.name.localeCompare(b.name));
        setDishes(sortedDishes);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  const handleEditClick = (dish) => {
    console.log("Editing dish:", dish);
    // Future implementation: Open edit dish modal
  };

  const handleDeleteClick = (dish) => {
    console.log("Deleting dish:", dish);
    // Future implementation: Open delete confirmation modal
  };

  const columns = [
    { key: 'name', header: 'Dish Name' },
    { key: 'description', header: 'Description' },
    { key: 'price', header: 'Price' },
    { key: 'pictureUrl', header: 'Picture' , render: (dish) => <img src={dish.pictureUrl} alt={dish.name} style={{width: "100px", height: "auto"}}/> },
  ];
  
  const renderActions = (dish) => (
    <>
      <button className="btn-edit" onClick={() => handleEditClick(dish)}>Edit</button>
      <button className="btn-delete" onClick={() => handleDeleteClick(dish)}>Delete</button>
    </>
  );

  if (loading) {
    return <div className="page-container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => navigate('/restaurants')}>&larr; Back to Restaurants</button>
      <h2>Manage Dishes for {restaurantName}</h2>
      <button className="btn-add">Add New Dish</button>
      <Table data={dishes} columns={columns} renderActions={renderActions} />
    </div>
  );
};

export default DishesPage;