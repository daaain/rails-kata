import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const CreateReview = props => {
  const [rating, setRating] = useState(1);
  const setRatingWithEvent = event => setRating(parseInt(event.target.value, 10));

  const [content, setContent] = useState('');
  const setContentWithEvent = event => setContent(event.target.value);
  
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
            <h2><label className="title is-4" htmlFor="review_rating">Rating</label></h2>
            <div className="ratings block" onChange={setRatingWithEvent}>
              {
                [1, 2, 3, 4, 5].map(i => <>
                  <input type="radio" checked={rating === i} onChange={setRatingWithEvent} value={`${i}`} name="review[rating]" id={`review_rating_${i}`} />
                  <label htmlFor={`review_rating_${i}`}>⭐️</label>
                </>)
              }
            </div>
            <h2><label className="title is-4" htmlFor="review_content">Review</label></h2>
            <div className="block">
              <textarea className={`textarea block ${content.length === 0 && 'is-danger'}`} placeholder="Your review"  name="review[content]" id="review_content" value={content} onChange={setContentWithEvent} />
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
