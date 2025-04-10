import React, { useEffect, useState } from 'react';
import './List.css';
import { deleteProduct, getProducts, updateProduct } from '../../Services/BastOnline';
import { toast } from 'react-toastify';

const List = () => {
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    listProducts();
  }, []);

  function listProducts() {
    getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error: can't catch products");
      });
  }

  function handleDelete(productId) {
    deleteProduct(productId)
      .then(() => {
        setProducts(products.filter(product => product.id !== productId));
        toast.success("Deleted successfully!");
      })
      .catch((error) => {
        console.error("Error: delete", error);
        toast.error("Error: delete");
      });
  }

  function handleEdit(product) {
    console.log("EDITING PRODUCT:", product);
    setEditProductId(product.id);
    setEditedProduct({ ...product });
  }

  function handleCancel() {
    setEditProductId(null);
    setEditedProduct({});
  }

  function handleInputChange(e, field) {
    setEditedProduct(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  }

  function handleSave() {
    updateProduct(editProductId, editedProduct)
      .then(() => {
        setProducts(products.map(p => (p.id === editProductId ? editedProduct : p)));
        setEditProductId(null);
        setEditedProduct({});
        toast.success("Updated successfully!");
      })
      .catch((error) => {
        console.error("Error: can't update", error);
        toast.error("Error: can't update");
      });
  }

  return (
    <div className='container'>
      <h2 className='text-center'>List of Products</h2>
      <div>
        <table>
      <tbody>
  {products.map(product =>
    <tr key={product.id}>
      <td>
        {editProductId === product.id
          ? <input value={editedProduct.name || ''} onChange={(e) => handleInputChange(e, 'name')} />
          : product.name}
      </td>
      <td>
        {editProductId === product.id
          ? <input type="number" value={editedProduct.kilograms || ''} onChange={(e) => handleInputChange(e, 'kilograms')} />
          : product.kilograms}
      </td>
      <td>
        {editProductId === product.id
          ? <input type="number" value={editedProduct.price || ''} onChange={(e) => handleInputChange(e, 'price')} />
          : product.price}
      </td>
      <td>
        {editProductId === product.id
          ? (
            <select value={editedProduct.category || ''} onChange={(e) => handleInputChange(e, 'category')}>
              <option value="">--Select Category--</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Eggs">Eggs</option>
            </select>
          )
          : product.category}
      </td>
      <td>
        {editProductId === product.id
          ? <input value={editedProduct.description || ''} onChange={(e) => handleInputChange(e, 'description')} />
          : product.description}
      </td>
      <td>
        {editProductId === product.id ? (
          <>
            <button className='btn btn-success save-btn' onClick={handleSave}>Save</button>
            <button className='btn btn-secondary cancel-btn' onClick={handleCancel} style={{ marginLeft: "10px" }}>Cancel</button>
          </>
        ) : (
          <>
            <button className='btn btn-warning edit-btn' onClick={() => handleEdit(product)}>Edit</button>
            <button className='btn btn-danger' onClick={() => handleDelete(product.id)} style={{ marginLeft: "10px" }}>Delete</button>
          </>
        )}
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default List;
