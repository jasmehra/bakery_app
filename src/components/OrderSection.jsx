export default function OrderSection({
  items,
  cart,
  cartRows,
  totalItems,
  totalPrice,
  checkoutState,
  checkoutErrors,
  orderPayload,
  onAddToCart,
  onRemoveFromCart,
  onCheckoutChange,
  onCheckoutSubmit,
  onClearCart,
  text
}) {
  return (
    <section className="section order-section" id="order" data-reveal>
      <div className="section-head">
        <p className="eyebrow">{text.orderEyebrow}</p>
        <h2>{text.orderTitle}</h2>
      </div>
      <div className="order-layout">
        <div className="order-grid">
          {items.map((item, index) => (
            <article
              className="order-card"
              key={item.id}
              data-reveal
              style={{ "--delay": `${0.07 * (index + 1)}s` }}
            >
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.note}</p>
              <div className="order-row">
                <strong>${Number(item.price ?? 0).toFixed(2)}</strong>
                <div className="order-actions">
                  <button className="ghost small" onClick={() => onRemoveFromCart(item.id)}>
                    -
                  </button>
                  <span>{cart[item.id] ?? 0}</span>
                  <button className="small" onClick={() => onAddToCart(item.id)}>
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-panel" data-reveal style={{ "--delay": "0.12s" }}>
          <h3>Pickup Summary</h3>
          <p>{totalItems} item(s) selected</p>
          <div className="cart-list">
            {cartRows.length === 0 ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              cartRows.map((row) => (
                <p key={row.id}>
                  {row.title} x {row.qty}
                </p>
              ))
            )}
          </div>
          <p className="cart-total">${totalPrice.toFixed(2)}</p>

          <form className="checkout-form" onSubmit={onCheckoutSubmit} noValidate>
            <label htmlFor="pickupName">Pickup name</label>
            <input
              id="pickupName"
              name="name"
              value={checkoutState.name}
              onChange={onCheckoutChange}
            />
            {checkoutErrors.name && <small className="error-text">{checkoutErrors.name}</small>}

            <label htmlFor="pickupPhone">Phone</label>
            <input
              id="pickupPhone"
              name="phone"
              value={checkoutState.phone}
              onChange={onCheckoutChange}
            />
            {checkoutErrors.phone && (
              <small className="error-text">{checkoutErrors.phone}</small>
            )}

            <label htmlFor="pickupTime">Pickup time</label>
            <input
              id="pickupTime"
              name="pickupTime"
              type="datetime-local"
              value={checkoutState.pickupTime}
              onChange={onCheckoutChange}
            />
            {checkoutErrors.pickupTime && (
              <small className="error-text">{checkoutErrors.pickupTime}</small>
            )}
            {checkoutErrors.cart && <small className="error-text">{checkoutErrors.cart}</small>}
            {checkoutErrors.api && <small className="error-text">{checkoutErrors.api}</small>}

            <div className="checkout-actions">
              <button type="submit" disabled={totalItems === 0}>
                Place Order
              </button>
              <button type="button" className="ghost" onClick={onClearCart}>
                Clear Cart
              </button>
            </div>
          </form>

          {orderPayload && (
            <div className="payload-wrap">
              <p className="success-text">Order payload ready</p>
              <pre>{JSON.stringify(orderPayload, null, 2)}</pre>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
