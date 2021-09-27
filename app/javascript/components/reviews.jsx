import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Review from '../components/review'
import CreateReview from '../components/create_review'

const Reviews = props => {
  const [showCreateReview, setCreateReview] = useState(false)
  const toggleCreateReview = () => setCreateReview(!showCreateReview)

  const [reviews, setReviews] = useState(null)
  const addReview = newReview => setReviews(reviews => [...reviews, newReview])
  const addReviewIfNotSubscribed = newReview => {
    if (!isSubscribed) {
      addReview(newReview)
    }
  }

  const [isSubscribed, setIsSubscribed] = useState(false)
  const setIsSubscribedWithEvent = event => {
    setIsSubscribed(event.target.checked)
    if (event.target.checked) {
      props.createSubscription(receivedData => addReview(receivedData))
    } else {
      props.removeSubscription()
    }
  }

  useEffect(
    () =>
      (async () => {
        setReviews(await props.loadReviews())
      })(),
    []
  )

  return (
    <>
      {reviews === null ? (
        <b>Loading reviews...</b>
      ) : reviews.length > 0 ? (
        <>
          <h3 className="title is-4">Average rating</h3>
          <div className="is-size-3 is-size-5-mobile columns mx-0 is-multiline is-justify-content-space-between is-align-items-center">
            <div className="mt-3">
              <Review
                review={{
                  rating: (
                    reviews.reduce((total, review) => total + parseFloat(review.rating), 0) /
                    reviews.length
                  ).toFixed(1),
                }}
              />
            </div>
            <a
              id="create-review-button"
              className="button is-primary mt-3"
              onClick={toggleCreateReview}
            >
              Add your review
            </a>
          </div>
          <hr />
          <div className="columns mx-0 is-justify-content-space-between is-align-items-center is-mobile">
            <h2 className="title is-4">Reviews</h2>
            {reviews !== null && (
              <div className="mb-5">
                <input
                  className="toggle"
                  id="live-update"
                  type="checkbox"
                  checked={isSubscribed}
                  onChange={setIsSubscribedWithEvent}
                />
                <label className="toggle-button" htmlFor="live-update">
                  <span className="is-size-7-mobile">Toggle live update</span>
                </label>
              </div>
            )}
          </div>
          <ul className="columns is-multiline">
            {reviews.map(review => (
              <li key={review.id} className="column is-half is-flex">
                <div className="box is-flex is-flex-direction-row is-align-items-flex-start is-full-width">
                  <Review review={review} />
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className="block">No reviews yet, why don't you add the first one?</p>
          <a
            id="create-review-button"
            className="button is-primary mt-3"
            onClick={toggleCreateReview}
          >
            Add your review
          </a>
        </>
      )}
      {showCreateReview && (
        <CreateReview
          close={toggleCreateReview}
          submitReview={props.submitReview}
          addReview={addReviewIfNotSubscribed}
        />
      )}
    </>
  )
}

Reviews.propTypes = {
  loadReviews: PropTypes.func.isRequired,
  submitReview: PropTypes.func.isRequired,
  createSubscription: PropTypes.func.isRequired,
  removeSubscription: PropTypes.func.isRequired,
}

export default Reviews
