require 'test_helper'
require 'application_system_test_case'

class ReviewsTest < ApplicationSystemTestCase
  test 'add a new review for a product' do
    product = Product.all.first
    visit product_path(product)
    find('#create-review-button').click
    fill_in 'Review', with: 'This is the bestest product ever!'
    find('#review_rating_5 + label').click
    click_on 'Submit review'
    page.has_content? product.reviews.last.content
  end
end
