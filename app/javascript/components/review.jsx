import React from 'react'
import PropTypes from 'prop-types'

const Review = props => (
  <>
    <div className="ratings is-flex is-align-items-center">
      {
        [1, 2, 3, 4, 5].map(i => i <= props.review.rating ?
            (<span key={i} className="star">⭐️</span>) :
            (<span key={i} className="star star-off">⭐️</span>)
        )
      }
      <span className="is-size-5 has-text-weight-bold ml-1 mr-4">{props.review.rating}</span>
    </div>
    {
      props.review.content && <span>{props.review.content}</span>
    }
  </>
)

Review.propTypes = {
  review: PropTypes.shape({
    content: PropTypes.string,
    created_at: PropTypes.string,
    updated_at: PropTypes.string,
    rating: PropTypes.number.isRequired,
    product_id: PropTypes.number,
    id: PropTypes.number
  }).isRequired
}

export default Review
