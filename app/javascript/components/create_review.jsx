import React, { Fragment, useState } from 'react'
import PropTypes from 'prop-types'

const CreateReview = props => {
  const [rating, setRating] = useState("0.5");
  const setRatingWithEvent = event => setRating(event.target.value);

  const [content, setContent] = useState('');
  const setContentWithEvent = event => setContent(event.target.value);
  
  const [hoveredRating, setHoveredRating] = useState(rating);
  const setHoveredRatingWithEvent = event => setHoveredRating(event.target.control.value)
  const resetHoveredRatingWithEvent = event => setHoveredRating(rating);

  const [error, setError] = useState(null);
  const submitReviewAndUpdateReviews = async event => {
    event.preventDefault();
    const response = await props.submitReview(rating, content);
    if (response.ok) {
      props.close();
      props.addReview(await response.json());
    } else {
      const errorsJSON = await response.json();
      if(Array.isArray(errorsJSON)) {
        setError(Object.entries(errorsJSON).map(([key, values]) => <p key={key} className="block has-text-danger">
          {`${key} ${values.join(' ,')}`}
        </p>));
      } else {
        setError(<p className="block has-text-danger">Unexpected error submitting review, please try again.</p>);
      }
    }
  }
  
  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <form className="new_review" id="new_review" acceptCharset="UTF-8" onSubmit={submitReviewAndUpdateReviews}>
            <label className="title is-4" htmlFor="review_rating">Rating</label>
            <div className="ratings is-size-2 is-size-3-mobile" onChange={setRatingWithEvent}>
              {
                [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(i => <Fragment key={i}>
                  <div className={`${i % 1 == 0.5 ? "first" : "second"}-half-wrapper`}>
                    <input type="radio" checked={rating === `${i}`} value={`${i}`} name="review[rating]" id={`review_rating_${i}`} onChange={setRatingWithEvent} />
                    <label className={`star ${i % 1 == 0.5 ? "first" : "second"}-half ${i > hoveredRating && "star-off"}`} htmlFor={`review_rating_${i}`} onMouseEnter={setHoveredRatingWithEvent} onMouseLeave={resetHoveredRatingWithEvent}>⭐️</label>
                  </div>
                </Fragment>)
              }
              <span className="has-text-weight-bold ml-3 is-size-4">{rating}</span>
            </div>
            <label className="title is-4" htmlFor="review_content">Review</label>
            <div className="block mt-2">
              <textarea className={`textarea is-small block ${content.length === 0 && 'is-danger'}`} placeholder="Your review"  name="review[content]" id="review_content" value={content} onChange={setContentWithEvent} />
            </div>
            {error}
            <div className="block">
              <input type="submit" name="commit" value="Submit review" className="button is-primary" disabled={content.length === 0} />
            </div>
          </form>
        </div>
        <button className="modal-close is-large" aria-label="close" onClick={props.close}></button>
        </div>
    </div>
  )
}

CreateReview.propTypes = {
  close: PropTypes.func.isRequired,
  submitReview: PropTypes.func.isRequired,
  addReview: PropTypes.func.isRequired
}

export default CreateReview
