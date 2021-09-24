import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Review from '../components/review'
import CreateReview from '../components/create_review'
import consumer from "../channels/consumer"

const Reviews = props => {
  const [showCreateReview, setCreateReview] = useState(false);
  const toggleCreateReview = () => setCreateReview(!showCreateReview);

  const [reviews, setReviews] = useState(null);
  const addReview = newReview => setReviews(reviews => [...reviews, newReview])
  const addReviewIfNotSubscribed = newReview => {
    if(!isSubscribed) {
      addReview(newReview)
    }
  }

  const [isSubscribed, setIsSubscribed] = useState(false);
  const setIsSubscribedWithEvent = event => {
    setIsSubscribed(event.target.checked);
    if(event.target.checked) {
      props.createSubscription(receivedData => {
        addReview(receivedData);
      })
    } else {
      props.removeSubscription()
    }
  }

  useEffect(() => (async () => {
    setReviews(await props.loadReviews())
  })(), [])
  
  return (
    <>
      {
        reviews === null ?
        <b>Loading reviews...</b> :
        reviews.length > 0 ?
          (
            <>
              <h3 className="title is-5">Average rating</h3>
              <Review review={{
                rating: Math.round((reviews.reduce((total, review) => total + review.rating, 0) / reviews.length) * 10) / 10
              }} />
              <hr/>
              {
                reviews !== null && <div className="is-pulled-right">
                  <input className="toggle" id="live-update" type="checkbox" checked={isSubscribed} onChange={setIsSubscribedWithEvent} />
                  <label className="toggle-button" htmlFor="live-update">
                    <span>Toggle live update</span>
                  </label>
                </div>
              }
              <h2 className="title is-4">Reviews</h2>
              <ul className="columns is-multiline is-justify-content-flex-start">
                {
                  reviews.map(review => (
                    <li key={review.id} className="column is-half is-flex is-align-items-center">
                      <Review review={review} />
                    </li>
                  ))
                }
              </ul>
            </>
          ) :
          (
            <p className="block">No reviews yet, why don't you add the first one?</p>
          )
      }
      {
        reviews !== null && <a className="button is-primary" onClick={toggleCreateReview}>Add your review</a>
      }
      {
        showCreateReview &&
        <CreateReview close={toggleCreateReview} submitReview={props.submitReview} addReview={addReviewIfNotSubscribed} />
      }
    </>
  )
}

Reviews.propTypes = {
  loadReviews: PropTypes.func.isRequired,
  submitReview: PropTypes.func.isRequired,
  createSubscription: PropTypes.func.isRequired,
  removeSubscription: PropTypes.func.isRequired
}

document.addEventListener('turbolinks:load', () => {
  const reviewsElement = document.getElementById('reviews-react')
  if (reviewsElement?.dataset?.productId) {
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
})
