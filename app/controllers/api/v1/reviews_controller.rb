class Api::V1::ReviewsController < ApplicationController
  protect_from_forgery with: :null_session

  def index
    @product = Product.find(params[:product_id])
    @reviews = @product.reviews
  end

  def create
    @product = Product.find(params[:product_id])
    @review = @product.reviews.build(review_params)
    respond_to do |format|
      if @review.save
        ActionCable.server.broadcast(
          "reviews_for_product_#{params[:product_id]}",
          @review
        )
        format.json { render json: @review, status: :created }
      else
        format.json { render json: @review.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def review_params
    params.require(:review).permit(:content, :rating, :product_id)
  end
end
