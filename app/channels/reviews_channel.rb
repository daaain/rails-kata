class ReviewsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "reviews_for_product_#{params[:product_id]}"
  end
end
