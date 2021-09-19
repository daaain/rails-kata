require 'test_helper'

class ReviewTest < ActiveSupport::TestCase
  test 'should not save review without rating, content and product_id' do
    review = Review.new
    assert_not review.save, 'Saved the review without rating, content and product_id'
    review.rating = 1
    assert_not review.save, 'Saved the review without content and product_id'
    review.content = 'Test'
    assert_not review.save, 'Saved the review without product_id'
    review.product_id = 1
    assert review.save, 'Failed to save the review'
  end
end
