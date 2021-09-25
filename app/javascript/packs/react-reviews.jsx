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
    if(reviewsElement.dataset.reviews) {
      return JSON.parse(reviews)
    }
    const response = await fetch(`/api/v1/products/${productId}/reviews`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const reviews = await response.json()
    reviewsElement.dataset.reviews = JSON.stringify(reviews)
    return reviews
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
