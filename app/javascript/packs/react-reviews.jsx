import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import Reviews from '../components/reviews'
import consumer from "../channels/consumer"

const reviewsElement = document.getElementById('reviews-react')
// We need this workaround because the `turbolinks:load` event listener didn't fire if it was
// attached after the page was already loaded. It's pretty annoying as this way the reviews will
// reload every time as it also doesn't cache React's HTML output properly...
if (reviewsElement?.getElementsByClassName("no-react").length > 0 && reviewsElement.dataset.productId) {
  const productId = reviewsElement.dataset.productId
  
  const loadReviews = async () => {
    const response = await fetch(`/api/v1/products/${productId}/reviews`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json()
  }

  const submitReview = (rating, content) => {
    return fetch(`/api/v1/products/${productId}/reviews`, {
      headers: { "Content-Type": "application/json; charset=utf-8" },
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        content,
        rating
      })
    })
  }

  let subscription;
  const createSubscription = receiveCallback => {
    subscription = consumer.subscriptions.create(
      {
        channel: "ReviewsChannel",
        product_id: productId
      }, {
      connected() {
        console.log("ReviewsChannel connected")
      },
      disconnected() {
        console.log("ReviewsChannel disconnected")
      },
      received(data) {
        console.log("ReviewsChannel received", data)
        receiveCallback(data)
      }
    });
  }
  const removeSubscription = () => {
    consumer.subscriptions.remove(subscription);
  }
  
  ReactDOM.render(<Reviews loadReviews={loadReviews} submitReview={submitReview} createSubscription={createSubscription} removeSubscription={removeSubscription} />, reviewsElement)
}

// Restoring the React host element as there's no way to stop Turbolinks from replacing it, so this
// at least prevents the flash of cache before returning to the loading message.
document.addEventListener("turbolinks:before-cache", (event) => {
  reviewsElement.innerHTML = '<b>Loading reviews...</b>';
})
