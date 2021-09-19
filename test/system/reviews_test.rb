require 'test_helper'
require 'application_system_test_case'

class ReviewsTest < ApplicationSystemTestCase
  test 'add a new review for a product' do
    product = Product.all.first
    visit product_path(product)
    click_link 'Add your review'
    fill_in 'Review', with: 'This is the bestest product ever!'
    page.choose '5'
    click_on 'Submit review'
    page.has_content? product.reviews.last.content
  end
end
