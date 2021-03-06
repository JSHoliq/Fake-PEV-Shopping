import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import appStore from '../../features/appStore';
import { getUserCartStateFromStorage, saveUserCartStateToStorage } from '../../features/storageApi';
import apiService from '../../features/apiService';

export default observer(function Cart() {
  const [cartVisibility, updateCartVisibility] = useState(false);

  const translations = {
    header: 'Cart',
    productNameHeader: 'Product',
    productCountHeader: 'Count',
    productPriceHeader: 'Price',
    lackOfProducts: 'No products yet...',
    productsTotals: 'Totals',
    submitCart: 'Submit cart',
    cleanupCart: 'Cleanup cart',
  };

  useEffect(() => {
    appStore.replaceUserCartState(getUserCartStateFromStorage());

    window.addEventListener(
      'beforeunload',
      () => {
        saveUserCartStateToStorage(appStore.userCartState);
      },
      { once: true }
    );
  }, []);

  const handleTogglingCart = () => {
    updateCartVisibility(!cartVisibility);
  };

  const handleCartCleanup = () => {
    appStore.clearUserCartState();
  };

  const handleCartSubmission = () => {
    apiService
      .submitCart(appStore.userCartProducts)
      .then(({ redirectUri }) => {
        appStore.clearUserCartState();
        window.location = redirectUri;
      })
      // TODO: handle error in better way
      .catch((error) => console.error('submitCart error:', error));
  };

  return (
    <>
      <button className="cart-toggle-button" onClick={handleTogglingCart}>
        $$$
      </button>

      <section className={`cart-container ${cartVisibility ? 'cart-container--visible' : ''}`}>
        {translations.header}

        <table>
          <thead>
            <tr>
              <th>{translations.productNameHeader}</th>
              <th>{translations.productCountHeader}</th>
              <th>{translations.productPriceHeader}</th>
            </tr>
          </thead>

          <tbody>
            {appStore.userCartProducts.length ? (
              appStore.userCartProducts.map((productItem) => {
                return (
                  <tr key={productItem.name}>
                    <td>{productItem.name}</td>
                    <td>{productItem.count}</td>
                    <td>{productItem.price}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>{translations.lackOfProducts}</td>
              </tr>
            )}
          </tbody>

          <tfoot>
            <tr>
              <th>{translations.productsTotals}</th>
              <td>{appStore.userCartProductsCount}</td>
              <td>{appStore.userCartTotalPrice}</td>
            </tr>
          </tfoot>
        </table>

        <button className="cart-cleanup-button" onClick={handleCartCleanup}>
          {translations.cleanupCart}
        </button>
        <button className="cart-submit-button" onClick={handleCartSubmission}>
          {translations.submitCart}
        </button>
      </section>
    </>
  );
});
