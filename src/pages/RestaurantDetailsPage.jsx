import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../api/apiService';
import Table from '../components/common/Table';
import ManageCuisinesModal from '../components/common/ManageCuisinesModal';
import ConfirmDeleteCuisineModal from '../components/common/ConfirmDeleteCuisineModal';
import ManageFeaturesModal from '../components/common/ManageFeaturesModal';
import ConfirmDeleteFeatureModal from '../components/common/ConfirmDeleteFeatureModal';
import ManageMealTypesModal from '../components/common/ManageMealTypesModal';
import ConfirmDeleteMealTypeModal from '../components/common/ConfirmDeleteMealTypeModal';
import ManageTagsModal from '../components/common/ManageTagsModal';
import ConfirmDeleteTagModal from '../components/common/ConfirmDeleteTagModal';
import ManageWorkTimesModal from '../components/common/ManageWorkTimesModal';
import ConfirmDeleteWorkTimeModal from '../components/common/ConfirmDeleteWorkTimeModal';
import AddDishModal from '../components/common/AddDishModal';
import ConfirmDeleteDishModal from '../components/common/ConfirmDeleteDishModal';
import EditDishModal from '../components/common/EditDishModal';
import '../assets/styles/RestaurantDetailsPage.css';

const RestaurantDetailsPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [currencyTypes, setCurrencyTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [mealTypes, setMealTypes] = useState([]);
  const [tags, setTags] = useState([]);
  const [workTimes, setWorkTimes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isManageCuisinesModalOpen, setIsManageCuisinesModalOpen] = useState(false);
  const [cuisineToDelete, setCuisineToDelete] = useState(null);
  const [isManageFeaturesModalOpen, setIsManageFeaturesModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState(null);
  const [isManageMealTypesModalOpen, setIsManageMealTypesModalOpen] = useState(false);
  const [mealTypeToDelete, setMealTypeToDelete] = useState(null);
  const [isManageTagsModalOpen, setIsManageTagsModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState(null);
  const [isManageWorkTimesModalOpen, setIsManageWorkTimesModalOpen] = useState(false);
  const [workTimeToDelete, setWorkTimeToDelete] = useState(null);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [dishToDelete, setDishToDelete] = useState(null);
  const [dishToEdit, setDishToEdit] = useState(null);
  const [isEditDishModalOpen, setIsEditDishModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        restaurantResponse,
        dishesResponse,
        cuisinesResponse,
        currencyTypesResponse,
        featuresResponse,
        mealTypesResponse,
        tagsResponse,
        workTimesResponse
      ] = await Promise.all([
        ApiService.getRestaurantById(restaurantId),
        ApiService.getDishesByRestaurantId(restaurantId),
        ApiService.getRestaurantCuisines(restaurantId),
        ApiService.getRestaurantCurrencyTypes(restaurantId),
        ApiService.getRestaurantFeatures(restaurantId),
        ApiService.getRestaurantMealTypes(restaurantId),
        ApiService.getRestaurantTags(restaurantId),
        ApiService.getRestaurantWorkTimes(restaurantId)
      ]);
      
      setRestaurant(restaurantResponse.data);
      setDishes(dishesResponse.data);
      setCuisines(cuisinesResponse.data);
      setCurrencyTypes(currencyTypesResponse.data);
      setFeatures(featuresResponse.data);
      setMealTypes(mealTypesResponse.data);
      setTags(tagsResponse.data);
      setWorkTimes(workTimesResponse.data);

    } catch (error) {
      console.error('Error fetching restaurant details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [restaurantId]);

  const handleCuisinesUpdated = async () => {
    const response = await ApiService.getRestaurantCuisines(restaurantId);
    setCuisines(response.data);
    const restaurantResponse = await ApiService.getRestaurantById(restaurantId);
    setRestaurant(restaurantResponse.data);
  };

  const handleFeaturesUpdated = async () => {
    const response = await ApiService.getRestaurantFeatures(restaurantId);
    setFeatures(response.data);
    const restaurantResponse = await ApiService.getRestaurantById(restaurantId);
    setRestaurant(restaurantResponse.data);
  };
  
  const handleMealTypesUpdated = async () => {
    const response = await ApiService.getRestaurantMealTypes(restaurantId);
    setMealTypes(response.data);
    const restaurantResponse = await ApiService.getRestaurantById(restaurantId);
    setRestaurant(restaurantResponse.data);
  };
  
  const handleTagsUpdated = async () => {
    const response = await ApiService.getRestaurantTags(restaurantId);
    setTags(response.data);
    const restaurantResponse = await ApiService.getRestaurantById(restaurantId);
    setRestaurant(restaurantResponse.data);
  };

  const handleWorkTimesUpdated = async () => {
    const response = await ApiService.getRestaurantWorkTimes(restaurantId);
    setWorkTimes(response.data);
    const restaurantResponse = await ApiService.getRestaurantById(restaurantId);
    setRestaurant(restaurantResponse.data);
  };

  const handleDishAdded = async () => {
    const dishesResponse = await ApiService.getDishesByRestaurantId(restaurantId);
    setDishes(dishesResponse.data);
  };

  const handleDishUpdated = async () => {
    const dishesResponse = await ApiService.getDishesByRestaurantId(restaurantId);
    setDishes(dishesResponse.data);
  };

  const handleConfirmDeleteCuisine = async (cuisineId) => {
    try {
      await ApiService.removeCuisineFromRestaurant(restaurantId, cuisineId);
      handleCuisinesUpdated();
    } catch (error) {
      console.error('Error deleting cuisine:', error);
    } finally {
      setCuisineToDelete(null);
    }
  };

  const handleConfirmDeleteFeature = async (featureId) => {
    try {
      await ApiService.removeFeatureFromRestaurant(restaurantId, featureId);
      handleFeaturesUpdated();
    } catch (error) {
      console.error('Error deleting feature:', error);
    } finally {
      setFeatureToDelete(null);
    }
  };
  
  const handleConfirmDeleteMealType = async (mealTypeId) => {
    try {
      await ApiService.removeMealTypeFromRestaurant(restaurantId, mealTypeId);
      handleMealTypesUpdated();
    } catch (error) {
      console.error('Error deleting meal type:', error);
    } finally {
      setMealTypeToDelete(null);
    }
  };
  
  const handleConfirmDeleteTag = async (tagId) => {
    try {
      await ApiService.removeTagFromRestaurant(restaurantId, tagId);
      handleTagsUpdated();
    } catch (error) {
      console.error('Error deleting tag:', error);
    } finally {
      setTagToDelete(null);
    }
  };

  const handleConfirmDeleteWorkTime = async (workTimeId) => {
    try {
      await ApiService.removeWorkTimeFromRestaurant(restaurantId, workTimeId);
      handleWorkTimesUpdated();
    } catch (error) {
      console.error('Error deleting work time:', error);
    } finally {
      setWorkTimeToDelete(null);
    }
  };

  const handleConfirmDeleteDish = async (dishId) => {
    try {
      await ApiService.deleteDishFromRestaurant(restaurantId, dishId);
      handleDishAdded();
    } catch (error) {
      console.error('Error deleting dish:', error);
    } finally {
      setDishToDelete(null);
    }
  };

  const handleCancelDeleteDish = () => {
    setDishToDelete(null);
  };

  const handleEditClick = (dish) => {
    setDishToEdit(dish);
    setIsEditDishModalOpen(true);
  };

  const dishColumns = [
    { key: 'name', header: 'Dish Name' },
    { key: 'description', header: 'Description' },
    { key: 'price', header: 'Price' },
  ];

  if (loading) {
    return <div className="page-container"><h2>Loading...</h2></div>;
  }

  return (
    <div className="page-container">
      <button className="btn-back" onClick={() => navigate('/restaurants')}>&larr; Back to Restaurants</button>
      <h2>Manage {restaurant?.name}</h2>
      
      {isManageCuisinesModalOpen && (
        <ManageCuisinesModal
          restaurant={{ id: restaurantId, cuisines }}
          onClose={() => setIsManageCuisinesModalOpen(false)}
          onCuisinesUpdated={(cuisine) => {
            if (cuisine) {
              setCuisineToDelete(cuisine);
              setIsManageCuisinesModalOpen(false);
            } else {
              handleCuisinesUpdated();
            }
          }}
        />
      )}

      {cuisineToDelete && (
        <ConfirmDeleteCuisineModal
          cuisine={cuisineToDelete}
          onConfirm={handleConfirmDeleteCuisine}
          onCancel={() => setCuisineToDelete(null)}
        />
      )}

      {isManageFeaturesModalOpen && (
        <ManageFeaturesModal
          restaurant={{ id: restaurantId, features }}
          onClose={() => setIsManageFeaturesModalOpen(false)}
          onFeaturesUpdated={(feature) => {
            if (feature) {
              setFeatureToDelete(feature);
              setIsManageFeaturesModalOpen(false);
            } else {
              handleFeaturesUpdated();
            }
          }}
        />
      )}

      {featureToDelete && (
        <ConfirmDeleteFeatureModal
          feature={featureToDelete}
          onConfirm={handleConfirmDeleteFeature}
          onCancel={() => setFeatureToDelete(null)}
        />
      )}

      {isManageMealTypesModalOpen && (
        <ManageMealTypesModal
          restaurant={{ id: restaurantId, mealTypes }}
          onClose={() => setIsManageMealTypesModalOpen(false)}
          onMealTypesUpdated={(mealType) => {
            if (mealType) {
              setMealTypeToDelete(mealType);
              setIsManageMealTypesModalOpen(false);
            } else {
              handleMealTypesUpdated();
            }
          }}
        />
      )}

      {mealTypeToDelete && (
        <ConfirmDeleteMealTypeModal
          mealType={mealTypeToDelete}
          onConfirm={handleConfirmDeleteMealType}
          onCancel={() => setMealTypeToDelete(null)}
        />
      )}
      
      {isManageTagsModalOpen && (
        <ManageTagsModal
          restaurant={{ id: restaurantId, tags }}
          onClose={() => setIsManageTagsModalOpen(false)}
          onTagsUpdated={(tag) => {
            if (tag) {
              setTagToDelete(tag);
              setIsManageTagsModalOpen(false);
            } else {
              handleTagsUpdated();
            }
          }}
        />
      )}

      {tagToDelete && (
        <ConfirmDeleteTagModal
          tag={tagToDelete}
          onConfirm={handleConfirmDeleteTag}
          onCancel={() => setTagToDelete(null)}
        />
      )}

      {isManageWorkTimesModalOpen && (
        <ManageWorkTimesModal
          restaurant={{ id: restaurantId, workTimes }}
          onClose={() => setIsManageWorkTimesModalOpen(false)}
          onWorkTimesUpdated={(workTime) => {
            if (workTime) {
              setWorkTimeToDelete(workTime);
              setIsManageWorkTimesModalOpen(false);
            } else {
              handleWorkTimesUpdated();
            }
          }}
        />
      )}

      {workTimeToDelete && (
        <ConfirmDeleteWorkTimeModal
          workTime={workTimeToDelete}
          onConfirm={handleConfirmDeleteWorkTime}
          onCancel={() => setWorkTimeToDelete(null)}
        />
      )}
      
      {isAddDishModalOpen && (
        <AddDishModal
          restaurantId={restaurantId}
          onClose={() => setIsAddDishModalOpen(false)}
          onDishAdded={handleDishAdded}
        />
      )}

      {dishToDelete && (
        <ConfirmDeleteDishModal
          dish={dishToDelete}
          onConfirm={handleConfirmDeleteDish}
          onCancel={handleCancelDeleteDish}
        />
      )}

      {isEditDishModalOpen && (
        <EditDishModal
          dish={dishToEdit}
          restaurantId={restaurantId}
          onClose={() => setIsEditDishModalOpen(false)}
          onDishUpdated={handleDishUpdated}
        />
      )}

      <div className="details-grid">
        <div className="detail-section">
          <div className="section-header">
            <h3>Cuisines</h3>
            <button className="btn-manage" onClick={() => setIsManageCuisinesModalOpen(true)}>Manage</button>
          </div>
          <ul>{cuisines.map(c => <li key={c.id}>{c.name}</li>)}</ul>
        </div>
        
        <div className="detail-section">
          <div className="section-header">
            <h3>Features</h3>
            <button className="btn-manage" onClick={() => setIsManageFeaturesModalOpen(true)}>Manage</button>
          </div>
          <ul>{features.map(f => <li key={f.id}>{f.name}</li>)}</ul>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h3>Meal Types</h3>
            <button className="btn-manage" onClick={() => setIsManageMealTypesModalOpen(true)}>Manage</button>
          </div>
          <ul>{mealTypes.map(m => <li key={m.id}>{m.name}</li>)}</ul>
        </div>

        <div className="detail-section">
          <div className="section-header">
            <h3>Tags</h3>
            <button className="btn-manage" onClick={() => setIsManageTagsModalOpen(true)}>Manage</button>
          </div>
          <ul>{tags.map(t => <li key={t.id}>{t.name}</li>)}</ul>
        </div>
        
        <div className="detail-section">
          <div className="section-header">
            <h3>Work Times</h3>
            <button className="btn-manage" onClick={() => setIsManageWorkTimesModalOpen(true)}>Manage</button>
          </div>
          <ul>
            {workTimes.map(w => (
              <li key={w.id}>
                {w.day}: 
                {w.openHour ? w.openHour.substring(0, 5) : 'N/A'} - 
                {w.closeHour ? w.closeHour.substring(0, 5) : 'N/A'}
              </li>
            ))}
          </ul>
        </div>

        <div className="detail-section">
          <h3>Currency Types</h3>
          <ul>{currencyTypes.map(c => <li key={c.id}>{c.name} ({c.symbol})</li>)}</ul>
        </div>

      </div>

      <div className="detail-section">
        <h3>Dishes</h3>
        <button className="btn-add" onClick={() => setIsAddDishModalOpen(true)}>Add New Dish</button>
        <Table data={dishes} columns={dishColumns} renderActions={(dish) => (
          <>
            <button className="btn-edit" onClick={() => handleEditClick(dish)}>Edit</button>
            <button className="btn-delete" onClick={() => setDishToDelete(dish)}>Delete</button>
          </>
        )} />
      </div>
    </div>
  );
};

export default RestaurantDetailsPage;