import React from 'react'
import PropTypes from 'prop-types'

const Review = props => (
  <div className="columns mx-0 is-multiline">
    <div className="ratings my-2">
      {
        [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(i => (
          <div key={i} className={`${i % 1 == 0.5 ? "first" : "second"}-half-wrapper`}>
            <span key={i} className={`star ${i % 1 == 0.5 ? "first" : "second"}-half ${i > props.review.rating && "star-off"}`}>⭐️</span>
          </div>))
      }
      <span className="has-text-weight-bold mr-4 ml-1">{props.review.rating}</span>
    </div>
    {
      props.review.content && <p className="my-2">{props.review.content}</p>
    }
  </div>
)

Review.propTypes = {
  review: PropTypes.shape({
    content: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    rating: PropTypes.string.isRequired,
    product_id: PropTypes.number,
    id: PropTypes.number
  }).isRequired
}

export default Review
